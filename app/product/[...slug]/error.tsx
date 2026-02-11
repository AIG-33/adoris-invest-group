'use client'

import Link from 'next/link'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--company-secondary, #ffffff)' }}>
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-neutral-300 mb-4">503</h1>
        <h2 className="text-xl font-semibold text-neutral-800 mb-3">
          Temporarily unavailable
        </h2>
        <p className="text-neutral-600 mb-6">
          This product page is temporarily unavailable. Please try again in a moment.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: 'var(--company-accent, #000000)' }}
          >
            Try again
          </button>
          <Link
            href="/products"
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
          >
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}
