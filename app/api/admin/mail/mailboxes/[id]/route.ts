import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminApi } from '@/lib/rfq/auth'
import { GmailClient } from '@/lib/rfq/gmail'
import { processQueue } from '@/lib/rfq/process'
import { logAutomation } from '@/lib/rfq/settings'
import { syncMailbox } from '@/lib/rfq/sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300

const MODES = ['off', 'monitor', 'drafts', 'auto']

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response

  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (typeof body.mode === 'string') {
    if (!MODES.includes(body.mode)) return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    data.mode = body.mode
  }
  if ('companyId' in body) data.companyId = body.companyId || null
  if (typeof body.displayName === 'string') data.displayName = body.displayName.trim() || null
  if (typeof body.replyLanguage === 'string') data.replyLanguage = body.replyLanguage.trim() || 'auto'
  if (typeof body.signatureHtml === 'string') data.signatureHtml = body.signatureHtml.trim() || null
  if (typeof body.excludedSenders === 'string') data.excludedSenders = body.excludedSenders.trim() || null
  if (typeof body.gmailQuery === 'string') data.gmailQuery = body.gmailQuery.trim() || null
  if (body.backfillDays !== undefined) {
    const days = Math.round(Number(body.backfillDays))
    if (!Number.isFinite(days) || days < 1 || days > 60) {
      return NextResponse.json({ error: 'backfillDays must be 1–60' }, { status: 400 })
    }
    data.backfillDays = days
  }

  const before = await prisma.mailbox.findUniqueOrThrow({ where: { id: params.id } })
  const mailbox = await prisma.mailbox.update({ where: { id: params.id }, data })
  if (data.mode && data.mode !== before.mode) {
    await logAutomation('mailbox_mode_changed', auth.email, { email: mailbox.email, from: before.mode, to: data.mode })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response
  const mailbox = await prisma.mailbox.update({
    where: { id: params.id },
    data: { refreshTokenEnc: null, mode: 'off', historyId: null },
  })
  await logAutomation('mailbox_disconnected', auth.email, { email: mailbox.email })
  return NextResponse.json({ ok: true })
}

/** Actions: { action: 'test' | 'sync' } */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response

  const { action } = await request.json()
  const mailbox = await prisma.mailbox.findUniqueOrThrow({ where: { id: params.id } })
  if (!mailbox.refreshTokenEnc) return NextResponse.json({ error: 'Ящик не подключён к Google' }, { status: 400 })

  try {
    if (action === 'test') {
      const profile = await new GmailClient(mailbox.refreshTokenEnc).getProfile()
      return NextResponse.json({ ok: true, email: profile.emailAddress, messagesTotal: profile.messagesTotal })
    }
    if (action === 'sync') {
      const { added } = await syncMailbox(mailbox)
      const processed = await processQueue(Date.now() + 200_000)
      return NextResponse.json({ ok: true, added, processed: processed.length })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await prisma.mailbox.update({ where: { id: mailbox.id }, data: { lastError: message, lastErrorAt: new Date() } })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
