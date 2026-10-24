'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const MODELS = [
  { value: 'gpt-4.1', label: 'GPT-4.1 — точнее читает таблицы и сканы (рекомендуется)' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini — дешевле, для простых текстовых писем' },
  { value: 'gpt-4o', label: 'GPT-4o' },
]

interface Props {
  initial: { autoSendEnabled: boolean; model: string; confidenceThreshold: number }
}

export function AutomationSettingsForm({ initial }: Props) {
  const router = useRouter()
  const [model, setModel] = useState(initial.model)
  const [threshold, setThreshold] = useState(Math.round(initial.confidenceThreshold * 100))
  const [busy, setBusy] = useState(false)

  const save = async (patch: Record<string, unknown>, message: string) => {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/mail/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      toast.success(message)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  const toggle = () => {
    const next = !initial.autoSendEnabled
    const question = next
      ? 'Включить автоотправку? Ответы будут уходить клиентам без проверки в ящиках с режимом «Автоотправка».'
      : 'Выключить автоотправку? Все ответы будут сохраняться как черновики.'
    if (confirm(question)) save({ autoSendEnabled: next }, next ? 'Автоотправка включена' : 'Автоотправка выключена')
  }

  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Автоотправка ответов</h2>
          <p className="text-sm text-neutral-500 max-w-2xl">
            Пока выключено, система только готовит черновики — менеджер проверяет и отправляет. Включите, когда черновики
            стабильно уходят без правок. Ответ уйдёт сам только в ящиках с режимом «Автоотправка», если найден хотя бы
            один артикул с ценой, уверенность AI не ниже порога, все вложения прочитаны и в переписке ещё не было ответа.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={initial.autoSendEnabled}
          disabled={busy}
          onClick={toggle}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
            initial.autoSendEnabled ? 'bg-green-600' : 'bg-neutral-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              initial.autoSendEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
          <span className="sr-only">Автоотправка</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
        <label className="text-sm">
          <span className="block font-medium mb-1">Модель AI для распознавания</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-2 py-1.5"
          >
            {MODELS.some((m) => m.value === model) ? null : <option value={model}>{model}</option>}
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-medium mb-1">Порог уверенности для автоотправки: {threshold}%</span>
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>
      <button
        type="button"
        disabled={busy || (model === initial.model && threshold === Math.round(initial.confidenceThreshold * 100))}
        onClick={() => save({ model, confidenceThreshold: threshold / 100 }, 'Настройки сохранены')}
        className="border border-neutral-300 rounded-md px-4 py-1.5 text-sm disabled:opacity-50"
      >
        Сохранить
      </button>
    </section>
  )
}
