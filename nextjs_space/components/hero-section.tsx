'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

const heroSlides = [
  {
    title: 'MedNAIS™',
    subtitle: 'Enhancing Medical SOPs and streamline healthcare operations',
    description: 'MedNAIS™ must have FREE App for medical nurses and laboratory professionals',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&h=1080&fit=crop',
    cta: 'MORE INFO',
    link: 'https://mednais.com',
  },
  {
    title: 'ILabU™ Kits',
    subtitle: 'Open new revenues for your IVD business',
    description: 'Easy to use at-home sample collection set, designed to make testing accessible from the comfort of your home',
    image: 'https://immunoserv.com/wp-content/uploads/bb-plugin/cache/827A3079-landscape-db75b79966d420a6479b7be6c0af29a7-fqtkhsu3vy0j.jpg',
    cta: 'MORE INFO',
    link: 'https://ilabu.io',
  },
  {
    title: 'Reagents & Disposables',
    subtitle: 'Premium Quality Medical Supplies',
    description: 'Original products from top European manufacturers with full compliance',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&h=1080&fit=crop',
    cta: 'Shop Now',
    link: '/products?category=reagents-disposables',
  },
]

export function HeroSection() {
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
            />
            {/* Dark Gradient Overlay - Stronger on Mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 md:via-black/80 to-black/50 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
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
              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#666666] transition-all duration-700 ${
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
                className="group flex items-center justify-center gap-2 rounded-md bg-[#000000] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-[#156b5f] hover:scale-105 hover:shadow-xl hover:shadow-[#000000]/50"
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="group flex items-center justify-center gap-2 rounded-md border-2 border-white/30 bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                Browse Catalog
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
                ? 'w-8 sm:w-12 bg-[#000000]'
                : 'w-6 sm:w-8 bg-white/30 hover:bg-white/50'
            }`}
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
