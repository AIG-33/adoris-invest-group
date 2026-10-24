import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { classifyEmail } from '@/lib/rfq/ai'
import { requireAdminApi } from '@/lib/rfq/auth'
import { matchItems } from '@/lib/rfq/match'
import { stripQuotedText } from '@/lib/rfq/parse-message'
import {
  activatePromptVersion,
  getActivePrompt,
  getAutomationSettings,
  logAutomation,
  savePromptVersion,
  type PromptKind,
} from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 120

const KINDS: PromptKind[] = ['classify', 'reply']

/**
 * { action: 'save', kind, text, comment }
 * { action: 'activate', id }
 * { action: 'test', text, emailId } — runs the classify prompt on a stored email without saving anything.
 *   Text attachments are reused; PDFs/images are not re-downloaded for the test.
 */
export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response
  const body = await request.json()

  if (body.action === 'save') {
    if (!KINDS.includes(body.kind)) return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
    if (typeof body.text !== 'string' || body.text.trim().length < 20) {
      return NextResponse.json({ error: 'Промт слишком короткий' }, { status: 400 })
    }
    const version = await savePromptVersion({
      kind: body.kind,
      text: body.text.trim(),
      comment: body.comment,
      authorEmail: auth.email,
    })
    await logAutomation('prompt_saved', auth.email, { kind: body.kind, version: version.version })
    return NextResponse.json({ ok: true, version })
  }

  if (body.action === 'activate') {
    const version = await activatePromptVersion(body.id)
    await logAutomation('prompt_activated', auth.email, { kind: version.kind, version: version.version })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'test') {
    const email = await prisma.inboundEmail.findUnique({
      where: { id: body.emailId },
      include: { attachments: true, mailbox: { include: { company: true } } },
    })
    if (!email) return NextResponse.json({ error: 'Письмо не найдено' }, { status: 404 })

    const [settings, active] = await Promise.all([getAutomationSettings(), getActivePrompt('classify')])
    const attachmentTexts = email.attachments
      .filter((a) => a.status === 'text' && a.extractedText)
      .map((a) => ({ filename: a.filename, text: a.extractedText! }))
    const input = {
      model: settings.model,
      from: email.fromName ? `${email.fromName} <${email.fromEmail}>` : email.fromEmail,
      subject: email.subject,
      body: stripQuotedText(email.bodyText || ''),
      attachmentTexts,
      attachmentParts: [],
    }
    const sourceText = [email.subject, email.bodyText || '', ...attachmentTexts.map((a) => a.text)].join('\n')
    const baseUrl = email.mailbox.company?.domain ? `https://${email.mailbox.company.domain}` : null

    try {
      const [candidate, current] = await Promise.all([
        classifyEmail({ ...input, prompt: String(body.text || '') }),
        classifyEmail({ ...input, prompt: active.text }),
      ])
      const [candidateItems, currentItems] = await Promise.all([
        candidate.is_price_request ? matchItems(candidate.items, sourceText, baseUrl) : [],
        current.is_price_request ? matchItems(current.items, sourceText, baseUrl) : [],
      ])
      const skippedBinary = email.attachments.filter((a) => a.status === 'sent_to_ai').map((a) => a.filename)
      return NextResponse.json({
        candidate: { ...candidate, matched: candidateItems },
        current: { ...current, matched: currentItems, version: active.version },
        skippedBinary,
      })
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
