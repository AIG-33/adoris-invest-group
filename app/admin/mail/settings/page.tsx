import { prisma } from '@/lib/db'
import { AutomationSettingsForm } from '@/components/admin-mail/automation-settings-form'
import { MailboxCard } from '@/components/admin-mail/mailbox-card'
import { requireAdminPage } from '@/lib/rfq/auth'
import { isGoogleOAuthConfigured } from '@/lib/rfq/google-oauth'
import { LOG_ACTIONS } from '@/lib/rfq/labels'
import { getAutomationSettings } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

export default async function MailSettingsPage({
  searchParams,
}: {
  searchParams: { connected?: string; error?: string }
}) {
  await requireAdminPage()
  const [settings, mailboxes, companies, logs, counts] = await Promise.all([
    getAutomationSettings(),
    prisma.mailbox.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.company.findMany({ select: { id: true, name: true, domain: true }, orderBy: { name: 'asc' } }),
    prisma.automationLog.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.inboundEmail.groupBy({
      by: ['mailboxId'],
      where: { receivedAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
      _count: true,
    }),
  ])
  const oauthReady = isGoogleOAuthConfigured()

  return (
    <div className="space-y-6">
      {searchParams.connected && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-900">
          Ящик <b>{searchParams.connected}</b> подключён. Проверьте компанию и режим работы ниже — первые письма появятся
          во входящих в течение 5 минут или сразу после «Синхронизировать сейчас».
        </div>
      )}
      {searchParams.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{searchParams.error}</div>
      )}

      <AutomationSettingsForm
        initial={{
          autoSendEnabled: settings.autoSendEnabled,
          model: settings.model,
          confidenceThreshold: settings.confidenceThreshold,
        }}
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Почтовые ящики</h2>
          {oauthReady ? (
            <a href="/api/admin/mail/oauth/start" className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium">
              + Подключить ящик через Google
            </a>
          ) : (
            <span className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              Подключение Google ещё не настроено администратором сайта
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500">
          При подключении войдите в Google под нужным ящиком (например, sales@ivdgroup.eu) и разрешите доступ к почте.
          Ящик определяет компанию: от неё зависят шаблон, подпись и ссылки на товары.
        </p>
        {mailboxes.length === 0 && (
          <div className="bg-white border border-dashed border-neutral-300 rounded-lg p-6 text-center text-sm text-neutral-500">
            Ни одного ящика не подключено
          </div>
        )}
        {mailboxes.map((m) => (
          <MailboxCard
            key={m.id}
            companies={companies}
            last24h={counts.find((c) => c.mailboxId === m.id)?._count || 0}
            mailbox={{
              id: m.id,
              email: m.email,
              displayName: m.displayName || '',
              companyId: m.companyId || '',
              mode: m.mode,
              replyLanguage: m.replyLanguage,
              signatureHtml: m.signatureHtml || '',
              excludedSenders: m.excludedSenders || '',
              gmailQuery: m.gmailQuery || '',
              backfillDays: m.backfillDays,
              connected: Boolean(m.refreshTokenEnc),
              lastSyncAt: m.lastSyncAt?.toISOString() || null,
              lastError: m.lastError,
              lastErrorAt: m.lastErrorAt?.toISOString() || null,
            }}
          />
        ))}
      </section>

      <section className="bg-white border border-neutral-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Журнал изменений</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-neutral-500">Пока пусто</p>
        ) : (
          <ul className="divide-y divide-neutral-100 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="py-1.5 flex flex-wrap gap-x-3">
                <span className="text-neutral-500 whitespace-nowrap">
                  {l.createdAt.toLocaleString('ru-RU', { timeZone: 'Europe/Warsaw' })}
                </span>
                <span className="font-medium">{LOG_ACTIONS[l.action] || l.action}</span>
                {l.details ? (
                  <span className="text-neutral-500 break-all">{formatDetails(l.details)}</span>
                ) : null}
                <span className="text-neutral-400">{l.userEmail || 'система'}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function formatDetails(details: unknown): string {
  if (!details || typeof details !== 'object') return ''
  const d = details as Record<string, unknown>
  if ('from' in d && 'to' in d) return `${d.email ? `${d.email}: ` : ''}${d.from} → ${d.to}`
  if (d.email) return String(d.email)
  if (d.kind) return `${d.kind === 'classify' ? 'распознавание' : 'текст ответа'}${d.version ? `, версия ${d.version}` : ''}`
  if ('edited' in d) return d.edited ? 'с правками' : 'без правок'
  return ''
}
