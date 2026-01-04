'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { getProductUrl } from '@/lib/product-url'
import { useRef } from 'react'
import type { CompanyConfig } from '@/lib/company-types'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  description: string | null
  category: { name: string; slug: string }
  manufacturer: { name: string; slug: string; logo: string | null }
}

interface FeaturedProductsTranslations {
  title: string
  subtitle: string
  viewAll: string
}

type Props = {
  products: Product[]
  translations: FeaturedProductsTranslations
  company: CompanyConfig | null
}

export function FeaturedProducts({ products, translations, company }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))

    // Visual feedback
    const button = e.currentTarget as HTMLButtonElement
    button.classList.add('scale-90')
    setTimeout(() => button.classList.remove('scale-90'), 200)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {translations.title}
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              {translations.subtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-[#666666] transition-colors hover:text-[#333333] md:block"
          >
            {translations.viewAll} →
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="group relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-3 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#000000] group-hover:opacity-100 lg:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-3 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#000000] group-hover:opacity-100 lg:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={getProductUrl(product)}
                className="group/card relative min-w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#000000]/20 md:min-w-[320px]"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
                  <Image
                    src={
                      product.image && product.image.length > 0
                        ? normalizeImageUrl(product.image)
                        : product.manufacturer?.logo && product.manufacturer.logo.length > 0
                        ? normalizeImageUrl(product.manufacturer.logo)
                        : '/placeholder.svg'
                    }
                    alt={`${product.name || 'Product'} - ${product.manufacturer?.name || ''} ${product.category?.name || 'Medical Equipment'}`}
                    fill
                    className={
                      product.image && product.image.length > 0
                        ? 'object-cover transition-transform duration-500 group-hover/card:scale-110'
                        : 'object-contain transition-transform duration-500 group-hover/card:scale-110 p-4'
                    }
                    sizes="(max-width: 768px) 280px, 320px"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-[#000000]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {product.category.name}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#000000] opacity-0 transition-all hover:bg-white hover:scale-110 group-hover/card:opacity-100"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  {/* SKU - Highlighted for B2B search */}
                  <div className="mb-2 bg-white/10 backdrop-blur-sm px-2 py-1 rounded inline-block">
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">SKU:</span>
                    <span className="text-xs font-mono font-bold text-white ml-2">{product.sku}</span>
                  </div>
                  <Link 
                    href={`/products?manufacturer=${product.manufacturer.slug}`}
                    className="mb-2 text-sm text-gray-400 hover:text-gray-300 transition-colors block"
                  >
                    {product.manufacturer.name}
                  </Link>
                  {product.description && (
                    <p className="mb-3 text-sm text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#666666]">
                            {(!company?.showPrices || product.price === 0) ? (
                              <span className="text-sm">Price on Request</span>
                            ) : (
                              `€${product.price.toLocaleString()}`
                            )}
                          </span>
                          <span className="text-sm text-gray-400">By Order</span>
                        </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
