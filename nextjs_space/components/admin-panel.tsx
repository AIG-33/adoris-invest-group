'use client'

import { useState } from 'react'
import { Upload, Package, ShoppingBag, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react'

interface AdminPanelProps {
  stats: {
    totalProducts: number
    totalOrders: number
    pendingOrders: number
  }
  recentOrders: any[]
}

export function AdminPanel({ stats, recentOrders }: AdminPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage('')
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
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#20a895]/10 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-[#20a895]" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-neutral-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2ec4b6]/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[#2ec4b6]" />
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
          <FileSpreadsheet className="w-7 h-7 text-[#20a895]" />
          Import Products from Excel/CSV
        </h2>

        <div className="bg-gradient-to-r from-[#20a895]/10 to-[#2ec4b6]/10 rounded-xl p-6 mb-6">
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
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-[#20a895] transition-colors">
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
            className="bg-[#20a895] text-white py-4 px-8 rounded-lg hover:bg-[#0891B2] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Order #</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Items</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map?.((order) => (
                <tr key={order?.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-4 px-4 font-mono text-sm">{order?.orderNumber}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-neutral-900">{order?.customerName}</div>
                    <div className="text-xs text-neutral-600">{order?.company}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-600">
                    {new Date(order?.createdAt)?.toLocaleDateString?.()}
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-600">
                    {order?.items?.length || 0} items
                  </td>
                  <td className="py-4 px-4 font-semibold text-neutral-900">
                    €{order?.total?.toFixed?.(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        order?.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order?.status === 'pending' ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {order?.status}
                    </span>
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
