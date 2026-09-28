import Link from 'next/link'
import type { Metadata } from 'next'

/**
 * Segment-level 404 for /product/* — ensures missing products emit a real
 * HTTP 404 (not soft-404 200 + NEXT_NOT_FOUND) and never inherit the
 * homepage canonical / index,follow from the root layout.
 */
export const metadata: Metadata = {
  title: 'Product Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: null },
}

export default function ProductNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-neutral-300 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-neutral-800 mb-3">
          Product not found
        </h2>
        <p className="text-neutral-600 mb-6">
          This product does not exist or is no longer available in our catalog.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: 'var(--company-accent, #000000)' }}
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
