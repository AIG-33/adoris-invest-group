'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Building2, Truck, FileText } from 'lucide-react'
import type { CompanyConfig } from '@/lib/company-types'

interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  image: string
  quantity: number
}

interface CheckoutTranslations {
  title: string
  billingInfo: string
  orderSummary: string
  placeOrder: string
  processing: string
  secure: string
  gdpr: string
}

interface CheckoutFormProps {
  translations: CheckoutTranslations
  company: CompanyConfig | null
}

export function CheckoutForm({ translations, company }: CheckoutFormProps) {
  const router = useRouter()
  const { data: session } = useSession() || {}
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
    
    // Load profile data if user is logged in
    if (session?.user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            const profile = data.profile
            // Split name into firstName and lastName if needed
            let firstName = profile.firstName || ''
            let lastName = profile.lastName || ''
            
            // If name exists but firstName/lastName don't, try to split
            if (!firstName && !lastName && profile.name) {
              const nameParts = profile.name.split(' ')
              firstName = nameParts[0] || ''
              lastName = nameParts.slice(1).join(' ') || ''
            }
            
            setFormData(prev => ({
              ...prev,
              firstName: firstName || prev.firstName,
              lastName: lastName || prev.lastName,
              email: profile.email || prev.email,
              company: profile.company || prev.company,
              vatId: profile.vatId || prev.vatId,
              phone: profile.phone || prev.phone,
              address: profile.address || prev.address,
              city: profile.city || prev.city,
              postalCode: profile.postalCode || prev.postalCode,
              country: profile.country || prev.country,
              department: profile.department || prev.department,
              paymentMethod: profile.paymentMethod || prev.paymentMethod,
            }))
          }
        })
        .catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error loading profile:', error)
          }
        })
    }
  }, [session])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center text-neutral-600">{translations.processing}</div>
      </div>
    )
  }

  if (cart?.length === 0) {
    router?.push?.('/cart')
    return null
  }

  // Calculate subtotal - if showPrices is false, set all prices to 0
  const subtotal = company?.showPrices 
    ? (cart?.reduce?.((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0) || 0)
    : 0
  
  // Calculate discount based on order value (only if prices are shown)
  let discountRate = 0
  if (company?.showPrices && subtotal >= 100000) {
    discountRate = 0.10 // 10% for orders €100,000+
  } else if (company?.showPrices && subtotal >= 50000) {
    discountRate = 0.05 // 5% for orders €50,000+
  }
  // 0% for orders below €50,000 or if prices are hidden
  
        const discount = subtotal * discountRate
        const subtotalAfterDiscount = subtotal - discount
        const vat = 0 // VAT is always 0%
        const total = subtotalAfterDiscount + vat

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setLoading(true)

    try {
      // If showPrices is false, set all item prices to 0 before sending to API
      const itemsWithPrices = company?.showPrices 
        ? cart 
        : cart?.map(item => ({ ...item, price: 0 }))
      
      const orderData = {
        ...formData,
        items: itemsWithPrices,
        subtotal: company?.showPrices ? subtotal : 0,
        discount: company?.showPrices ? discount : 0,
        vat: 0,
        total: company?.showPrices ? total : 0,
        userId: session?.user ? (session.user as any).id : null,
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Order error:', error)
      }
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e?.target?.name]: e?.target?.value })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 mb-6 sm:mb-8">
        <Link href="/" className="hover:text-[#333333]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#333333]">Cart</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{translations.title}</span>
      </nav>

      {/* Progress Steps - Compact on Mobile */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8 sm:mb-12 bg-white p-4 sm:p-6 rounded-xl shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#666666] text-white flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
            ✓
          </div>
          <span className="font-semibold text-[#666666] text-xs sm:text-base whitespace-nowrap">Cart</span>
        </div>
        <div className="w-8 sm:w-16 h-0.5" style={{ backgroundColor: 'var(--company-accent, #000000)' }}></div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0" style={{ backgroundColor: 'var(--company-accent, #000000)' }}>
            2
          </div>
          <span className="font-semibold text-[#333333] text-xs sm:text-base whitespace-nowrap">{translations.title}</span>
        </div>
        <div className="w-8 sm:w-16 h-0.5 bg-neutral-200"></div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
            3
          </div>
          <span className="font-semibold text-neutral-600 text-xs sm:text-base whitespace-nowrap hidden xs:inline">Confirm</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Billing Information */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-neutral-200">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#333333]" />
              {translations.billingInfo}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-neutral-200">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#333333]" />
              Order Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Purchase Order Number
                </label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 text-sm sm:text-base"
                  placeholder="Special instructions, delivery notes, etc."
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-neutral-200 lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">{translations.orderSummary}</h2>

            {/* Cart Items Mini */}
            <div className="max-h-[250px] sm:max-h-[300px] overflow-y-auto mb-4 sm:mb-6 space-y-2 sm:space-y-3">
              {cart?.map?.((item) => (
                <div key={item?.id} className="flex gap-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item?.image && item.image.length > 0 ? item.image : '/placeholder.svg'}
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
                    <p className="text-sm font-bold text-[#000000] mt-1">
                      {(!company?.showPrices || item?.price === 0) ? (
                        <span className="text-xs">Price on Request</span>
                      ) : (
                        `€${((item?.price || 0) * (item?.quantity || 0))?.toFixed?.(2)}`
                      )}
                    </p>
                  </div>
                </div>
              )) || []}
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal</span>
                <span className="font-semibold">
                  {(!company?.showPrices || subtotal === 0) ? (
                    <span className="text-xs">Price on Request</span>
                  ) : (
                    `€${subtotal?.toFixed?.(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Shipping</span>
                <span className="font-semibold text-[#666666]">FREE</span>
              </div>
              {discountRate > 0 && company?.showPrices && subtotal > 0 && (
                <div className="flex justify-between text-[#666666]">
                  <span>Volume Discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">-€{discount?.toFixed?.(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t-2 border-neutral-900 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-[#000000]">
                  {(!company?.showPrices || total === 0) ? (
                    <span className="text-sm">Price on Request</span>
                  ) : (
                    `€${total?.toFixed?.(2)}`
                  )}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 rounded-lg transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--company-accent, #000000)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
                  const rgb = currentColor.replace('#', '').match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0]
                  const darkened = `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`
                  e.currentTarget.style.backgroundColor = darkened
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
                }
              }}
            >
              {loading ? translations.processing : translations.placeOrder}
            </button>

            <div className="mt-6 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>{translations.secure}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>{translations.gdpr}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
