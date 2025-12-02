'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  image: string
  quantity: number
  manufacturer: { name: string }
}

export function CartContent() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage?.getItem?.('cart') || '[]')
    setCart(savedCart || [])
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = cart?.map?.((item) =>
      item?.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart || [])
    localStorage?.setItem?.('cart', JSON.stringify(updatedCart))
    window?.dispatchEvent?.(new Event('cartUpdated'))
  }

  const removeItem = (id: string) => {
    const updatedCart = cart?.filter?.((item) => item?.id !== id)
    setCart(updatedCart || [])
    localStorage?.setItem?.('cart', JSON.stringify(updatedCart))
    window?.dispatchEvent?.(new Event('cartUpdated'))
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center text-neutral-600">Loading cart...</div>
      </div>
    )
  }

  const subtotal = cart?.reduce?.((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0) || 0
  
  // Calculate discount based on order value
  let discountRate = 0
  if (subtotal >= 100000) {
    discountRate = 0.10 // 10% for orders €100,000+
  } else if (subtotal >= 50000) {
    discountRate = 0.05 // 5% for orders €50,000+
  }
  // 0% for orders below €50,000
  
  const discount = subtotal * discountRate
  const subtotalAfterDiscount = subtotal - discount
  const vat = subtotalAfterDiscount * 0.23 // 23% VAT
  const total = subtotalAfterDiscount + vat

  if (cart?.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-neutral-200">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-8">
              Browse our products and add items to your cart to get started.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#20a895] text-white px-8 py-4 rounded-lg hover:bg-[#0891B2] transition-all font-semibold"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 mb-6 sm:mb-8">
        <Link href="/" className="hover:text-[#20a895]">Home</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">Shopping Cart</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart?.map?.((item) => (
            <div
              key={item?.id}
              className="bg-white rounded-xl p-3 sm:p-6 border-2 border-neutral-200 hover:border-[#20a895] transition-all flex flex-col sm:flex-row gap-3 sm:gap-6"
            >
              <Link href={`/product/${item?.slug}`} className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-neutral-50 rounded-lg overflow-hidden">
                  <Image
                    src={item?.image || '/placeholder.png'}
                    alt={item?.name || 'Product'}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 80px, 112px"
                  />
                </div>
              </Link>

              <div className="flex-1 flex flex-col">
                <div className="text-xs sm:text-sm text-[#20a895] font-semibold mb-1">
                  {item?.manufacturer?.name}
                </div>
                <Link href={`/product/${item?.slug}`}>
                  <h3 className="font-semibold text-sm sm:text-lg text-neutral-900 mb-1 hover:text-[#20a895] transition-colors line-clamp-2">
                    {item?.name}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-neutral-600 font-mono mb-3 sm:mb-4">SKU: {item?.sku}</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className="text-xs sm:text-sm font-medium text-neutral-700">Qty:</span>
                    <div className="flex border-2 border-neutral-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item?.id, (item?.quantity || 1) - 1)}
                        className="px-2 sm:px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="px-3 sm:px-4 py-1 font-semibold border-x-2 border-neutral-300 min-w-[40px] sm:min-w-[50px] text-center text-sm">
                        {item?.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item?.id, (item?.quantity || 1) + 1)}
                        className="px-2 sm:px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:text-right gap-3">
                    <div className="text-lg sm:text-2xl font-bold text-[#1a8c7c]">
                      €{((item?.price || 0) * (item?.quantity || 0))?.toLocaleString?.('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || '0.00'}
                    </div>
                    <button
                      onClick={() => removeItem(item?.id)}
                      className="text-xs sm:text-sm text-red-500 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) || []}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-neutral-200 shadow-lg lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">💼 Order Summary</h2>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base">
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal ({cart?.length} items)</span>
                <span className="font-semibold">
                  €{subtotal?.toLocaleString?.('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Shipping</span>
                <span className="font-semibold text-[#2ec4b6]">FREE</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-[#2ec4b6]">
                  <span>Volume Discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">
                    -€{discount?.toLocaleString?.('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '0.00'}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal (excl. VAT)</span>
                <span className="font-semibold">
                  €{subtotalAfterDiscount?.toLocaleString?.('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>VAT (23%)</span>
                <span className="font-semibold">
                  €{vat?.toLocaleString?.('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || '0.00'}
                </span>
              </div>
            </div>

            <div className="border-t-2 border-neutral-900 pt-3 sm:pt-4 mb-4 sm:mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-bold text-neutral-900">Total</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#1a8c7c]">
                  €{total?.toLocaleString?.('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || '0.00'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 text-center mt-2">Including 23% VAT</p>
            </div>

            <button
              onClick={() => router?.push?.('/checkout')}
              className="w-full bg-[#20a895] text-white py-3 sm:py-4 rounded-lg hover:bg-[#0891B2] transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Free shipping on orders over €5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
