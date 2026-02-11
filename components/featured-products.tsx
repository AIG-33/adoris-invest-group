'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { getProductUrl } from '@/lib/product-url'
import type { CompanyConfig } from '@/lib/company-types'
import { normalizeImageUrl } from '@/lib/normalize-image-url'

type Product = {
  id: string
  name: string
  sku: string
  slug: string
  price: number
  image: string | null
  description?: string | null
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

    const button = e.currentTarget as HTMLButtonElement
    button.classList.add('scale-90')
    setTimeout(() => button.classList.remove('scale-90'), 200)
  }

  if (products.length === 0) return null

  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {translations.title}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={getProductUrl(product)}
              className="group relative rounded-xl overflow-hidden bg-white/[0.06] backdrop-blur-sm border border-white/[0.10] transition-all duration-500 hover:bg-white/[0.10] hover:border-white/[0.18] hover:shadow-2xl hover:shadow-white/[0.05] hover:-translate-y-1.5 card-glow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                <Image
                  src={
                    product.image && product.image.length > 0
                      ? normalizeImageUrl(product.image)
                      : product.manufacturer?.logo && product.manufacturer.logo.length > 0
                      ? normalizeImageUrl(product.manufacturer.logo)
                      : '/placeholder.svg'
                  }
                  alt={`${product.name} - ${product.manufacturer?.name || ''}`}
                  fill
                  className={
                    product.image && product.image.length > 0
                      ? 'object-cover transition-transform duration-700 group-hover:scale-105'
                      : 'object-contain transition-transform duration-700 group-hover:scale-105 p-6'
                  }
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                {/* Top gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-medium text-white/90">
                  {product.category.name}
                </div>

                {/* Add to cart button */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="absolute bottom-3 right-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 p-2.5 text-white opacity-0 transition-all duration-300 hover:bg-white/20 hover:scale-110 group-hover:opacity-100"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {/* SKU - prominent for B2B */}
                <div className="inline-flex items-center gap-1.5 mb-2.5 px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.08]">
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">SKU</span>
                  <span className="text-xs font-mono font-bold text-white/80">{product.sku}</span>
                </div>

                {/* Product name */}
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
                  {product.name}
                </h3>

                {/* Manufacturer */}
                <p className="text-xs text-white/65 mb-3">
                  {product.manufacturer.name}
                </p>

                {/* Price row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                  <span className="text-lg font-bold text-white">
                    {(!company?.showPrices || product.price === 0) ? (
                      <span className="text-sm font-medium text-white/60">Price on Request</span>
                    ) : (
                      `€${product.price.toLocaleString()}`
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/55 font-medium">By Order</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white text-sm font-semibold transition-all duration-300 hover:bg-white/[0.14] hover:border-white/[0.22] hover:shadow-lg hover:shadow-white/[0.04]"
          >
            {translations.viewAll}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
