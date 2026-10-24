'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MAILBOX_MODES } from '@/lib/rfq/labels'

interface MailboxView {
  id: string
  email: string
  displayName: string
  companyId: string
  mode: string
  replyLanguage: string
  signatureHtml: string
  excludedSenders: string
  gmailQuery: string
  backfillDays: number
  connected: boolean
  lastSyncAt: string | null
  lastError: string | null
  lastErrorAt: string | null
}

const LANGUAGES = [
  { value: 'auto', label: 'Как у клиента' },
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
]

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('ru-RU', { timeZone: 'Europe/Warsaw' }) : '—')

export function MailboxCard({
  mailbox,
  companies,
  last24h,
}: {
  mailbox: MailboxView
  companies: { id: string; name: string; domain: string }[]
  last24h: number
}) {
  const router = useRouter()
  const [form, setForm] = useState(mailbox)
  const [busy, setBusy] = useState<string | null>(null)
  const [open, setOpen] = useState(!mailbox.companyId)

  const set = (key: keyof MailboxView, value: string | number) => setForm((f) => ({ ...f, [key]: value }))

  const request = async (method: string, body?: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/mail/mailboxes/${mailbox.id}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Ошибка')
    return data
  }

  const run = async (key: string, fn: () => Promise<string | void>) => {
    setBusy(key)
    try {
      const message = await fn()
      if (message) toast.success(message)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(null)
    }
  }

  const save = () =>
    run('save', async () => {
      if (form.mode === 'auto' && mailbox.mode !== 'auto') {
        if (!confirm('Режим «Автоотправка»: ответы из этого ящика будут уходить сами, если общий переключатель включён. Продолжить?')) {
          return
        }
      }
      await request('PATCH', {
        displayName: form.displayName,
        companyId: form.companyId,
        mode: form.mode,
        replyLanguage: form.replyLanguage,
        signatureHtml: form.signatureHtml,
        excludedSenders: form.excludedSenders,
        gmailQuery: form.gmailQuery,
        backfillDays: form.backfillDays,
      })
      return 'Настройки ящика сохранены'
    })

  const modeInfo = MAILBOX_MODES.find((m) => m.value === mailbox.mode)

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-neutral-900">{mailbox.email}</div>
          <div className="text-sm text-neutral-500">
            {companies.find((c) => c.id === mailbox.companyId)?.name || 'Компания не выбрана'} · {modeInfo?.label}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {mailbox.connected ? 'Подключён к Google' : 'Не подключён'} · синхронизация: {fmt(mailbox.lastSyncAt)} · писем за
            сутки: {last24h}
          </div>
          {mailbox.lastError && (
            <div className="text-xs text-red-700 mt-1">
              Ошибка {fmt(mailbox.lastErrorAt)}: {mailbox.lastError}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {mailbox.connected ? (
            <>
              <button
                type="button"
                disabled={!!busy}
                onClick={() =>
                  run('test', async () => {
                    const r = await request('POST', { action: 'test' })
                    return `Подключение работает: ${r.email}, писем в ящике ${r.messagesTotal}`
                  })
                }
                className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {busy === 'test' ? '…' : 'Проверить подключение'}
              </button>
              <button
                type="button"
                disabled={!!busy || mailbox.mode === 'off'}
                onClick={() =>
                  run('sync', async () => {
                    const r = await request('POST', { action: 'sync' })
                    return `Новых писем: ${r.added}, обработано: ${r.processed}`
                  })
                }
                className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {busy === 'sync' ? 'Синхронизация…' : 'Синхронизировать сейчас'}
              </button>
            </>
          ) : (
            <a
              href={`/api/admin/mail/oauth/start?email=${encodeURIComponent(mailbox.email)}`}
              className="bg-neutral-900 text-white rounded-md px-3 py-1.5 text-sm"
            >
              Подключить снова
            </a>
          )}
          <button type="button" onClick={() => setOpen((o) => !o)} className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm">
            {open ? 'Свернуть' : 'Настройки'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="block font-medium mb-1">Компания</span>
              <select
                value={form.companyId}
                onChange={(e) => set('companyId', e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              >
                <option value="">— не выбрана —</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.domain})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block font-medium mb-1">Имя отправителя</span>
              <input
                value={form.displayName}
                onChange={(e) => set('displayName', e.target.value)}
                placeholder="По умолчанию — название компании"
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              />
            </label>
          </div>

          <fieldset className="text-sm">
            <legend className="font-medium mb-1">Режим работы</legend>
            <div className="grid md:grid-cols-2 gap-2">
              {MAILBOX_MODES.map((m) => (
                <label
                  key={m.value}
                  className={`flex gap-2 border rounded-md px-3 py-2 cursor-pointer ${
                    form.mode === m.value ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                  }`}
                >
                  <input type="radio" name={`mode-${mailbox.id}`} checked={form.mode === m.value} onChange={() => set('mode', m.value)} />
                  <span>
                    <span className="font-medium">{m.label}</span>
                    <span className="block text-xs text-neutral-500">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="text-sm">
              <span className="block font-medium mb-1">Язык ответа</span>
              <select
                value={form.replyLanguage}
                onChange={(e) => set('replyLanguage', e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block font-medium mb-1">Фильтр Gmail (необязательно)</span>
              <input
                value={form.gmailQuery}
                onChange={(e) => set('gmailQuery', e.target.value)}
                placeholder="например: label:zapytania"
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              />
            </label>
            <label className="text-sm">
              <span className="block font-medium mb-1">Загрузить письма за последние (дней)</span>
              <input
                type="number"
                min={1}
                max={60}
                value={form.backfillDays}
                onChange={(e) => set('backfillDays', Number(e.target.value))}
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              />
              <span className="text-xs text-neutral-500">Действует при первой синхронизации</span>
            </label>
          </div>

          <label className="text-sm block">
            <span className="block font-medium mb-1">Не обрабатывать письма от</span>
            <textarea
              value={form.excludedSenders}
              onChange={(e) => set('excludedSenders', e.target.value)}
              rows={3}
              placeholder={'по одному в строке: supplier@example.com или @bank.pl'}
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5 font-mono text-xs"
            />
            <span className="text-xs text-neutral-500">
              Рассылки, автоответы, no-reply и письма с наших доменов пропускаются автоматически
            </span>
          </label>

          <label className="text-sm block">
            <span className="block font-medium mb-1">Подпись (HTML)</span>
            <textarea
              value={form.signatureHtml}
              onChange={(e) => set('signatureHtml', e.target.value)}
              rows={4}
              placeholder="Пусто — название компании, e-mail ящика, телефон и сайт компании"
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5 font-mono text-xs"
            />
          </label>

          <div className="flex flex-wrap justify-between gap-2">
            <button
              type="button"
              disabled={!!busy}
              onClick={save}
              className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {busy === 'save' ? 'Сохранение…' : 'Сохранить'}
            </button>
            {mailbox.connected && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() =>
                  confirm(`Отключить ${mailbox.email}? Письма перестанут обрабатываться, история сохранится.`) &&
                  run('disconnect', async () => {
                    await request('DELETE')
                    return 'Ящик отключён'
                  })
                }
                className="text-sm text-red-700 underline disabled:opacity-50"
              >
                Отключить ящик
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
