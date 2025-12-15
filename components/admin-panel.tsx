'use client'

import { useState, useEffect } from 'react'
import { Upload, Package, ShoppingBag, Clock, CheckCircle, FileSpreadsheet, Calendar, Plus, Trash2, Image as ImageIcon, MapPin, XCircle, Truck, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminPanelProps {
  stats: {
    totalProducts: number
    totalOrders: number
    pendingOrders: number
  }
  recentOrders: any[]
  exhibitions?: any[]
}

export function AdminPanel({ stats, recentOrders, exhibitions = [] }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'exhibitions'>('orders')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [orders, setOrders] = useState<any[]>(recentOrders)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null)
  
  // Exhibition form state
  const [showExhibitionForm, setShowExhibitionForm] = useState(false)
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    images: '',
    featured: false,
  })
  const [exhibitionsList, setExhibitionsList] = useState(exhibitions || [])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  // Load all orders
  useEffect(() => {
    if (activeTab === 'orders') {
      loadAllOrders()
    }
  }, [activeTab])

  const loadAllOrders = async () => {
    setLoadingOrders(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading orders:', error)
      }
      toast.error('Error loading orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(orders.map(order => order.id === orderId ? data.order : order))
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Error updating order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
      return
    }

    setDeletingOrder(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        toast.success(`Order ${orderNumber} deleted successfully`)
      } else {
        toast.error('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Error deleting order')
    } finally {
      setDeletingOrder(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'processing':
        return <RefreshCw className="w-3 h-3" />
      case 'shipped':
        return <Truck className="w-3 h-3" />
      case 'delivered':
        return <CheckCircle className="w-3 h-3" />
      case 'cancelled':
        return <XCircle className="w-3 h-3" />
      default:
        return <Package className="w-3 h-3" />
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage('')
    }
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/exhibition-image', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        } else {
          const error = await response.json()
          toast.error(`Failed to upload ${file.name}: ${error.error || 'Unknown error'}`)
        }
      }

      if (uploadedUrls.length > 0) {
        setUploadedImageUrls([...uploadedImageUrls, ...uploadedUrls])
        const currentImages = exhibitionForm.images
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url)
        const allImages = [...currentImages, ...uploadedUrls].join('\n')
        setExhibitionForm({ ...exhibitionForm, images: allImages })
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error uploading images:', error)
      }
      toast.error('Error uploading images')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleExhibitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!exhibitionForm.title || !exhibitionForm.startDate || !exhibitionForm.endDate || !exhibitionForm.location) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const images = exhibitionForm.images
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url)

      const response = await fetch('/api/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: exhibitionForm.title,
          description: exhibitionForm.description,
          startDate: exhibitionForm.startDate,
          endDate: exhibitionForm.endDate,
          location: exhibitionForm.location,
          images: images,
        }),
      })

      if (response.ok) {
        const newExhibition = await response.json()
        setExhibitionsList([newExhibition, ...exhibitionsList])
        toast.success('Exhibition created successfully!')
        setShowExhibitionForm(false)
        setExhibitionForm({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
          images: '',
          featured: false,
        })
        setUploadedImageUrls([])
      } else {
        toast.error('Failed to create exhibition')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating exhibition:', error)
      }
      toast.error('An error occurred')
    }
  }

  const handleDeleteExhibition = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exhibition?')) {
      return
    }

    try {
      const response = await fetch(`/api/exhibitions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setExhibitionsList(exhibitionsList.filter((ex) => ex.id !== id))
        toast.success('Exhibition deleted successfully!')
      } else {
        toast.error('Failed to delete exhibition')
      }
    } catch (error) {
      console.error('Error deleting exhibition:', error)
      toast.error('An error occurred')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first')
      return
    }

    setUploading(true)
    setMessage('Uploading and processing file...')

    try {
      // In a real implementation, you would:
      // 1. Parse the CSV/Excel file
      // 2. Validate the data
      // 3. Send to API endpoint for batch import
      // 4. Handle errors and conflicts

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage(
        '✅ File uploaded successfully! In production, this would parse and import products from the Excel/CSV file.'
      )
      setFile(null)
    } catch (error) {
      setMessage('❌ Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 mb-12 -mx-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg text-white/90">Manage orders, products, and exhibitions</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#000000] text-[#000000]'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Orders & Products
          </span>
        </button>
        <button
          onClick={() => setActiveTab('exhibitions')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'exhibitions'
              ? 'border-b-2 border-[#000000] text-[#000000]'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Exhibitions
          </span>
        </button>
      </div>

      {/* Orders & Products Tab */}
      {activeTab === 'orders' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#333333]/10 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-[#333333]" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-neutral-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#666666]/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[#666666]" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-neutral-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 font-medium">Pending Orders</p>
              <p className="text-3xl font-bold text-neutral-900">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Import */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
          <FileSpreadsheet className="w-7 h-7 text-[#333333]" />
          Import Products from Excel/CSV
        </h2>

        <div className="bg-gradient-to-r from-[#333333]/10 to-[#666666]/10 rounded-xl p-6 mb-6">
          <p className="text-sm text-neutral-700 mb-4">
            Upload an Excel (.xlsx) or CSV file to bulk import products. The file should contain
            the following columns:
          </p>
          <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
            <li>name, sku, description, shortDesc, price, image (URL), category, manufacturer, stockStatus, stockQuantity</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-[#333333] transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-700 font-medium mb-1">
                    {file ? file?.name : 'Choose a file or drag it here'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Supported formats: .xlsx, .csv (max 10 MB)
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-[#333333] text-white py-4 px-8 rounded-lg hover:bg-[#1a1a1a] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? 'Processing...' : 'Upload and Import'}
          </button>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message?.includes?.('✅')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : message?.includes?.('❌')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* All Orders */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">All Orders</h2>
          <button
            onClick={loadAllOrders}
            disabled={loadingOrders}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        {loadingOrders ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-600">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders?.map?.((order) => (
                    <tr key={order?.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4 font-mono text-sm">{order?.orderNumber}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-neutral-900">{order?.customerName}</div>
                        <div className="text-xs text-neutral-600">{order?.billingAddress?.split(',')[0] || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-600">
                        {order?.customerEmail}
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-600">
                        {new Date(order?.createdAt)?.toLocaleDateString?.('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-600">
                        {order?.items?.length || 0} items
                      </td>
                      <td className="py-4 px-4 font-semibold text-neutral-900">
                        €{Number(order?.total || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order?.status
                          )}`}
                        >
                          {getStatusIcon(order?.status)}
                          {order?.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order?.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingStatus === order.id}
                            className="text-xs px-2 py-1 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                            disabled={deletingOrder === order.id}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete order"
                          >
                            {deletingOrder === order.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {/* Exhibitions Tab */}
      {activeTab === 'exhibitions' && (
        <div>
          {/* Add Exhibition Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-900">Manage Exhibitions</h2>
            <button
              onClick={() => setShowExhibitionForm(!showExhibitionForm)}
              className="flex items-center gap-2 bg-[#000000] text-white px-6 py-3 rounded-lg hover:bg-[#156b5f] transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add New Exhibition
            </button>
          </div>

          {/* Exhibition Form */}
          {showExhibitionForm && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Create New Exhibition</h3>
              <form onSubmit={handleExhibitionSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={exhibitionForm.title}
                      onChange={(e) =>
                        setExhibitionForm({ ...exhibitionForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={exhibitionForm.startDate}
                      onChange={(e) =>
                        setExhibitionForm({ ...exhibitionForm, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={exhibitionForm.endDate}
                      onChange={(e) =>
                        setExhibitionForm({ ...exhibitionForm, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={exhibitionForm.location}
                    onChange={(e) =>
                      setExhibitionForm({ ...exhibitionForm, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    placeholder="e.g., Medica 2025, Düsseldorf, Germany"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={exhibitionForm.description}
                    onChange={(e) =>
                      setExhibitionForm({ ...exhibitionForm, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about this exhibition and your participation..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Images URLs (one per line)
                  </label>
                  <textarea
                    value={exhibitionForm.images}
                    onChange={(e) =>
                      setExhibitionForm({ ...exhibitionForm, images: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    rows={5}
                    placeholder="https://lh4.googleusercontent.com/w2oZgAWRit5XvJyXetISnm26XoXwG5BGuan6muWuMCaiTO_RNtqoAMvLXrT7j9Zf-QYEOyE9Oq0tbgzXDfno-3n7IC9amxL8-6FhEqBsUa5O3C8fJau_GQcWQa9fyIncH03ngV6363yd4D3OxtlStyQ"
                  />
                  <p className="mt-2 text-sm text-neutral-600">
                    Paste one image URL per line. You can use Unsplash or other image hosting services.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={exhibitionForm.featured}
                    onChange={(e) =>
                      setExhibitionForm({ ...exhibitionForm, featured: e.target.checked })
                    }
                    className="w-5 h-5 text-[#000000] border-neutral-300 rounded focus:ring-[#000000]"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-neutral-700">
                    Featured Exhibition
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-[#000000] text-white px-8 py-3 rounded-lg hover:bg-[#156b5f] transition-all font-semibold"
                  >
                    Create Exhibition
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExhibitionForm(false)}
                    className="bg-neutral-200 text-neutral-700 px-8 py-3 rounded-lg hover:bg-neutral-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Exhibitions List */}
          {exhibitionsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-neutral-200 text-center">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No Exhibitions Yet</h3>
              <p className="text-neutral-600 mb-6">Create your first exhibition to get started</p>
              <button
                onClick={() => setShowExhibitionForm(true)}
                className="inline-flex items-center gap-2 bg-[#000000] text-white px-6 py-3 rounded-lg hover:bg-[#156b5f] transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Exhibition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitionsList.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden group hover:shadow-xl transition-all"
                >
                  {/* Image Preview */}
                  {exhibition.images.length > 0 ? (
                    <div className="aspect-video bg-neutral-200 overflow-hidden relative">
                      <img
                        src={exhibition.images[0]}
                        alt={exhibition.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {exhibition.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                          <ImageIcon className="w-3 h-3 inline mr-1" />
                          {exhibition.images.length} photos
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-neutral-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-neutral-900 flex-1 line-clamp-2">
                        {exhibition.title}
                      </h3>
                      {exhibition.featured && (
                        <span className="ml-2 px-2 py-1 bg-[#000000]/10 text-[#000000] text-xs font-semibold rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 text-[#000000]" />
                        {new Date(exhibition.startDate || exhibition.endDate || exhibition.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 text-[#000000]" />
                        {exhibition.location}
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 line-clamp-3 mb-4">
                      {exhibition.description}
                    </p>

                    <button
                      onClick={() => handleDeleteExhibition(exhibition.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
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
