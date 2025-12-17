'use client'

import { useState, useEffect } from 'react'
import { Upload, Package, ShoppingBag, Clock, CheckCircle, FileSpreadsheet, XCircle, Truck, RefreshCw, Trash2, Plus, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminPanelProps {
  stats: {
    totalProducts: number
    totalOrders: number
    pendingOrders: number
  }
  recentOrders: any[]
}

export function AdminPanel({ stats, recentOrders }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [orders, setOrders] = useState<any[]>(recentOrders)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [liveErrors, setLiveErrors] = useState<string[]>([])
  const [fileColumns, setFileColumns] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [analyzingFile, setAnalyzingFile] = useState(false)
  const [showColumnMapping, setShowColumnMapping] = useState(false)
  const [importResults, setImportResults] = useState<{
    created: number
    updated: number
    errors: string[]
    products: Array<{
      action: 'created' | 'updated'
      product: any
      sku: string
      name: string
      price: number
      manufacturer: string
    }>
  } | null>(null)

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
      setLiveErrors([])
      setImportResults(null)
      setShowColumnMapping(false)
      setColumnMapping({})
      setFileColumns([])
    }
  }

  const handleAnalyzeFile = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
      toast.error('Column mapping is only available for Excel (.xlsx, .xls) and CSV (.csv) files')
      return
    }

    setAnalyzingFile(true)
    setMessage('')
    setLiveErrors([])
    setImportResults(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/products/import/analyze', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        setFileColumns(data.columns || [])
        
        // Auto-map columns based on common patterns
        const autoMapping: Record<string, string> = {}
        data.columns.forEach((col: string) => {
          const colLower = col.toLowerCase().trim()
          // SKU mapping
          if (colLower.includes('cat#') || colLower.includes('sku') || colLower.includes('catalog') || colLower.includes('code')) {
            if (!autoMapping.sku) autoMapping.sku = col
          }
          // Name mapping
          else if (colLower.includes('product') || colLower.includes('name') || colLower.includes('title')) {
            if (!autoMapping.name) autoMapping.name = col
          }
          // Manufacturer mapping
          else if (colLower.includes('mnf') || colLower.includes('manufacturer') || colLower.includes('brand') || colLower.includes('maker')) {
            if (!autoMapping.manufacturer) autoMapping.manufacturer = col
          }
          // Price mapping
          else if (colLower.includes('price') || colLower.includes('cost')) {
            if (!autoMapping.price) autoMapping.price = col
          }
          // Description mapping
          else if (colLower.includes('description') || colLower.includes('desc')) {
            if (!autoMapping.description) autoMapping.description = col
          }
          // Category mapping
          else if (colLower.includes('category') || colLower.includes('cat')) {
            if (!autoMapping.category) autoMapping.category = col
          }
          // Image mapping
          else if (colLower.includes('image') || colLower.includes('img') || colLower.includes('photo')) {
            if (!autoMapping.image) autoMapping.image = col
          }
        })
        
        setColumnMapping(autoMapping)
        setShowColumnMapping(true)
        toast.success(`Found ${data.columns.length} columns in file`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to analyze file')
      }
    } catch (error: any) {
      console.error('Error analyzing file:', error)
      toast.error('Failed to analyze file structure')
    } finally {
      setAnalyzingFile(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first')
      return
    }

    // Check if column mapping is complete for required fields (only for Excel/CSV)
    const fileName = file.name.toLowerCase()
    if ((fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) && 
        (!columnMapping.sku || !columnMapping.name || !columnMapping.manufacturer)) {
      toast.error('Please map all required columns: SKU, Name, and Manufacturer')
      return
    }

    setUploading(true)
    setMessage('')
    setProcessingStatus('Uploading file...')
    setImportResults(null)
    setLiveErrors([])
    setProgress({ current: 0, total: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (Object.keys(columnMapping).length > 0) {
        formData.append('columnMapping', JSON.stringify(columnMapping))
      }

      setProcessingStatus('Processing file...')

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      let data: any

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // If not JSON, read as text and try to parse
        const text = await response.text()
        try {
          data = JSON.parse(text)
        } catch (e) {
          throw new Error(`Server error: ${text.substring(0, 200)}`)
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to import products')
      }

      setProcessingStatus('Processing complete!')

      if (data.results) {
        const { created, updated, errors, products, total } = data.results
        
        // Update progress to 100%
        if (total) {
          setProgress({ current: total, total })
        }
        
        // Show all errors
        if (errors && errors.length > 0) {
          setLiveErrors(errors)
        }
        
        setImportResults({
          created,
          updated,
          errors,
          products: products || [],
        })
        let message = `✅ Successfully processed: ${created} created, ${updated} updated`
        if (errors.length > 0) {
          message += `\n⚠️ Errors: ${errors.length}`
          if (process.env.NODE_ENV === 'development') {
            console.error('Import errors:', errors)
          }
        }
        setMessage(message)
        toast.success(`Products imported: ${created} created, ${updated} updated`)
      } else {
        setMessage('✅ ' + (data.message || 'File processed successfully'))
        toast.success('Products imported successfully')
        setImportResults(null)
      }
      
      setFile(null)
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
      
      // Clear processing status after a delay, but keep errors visible
      setTimeout(() => {
        setProcessingStatus('')
        // Don't clear liveErrors - they should remain visible
      }, 2000)
    } catch (error: any) {
      const errorMessage = error?.message || 'Upload failed. Please try again.'
      setMessage('❌ ' + errorMessage)
      setProcessingStatus('Error occurred')
      toast.error(errorMessage)
      
      // Clear processing status after a delay, but keep errors visible
      setTimeout(() => {
        setProcessingStatus('')
        // Don't clear liveErrors - they should remain visible
      }, 3000)
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
          <p className="text-lg text-white/90">Manage orders and products</p>
        </div>
      </section>


      {/* Orders & Products */}
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
            Upload a file (Excel, CSV, JSON, TXT, PDF, or image) and AI will automatically extract product information:
          </p>
          <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside mb-4">
            <li><strong>Catalog Number/SKU</strong> - automatically detected</li>
            <li><strong>Product Name</strong> - extracted from document</li>
            <li><strong>Price</strong> - found and converted to EUR</li>
            <li><strong>Description</strong> - extracted from document</li>
            <li><strong>Manufacturer</strong> - identified and matched to database</li>
            <li><strong>Category</strong> - automatically categorized (if found)</li>
          </ul>
          <p className="text-xs text-neutral-500 mt-4">
            💡 If a product with the same catalog number already exists, it will be updated with new information.
          </p>
          <p className="text-xs text-orange-600 mt-2 font-semibold">
            ⚠️ Large files: Maximum 100 products per file. For larger files, please split them into smaller parts.
          </p>
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
                    Supported formats: Excel (.xlsx, .xls), CSV (.csv), JSON (.json), TXT (.txt), PDF, Images (PNG, JPG, etc.) (max 20 MB)
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.doc,.docx,.xlsx,.xls,.csv,.json"
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

          {/* Processing Status with Progress */}
          {processingStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                {uploading ? (
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">{processingStatus}</p>
                  {uploading && progress.total > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
                        <span>Processing products...</span>
                        <span>{progress.current} / {progress.total}</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((progress.current / progress.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {uploading && progress.total === 0 && (
                    <p className="text-sm text-blue-700 mt-1">
                      This may take a few moments depending on file size...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Errors Display - Always visible if there are errors */}
          {liveErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">
                    Errors ({liveErrors.length})
                  </span>
                </div>
                <button
                  onClick={() => setLiveErrors([])}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto bg-white rounded border border-red-200 p-3">
                <ul className="space-y-1.5 text-sm text-red-700">
                  {liveErrors.map((error, index) => (
                    <li key={index} className="list-disc list-inside break-words">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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

          {/* Import Results */}
          {importResults && importResults.products.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Import Results
              </h3>
              
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                {importResults.created > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">New Products</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{importResults.created}</p>
                  </div>
                )}
                {importResults.updated > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Updated Products</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{importResults.updated}</p>
                  </div>
                )}
              </div>

              {/* Products List */}
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 sticky top-0">
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">SKU</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Manufacturer</th>
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.products.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-b border-neutral-100 hover:bg-neutral-50 ${
                            item.action === 'created' ? 'bg-green-50/30' : 'bg-blue-50/30'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                item.action === 'created'
                                  ? 'bg-green-100 text-green-700 border border-green-200'
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {item.action === 'created' ? (
                                <>
                                  <Plus className="w-3 h-3" />
                                  New
                                </>
                              ) : (
                                <>
                                  <Edit className="w-3 h-3" />
                                  Updated
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm text-neutral-900">
                            {item.sku}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-900 font-medium">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-600">
                            {item.manufacturer}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-neutral-900">
                            €{Number(item.price || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Errors */}
              {importResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Errors ({importResults.errors.length})
                  </h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {importResults.errors.slice(0, 10).map((error, index) => (
                      <li key={index} className="list-disc list-inside">
                        {error}
                      </li>
                    ))}
                    {importResults.errors.length > 10 && (
                      <li className="text-red-600 italic">
                        ... and {importResults.errors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Clear Results Button */}
              <button
                onClick={() => setImportResults(null)}
                className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-sm font-medium text-neutral-700"
              >
                Clear Results
              </button>
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
    </div>
  )
}
