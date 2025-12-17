'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  sku: string
  slug: string
  description: string | null
  price: number
  image: string | null
  category: { id: string; name: string }
  manufacturer: { id: string; name: string }
}

interface EditProductFormProps {
  product: Product
  categories: { id: string; name: string }[]
  manufacturers: { id: string; name: string }[]
}

export function EditProductForm({ product, categories, manufacturers }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name || '',
    sku: product.sku || '',
    slug: product.slug || '',
    description: product.description || '',
    priceEU: (product as any).priceEU || product.price || 0,
    priceRU: (product as any).priceRU || null,
    image: product.image || '',
    categoryId: product.category.id || '',
    manufacturerId: product.manufacturer.id || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to update product'
        let errorDetails = ''
        
        if (data.details) {
          errorDetails = ` Details: ${JSON.stringify(data.details)}`
        }
        if (data.message) {
          errorDetails += ` Message: ${data.message}`
        }
        if (data.code) {
          errorDetails += ` Code: ${data.code}`
        }
        
        console.error('API Error Response:', {
          status: response.status,
          error: data.error,
          message: data.message,
          code: data.code,
          details: data.details,
          fullResponse: data
        })
        
        throw new Error(errorMessage + errorDetails)
      }

      toast.success('Product updated successfully!')
      router.push(`/product/${formData.slug}`)
    } catch (error) {
      console.error('Update error:', error)
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update product')
      } else {
        toast.error('Failed to update product. Please check the console for details.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }))
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#333333] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900">Edit Product</h1>
          <p className="text-neutral-600 mt-2">Update product information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  />
                  <p className="text-xs text-neutral-500 mt-1">URL-friendly identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Manufacturer *
                  </label>
                  <select
                    name="manufacturerId"
                    value={formData.manufacturerId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  >
                    <option value="">Select manufacturer</option>
                    {manufacturers.map(man => (
                      <option key={man.id} value={man.id}>
                        {man.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Product Image</h2>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Image URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  />
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-neutral-700 mb-2">Preview:</p>
                    <div className="relative w-full max-w-md aspect-square bg-neutral-50 rounded-lg border-2 border-neutral-200 overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Description</h2>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10"
                  placeholder="Enter product description..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-neutral-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#333333] to-[#666666] text-white py-4 px-8 rounded-lg hover:from-[#000000] hover:to-[#333333] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="px-8 py-4 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-all font-semibold"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

