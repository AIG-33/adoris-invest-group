import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminPage } from '@/lib/rfq/auth'
import { EMAIL_STATUS } from '@/lib/rfq/labels'
import { getAutomationSettings } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Все, кроме пропущенных' },
  { value: 'draft_ready', label: 'Черновик на проверке' },
  { value: 'sent', label: 'Отправлено (все)' },
  { value: 'sent_auto', label: 'Отправлено · авто' },
  { value: 'sent_manual', label: 'Отправлено · вручную' },
  { value: 'rfq_detected', label: 'Запрос (мониторинг)' },
  { value: 'not_rfq', label: 'Не запрос цен' },
  { value: 'rejected', label: 'Отклонено' },
  { value: 'queue', label: 'В очереди / обработка' },
  { value: 'error', label: 'Ошибка' },
  { value: 'ignored', label: 'Пропущено (рассылки, автоответы)' },
  { value: 'all', label: 'Все' },
]

function statusWhere(status: string) {
  switch (status) {
    case '':
      return { status: { not: 'ignored' } }
    case 'all':
      return {}
    case 'sent':
      return { status: { in: ['sent_auto', 'sent_manual'] } }
    case 'queue':
      return { status: { in: ['new', 'processing'] } }
    default:
      return { status }
  }
}

function formatDate(d: Date) {
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' })
}

