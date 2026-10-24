import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminApi } from '@/lib/rfq/auth'
import { GmailClient, GMAIL_LABELS } from '@/lib/rfq/gmail'
import { buildDraft, processEmail } from '@/lib/rfq/process'
import { sendReply } from '@/lib/rfq/send'
import { logAutomation } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300

/**
 * { action: 'send', subject, bodyHtml }
 * { action: 'save_draft', subject, bodyHtml }
 * { action: 'reprocess' }   — re-run extraction + AI + matching + draft
 * { action: 'redraft' }     — rebuild the draft from current items (e.g. after template change)
 * { action: 'not_rfq' } | { action: 'reject' }
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response

  const body = await request.json()
  const email = await prisma.inboundEmail.findUnique({
    where: { id: params.id },
    include: { mailbox: true, replies: { where: { status: 'draft' }, orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  if (!email) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const draft = email.replies[0]

  try {
    switch (body.action) {
      case 'send': {
        if (!draft) return NextResponse.json({ error: 'Нет черновика для отправки' }, { status: 400 })
        const res = await sendReply(draft.id, {
          mode: 'manual',
          userEmail: auth.email,
          subject: typeof body.subject === 'string' ? body.subject : undefined,
          bodyHtml: typeof body.bodyHtml === 'string' ? body.bodyHtml : undefined,
        })
        return NextResponse.json({ ok: true, ...res })
      }
      case 'save_draft': {
        if (!draft) return NextResponse.json({ error: 'Нет черновика' }, { status: 400 })
        await prisma.outboundReply.update({
          where: { id: draft.id },
          data: { subject: String(body.subject ?? draft.subject), bodyHtml: String(body.bodyHtml ?? draft.bodyHtml) },
        })
        return NextResponse.json({ ok: true })
      }
      case 'reprocess': {
        await prisma.inboundEmail.update({ where: { id: email.id }, data: { attempts: 0 } })
        await prisma.emailAttachment.updateMany({
          where: { emailId: email.id, status: { in: ['error', 'sent_to_ai'] } },
          data: { status: 'pending', error: null },
        })
        const res = await processEmail(email.id)
        await logAutomation('email_reprocessed', auth.email, { emailId: email.id })
        return NextResponse.json({ ok: true, ...res })
      }
      case 'redraft': {
        if (!email.isPriceRequest) return NextResponse.json({ error: 'Письмо не распознано как запрос цен' }, { status: 400 })
        await buildDraft(email.id)
        await prisma.inboundEmail.update({ where: { id: email.id }, data: { status: 'draft_ready' } })
        return NextResponse.json({ ok: true })
      }
      case 'force_rfq': {
        await prisma.inboundEmail.update({ where: { id: email.id }, data: { isPriceRequest: true } })
        await buildDraft(email.id)
        await prisma.inboundEmail.update({ where: { id: email.id }, data: { status: 'draft_ready' } })
        if (email.mailbox.refreshTokenEnc) {
          await new GmailClient(email.mailbox.refreshTokenEnc)
            .addLabels(email.gmailMessageId, [GMAIL_LABELS.rfq, GMAIL_LABELS.draft], [GMAIL_LABELS.notRfq])
            .catch(() => {})
        }
        await logAutomation('email_forced_rfq', auth.email, { emailId: email.id })
        return NextResponse.json({ ok: true })
      }
      case 'not_rfq':
      case 'reject': {
        const status = body.action === 'not_rfq' ? 'not_rfq' : 'rejected'
        await prisma.$transaction([
          prisma.inboundEmail.update({ where: { id: email.id }, data: { status } }),
          prisma.outboundReply.updateMany({ where: { emailId: email.id, status: 'draft' }, data: { status: 'discarded' } }),
        ])
        if (email.mailbox.refreshTokenEnc) {
          await new GmailClient(email.mailbox.refreshTokenEnc)
            .addLabels(
              email.gmailMessageId,
              body.action === 'not_rfq' ? [GMAIL_LABELS.notRfq] : [],
              body.action === 'not_rfq' ? [GMAIL_LABELS.rfq, GMAIL_LABELS.draft] : [GMAIL_LABELS.draft]
            )
            .catch(() => {})
        }
        await logAutomation(`email_${status}`, auth.email, { emailId: email.id })
        return NextResponse.json({ ok: true })
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
