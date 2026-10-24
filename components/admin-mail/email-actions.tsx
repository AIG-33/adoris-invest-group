'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Props {
  emailId: string
  status: string
  isPriceRequest: boolean
  draft: { subject: string; bodyHtml: string; toEmail: string; error: string | null } | null
}

export function EmailActions({ emailId, status, isPriceRequest, draft }: Props) {
  const router = useRouter()
  const [subject, setSubject] = useState(draft?.subject || '')
  const [bodyHtml, setBodyHtml] = useState(draft?.bodyHtml || '')
  const [view, setView] = useState<'preview' | 'html'>('preview')
  const [busy, setBusy] = useState<string | null>(null)

  const call = async (action: string, extra: Record<string, unknown> = {}, success?: string) => {
    setBusy(action)
    try {
      const res = await fetch(`/api/admin/mail/emails/${emailId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      if (success) toast.success(success)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(null)
    }
  }

  const sent = status === 'sent_auto' || status === 'sent_manual'
  const dirty = draft ? subject !== draft.subject || bodyHtml !== draft.bodyHtml : false

  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
      {draft ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Черновик ответа</h3>
            <div className="flex gap-1 text-xs">
              <button
                type="button"
                onClick={() => setView('preview')}
                className={`px-2 py-1 rounded ${view === 'preview' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
              >
                Просмотр
              </button>
              <button
                type="button"
                onClick={() => setView('html')}
                className={`px-2 py-1 rounded ${view === 'html' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
              >
                Редактировать HTML
              </button>
            </div>
          </div>
          <div className="text-xs text-neutral-500">Кому: {draft.toEmail}</div>
          {draft.error && <div className="text-sm bg-red-50 text-red-700 rounded px-3 py-2">Ошибка отправки: {draft.error}</div>}
          <label className="block text-sm">
            <span className="text-xs text-neutral-500">Тема</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
            />
          </label>
          {view === 'preview' ? (
            <iframe title="Черновик" sandbox="" srcDoc={bodyHtml} className="w-full h-[420px] border border-neutral-200 rounded" />
          ) : (
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={18}
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5 font-mono text-xs"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!!busy}
              onClick={() => {
                if (confirm(`Отправить ответ на ${draft.toEmail}?`)) call('send', { subject, bodyHtml }, 'Ответ отправлен')
              }}
              className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {busy === 'send' ? 'Отправка…' : 'Отправить'}
            </button>
            <button
              type="button"
              disabled={!!busy || !dirty}
              onClick={() => call('save_draft', { subject, bodyHtml }, 'Черновик сохранён')}
              className="border border-neutral-300 rounded-md px-4 py-2 text-sm disabled:opacity-50"
            >
              Сохранить правки
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => call('redraft', {}, 'Черновик пересобран')}
              className="border border-neutral-300 rounded-md px-4 py-2 text-sm disabled:opacity-50"
              title="Собрать черновик заново по текущему шаблону и промту"
            >
              {busy === 'redraft' ? '…' : 'Пересобрать черновик'}
            </button>
          </div>
        </>
      ) : (
        <h3 className="font-semibold">Действия</h3>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
        {!sent && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => call('reprocess', {}, 'Письмо обработано заново')}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
            title="Заново прочитать вложения, распознать AI и сопоставить с базой"
          >
            {busy === 'reprocess' ? 'Обработка…' : 'Обработать заново'}
          </button>
        )}
        {!sent && isPriceRequest && !draft && status !== 'rejected' && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => call('redraft', {}, 'Черновик создан')}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Создать черновик
          </button>
        )}
        {!sent && !isPriceRequest && ['not_rfq', 'ignored', 'rejected'].includes(status) && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => call('force_rfq', {}, 'Черновик создан')}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
            title="AI ошибся — подготовить ответ по найденным позициям"
          >
            Это запрос цен — подготовить ответ
          </button>
        )}
        {!sent && status !== 'not_rfq' && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => call('not_rfq', {}, 'Отмечено как «не запрос цен»')}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Это не запрос цен
          </button>
        )}
        {!sent && status !== 'rejected' && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => call('reject', {}, 'Письмо отклонено')}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm text-red-700 disabled:opacity-50"
          >
            Отклонить
          </button>
        )}
      </div>
    </section>
  )
}
