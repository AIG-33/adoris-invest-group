'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  User, 
  Package, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Euro,
  Calendar,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  Settings,
  Save,
  Building2,
  FileText
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface AccountContentProps {
  orders: any[]
  stats: {
    totalOrders: number
    totalSpent: number
    pendingOrders: number
  }
  user: any
}

export function AccountContent({ orders, stats, user }: AccountContentProps) {
  const router = useRouter()
  const [reordering, setReordering] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    vatId: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Poland',
    department: '',
    paymentMethod: 'bank_transfer',
  })

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setProfileData({
              firstName: data.profile.firstName || '',
              lastName: data.profile.lastName || '',
              company: data.profile.company || '',
              vatId: data.profile.vatId || '',
              phone: data.profile.phone || '',
              address: data.profile.address || '',
              city: data.profile.city || '',
              postalCode: data.profile.postalCode || '',
              country: data.profile.country || 'Poland',
              department: data.profile.department || '',
              paymentMethod: data.profile.paymentMethod || 'bank_transfer',
            })
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading profile:', error)
        }
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast.success('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (orderId: string) => {
    setReordering(orderId)
    
    try {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return

      // Get current cart
      const cartData = localStorage.getItem('cart')
      let cart = cartData ? JSON.parse(cartData) : []

      // Add all items from the order to cart
      order.items.forEach((item: any) => {
        const existingItemIndex = cart.findIndex(
          (cartItem: any) => cartItem.id === item.product.id
        )

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          cart[existingItemIndex].quantity += item.quantity
        } else {
          // Add new item
          cart.push({
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            slug: item.product.slug,
            price: item.product.price,
            image: item.product.image || '',
            quantity: item.quantity,
            manufacturer: {
              name: item.product.manufacturer?.name || '',
              logo: item.product.manufacturer?.logo || null,
            },
          })
        }
      })

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'))

      toast.success(`${order.items.length} item(s) added to cart!`)
      
      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push('/cart')
      }, 1000)
    } catch (error) {
      console.error('Error reordering:', error)
      toast.error('Failed to reorder')
    } finally {
      setReordering(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'shipped':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'delivered':
        return 'text-[#000000] bg-[#666666]/10 border-[#666666]/20'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
      case 'shipped':
        return <Package className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }
    return statusMap[status] || status
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-white">
      {/* User Info Card */}
      <div className="bg-gradient-to-br from-[#333333] to-[#666666] rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
            <p className="text-white/90 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-5 h-5" />
              <span className="text-sm font-medium">Total Spent</span>
            </div>
            <p className="text-3xl font-bold">
              €{Number(stats.totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mb-6 overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'text-[#000000] border-b-2 border-[#333333] bg-neutral-50'
                : 'text-neutral-600 hover:text-[#000000] hover:bg-neutral-50'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'text-[#000000] border-b-2 border-[#333333] bg-neutral-50'
                : 'text-neutral-600 hover:text-[#000000] hover:bg-neutral-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            Profile
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#333333]/10 to-[#666666]/5 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-[#000000] flex items-center gap-2">
              <User className="w-6 h-6" />
              Edit Profile
            </h2>
            <p className="text-neutral-600 mt-1">Fill in your details for faster checkout</p>
          </div>

          {profileLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-4" />
              <p className="text-neutral-600">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="+48793081310"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      VAT ID
                    </label>
                    <input
                      type="text"
                      name="vatId"
                      value={profileData.vatId}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="PL1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="Laboratory Services"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="Warsaw"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={profileData.postalCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                      placeholder="00-001"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={profileData.country}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                    >
                      <option value="Poland">Poland</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Preferences */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Payment Preferences
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Default Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={profileData.paymentMethod}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#333333]/10 to-[#666666]/5 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-[#000000] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            My Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">You have no orders yet</h3>
            <p className="text-neutral-600 mb-6">Start shopping in our store</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Go to Catalog
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#333333] to-[#666666] rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      {order.items.length}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#000000]">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {formatStatus(order.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#000000]">
                          <Euro className="w-4 h-4" />
                          €{order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`}
                      className="px-4 py-2 bg-white border-2 rounded-lg transition-all font-semibold flex items-center gap-2"
                      style={{
                        borderColor: 'var(--company-accent, #000000)',
                        color: 'var(--company-accent, #000000)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
                        e.currentTarget.style.color = '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff'
                        e.currentTarget.style.color = 'var(--company-accent, #000000)'
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </Link>
                    <button
                      onClick={() => handleReorder(order.id)}
                      disabled={reordering === order.id}
                      className="px-4 py-2 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                    >
                      {reordering === order.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Reorder
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                  {order.items.slice(0, 6).map((item: any) => (
                    <div key={item.id} className="relative group">
                      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                        <Image
                          src={item.product?.image && item.product.image.length > 0 ? item.product.image : '/placeholder.svg'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-semibold text-center px-2">
                          {item.product.name.length > 40
                            ? item.product.name.slice(0, 40) + '...'
                            : item.product.name}
                        </span>
                      </div>
                      <span className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--company-accent, #000000)' }}>
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 6 && (
                    <div className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center border border-neutral-300">
                      <span className="text-neutral-600 font-semibold text-center">
                        +{order.items.length - 6}
                        <br />
                        more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  )
}
