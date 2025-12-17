'use client'

import Link from 'next/link'
import { Download, Package } from 'lucide-react'

function darkenColor(color: string): string {
  // Remove # if present
  const hex = color.replace('#', '')
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Darken by 20
  const darkened = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`
  return darkened
}

export function ProductsActionButtons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href="/api/products/export-pricelist"
        download
        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm"
        style={{ backgroundColor: 'var(--company-accent, #000000)' }}
        onMouseEnter={(e) => {
          const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
          e.currentTarget.style.backgroundColor = darkenColor(currentColor)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
        }}
      >
        <Download className="w-4 h-4" />
        <span>Download Pricelist</span>
      </a>
      <Link
        href="/bulk-order"
        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm"
        style={{ backgroundColor: 'var(--company-accent, #000000)' }}
        onMouseEnter={(e) => {
          const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
          e.currentTarget.style.backgroundColor = darkenColor(currentColor)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
        }}
      >
        <Package className="w-4 h-4" />
        <span>Bulk Order</span>
      </Link>
    </div>
  )
}

