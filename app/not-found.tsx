import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // Unset root-layout homepage canonical on 404 responses
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-neutral-300 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-neutral-800 mb-3">
          Page not found
        </h2>
        <p className="text-neutral-600 mb-6">
          The page you requested does not exist or has been moved.
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
