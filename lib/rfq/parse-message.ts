import type { GmailMessage, GmailPart } from './gmail'

export interface ParsedAttachment {
  filename: string
  mimeType: string
  size: number
  attachmentId?: string
  inlineData?: string
}

export interface ParsedMessage {
  headers: Record<string, string>
  fromEmail: string
  fromName: string | null
  toEmail: string | null
  subject: string
  rfcMessageId: string | null
  references: string | null
  receivedAt: Date
  bodyText: string
  bodyHtml: string | null
  attachments: ParsedAttachment[]
}

function decodeBody(data?: string): string {
  if (!data) return ''
  return Buffer.from(data, 'base64url').toString('utf8')
}

export function parseAddress(value: string | undefined): { email: string; name: string | null } {
  if (!value) return { email: '', name: null }
  const match = value.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
  if (match) return { email: match[2].trim().toLowerCase(), name: match[1].trim() || null }
  return { email: value.trim().toLowerCase(), name: null }
}

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|head)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, '\n')
    .replace(/<\/(td|th)>/gi, '\t')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Drop quoted history from replies/forwards so the AI sees the new request first. */
export function stripQuotedText(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []
  for (const line of lines) {
    const t = line.trim()
    if (
      /^On .+wrote:$/i.test(t) ||
      /^W dniu .+napisał/i.test(t) ||
      /^Am .+schrieb/i.test(t) ||
      /^-{2,}\s*Original Message\s*-{2,}$/i.test(t) ||
      /^_{5,}$/.test(t) ||
      (/^From:\s.+/i.test(t) && out.length > 3)
    ) {
      break
    }
    if (t.startsWith('>')) continue
    out.push(line)
  }
  const stripped = out.join('\n').trim()
  // Forwarded requests keep the request in the quoted part
  return stripped.length >= 20 ? stripped : text.trim()
}

export function parseGmailMessage(msg: GmailMessage): ParsedMessage {
  const headers: Record<string, string> = {}
  for (const h of msg.payload?.headers || []) headers[h.name.toLowerCase()] = h.value

  let plain = ''
  let html = ''
  const attachments: ParsedAttachment[] = []

  const walk = (part: GmailPart) => {
    const disposition = (part.headers || []).find((h) => h.name.toLowerCase() === 'content-disposition')?.value || ''
    const isAttachment = Boolean(part.filename) || /attachment/i.test(disposition)

    if (isAttachment && part.body) {
      attachments.push({
        filename: part.filename || 'attachment',
        mimeType: part.mimeType,
        size: part.body.size || 0,
        attachmentId: part.body.attachmentId,
        inlineData: part.body.data,
      })
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      plain += decodeBody(part.body.data) + '\n'
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      html += decodeBody(part.body.data) + '\n'
    }
    for (const child of part.parts || []) walk(child)
  }
  if (msg.payload) walk(msg.payload)

  const from = parseAddress(headers['from'])
  const to = parseAddress(headers['to']?.split(',')[0])
  const bodyText = (plain.trim() || htmlToText(html)).slice(0, 100_000)

  return {
    headers,
    fromEmail: from.email,
    fromName: from.name,
    toEmail: to.email || null,
    subject: headers['subject'] || '',
    rfcMessageId: headers['message-id'] || null,
    references: headers['references'] || null,
    receivedAt: msg.internalDate ? new Date(Number(msg.internalDate)) : new Date(),
    bodyText,
    bodyHtml: html.trim() ? html.slice(0, 300_000) : null,
    attachments,
  }
}
