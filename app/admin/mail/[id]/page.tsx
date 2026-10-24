import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { EmailActions } from '@/components/admin-mail/email-actions'
import { gmailThreadUrl } from '@/lib/rfq/gmail'
import { EMAIL_STATUS, ITEM_STATUS } from '@/lib/rfq/labels'

export const dynamic = 'force-dynamic'

function formatDate(d: Date | null) {
  if (!d) return '—'
  return d.toLocaleString('ru-RU', { timeZone: 'Europe/Warsaw' })
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`
}

const ATTACHMENT_STATUS: Record<string, string> = {
  pending: 'ожидает',
  text: 'текст извлечён',
  sent_to_ai: 'прочитано AI (PDF/картинка)',
  skipped: 'пропущено',
  error: 'ошибка',
}

export default async function MailEmailPage({ params }: { params: { id: string } }) {
  const email = await prisma.inboundEmail.findUnique({
    where: { id: params.id },
    include: {
      mailbox: { include: { company: { select: { name: true } } } },
      attachments: { orderBy: { createdAt: 'asc' } },
      items: { orderBy: { position: 'asc' }, include: { product: { include: { manufacturer: true } } } },
      replies: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!email) notFound()

  const st = EMAIL_STATUS[email.status] || { label: email.status, className: 'bg-neutral-100' }
  const draft = email.replies.find((r) => r.status === 'draft') || null
  const sent = email.replies.filter((r) => r.status === 'sent')
  const blockers: string[] = ((email.aiRaw as any)?.autoSendBlockers as string[]) || []
  const total = email.items.reduce((s, i) => s + (i.unitPrice ? Number(i.unitPrice) * i.quantity : 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Link href="/admin/mail" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Входящие
        </Link>
        <a
          href={gmailThreadUrl(email.mailbox.email, email.gmailThreadId)}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline text-neutral-700"
        >
          Открыть переписку в Gmail ↗
        </a>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-neutral-900 break-words">{email.subject || '(без темы)'}</h2>
            <div className="text-sm text-neutral-600">
              {email.fromName ? `${email.fromName} <${email.fromEmail}>` : email.fromEmail}
              {email.customerCompany ? ` · ${email.customerCompany}` : ''}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {formatDate(email.receivedAt)} · ящик {email.mailbox.email}
              {email.mailbox.company ? ` (${email.mailbox.company.name})` : ''}
            </div>
          </div>
          <span className={`rounded px-2 py-1 text-xs font-medium ${st.className}`}>{st.label}</span>
        </div>

        {(email.aiSummary || email.isPriceRequest !== null) && (
          <div className="mt-3 text-sm bg-neutral-50 rounded-md px-3 py-2 text-neutral-700">
            <b>AI:</b> {email.isPriceRequest ? 'запрос цен' : 'не запрос цен'}
            {email.confidence !== null && ` · уверенность ${Math.round((email.confidence || 0) * 100)}%`}
            {email.language && ` · язык ${email.language}`}
            {email.aiSummary && <div className="mt-1">{email.aiSummary}</div>}
          </div>
        )}
        {email.ignoreReason && (
          <div className="mt-3 text-sm text-neutral-500">Пропущено автоматически: {email.ignoreReason}</div>
        )}
        {email.error && <div className="mt-3 text-sm bg-red-50 text-red-700 rounded-md px-3 py-2">Ошибка: {email.error}</div>}
        {email.status === 'draft_ready' && blockers.length > 0 && (
          <div className="mt-3 text-sm bg-amber-50 text-amber-900 rounded-md px-3 py-2">
            <b>Почему не ушло автоматически:</b>
            <ul className="list-disc ml-5">
              {blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <section className="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Письмо клиента</h3>
            <pre className="whitespace-pre-wrap break-words text-sm text-neutral-800 font-sans max-h-[480px] overflow-auto">
              {email.bodyText || email.snippet || '(пусто)'}
            </pre>
            {email.bodyHtml && (
              <details className="mt-3">
                <summary className="text-sm text-neutral-600 cursor-pointer">Показать в оригинальном оформлении</summary>
                <iframe
                  title="Оригинал письма"
                  sandbox=""
                  srcDoc={email.bodyHtml}
                  className="w-full h-[480px] mt-2 border border-neutral-200 rounded"
                />
              </details>
            )}
          </section>

          {email.attachments.length > 0 && (
            <section className="bg-white border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Вложения</h3>
              <ul className="space-y-2 text-sm">
                {email.attachments.map((a) => (
                  <li key={a.id}>
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium break-all">{a.filename}</span>
                      <span className="text-neutral-500">
                        {formatSize(a.size)} · {ATTACHMENT_STATUS[a.status] || a.status}
                      </span>
                    </div>
                    {a.error && <div className="text-xs text-neutral-500">{a.error}</div>}
                    {a.extractedText && (
                      <details>
                        <summary className="text-xs text-neutral-500 cursor-pointer">Извлечённый текст</summary>
                        <pre className="whitespace-pre-wrap text-xs bg-neutral-50 p-2 rounded max-h-64 overflow-auto">
                          {a.extractedText.slice(0, 20_000)}
                        </pre>
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-4">
          {email.items.length > 0 && (
            <section className="bg-white border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                Позиции: найдено {email.items.filter((i) => i.status === 'found').length} из {email.items.length}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-neutral-500">
                    <tr>
                      <th className="py-1 pr-2 font-medium">Артикул в письме</th>
                      <th className="py-1 pr-2 font-medium">Товар в базе</th>
                      <th className="py-1 pr-2 font-medium text-right">Кол-во</th>
                      <th className="py-1 pr-2 font-medium text-right">Цена EU</th>
                      <th className="py-1 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {email.items.map((i) => {
                      const is = ITEM_STATUS[i.status] || { label: i.status, className: '' }
                      return (
                        <tr key={i.id} className="border-t border-neutral-100 align-top">
                          <td className="py-1.5 pr-2">
                            <div className="font-mono">{i.requestedSku || '—'}</div>
                            {i.description && <div className="text-xs text-neutral-500">{i.description}</div>}
                            {i.requestedSku && !i.verifiedInText && (
                              <div className="text-xs text-amber-700" title="Артикул не найден в тексте письма/вложений — возможно, распознан с картинки или PDF">
                                из PDF/картинки — проверьте
                              </div>
                            )}
                          </td>
                          <td className="py-1.5 pr-2">
                            {i.product ? (
                              <Link
                                href={`/product/${i.product.manufacturer?.slug || 'unknown'}/${i.product.slug}`}
                                target="_blank"
                                className="hover:underline"
                              >
                                <span className="font-mono">{i.matchedSku}</span> · {i.productName}
                              </Link>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-1.5 pr-2 text-right">{i.quantity}</td>
                          <td className="py-1.5 pr-2 text-right whitespace-nowrap">
                            {i.unitPrice ? `${Number(i.unitPrice).toFixed(2)} €` : '—'}
                          </td>
                          <td className={`py-1.5 whitespace-nowrap ${is.className}`}>{is.label}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {total > 0 && <div className="text-right text-sm mt-2">Итого по найденным: <b>{total.toFixed(2)} €</b></div>}
            </section>
          )}

          {sent.map((r) => (
            <section key={r.id} className="bg-white border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold mb-1">
                Отправленный ответ · {r.sendMode === 'auto' ? 'автоматически' : 'вручную'}
                {r.sendMode === 'manual' && (r.edited ? ', с правками' : ', без правок')}
              </h3>
              <div className="text-xs text-neutral-500 mb-2">
                {formatDate(r.sentAt)}
                {r.sentByEmail ? ` · ${r.sentByEmail}` : ''} · кому {r.toEmail}
              </div>
              <div className="text-sm font-medium mb-1">{r.subject}</div>
              <iframe title="Отправленный ответ" sandbox="" srcDoc={r.bodyHtml} className="w-full h-[360px] border border-neutral-200 rounded" />
              {r.edited && (
                <details className="mt-2">
                  <summary className="text-sm text-neutral-600 cursor-pointer">Исходный черновик AI</summary>
                  <iframe title="Черновик AI" sandbox="" srcDoc={r.aiDraftHtml} className="w-full h-[300px] mt-2 border border-neutral-200 rounded" />
                </details>
              )}
            </section>
          ))}

          <EmailActions
            emailId={email.id}
            status={email.status}
            isPriceRequest={Boolean(email.isPriceRequest)}
            draft={draft ? { subject: draft.subject, bodyHtml: draft.bodyHtml, toEmail: draft.toEmail, error: draft.error } : null}
          />
        </div>
      </div>
    </div>
  )
}
