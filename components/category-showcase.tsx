'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  manufacturer: { name: string }
}

type Category = {
  id: string
  name: string
  slug: string
  products: Product[]
}

type Props = {
  categories: Category[]
}

export function CategoryShowcase({ categories }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}

function CategoryRow({ category }: { category: Category }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (category.products.length === 0) return null

  return (
    <div className="mb-12">
      {/* Category Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {category.name}
        </h2>
        <Link
          href={`/products?category=${category.slug}`}
          className="text-[#666666] transition-colors hover:text-[#333333]"
        >
          Explore All →
        </Link>
      </div>

      {/* Products Row */}
      <div className="group relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#000000] group-hover:opacity-100 lg:block"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-[#000000] group-hover:opacity-100 lg:block"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {category.products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group/item relative min-w-[200px] flex-shrink-0 overflow-hidden rounded-lg transition-all hover:scale-105 md:min-w-[240px]"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="mb-1 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mb-1 text-xs text-gray-300">
                    {product.manufacturer.name}
                  </p>
                  <p className="text-lg font-bold text-[#666666]">
                    €{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
