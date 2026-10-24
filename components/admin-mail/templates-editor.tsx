'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { renderTemplate } from '@/lib/rfq/template'

interface TemplateView {
  id: string
  companyId: string
  language: string
  subject: string
  bodyHtml: string
  updatedAt: string
}

const SAMPLE = {
  subject: 'Zapytanie ofertowe',
  customerName: 'Anna Kowalska',
  intro: 'Thank you for your request. Please find below the prices for the products available in our database.',
  companyName: 'IVD GROUP Sp. z o.o.',
  signatureHtml: '<p><b>IVD GROUP Sp. z o.o.</b><br>sales@ivdgroup.eu<br>ivdgroup.eu</p>',
  found: [
    { sku: 'BMS2214', name: 'PD-1 (CD279) ELISA Kit, 96 Tests', quantity: 2, unitPrice: 612.5, currency: 'EUR', url: null },
    { sku: 'LH-729070', name: 'Transferpette S, 100–1000 µl', quantity: 1, unitPrice: 189, currency: 'EUR', url: null },
  ],
  notFound: [{ sku: 'AB-12345', description: 'Anti-CD3 antibody', quantity: 1 }],
}

const PLACEHOLDERS = [
  ['{{customerName}}', 'имя клиента'],
  ['{{intro}}', 'вступление от AI (промт «текст ответа»)'],
  ['{{foundTable}}', 'таблица найденных позиций с ценами EU'],
  ['{{notFoundList}}', 'список позиций, которые уточняем у поставщиков'],
  ['{{companyName}}', 'название компании ящика'],
  ['{{signature}}', 'подпись ящика'],
  ['{{subject}}', 'тема письма клиента (без Re:)'],
  ['{{#found}}…{{/found}}', 'показать, если что-то найдено'],
  ['{{#notFound}}…{{/notFound}}', 'показать, если есть ненайденные'],
  ['{{#noneFound}}…{{/noneFound}}', 'показать, если ничего не найдено'],
]

const EMPTY = (defaults: { subject: string; bodyHtml: string }): TemplateView => ({
  id: '',
  companyId: '',
  language: 'en',
  subject: defaults.subject,
  bodyHtml: defaults.bodyHtml,
  updatedAt: '',
})

export function TemplatesEditor({
  templates,
  companies,
  defaults,
}: {
  templates: TemplateView[]
  companies: { id: string; name: string }[]
  defaults: { subject: string; bodyHtml: string }
}) {
  const router = useRouter()
  const [current, setCurrent] = useState<TemplateView>(templates[0] || EMPTY(defaults))
  const [busy, setBusy] = useState(false)

  const preview = useMemo(() => renderTemplate(current, SAMPLE), [current])
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name || 'Все компании (по умолчанию)'

  const save = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/mail/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, id: current.id || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      toast.success('Шаблон сохранён')
      setCurrent((c) => ({ ...c, id: data.template.id }))
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!current.id || !confirm('Удалить шаблон?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/mail/templates?id=${current.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Ошибка удаления')
      toast.success('Шаблон удалён')
      setCurrent(EMPTY(defaults))
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
      <aside className="bg-white border border-neutral-200 rounded-lg p-3 space-y-2">
        <div className="text-sm font-semibold">Шаблоны</div>
        {templates.length === 0 && (
          <p className="text-xs text-neutral-500">
            Своих шаблонов пока нет — используется встроенный английский. Сохраните его ниже, чтобы изменить.
          </p>
        )}
        <ul className="space-y-1">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setCurrent(t)}
                className={`w-full text-left rounded-md px-2 py-1.5 text-sm ${
                  current.id === t.id ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
                }`}
              >
                {companyName(t.companyId)} · {t.language.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setCurrent({ ...EMPTY(defaults), bodyHtml: current.bodyHtml, subject: current.subject })}
          className="w-full border border-dashed border-neutral-300 rounded-md px-2 py-1.5 text-sm"
        >
          + Новый (копия текущего)
        </button>
        <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          Выбор шаблона: компания + язык клиента → компания + EN → общий + язык → общий + EN.
        </p>
      </aside>

      <div className="space-y-4">
        <section className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block font-medium mb-1">Компания</span>
              <select
                value={current.companyId}
                onChange={(e) => setCurrent({ ...current, companyId: e.target.value })}
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              >
                <option value="">Все компании (по умолчанию)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block font-medium mb-1">Язык (код: en, pl, de, ru…)</span>
              <input
                value={current.language}
                onChange={(e) => setCurrent({ ...current, language: e.target.value })}
                className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
              />
            </label>
          </div>
          <label className="text-sm block">
            <span className="block font-medium mb-1">Тема</span>
            <input
              value={current.subject}
              onChange={(e) => setCurrent({ ...current, subject: e.target.value })}
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
            />
          </label>
          <label className="text-sm block">
            <span className="block font-medium mb-1">Текст письма (HTML)</span>
            <textarea
              value={current.bodyHtml}
              onChange={(e) => setCurrent({ ...current, bodyHtml: e.target.value })}
              rows={16}
              className="w-full border border-neutral-300 rounded-md px-2 py-1.5 font-mono text-xs"
            />
          </label>
          <details className="text-sm">
            <summary className="cursor-pointer text-neutral-600">Подстановки</summary>
            <ul className="mt-2 grid md:grid-cols-2 gap-x-4 gap-y-1">
              {PLACEHOLDERS.map(([code, label]) => (
                <li key={code}>
                  <code className="bg-neutral-100 px-1 rounded text-xs">{code}</code> — {label}
                </li>
              ))}
            </ul>
          </details>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Сохранить
            </button>
            {current.id && (
              <button type="button" disabled={busy} onClick={remove} className="text-sm text-red-700 underline disabled:opacity-50">
                Удалить
              </button>
            )}
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-sm font-semibold mb-1">Предпросмотр на примере</div>
          <div className="text-sm text-neutral-600 mb-2">Тема: {preview.subject}</div>
          <iframe title="Предпросмотр шаблона" sandbox="" srcDoc={preview.bodyHtml} className="w-full h-[460px] border border-neutral-200 rounded" />
        </section>
      </div>
    </div>
  )
}
