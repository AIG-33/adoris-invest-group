import MailComposer from 'nodemailer/lib/mail-composer'
import { prisma } from '@/lib/db'
import { GmailClient, GMAIL_LABELS } from './gmail'
import { htmlToText } from './parse-message'
import { logAutomation } from './settings'

export async function sendReply(
  replyId: string,
  opts: { mode: 'auto' | 'manual'; userEmail?: string | null; subject?: string; bodyHtml?: string }
) {
  const reply = await prisma.outboundReply.findUniqueOrThrow({
    where: { id: replyId },
    include: { email: { include: { mailbox: { include: { company: true } } } } },
  })
  if (reply.status === 'sent') throw new Error('This reply has already been sent')

  const { email } = reply
  const { mailbox } = email
  if (!mailbox.refreshTokenEnc) throw new Error('Mailbox is not connected to Google')

  if (opts.mode === 'auto') {
    const alreadyReplied = await prisma.outboundReply.count({
      where: { status: 'sent', email: { gmailThreadId: email.gmailThreadId, mailboxId: mailbox.id } },
    })
    if (alreadyReplied > 0) throw new Error('A reply was already sent in this thread')
  }

  const subject = (opts.subject ?? reply.subject).trim()
  const bodyHtml = opts.bodyHtml ?? reply.bodyHtml
  const edited = bodyHtml.trim() !== reply.aiDraftHtml.trim() || subject !== reply.subject.trim()

  const fromName = mailbox.displayName || mailbox.company?.name || undefined
  const references = [email.references, email.rfcMessageId].filter(Boolean).join(' ')
  const raw = await new MailComposer({
    from: fromName ? { name: fromName, address: mailbox.email } : mailbox.email,
    to: reply.toEmail,
    subject,
    html: bodyHtml,
    text: htmlToText(bodyHtml),
    inReplyTo: email.rfcMessageId || undefined,
    references: references || undefined,
  })
    .compile()
    .build()

  const client = new GmailClient(mailbox.refreshTokenEnc)
  try {
    const sent = await client.sendRaw(raw, email.gmailThreadId)
    const now = new Date()
    await prisma.$transaction([
      prisma.outboundReply.update({
        where: { id: reply.id },
        data: {
          status: 'sent',
          subject,
          bodyHtml,
          sendMode: opts.mode,
          edited,
          sentByEmail: opts.mode === 'manual' ? opts.userEmail || null : null,
          sentAt: now,
          gmailMessageId: sent.id,
          gmailThreadId: sent.threadId,
          error: null,
        },
      }),
      prisma.inboundEmail.update({
        where: { id: email.id },
        data: { status: opts.mode === 'auto' ? 'sent_auto' : 'sent_manual' },
      }),
    ])

    await client
      .addLabels(
        email.gmailMessageId,
        [opts.mode === 'auto' ? GMAIL_LABELS.sentAuto : GMAIL_LABELS.sentManual],
        [GMAIL_LABELS.draft]
      )
      .catch((e) => console.error('[rfq] label update failed', e))

    await logAutomation(opts.mode === 'auto' ? 'reply_sent_auto' : 'reply_sent_manual', opts.userEmail || null, {
      emailId: email.id,
      replyId: reply.id,
      edited,
    })
    return { gmailMessageId: sent.id, edited }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await prisma.outboundReply.update({ where: { id: reply.id }, data: { error: message } })
    throw error
  }
}
