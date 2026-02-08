'use client'

import Image from 'next/image'
import Link from 'next/link'
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

        <div className="flex animate-scroll-left gap-8 sm:gap-12 w-max">
          {items.map((manufacturer, idx) => (
            <Link
              key={`${manufacturer.slug}-${idx}`}
              href={`/products?manufacturer=${manufacturer.slug}`}
              className="flex items-center justify-center flex-shrink-0 w-28 h-14 sm:w-36 sm:h-16 rounded-lg bg-white/5 border border-white/5 px-4 py-2 transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-105 group"
            >
              {manufacturer.logo ? (
                <Image
                  src={normalizeImageUrl(manufacturer.logo)}
                  alt={manufacturer.name}
                  width={120}
                  height={48}
                  className="object-contain max-h-10 sm:max-h-12 opacity-50 group-hover:opacity-90 transition-opacity duration-300 brightness-0 invert"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs sm:text-sm font-medium text-white/40 group-hover:text-white/70 transition-colors text-center leading-tight">
                  {manufacturer.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
