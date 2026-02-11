'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search, Package } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getProductUrl } from '@/lib/product-url'

interface SearchResult {
  id: string
  name: string
  sku: string
  slug: string
  price: number
  imageUrl: string | null
  category: { name: string } | null
  manufacturer: { name: string; slug: string } | null
}

interface HeroTranslations {
  reagentsTitle: string
  reagentsSubtitle: string
  reagentsDescription: string
  bulkOrderTitle: string
  bulkOrderSubtitle: string
  bulkOrderDescription: string
  supplierTitle: string
  supplierSubtitle: string
  supplierDescription: string
  shopNow: string
  tryBulkOrder: string
  becomeSupplier: string
  browseCatalog: string
  searchPlaceholder: string
}

interface HeroSectionProps {
  translations: HeroTranslations
}

export function HeroSection({ translations }: HeroSectionProps) {
  const router = useRouter()
  const heroSlides = [
    {
      title: translations.reagentsTitle,
      subtitle: translations.reagentsSubtitle,
      description: translations.reagentsDescription,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=675&fit=crop&q=80',
      cta: translations.shopNow,
      link: '/products',
    },
    {
      title: translations.bulkOrderTitle,
      subtitle: translations.bulkOrderSubtitle,
      description: translations.bulkOrderDescription,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=675&fit=crop&q=80',
      cta: translations.tryBulkOrder,
      link: '/bulk-order',
    },
    {
      title: translations.supplierTitle,
      subtitle: translations.supplierSubtitle,
      description: translations.supplierDescription,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=675&fit=crop&q=80',
      cta: translations.becomeSupplier,
      link: '/supplier',
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setIsSearching(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          setShowDropdown(results.length > 0)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleResultClick = (product: SearchResult) => {
    setShowDropdown(false)
    setSearchQuery('')
    router.push(getProductUrl({
      slug: product.slug,
      sku: product.sku,
      manufacturer: { slug: product.manufacturer?.slug || 'unknown' },
    }))
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] min-h-[500px] sm:min-h-[550px] overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover scale-105"
              priority={idx === 0}
              loading={idx === 0 ? 'eager' : 'lazy'}
              quality={75}
              sizes="100vw"
            />
            {/* Multi-layer gradient overlays for depth — lighter to let photos show through */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            {/* Subtle warm highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {slide.description}
            </p>

            {/* Search Bar */}
            <div
              ref={searchRef}
              className={`relative max-w-2xl transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-xl blur-sm group-hover:from-white/30 group-hover:to-white/10 transition-all duration-300" />
                  <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
                    <Search className="ml-4 sm:ml-5 w-5 h-5 sm:w-6 sm:h-6 text-white/60 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => { if (searchResults.length > 0) setShowDropdown(true) }}
                      placeholder={translations.searchPlaceholder}
                      className="w-full px-3 sm:px-4 py-3.5 sm:py-4 bg-transparent text-white text-sm sm:text-base placeholder-white/40 focus:outline-none"
                    />
                    {isSearching ? (
                      <div className="mr-4">
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="mr-2 px-5 sm:px-7 py-2 sm:py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:scale-105 hover:brightness-110 flex-shrink-0"
                        style={{ backgroundColor: 'var(--company-accent)' }}
                      >
                        <Search className="w-4 h-4 sm:hidden" />
                        <span className="hidden sm:inline">{translations.browseCatalog.split(' ')[0]}</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 text-left"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{product.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-white/60 bg-white/10 px-1.5 py-0.5 rounded">{product.sku}</span>
                          {product.manufacturer && (
                            <span className="text-xs text-white/40 truncate">{product.manufacturer.name}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-3 pt-2 transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <Link
                href={slide.link}
                className="group inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:brightness-110"
                style={{ backgroundColor: 'var(--company-accent)' }}
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
              >
                {translations.browseCatalog}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? 'w-10'
                : 'w-6 bg-white/20 hover:bg-white/40'
            }`}
            style={idx === currentSlide ? { backgroundColor: 'var(--company-accent)' } : undefined}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
