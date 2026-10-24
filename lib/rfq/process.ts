import type { ChatCompletionContentPart } from 'openai/resources/chat/completions'
import { prisma } from '@/lib/db'
import { classifyEmail, generateIntro, type ClassifyResult } from './ai'
import { extractAttachment } from './extract'
import { GmailClient, GMAIL_LABELS } from './gmail'
import { matchItems, type MatchedItem } from './match'
import { stripQuotedText } from './parse-message'
import { sendReply } from './send'
import { getActivePrompt, getAutomationSettings, resolveTemplate } from './settings'
import { escapeHtml, renderTemplate } from './template'

const MAX_AI_ATTACHMENTS = 8
const MAX_ATTEMPTS = 3

function defaultSignature(company: { name: string; domain: string; email: string | null; phone: string | null } | null, mailboxEmail: string) {
  if (!company) return `<p>${escapeHtml(mailboxEmail)}</p>`
  const lines = [
    `<b>${escapeHtml(company.name)}</b>`,
    escapeHtml(mailboxEmail),
    company.phone ? escapeHtml(company.phone) : null,
    `<a href="https://${escapeHtml(company.domain)}">${escapeHtml(company.domain)}</a>`,
  ].filter(Boolean)
  return `<p>${lines.join('<br>')}</p>`
}

const FALLBACK_INTRO: Record<string, string> = {
  en: 'Thank you for your request. Please find below the prices for the products available in our database.',
  pl: 'Dziękujemy za zapytanie. Poniżej przesyłamy ceny produktów dostępnych w naszej bazie.',
  de: 'Vielen Dank für Ihre Anfrage. Nachfolgend finden Sie die Preise für die Produkte aus unserer Datenbank.',
  ru: 'Благодарим за запрос. Ниже приведены цены на продукты, найденные в нашей базе.',
}

const FALLBACK_NAME: Record<string, string> = {
  en: 'Sir or Madam',
  pl: 'Państwo',
  de: 'Damen und Herren',
  ru: 'коллеги',
}

/** Builds a fresh draft from the stored classification + matched items. */
export async function buildDraft(emailId: string) {
  const email = await prisma.inboundEmail.findUniqueOrThrow({
    where: { id: emailId },
    include: {
      mailbox: { include: { company: true } },
      items: { orderBy: { position: 'asc' }, include: { product: { include: { manufacturer: true } } } },
    },
  })
  const { mailbox } = email
  const company = mailbox.company
  const detected = (email.language || 'en').toLowerCase().slice(0, 2)
  const language = mailbox.replyLanguage && mailbox.replyLanguage !== 'auto' ? mailbox.replyLanguage : detected

  const found = email.items.filter((i) => i.status === 'found' && i.unitPrice)
  const notFound = email.items.filter((i) => i.status !== 'found')

  const replyPrompt = await getActivePrompt('reply')
  let intro = FALLBACK_INTRO[language] || FALLBACK_INTRO.en
  try {
    const generated = await generateIntro({
      prompt: replyPrompt.text,
      language,
      customerName: email.customerName,
      summary: email.aiSummary || '',
      foundCount: found.length,
      notFoundCount: notFound.length,
    })
    if (generated) intro = generated
  } catch (error) {
    console.error('[rfq] intro generation failed, using fallback', error)
  }

  const baseUrl = company?.domain ? `https://${company.domain}` : null
  const template = await resolveTemplate(company?.id || null, language)
  const rendered = renderTemplate(template, {
    subject: email.subject || '',
    customerName: email.customerName || email.fromName || FALLBACK_NAME[language] || FALLBACK_NAME.en,
    intro,
    companyName: company?.name || mailbox.displayName || '',
    signatureHtml: mailbox.signatureHtml || defaultSignature(company, mailbox.email),
    found: found.map((i) => ({
      sku: i.matchedSku || i.requestedSku,
      name: i.productName || i.description || '',
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      currency: i.currency,
      url:
        baseUrl && i.product
          ? `${baseUrl}/product/${i.product.manufacturer?.slug || 'unknown'}/${i.product.slug}`
          : null,
    })),
    notFound: notFound.map((i) => ({ sku: i.requestedSku, description: i.description, quantity: i.quantity })),
  })

  await prisma.outboundReply.updateMany({
    where: { emailId, status: 'draft' },
    data: { status: 'discarded' },
  })
  return prisma.outboundReply.create({
    data: {
      emailId,
      status: 'draft',
      toEmail: email.fromEmail,
      subject: rendered.subject,
      bodyHtml: rendered.bodyHtml,
      aiDraftHtml: rendered.bodyHtml,
      promptVersionId: replyPrompt.id,
      templateId: template.id,
    },
  })
}

