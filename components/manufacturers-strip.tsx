'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { normalizeImageUrl } from '@/lib/normalize-image-url'

type Manufacturer = {
  name: string
  slug: string
  logo: string | null
}

interface ManufacturersStripProps {
  manufacturers: Manufacturer[]
  title: string
}

function ManufacturerLogo({ manufacturer }: { manufacturer: Manufacturer }) {
  const [imgError, setImgError] = useState(false)

  if (!manufacturer.logo || imgError) {
    return (
      <span className="text-[11px] sm:text-xs font-semibold text-white/50 group-hover:text-white/80 transition-colors text-center leading-tight px-1">
        {manufacturer.name}
      </span>
    )
  }

  return (
    <Image
      src={normalizeImageUrl(manufacturer.logo)}
      alt={manufacturer.name}
      width={120}
      height={48}
      className="object-contain max-h-8 sm:max-h-10 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  )
}

function ScrollRow({ items, direction }: { items: Manufacturer[]; direction: 'left' | 'right' }) {
  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items]

  return (
    <div className="relative">
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className={`flex ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'} gap-5 sm:gap-6 w-max`}>
        {doubled.map((manufacturer, idx) => (
          <Link
            key={`${manufacturer.slug}-${idx}`}
            href={`/products?manufacturer=${manufacturer.slug}`}
            className="flex items-center justify-center flex-shrink-0 w-32 h-12 sm:w-40 sm:h-14 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12] hover:scale-105 group"
          >
            <ManufacturerLogo manufacturer={manufacturer} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ManufacturersStrip({ manufacturers, title }: ManufacturersStripProps) {
  if (manufacturers.length === 0) return null

  // Split: first half (A→M) scrolls left, second half (M→Z) scrolls right
  const midpoint = Math.ceil(manufacturers.length / 2)
  const topRow = manufacturers.slice(0, midpoint)        // A → middle, moves left (→ end)
  const bottomRow = [...manufacturers.slice(midpoint)].reverse()  // Z → middle, moves right (→ start)

  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
        <h2 className="text-center text-sm sm:text-base font-medium uppercase tracking-widest text-white/40">
          {title}
        </h2>
      </div>

      {/* Two rows scrolling in opposite directions */}
      <div className="space-y-3 sm:space-y-4">
        <ScrollRow items={topRow} direction="left" />
        <ScrollRow items={bottomRow} direction="right" />
      </div>

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
