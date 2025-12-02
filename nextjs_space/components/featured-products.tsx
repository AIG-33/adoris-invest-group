'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useRef } from 'react'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  shortDesc: string | null
  category: { name: string }
  manufacturer: { name: string }
}

type Props = {
  products: Product[]
}

export function FeaturedProducts({ products }: Props) {
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
              Featured Products
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Premium medical equipment from top manufacturers
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-[#2ec4b6] transition-colors hover:text-[#20a895] md:block"
          >
            View All →
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="group relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-3 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#1a8c7c] group-hover:opacity-100 lg:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-3 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#1a8c7c] group-hover:opacity-100 lg:block"
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
                href={`/product/${product.slug}`}
                className="group/card relative min-w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#1a8c7c]/20 md:min-w-[320px]"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-[#1a8c7c]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {product.category.name}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#1a8c7c] opacity-0 transition-all hover:bg-white hover:scale-110 group-hover/card:opacity-100"
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
                  <p className="mb-2 text-sm text-gray-400">
                    {product.manufacturer.name}
                  </p>
                  {product.shortDesc && (
                    <p className="mb-3 text-sm text-gray-300 line-clamp-2">
                      {product.shortDesc}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#2ec4b6]">
                      €{product.price.toLocaleString()}
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