function autoSendBlockers(params: {
  autoSendEnabled: boolean
  mailboxMode: string
  result: ClassifyResult
  threshold: number
  matched: MatchedItem[]
  attachmentErrors: number
  threadAlreadyAnswered: boolean
}): string[] {
  const reasons: string[] = []
  if (!params.autoSendEnabled) reasons.push('Автоотправка выключена в настройках')
  if (params.mailboxMode !== 'auto') reasons.push('Ящик в режиме черновиков')
  if (params.result.confidence < params.threshold) {
    reasons.push(`Низкая уверенность AI (${Math.round(params.result.confidence * 100)}%)`)
  }
  if (!params.matched.some((m) => m.status === 'found')) reasons.push('Ни одного артикула с ценой не найдено')
  if (params.attachmentErrors > 0) reasons.push('Не удалось прочитать часть вложений')
  if (params.threadAlreadyAnswered) reasons.push('В этой переписке уже был ответ')
  return reasons
}

export async function processEmail(emailId: string) {
  const email = await prisma.inboundEmail.update({
    where: { id: emailId },
    data: { status: 'processing', attempts: { increment: 1 }, error: null },
    include: { mailbox: { include: { company: true } }, attachments: true },
  })
  const { mailbox } = email
  if (!mailbox.refreshTokenEnc) throw new Error('Mailbox is not connected to Google')
  const client = new GmailClient(mailbox.refreshTokenEnc)

  try {
    const attachmentTexts: { filename: string; text: string }[] = []
    const attachmentParts: ChatCompletionContentPart[] = []
    let attachmentErrors = 0

    for (const att of email.attachments) {
      if (att.status === 'text' && att.extractedText) {
        attachmentTexts.push({ filename: att.filename, text: att.extractedText })
        continue
      }
      if (!att.gmailAttachmentId || att.status === 'skipped') continue

      if (attachmentParts.length >= MAX_AI_ATTACHMENTS) {
        await prisma.emailAttachment.update({
          where: { id: att.id },
          data: { status: 'skipped', error: 'Too many attachments' },
        })
        continue
      }

      const data = await client.getAttachment(email.gmailMessageId, att.gmailAttachmentId)
      const result = await extractAttachment(att.filename, att.mimeType, data)
      if (result.status === 'text' && result.text) attachmentTexts.push({ filename: att.filename, text: result.text })
      if (result.status === 'sent_to_ai' && result.part) attachmentParts.push(result.part)
      if (result.status === 'error') attachmentErrors++

      await prisma.emailAttachment.update({
        where: { id: att.id },
        data: {
          status: result.status,
          extractedText: result.text ?? null,
          error: result.error ?? null,
          size: data.length,
        },
      })
    }

    const [settings, classifyPrompt] = await Promise.all([getAutomationSettings(), getActivePrompt('classify')])
    const body = stripQuotedText(email.bodyText || '')
    const result = await classifyEmail({
      prompt: classifyPrompt.text,
      model: settings.model,
      from: email.fromName ? `${email.fromName} <${email.fromEmail}>` : email.fromEmail,
      subject: email.subject,
      body,
      attachmentTexts,
      attachmentParts,
    })

    const sourceText = [email.subject, email.bodyText || '', ...attachmentTexts.map((a) => a.text)].join('\n')
    const baseUrl = mailbox.company?.domain ? `https://${mailbox.company.domain}` : null
    // keep items even for non-RFQ results so a manager override can draft a reply
    const matched = result.items.length ? await matchItems(result.items, sourceText, baseUrl) : []

    await prisma.$transaction([
      prisma.priceRequestItem.deleteMany({ where: { emailId } }),
      prisma.priceRequestItem.createMany({
        data: matched.map((m) => ({
          emailId,
          position: m.position,
          requestedSku: m.requestedSku.slice(0, 200),
          quantity: m.quantity,
          description: m.description,
          manufacturerHint: m.manufacturerHint,
          productId: m.productId,
          matchedSku: m.matchedSku,
          productName: m.productName,
          unitPrice: m.unitPrice,
          status: m.status,
          verifiedInText: m.verifiedInText,
        })),
      }),
      prisma.inboundEmail.update({
        where: { id: emailId },
        data: {
          isPriceRequest: result.is_price_request,
          confidence: result.confidence,
          language: result.language,
          customerName: result.customer_name,
          customerCompany: result.customer_company,
          aiSummary: result.summary,
          aiRaw: result as any,
          model: settings.model,
          promptVersionId: classifyPrompt.id,
          processedAt: new Date(),
        },
      }),
    ])

    if (!result.is_price_request) {
      await prisma.inboundEmail.update({ where: { id: emailId }, data: { status: 'not_rfq' } })
      await client.addLabels(email.gmailMessageId, [GMAIL_LABELS.notRfq]).catch(() => {})
      return { status: 'not_rfq' }
    }

    if (mailbox.mode === 'monitor') {
      await prisma.inboundEmail.update({ where: { id: emailId }, data: { status: 'rfq_detected' } })
      await client.addLabels(email.gmailMessageId, [GMAIL_LABELS.rfq]).catch(() => {})
      return { status: 'rfq_detected' }
    }

    const reply = await buildDraft(emailId)

    const threadAlreadyAnswered =
      (await prisma.outboundReply.count({
        where: { status: 'sent', email: { gmailThreadId: email.gmailThreadId, mailboxId: mailbox.id } },
      })) > 0

    const blockers = autoSendBlockers({
      autoSendEnabled: settings.autoSendEnabled,
      mailboxMode: mailbox.mode,
      result,
      threshold: settings.confidenceThreshold,
      matched,
      attachmentErrors,
      threadAlreadyAnswered,
    })

    await prisma.inboundEmail.update({
      where: { id: emailId },
      data: {
        status: 'draft_ready',
        aiRaw: { ...(result as any), autoSendBlockers: blockers },
      },
    })
    await client.addLabels(email.gmailMessageId, [GMAIL_LABELS.rfq, GMAIL_LABELS.draft]).catch(() => {})

    if (blockers.length === 0) {
      try {
        await sendReply(reply.id, { mode: 'auto' })
        return { status: 'sent_auto' }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        await prisma.inboundEmail.update({
          where: { id: emailId },
          data: { aiRaw: { ...(result as any), autoSendBlockers: [`Автоотправка не удалась: ${message}`] } },
        })
        return { status: 'draft_ready', blockers: [message] }
      }
    }
    return { status: 'draft_ready', blockers }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await prisma.inboundEmail.update({
      where: { id: emailId },
      data: { status: email.attempts >= MAX_ATTEMPTS ? 'error' : 'new', error: message },
    })
    throw error
  }
}

/** Processes queued emails until the time budget runs out. */
export async function processQueue(deadlineMs: number) {
  const results: { id: string; status?: string; error?: string }[] = []
  while (Date.now() < deadlineMs) {
    const next = await prisma.inboundEmail.findFirst({
      where: {
        OR: [
          { status: 'new' },
          // a previous run timed out mid-processing
          { status: 'processing', updatedAt: { lt: new Date(Date.now() - 10 * 60_000) } },
        ],
        attempts: { lt: MAX_ATTEMPTS },
        mailbox: { mode: { not: 'off' } },
      },
      orderBy: { receivedAt: 'asc' },
      select: { id: true },
    })
    if (!next) break
    try {
      const r = await processEmail(next.id)
      results.push({ id: next.id, status: r.status })
    } catch (error) {
      results.push({ id: next.id, error: error instanceof Error ? error.message : String(error) })
    }
  }
  return results
}
