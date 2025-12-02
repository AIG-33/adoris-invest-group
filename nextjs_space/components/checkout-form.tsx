'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Building2, Truck, FileText } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  image: string
  quantity: number
}

export function CheckoutForm() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    vatId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Poland',
    department: '',
    poNumber: '',
    preferredDeliveryDate: '',
    notes: '',
    paymentMethod: 'bank_transfer',
  })

  useEffect(() => {
    setMounted(true)
    const savedCart = JSON.parse(localStorage?.getItem?.('cart') || '[]')
    setCart(savedCart || [])
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center text-neutral-600">Loading...</div>
      </div>
    )
  }

  if (cart?.length === 0) {
    router?.push?.('/cart')
    return null
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
  const vat = subtotalAfterDiscount * 0.23
  const total = subtotalAfterDiscount + vat

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: cart,
        subtotal,
        discount,
        vat,
        total,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response?.ok) {
        throw new Error('Order failed')
      }

      const result = await response.json()
      localStorage?.removeItem?.('cart')
      window?.dispatchEvent?.(new Event('cartUpdated'))
      router?.push?.(`/order-confirmation/${result?.orderNumber}`)
    } catch (error) {
      console.error('Order error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e?.target?.name]: e?.target?.value })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
        <Link href="/" className="hover:text-[#20a895]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#20a895]">Cart</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">Checkout</span>
      </nav>

      {/* Progress Steps */}
      <div className="flex justify-center items-center gap-4 mb-12 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2ec4b6] text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <span className="font-semibold text-[#2ec4b6]">Cart</span>
        </div>
        <div className="w-16 h-0.5 bg-[#20a895]"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#20a895] text-white flex items-center justify-center font-bold">
            2
          </div>
          <span className="font-semibold text-[#20a895]">Checkout</span>
        </div>
        <div className="w-16 h-0.5 bg-neutral-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold">
            3
          </div>
          <span className="font-semibold text-neutral-600">Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-[#20a895]" />
              Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  VAT ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vatId"
                  value={formData.vatId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="e.g., PL1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="e.g., Laboratory Services"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                >
                  <option value="Poland">Poland</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <FileText className="w-7 h-7 text-[#20a895]" />
              Order Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Purchase Order Number
                </label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="PO-2025-001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  name="preferredDeliveryDate"
                  value={formData.preferredDeliveryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Order Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="Special instructions, delivery notes, etc."
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-[#20a895]" />
              Payment Method
            </h2>
            <label className="flex items-start gap-4 p-4 border-2 border-[#20a895] rounded-lg bg-[#20a895]/5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={formData.paymentMethod === 'bank_transfer'}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-[#20a895]"
              />
              <div className="flex-1">
                <div className="font-semibold text-neutral-900 mb-1">🏦 Bank Transfer</div>
                <p className="text-sm text-neutral-600">
                  Pay via bank transfer after receiving the invoice. Payment terms: Net 30
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-neutral-200 sticky top-24">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Order Summary</h2>

            {/* Cart Items Mini */}
            <div className="max-h-[300px] overflow-y-auto mb-6 space-y-3">
              {cart?.map?.((item) => (
                <div key={item?.id} className="flex gap-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item?.image || '/placeholder.png'}
                      alt={item?.name || 'Product'}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-1">
                      {item?.name}
                    </h4>
                    <p className="text-xs text-neutral-600">Qty: {item?.quantity}</p>
                    <p className="text-sm font-bold text-[#1a8c7c] mt-1">
                      €{((item?.price || 0) * (item?.quantity || 0))?.toFixed?.(2)}
                    </p>
                  </div>
                </div>
              )) || []}
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal</span>
                <span className="font-semibold">€{subtotal?.toFixed?.(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Shipping</span>
                <span className="font-semibold text-[#2ec4b6]">FREE</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-[#2ec4b6]">
                  <span>Volume Discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">-€{discount?.toFixed?.(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-700">VAT (23%)</span>
                <span className="font-semibold">€{vat?.toFixed?.(2)}</span>
              </div>
            </div>

            <div className="border-t-2 border-neutral-900 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-[#1a8c7c]">
                  €{total?.toFixed?.(2)}
                </span>
              </div>
              <p className="text-xs text-center text-neutral-600 mt-2">Including VAT</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#20a895] text-white py-4 rounded-lg hover:bg-[#0891B2] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <div className="mt-6 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>Secure SSL encrypted transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>GDPR compliant data protection</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
