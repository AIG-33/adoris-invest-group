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

export function ManufacturersStrip({ manufacturers, title }: ManufacturersStripProps) {
  if (manufacturers.length === 0) return null

  // Duplicate for infinite scroll effect
  const items = [...manufacturers, ...manufacturers]

  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <h2 className="text-center text-sm sm:text-base font-medium uppercase tracking-widest text-white/40">
          {title}
        </h2>
      </div>

      {/* Auto-scrolling logos */}
      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-left gap-6 sm:gap-8 w-max">
          {items.map((manufacturer, idx) => (
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

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
