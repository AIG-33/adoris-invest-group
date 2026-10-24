'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Version {
  id: string
  version: number
  text: string
  comment: string | null
  authorEmail: string | null
  isActive: boolean
  createdAt: string
}

interface TestSide {
  is_price_request: boolean
  confidence: number
  language: string
  customer_name: string | null
  summary: string
  matched: { requestedSku: string; quantity: number; status: string; matchedSku: string | null; unitPrice: number | null }[]
}

interface TestResult {
  candidate: TestSide
  current: TestSide & { version: number }
  skippedBinary: string[]
}

const ITEM_LABEL: Record<string, string> = { found: 'найден', no_price: 'без цены', not_found: 'не найден' }

function ResultColumn({ title, side }: { title: string; side: TestSide }) {
  return (
    <div className="border border-neutral-200 rounded-md p-3 text-sm">
      <div className="font-semibold mb-1">{title}</div>
      <div>
        {side.is_price_request ? 'Запрос цен' : 'Не запрос цен'} · {Math.round(side.confidence * 100)}% · {side.language}
      </div>
      {side.customer_name && <div className="text-neutral-600">Клиент: {side.customer_name}</div>}
      <div className="text-neutral-600 mb-2">{side.summary}</div>
      {side.matched.length > 0 ? (
        <ul className="space-y-0.5">
          {side.matched.map((m, i) => (
            <li key={i} className="font-mono text-xs">
              {m.requestedSku || '—'} × {m.quantity} → {ITEM_LABEL[m.status] || m.status}
              {m.unitPrice ? ` · ${m.unitPrice.toFixed(2)} €` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-neutral-500">Позиций нет</div>
      )}
    </div>
  )
}

export function PromptEditor({
  kind,
  title,
  description,
  versions,
  testEmails,
}: {
  kind: 'classify' | 'reply'
  title: string
  description: string
  versions: Version[]
  testEmails: { id: string; label: string }[]
}) {
  const router = useRouter()
  const active = versions.find((v) => v.isActive) || versions[0]
  const [text, setText] = useState(active?.text || '')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [testEmailId, setTestEmailId] = useState(testEmails[0]?.id || '')
  const [test, setTest] = useState<TestResult | null>(null)

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch('/api/admin/mail/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Ошибка')
    return data
  }

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key)
    try {
      await fn()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setBusy(null)
    }
  }

  const dirty = text.trim() !== (active?.text || '').trim()

  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-neutral-500">{description}</p>
        {active && (
          <p className="text-xs text-neutral-500 mt-1">
            Активна версия {active.version} от {new Date(active.createdAt).toLocaleString('ru-RU')}
            {active.authorEmail ? ` · ${active.authorEmail}` : ''}
          </p>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={kind === 'classify' ? 22 : 10}
        className="w-full border border-neutral-300 rounded-md px-3 py-2 font-mono text-xs leading-relaxed"
      />

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Что изменили (для истории)"
          className="flex-1 min-w-[200px] border border-neutral-300 rounded-md px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          disabled={!!busy || !dirty}
          onClick={() =>
            run('save', async () => {
              const r = await post({ action: 'save', kind, text, comment })
              toast.success(`Сохранена и активирована версия ${r.version.version}`)
              setComment('')
              router.refresh()
            })
          }
          className="bg-neutral-900 text-white rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          Сохранить новую версию
        </button>
        {dirty && (
          <button type="button" onClick={() => setText(active?.text || '')} className="text-sm underline text-neutral-600">
            Отменить правки
          </button>
        )}
      </div>

      {kind === 'classify' && (
        <div className="border-t border-neutral-100 pt-3 space-y-2">
          <div className="font-medium text-sm">Проверить на письме (ничего не сохраняется и не отправляется)</div>
          {testEmails.length === 0 ? (
            <p className="text-sm text-neutral-500">Появится, когда придут первые письма</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <select
                value={testEmailId}
                onChange={(e) => setTestEmailId(e.target.value)}
                className="flex-1 min-w-[240px] border border-neutral-300 rounded-md px-2 py-1.5 text-sm"
              >
                {testEmails.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!!busy || !testEmailId}
                onClick={() =>
                  run('test', async () => {
                    setTest(null)
                    setTest(await post({ action: 'test', text, emailId: testEmailId }))
                  })
                }
                className="border border-neutral-300 rounded-md px-4 py-1.5 text-sm disabled:opacity-50"
              >
                {busy === 'test' ? 'Проверка…' : 'Проверить'}
              </button>
            </div>
          )}
          {test && (
            <>
              {test.skippedBinary.length > 0 && (
                <p className="text-xs text-amber-700">
                  В тесте не учитываются PDF и картинки: {test.skippedBinary.join(', ')}
                </p>
              )}
              <div className="grid md:grid-cols-2 gap-3">
                <ResultColumn title="Текст в редакторе" side={test.candidate} />
                <ResultColumn title={`Активная версия ${test.current.version}`} side={test.current} />
              </div>
            </>
          )}
        </div>
      )}

      <details className="border-t border-neutral-100 pt-3">
        <summary className="text-sm font-medium cursor-pointer">История версий ({versions.length})</summary>
        <ul className="mt-2 divide-y divide-neutral-100 text-sm">
          {versions.map((v) => (
            <li key={v.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
              <span>
                <b>Версия {v.version}</b> · {new Date(v.createdAt).toLocaleString('ru-RU')}
                {v.authorEmail ? ` · ${v.authorEmail}` : ''}
                {v.comment ? ` · ${v.comment}` : ''}
                {v.isActive && <span className="ml-2 text-green-700">активна</span>}
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => setText(v.text)} className="underline text-neutral-600">
                  В редактор
                </button>
                {!v.isActive && (
                  <button
                    type="button"
                    disabled={!!busy}
                    onClick={() =>
                      run('activate', async () => {
                        await post({ action: 'activate', id: v.id })
                        toast.success(`Активирована версия ${v.version}`)
                        setText(v.text)
                        router.refresh()
                      })
                    }
                    className="underline text-neutral-900 disabled:opacity-50"
                  >
                    Сделать активной
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
