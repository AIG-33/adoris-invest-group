'use client'

import { useState } from 'react'

export interface ProductRfqTranslations {
  rfqTitle: string
  rfqSubtitle: string
  rfqName: string
  rfqEmail: string
  rfqQuantity: string
  rfqMessage: string
  rfqMessagePlaceholder: string
  rfqSubmit: string
  rfqSending: string
  rfqSuccess: string
  rfqError: string
}

interface ProductRfqFormProps {
  sku: string
  productName: string
  productUrl: string
  initialQuantity?: number
  translations: ProductRfqTranslations
}

export function ProductRfqForm({
  sku,
  productName,
  productUrl,
  initialQuantity = 1,
  translations: t,
}: ProductRfqFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [quantity, setQuantity] = useState(Math.max(1, initialQuantity))
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          sku,
          productName,
          quantity,
          message,
          productUrl,
        }),
      })
      if (!res.ok) throw new Error('rfq failed')
      setStatus('success')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border-2 border-neutral-200 bg-neutral-50 p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{t.rfqTitle}</h3>
      <p className="text-sm text-neutral-600 mb-4">{t.rfqSubtitle}</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">{t.rfqName}</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              autoComplete="name"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">{t.rfqEmail}</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              autoComplete="email"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">{t.rfqQuantity}</span>
            <input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </label>
          <div className="block text-sm">
            <span className="font-medium text-neutral-700">SKU</span>
            <div className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono font-semibold text-neutral-800">
              {sku}
            </div>
          </div>
        </div>

        <label className="block text-sm">
          <span className="font-medium text-neutral-700">{t.rfqMessage}</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.rfqMessagePlaceholder}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'sending' || status === 'success'}
          className="w-full sm:w-auto px-6 py-3 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--company-primary, #333333)' }}
        >
          {status === 'sending' ? t.rfqSending : t.rfqSubmit}
        </button>

        {status === 'success' && (
          <p className="text-sm text-green-700 font-medium">{t.rfqSuccess}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-700 font-medium">{t.rfqError}</p>
        )}
      </form>
    </div>
  )
}
