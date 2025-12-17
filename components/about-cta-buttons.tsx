'use client'

import Link from 'next/link'

function darkenColor(color: string): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const darkened = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`
  return darkened
}

export function AboutCTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/products"
        className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
        style={{ backgroundColor: 'var(--company-accent, #000000)' }}
        onMouseEnter={(e) => {
          const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
          const rgb = currentColor.replace('#', '').match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0]
          const darkened = `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`
          e.currentTarget.style.backgroundColor = darkened
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
        }}
      >
        Browse Our Catalog
      </Link>
      <Link
        href="/company/team"
        className="inline-flex items-center justify-center px-8 py-4 border-2 font-semibold rounded-lg transition-all"
        style={{ 
          borderColor: 'var(--company-accent, #000000)',
          color: 'var(--company-accent, #000000)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
          e.currentTarget.style.color = '#ffffff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--company-accent, #000000)'
        }}
      >
        Meet Our Team
      </Link>
    </div>
  )
}

