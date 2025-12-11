'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Truck, Shield, Phone, Check } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDesc: string | null
  price: number
  image: string
  stockStatus: string
  stockQuantity: number
  category: { name: string; slug: string }
  manufacturer: { name: string; slug: string }
}

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
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

  const vatAmount = product?.price ? product.price * 0.23 : 0
  const priceWithVat = product?.price ? product.price + vatAmount : 0

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="sticky top-24 h-fit">
          <div className="relative w-full aspect-square bg-neutral-50 rounded-2xl border-2 border-neutral-200 p-8">
            <Image
              src={product?.image && product.image.length > 0 ? product.image : '/placeholder.svg'}
              alt={product?.name || 'Product'}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
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
              B2B Price (excl. VAT)
            </div>
            <div className="text-5xl font-bold text-[#000000] mb-2">
              €{product?.price?.toLocaleString?.('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'}
            </div>
            <div className="text-sm text-neutral-600">
              €{priceWithVat?.toLocaleString?.('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'} incl. 23% VAT
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
              className="flex-1 bg-[#333333] text-white py-4 px-8 rounded-lg hover:bg-[#1a1a1a] transition-all font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Truck className="w-5 h-5 text-[#333333]" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Shield className="w-5 h-5 text-[#333333]" />
              <span className="text-sm font-medium">2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#333333]" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Check className="w-5 h-5 text-[#333333]" />
              <span className="text-sm font-medium">CE Certified</span>
            </div>
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
              <div className="flex border-b border-neutral-200 py-3">
                <span className="w-1/3 font-semibold text-neutral-900">Category</span>
                <span className="flex-1 text-neutral-700">{product?.category?.name}</span>
              </div>
              <div className="flex border-b border-neutral-200 py-3">
                <span className="w-1/3 font-semibold text-neutral-900">Stock Status</span>
                <span className="flex-1 text-neutral-700 capitalize">
                  {product?.stockStatus?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex py-3">
                <span className="w-1/3 font-semibold text-neutral-900">Warranty</span>
                <span className="flex-1 text-neutral-700">2 years parts and labor</span>
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
                    src={relProduct?.image && relProduct.image.length > 0 ? relProduct.image : '/placeholder.svg'}
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
