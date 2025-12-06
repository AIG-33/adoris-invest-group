'use client'

import { useState } from 'react'
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
  Eye
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
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          })
        }
      })

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'))

      toast.success(`${order.items.length} товаров добавлено в корзину!`)
      
      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push('/cart')
      }, 1000)
    } catch (error) {
      console.error('Error reordering:', error)
      toast.error('Не удалось повторить заказ')
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
      pending: 'Ожидает',
      processing: 'Обрабатывается',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменён',
    }
    return statusMap[status] || status
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#000000] mb-2">Личный кабинет</h1>
        <p className="text-neutral-600">Управляйте своими заказами и настройками</p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-br from-[#333333] to-[#666666] rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name || 'Пользователь'}</h2>
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
              <span className="text-sm font-medium">Всего заказов</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-5 h-5" />
              <span className="text-sm font-medium">Общая сумма</span>
            </div>
            <p className="text-3xl font-bold">
              €{stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">В обработке</span>
            </div>
            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#333333]/10 to-[#666666]/5 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-[#000000] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Мои заказы
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">У вас пока нет заказов</h3>
            <p className="text-neutral-600 mb-6">Начните делать покупки в нашем магазине</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Перейти в каталог
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
                          Заказ #{order.orderNumber}
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
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items.length} {order.items.length === 1 ? 'товар' : 'товаров'}
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
                      className="px-4 py-2 bg-white border-2 border-[#333333] text-[#333333] rounded-lg hover:bg-[#333333] hover:text-white transition-all font-semibold flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Детали
                    </Link>
                    <button
                      onClick={() => handleReorder(order.id)}
                      disabled={reordering === order.id}
                      className="px-4 py-2 bg-gradient-to-r from-[#333333] to-[#666666] text-white rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                    >
                      {reordering === order.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Добавление...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Повторить
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
                          src={item.product.image}
                          alt={item.product.name}
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
                      <span className="absolute top-2 right-2 bg-[#000000] text-white text-xs font-bold px-2 py-1 rounded-full">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 6 && (
                    <div className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center border border-neutral-300">
                      <span className="text-neutral-600 font-semibold text-center">
                        +{order.items.length - 6}
                        <br />
                        ещё
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
