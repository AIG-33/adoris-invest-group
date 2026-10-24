import type { Mailbox } from '@prisma/client'
import { prisma } from '@/lib/db'
import { GmailClient, GmailError } from './gmail'
import { parseGmailMessage, type ParsedMessage } from './parse-message'

const SKIP_LABELS = ['SENT', 'DRAFT', 'SPAM', 'TRASH', 'CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'CATEGORY_FORUMS']
const NOREPLY = /(^|[._-])(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounce[s]?|notifications?)([._+-]|@)/i

export function ignoreReason(
  parsed: ParsedMessage,
  labelIds: string[],
  ourDomains: Set<string>,
  excluded: string[]
): string | null {
  const from = parsed.fromEmail
  const domain = from.split('@')[1] || ''
  const h = parsed.headers

  const skipLabel = labelIds.find((l) => SKIP_LABELS.includes(l))
  if (skipLabel) return `Gmail label ${skipLabel}`
  if (!from) return 'No sender'
  if (ourDomains.has(domain)) return 'Sent from our own domain'
  if (excluded.some((e) => (e.startsWith('@') ? from.endsWith(e) : from === e))) return 'Excluded sender'
  if (NOREPLY.test(from)) return 'No-reply / system sender'
  if (h['auto-submitted'] && h['auto-submitted'].toLowerCase() !== 'no') return 'Auto-reply (Auto-Submitted)'
  if (/^(bulk|list|junk|auto_reply)$/i.test(h['precedence'] || '')) return `Bulk mail (Precedence: ${h['precedence']})`
  if (h['list-unsubscribe'] || h['list-id']) return 'Mailing list / newsletter'
  if (h['x-autoreply'] || h['x-autorespond']) return 'Auto-reply'
  return null
}

function parseExcluded(value: string | null): string[] {
  return (value || '')
    .split(/[\n,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

async function ourDomains(): Promise<Set<string>> {
  const [mailboxes, companies] = await Promise.all([
    prisma.mailbox.findMany({ select: { email: true } }),
    prisma.company.findMany({ select: { domain: true, email: true } }),
  ])
  const set = new Set<string>()
  for (const m of mailboxes) set.add(m.email.split('@')[1])
  for (const c of companies) {
    if (c.domain) set.add(c.domain.replace(/^www\./, ''))
    if (c.email) set.add(c.email.split('@')[1])
  }
  return set
}

export async function syncMailbox(mailbox: Mailbox): Promise<{ added: number }> {
  if (!mailbox.refreshTokenEnc) throw new Error('Mailbox is not connected to Google')
  const client = new GmailClient(mailbox.refreshTokenEnc)

  let ids: string[]
  let historyId: string
  const extra = mailbox.gmailQuery?.trim() ? ` ${mailbox.gmailQuery.trim()}` : ''

  if (!mailbox.historyId) {
    const profile = await client.getProfile()
    historyId = profile.historyId
    ids = await client.listMessageIds(`in:inbox newer_than:${Math.max(1, mailbox.backfillDays)}d${extra}`, 300)
  } else if (extra) {
    // History API cannot apply a search filter, so poll the recent window instead
    const profile = await client.getProfile()
    historyId = profile.historyId
    ids = await client.listMessageIds(`in:inbox newer_than:2d${extra}`, 200)
  } else {
    try {
      const res = await client.listAddedSince(mailbox.historyId)
      ids = res.ids
      historyId = res.historyId
    } catch (error) {
      if (!(error instanceof GmailError) || error.status !== 404) throw error
      const profile = await client.getProfile()
      historyId = profile.historyId
      ids = await client.listMessageIds('in:inbox newer_than:2d', 200)
    }
  }

  const existing = new Set(
    (
      await prisma.inboundEmail.findMany({
        where: { mailboxId: mailbox.id, gmailMessageId: { in: ids } },
        select: { gmailMessageId: true },
      })
    ).map((e) => e.gmailMessageId)
  )

  const domains = await ourDomains()
  const excluded = parseExcluded(mailbox.excludedSenders)
  let added = 0

  for (const id of ids) {
    if (existing.has(id)) continue
    const msg = await client.getMessage(id)
    const labels = msg.labelIds || []
    if (!labels.includes('INBOX')) continue

    const parsed = parseGmailMessage(msg)
    const reason = ignoreReason(parsed, labels, domains, excluded)

    try {
      await prisma.inboundEmail.create({
        data: {
          mailboxId: mailbox.id,
          gmailMessageId: msg.id,
          gmailThreadId: msg.threadId,
          rfcMessageId: parsed.rfcMessageId,
          references: parsed.references,
          fromEmail: parsed.fromEmail,
          fromName: parsed.fromName,
          toEmail: parsed.toEmail,
          subject: parsed.subject.slice(0, 1000),
          receivedAt: parsed.receivedAt,
          snippet: msg.snippet || null,
          bodyText: parsed.bodyText,
          bodyHtml: parsed.bodyHtml,
          status: reason ? 'ignored' : 'new',
          ignoreReason: reason,
          attachments: {
            create: parsed.attachments.map((a) => ({
              filename: a.filename.slice(0, 500),
              mimeType: a.mimeType,
              size: a.size,
              gmailAttachmentId: a.attachmentId || null,
              status: a.attachmentId ? 'pending' : 'skipped',
              error: a.attachmentId ? null : 'Inline attachment without id',
            })),
          },
        },
      })
      added++
    } catch (error: any) {
      // concurrent sync already stored it
      if (error?.code !== 'P2002') throw error
    }
  }

  await prisma.mailbox.update({
    where: { id: mailbox.id },
    data: { historyId, lastSyncAt: new Date(), lastError: null, lastErrorAt: null },
  })

  return { added }
}

export async function syncAllMailboxes() {
  const mailboxes = await prisma.mailbox.findMany({
    where: { mode: { not: 'off' }, refreshTokenEnc: { not: null } },
  })
  const results: { email: string; added?: number; error?: string }[] = []
  for (const mailbox of mailboxes) {
    try {
      const { added } = await syncMailbox(mailbox)
      results.push({ email: mailbox.email, added })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      results.push({ email: mailbox.email, error: message })
      await prisma.mailbox.update({
        where: { id: mailbox.id },
        data: { lastError: message, lastErrorAt: new Date() },
      })
    }
  }
  return results
}