export default async function MailInboxPage({
  searchParams,
}: {
  searchParams: { status?: string; mailbox?: string; q?: string; page?: string }
}) {
  await requireAdminPage()
  const status = searchParams.status ?? ''
  const mailboxId = searchParams.mailbox || ''
  const q = (searchParams.q || '').trim()
  const page = Math.max(1, Number(searchParams.page) || 1)

  const where = {
    ...statusWhere(status),
    ...(mailboxId ? { mailboxId } : {}),
    ...(q
      ? {
          OR: [
            { fromEmail: { contains: q, mode: 'insensitive' as const } },
            { fromName: { contains: q, mode: 'insensitive' as const } },
            { subject: { contains: q, mode: 'insensitive' as const } },
            { customerCompany: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000)
  const [emails, total, mailboxes, settings, stats, manualSent, manualUnedited] = await Promise.all([
    prisma.inboundEmail.findMany({
      where,
      orderBy: { receivedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        mailbox: { select: { email: true } },
        items: { select: { status: true } },
        replies: { where: { status: 'sent' }, select: { sendMode: true, edited: true, sentByEmail: true } },
      },
    }),
    prisma.inboundEmail.count({ where }),
    prisma.mailbox.findMany({ select: { id: true, email: true }, orderBy: { email: 'asc' } }),
    getAutomationSettings(),
    prisma.inboundEmail.groupBy({ by: ['status'], where: { receivedAt: { gte: since } }, _count: true }),
    prisma.outboundReply.count({ where: { status: 'sent', sendMode: 'manual', sentAt: { gte: since } } }),
    prisma.outboundReply.count({ where: { status: 'sent', sendMode: 'manual', edited: false, sentAt: { gte: since } } }),
  ])

  const count = (s: string) => stats.find((x) => x.status === s)?._count || 0
  const received = stats.reduce((sum, s) => sum + s._count, 0) - count('ignored')
  const rfq = count('draft_ready') + count('sent_auto') + count('sent_manual') + count('rfq_detected') + count('rejected')
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const qs = (overrides: Record<string, string | number>) => {
    const p = new URLSearchParams({ status, mailbox: mailboxId, q, page: String(page) })
    for (const [k, v] of Object.entries(overrides)) p.set(k, String(v))
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k)
    return `?${p}`
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg border px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2 ${
          settings.autoSendEnabled ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <span>
          Автоотправка: <b>{settings.autoSendEnabled ? 'включена' : 'выключена'}</b>
          {settings.autoSendEnabled
            ? ' — ответы уходят сами в ящиках с режимом «Автоотправка».'
            : ' — все ответы сохраняются как черновики и отправляются менеджером.'}
        </span>
        <Link href="/admin/mail/settings" className="underline">
          Изменить
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Писем за 30 дней', value: received },
          { label: 'Запросов цен', value: rfq },
          { label: 'Черновиков ждут', value: count('draft_ready') },
          { label: 'Отправлено авто / вручную', value: `${count('sent_auto')} / ${count('sent_manual')}` },
          {
            label: 'Ручных без правок',
            value: manualSent ? `${Math.round((manualUnedited / manualSent) * 100)}% (${manualUnedited} из ${manualSent})` : '—',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-lg px-4 py-3">
            <div className="text-xs text-neutral-500">{s.label}</div>
            <div className="text-xl font-semibold text-neutral-900">{s.value}</div>
          </div>
        ))}
      </div>

      <form className="bg-white border border-neutral-200 rounded-lg p-3 flex flex-wrap gap-2 items-end" method="get">
        <label className="text-sm">
          <span className="block text-xs text-neutral-500 mb-1">Статус</span>
          <select name="status" defaultValue={status} className="border border-neutral-300 rounded-md px-2 py-1.5">
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-xs text-neutral-500 mb-1">Ящик</span>
          <select name="mailbox" defaultValue={mailboxId} className="border border-neutral-300 rounded-md px-2 py-1.5">
            <option value="">Все ящики</option>
            {mailboxes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.email}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm flex-1 min-w-[180px]">
          <span className="block text-xs text-neutral-500 mb-1">Поиск</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Отправитель, тема, компания"
            className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
          />
        </label>
        <button className="bg-neutral-900 text-white rounded-md px-4 py-1.5 text-sm font-medium">Показать</button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="px-3 py-2 font-medium">Получено</th>
              <th className="px-3 py-2 font-medium">От кого</th>
              <th className="px-3 py-2 font-medium">Тема</th>
              <th className="px-3 py-2 font-medium">Позиции</th>
              <th className="px-3 py-2 font-medium">Статус</th>
              <th className="px-3 py-2 font-medium">Ящик</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-neutral-500">
                  {mailboxes.length === 0 ? (
                    <>
                      Почтовые ящики ещё не подключены.{' '}
                      <Link href="/admin/mail/settings" className="underline">
                        Подключить
                      </Link>
                    </>
                  ) : (
                    'Писем нет'
                  )}
                </td>
              </tr>
            )}
            {emails.map((e) => {
              const st = EMAIL_STATUS[e.status] || { label: e.status, className: 'bg-neutral-100' }
              const found = e.items.filter((i) => i.status === 'found').length
              const sent = e.replies[0]
              return (
                <tr key={e.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 whitespace-nowrap text-neutral-600">{formatDate(e.receivedAt)}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-neutral-900 truncate max-w-[220px]">{e.fromName || e.fromEmail}</div>
                    <div className="text-xs text-neutral-500 truncate max-w-[220px]">
                      {e.customerCompany || (e.fromName ? e.fromEmail : '')}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/mail/${e.id}`} className="text-neutral-900 hover:underline line-clamp-1">
                      {e.subject || '(без темы)'}
                    </Link>
                    {e.aiSummary && <div className="text-xs text-neutral-500 line-clamp-1">{e.aiSummary}</div>}
                    {e.status === 'ignored' && e.ignoreReason && (
                      <div className="text-xs text-neutral-400">{e.ignoreReason}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-neutral-700">
                    {e.items.length > 0 ? `${found} из ${e.items.length} найдено` : '—'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${st.className}`}>{st.label}</span>
                    {sent?.sendMode === 'manual' && (
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {sent.edited ? 'с правками' : 'без правок'}
                        {sent.sentByEmail ? ` · ${sent.sentByEmail}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-neutral-500 whitespace-nowrap">{e.mailbox.email}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            Стр. {page} из {pages} · {total} писем
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={qs({ page: page - 1 })} className="px-3 py-1 border rounded-md bg-white">
                ← Назад
              </Link>
            )}
            {page < pages && (
              <Link href={qs({ page: page + 1 })} className="px-3 py-1 border rounded-md bg-white">
                Вперёд →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
