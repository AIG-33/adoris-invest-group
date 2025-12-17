'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Minus, Plus, Truck, Edit } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  image: string | null
  stockStatus: string
  stockQuantity: number
  category: { name: string; slug: string }
  manufacturer: { name: string; slug: string; logo: string | null }
}

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user && (session.user as any)?.role === 'admin'
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const addToCart = () => {
    const cart = JSON.parse(localStorage?.getItem?.('cart') || '[]')
    const existingItem = cart?.find?.((item: any) => item?.id === product?.id)

    if (existingItem) {
      existingItem.quantity = (existingItem?.quantity || 0) + quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage?.setItem?.('cart', JSON.stringify(cart))
    window?.dispatchEvent?.(new Event('cartUpdated'))
    alert(`${quantity} x ${product?.name} added to cart!`)
  }

  // VAT is always 0%
  const priceWithVat = product?.price || 0

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
        <Link href="/" className="hover:text-[#333333]">Home</Link>
        <span>/</span>
        <Link href="/" className="hover:text-[#333333]">Products</Link>
        <span>/</span>
        <Link href={`/?category=${product?.category?.slug}`} className="hover:text-[#333333]">
          {product?.category?.name}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{product?.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="relative w-full max-w-md mx-auto lg:max-w-full aspect-[4/3] bg-neutral-50 rounded-xl border-2 border-neutral-200 p-6 lg:p-8">
            <Image
              src={
                product?.image && product.image.length > 0
                  ? product.image
                  : product?.manufacturer?.logo && product.manufacturer.logo.length > 0
                  ? product.manufacturer.logo
                  : '/placeholder.svg'
              }
              alt={product?.name || 'Product'}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-neutral-100 rounded-full text-sm font-semibold text-neutral-700">
              {product?.category?.name}
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-full text-sm font-semibold">
              {product?.manufacturer?.name}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
            {product?.name}
          </h1>

          <p className="text-neutral-600 font-mono">SKU: {product?.sku}</p>

          {/* Price */}
          <div className="bg-neutral-50 p-6 rounded-2xl border-2 border-neutral-200">
            <div className="text-sm text-neutral-600 uppercase tracking-wide font-semibold mb-2">
              B2B Price
            </div>
            <div className="text-5xl font-bold text-[#000000]">
              €{product?.price?.toLocaleString?.('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-blue-50 border-l-4 border-[#333333] p-4 rounded-lg flex items-start gap-3">
            <Truck className="w-6 h-6 text-[#333333] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#333333] mb-1">Available by Order Only</h4>
              <p className="text-sm text-neutral-600">
                Delivery to our warehouse in Vilnius takes 4-7 weeks. Products sourced directly from European manufacturers.
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-neutral-700">Quantity:</span>
            <div className="flex border-2 border-neutral-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e?.target?.value || '1')))}
                className="w-20 text-center font-semibold border-x-2 border-neutral-300 focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={addToCart}
              className="flex-1 text-white py-4 px-8 rounded-lg transition-all font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--company-accent, #000000)',
              }}
              onMouseEnter={(e) => {
                const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
                const rgb = currentColor.replace('#', '').match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0]
                const darkened = `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`
                e.currentTarget.style.backgroundColor = darkened
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            {isAdmin && (
              <Link
                href={`/admin/products/${product?.id}/edit`}
                className="bg-[#666666] text-white py-4 px-6 rounded-lg hover:bg-[#555555] transition-all font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Edit product - ID:', product?.id, 'SKU:', product?.sku)
                  }
                }}
              >
                <Edit className="w-5 h-5" />
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden mb-16">
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-1 py-4 px-6 font-semibold transition-all ${activeTab === 'description' ? 'bg-white text-[#333333] border-b-2 border-[#333333]' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`flex-1 py-4 px-6 font-semibold transition-all ${activeTab === 'specifications' ? 'bg-white text-[#333333] border-b-2 border-[#333333]' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            Specifications
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
                {product?.description}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid gap-3">
              <div className="flex border-b border-neutral-200 py-3">
                <span className="w-1/3 font-semibold text-neutral-900">SKU</span>
                <span className="flex-1 text-neutral-700">{product?.sku}</span>
              </div>
              <div className="flex border-b border-neutral-200 py-3">
                <span className="w-1/3 font-semibold text-neutral-900">Manufacturer</span>
                <span className="flex-1 text-neutral-700">{product?.manufacturer?.name}</span>
              </div>
              <div className="flex py-3">
                <span className="w-1/3 font-semibold text-neutral-900">Category</span>
                <span className="flex-1 text-neutral-700">{product?.category?.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-neutral-900">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts?.map?.((relProduct) => (
              <Link
                key={relProduct?.id}
                href={`/product/${relProduct?.slug}`}
                className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative w-full aspect-square bg-neutral-50 p-4">
                  <Image
                    src={
                      relProduct?.image && relProduct.image.length > 0
                        ? relProduct.image
                        : relProduct?.manufacturer?.logo && relProduct.manufacturer.logo.length > 0
                        ? relProduct.manufacturer.logo
                        : '/placeholder.svg'
                    }
                    alt={relProduct?.name || 'Product'}
                    fill
                    className="object-contain"
                    sizes="25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-neutral-900 line-clamp-2 mb-2">
                    {relProduct?.name}
                  </h3>
                  <div className="text-xl font-bold text-[#000000]">
                    €{relProduct?.price?.toLocaleString?.('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '0.00'}
                  </div>
                </div>
              </Link>
            )) || []}
          </div>
        </div>
      )}
    </div>
  )
}
