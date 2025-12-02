'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  shortDesc: string | null
  price: number
  image: string
  stockStatus: string
  category: { name: string }
  manufacturer: { name: string }
}

interface ProductGridProps {
  products: Product[]
  search?: string
}

export function ProductGrid({ products, search }: ProductGridProps) {
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage?.getItem?.('cart') || '[]')
    const existingItem = cart?.find?.((item: any) => item?.id === product?.id)

    if (existingItem) {
      existingItem.quantity = (existingItem?.quantity || 1) + 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage?.setItem?.('cart', JSON.stringify(cart))
    window?.dispatchEvent?.(new Event('cartUpdated'))

    // Show toast notification
    alert(`${product?.name} added to cart!`)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900">
              {search ? `Search Results for "${search}"` : 'Medical Equipment'}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Showing {products?.length || 0} products
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products?.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-neutral-200">
          <p className="text-lg sm:text-xl text-neutral-600">
            No products found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products?.map?.((product) => (
            <article
              key={product?.id}
              className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <Link href={`/product/${product?.slug}`} className="relative">
                <div className="relative w-full aspect-square bg-neutral-50 p-4 sm:p-6">
                  <Image
                    src={product?.image || '/placeholder.png'}
                    alt={product?.name || 'Product'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-3 sm:p-5 flex flex-col flex-1">
                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                  {product?.category?.name}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#20a895] mb-2">
                  {product?.manufacturer?.name}
                </div>
                <Link href={`/product/${product?.slug}`}>
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-2 line-clamp-2 hover:text-[#20a895] transition-colors">
                    {product?.name}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-neutral-500 mb-1 font-mono truncate">
                  SKU: {product?.sku}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 mb-3 sm:mb-4">
                  {product?.shortDesc}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-3 sm:pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="text-lg sm:text-2xl font-bold text-[#1a8c7c]">
                      €{product?.price?.toLocaleString?.('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || '0.00'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-[#20a895] text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-[#0891B2] transition-colors font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Add</span>
                    </button>
                    <Link
                      href={`/product/${product?.slug}`}
                      className="bg-neutral-100 text-neutral-700 p-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )) || []}
        </div>
      )}
    </div>
  )
}
