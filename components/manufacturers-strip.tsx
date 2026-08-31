'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
      <span className="text-[11px] sm:text-xs font-semibold text-neutral-500 group-hover:text-neutral-800 transition-colors text-center leading-tight px-1">
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
      unoptimized
      onError={() => setImgError(true)}
    />
  )
}

function ScrollRow({ items, direction }: { items: Manufacturer[]; direction: 'left' | 'right' }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items]

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    setIsPaused(true)
    const amount = 300
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
    setTimeout(() => setIsPaused(false), 3000)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setIsPaused(true)
    dragStartX.current = e.clientX
    scrollStartX.current = scrollRef.current.scrollLeft
    e.preventDefault()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    const dx = e.clientX - dragStartX.current
    scrollRef.current.scrollLeft = scrollStartX.current - dx
  }, [isDragging])

  const onMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setTimeout(() => setIsPaused(false), 3000)
  }, [isDragging])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsPaused(true)
    dragStartX.current = e.touches[0].clientX
    scrollStartX.current = scrollRef.current.scrollLeft
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const dx = e.touches[0].clientX - dragStartX.current
    scrollRef.current.scrollLeft = scrollStartX.current - dx
  }, [])

  const onTouchEnd = useCallback(() => {
    setTimeout(() => setIsPaused(false), 3000)
  }, [])

  return (
    <div
      className="relative group/row"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { if (!isDragging) setIsPaused(false) }}
    >
      {/* Edge fade masks — light theme */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--company-secondary), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--company-secondary), transparent)' }} />

      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-400 opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-neutral-50 hover:text-neutral-700"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-400 opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-neutral-50 hover:text-neutral-700"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className={`flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Auto-scrolling inner wrapper */}
        <div
          className={`flex gap-5 sm:gap-6 w-max ${isPaused ? '' : direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
        >
          {doubled.map((manufacturer, idx) => (
            <Link
              key={`${manufacturer.slug}-${idx}`}
              href={`/products?manufacturer=${manufacturer.slug}`}
              className="flex items-center justify-center flex-shrink-0 w-32 h-12 sm:w-40 sm:h-14 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2 transition-all duration-300 hover:bg-white hover:border-neutral-300 hover:shadow-md hover:scale-105 group"
              draggable={false}
              onClick={(e) => { if (isDragging) e.preventDefault() }}
            >
              <ManufacturerLogo manufacturer={manufacturer} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ManufacturersStrip({ manufacturers, title }: ManufacturersStripProps) {
  if (manufacturers.length === 0) return null

  const midpoint = Math.ceil(manufacturers.length / 2)
  const topRow = manufacturers.slice(0, midpoint)
  const bottomRow = [...manufacturers.slice(midpoint)].reverse()

  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
        <h2 className="text-center text-sm sm:text-base font-medium uppercase tracking-widest text-neutral-400">
          {title}
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <ScrollRow items={topRow} direction="left" />
        <ScrollRow items={bottomRow} direction="right" />
      </div>
    </section>
  )
}
