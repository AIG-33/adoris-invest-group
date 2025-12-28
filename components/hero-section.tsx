'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

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
}

interface HeroSectionProps {
  translations: HeroTranslations
}

export function HeroSection({ translations }: HeroSectionProps) {
  const heroSlides = [
    {
      title: translations.reagentsTitle,
      subtitle: translations.reagentsSubtitle,
      description: translations.reagentsDescription,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&h=1080&fit=crop',
      cta: translations.shopNow,
      link: '/products',
    },
    {
      title: translations.bulkOrderTitle,
      subtitle: translations.bulkOrderSubtitle,
      description: translations.bulkOrderDescription,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop',
      cta: translations.tryBulkOrder,
      link: '/bulk-order',
    },
    {
      title: translations.supplierTitle,
      subtitle: translations.supplierSubtitle,
      description: translations.supplierDescription,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop',
      cta: translations.becomeSupplier,
      link: '/supplier',
    },
  ]
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
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
              className="object-cover"
              priority={idx === 0}
              loading={idx === 0 ? 'eager' : 'lazy'}
              quality={85}
              sizes="100vw"
            />
            {/* Dark Gradient Overlay - Stronger on Mobile */}
            <div 
              className="absolute inset-0 opacity-90 md:opacity-80"
              style={{ 
                background: `linear-gradient(to right, var(--company-primary, #333333), var(--company-primary, #333333)80, transparent)`
              }}
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(to top, var(--company-primary, #333333), transparent)`
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-6">
            {/* Title with Animation */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <h2
              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium text-black transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {slide.subtitle}
            </h2>

            {/* Description */}
            <p
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <Link
                href={slide.link}
                className="group flex items-center justify-center gap-2 rounded-md px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--company-accent, #000000)',
                  boxShadow: '0 0 0 0 var(--company-accent, #000000)',
                }}
                onMouseEnter={(e) => {
                  const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
                  const rgb = currentColor.replace('#', '').match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0]
                  const darkened = `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`
                  e.currentTarget.style.backgroundColor = darkened
                  e.currentTarget.style.boxShadow = `0 20px 25px -5px ${currentColor}50, 0 10px 10px -5px ${currentColor}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
                  e.currentTarget.style.boxShadow = '0 0 0 0 var(--company-accent, #000000)'
                }}
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="group flex items-center justify-center gap-2 rounded-md border-2 border-white/30 bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                {translations.browseCatalog}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === currentSlide
                ? 'w-8 sm:w-12'
                : 'w-6 sm:w-8 bg-white/30 hover:bg-white/50'
            }`}
            style={idx === currentSlide ? { backgroundColor: 'var(--company-accent, #000000)' } : undefined}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Hidden on Mobile */}
      <div className="hidden md:block absolute bottom-8 right-8 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="h-8 w-5 rounded-full border-2 border-white/30">
            <div className="mx-auto mt-1 h-2 w-1 animate-pulse rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
