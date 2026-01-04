'use client'

import { useState, useEffect } from 'react'
import { Building2, Edit, Trash2, Plus, Save, X, Upload, Globe, Mail, Phone, MapPin, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

// Normalize logo URL to ensure it starts with a slash
function normalizeLogoUrl(logo: string | null | undefined): string {
  if (!logo) {
    return '/logo.png'
  }
  
  // If logo is already a full URL, return as is
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }
  
  // Ensure logo starts with a slash
  return logo.startsWith('/') ? logo : `/${logo}`
}

interface Company {
  id: string
  name: string
  slug: string
  domain: string
  logo: string | null
  language: 'en' | 'ru'
  priceType: 'EU' | 'RU'
  email: string | null
  phone: string | null
  address: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  showPrices: boolean
  googleAnalyticsId: string | null
  yandexMetrikaId: string | null
  createdAt: string
  updatedAt: string
}

export function CompaniesAdmin() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    slug: '',
    domain: '',
    logo: null,
    language: 'en',
    priceType: 'EU',
    email: '',
    phone: '',
    address: '',
    primaryColor: '#333333',
    secondaryColor: '#666666',
    accentColor: '#000000',
    showPrices: true,
    googleAnalyticsId: '',
    yandexMetrikaId: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
      } else {
        toast.error('Failed to load companies')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading companies:', error)
      }
      toast.error('Error loading companies')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (company: Company) => {
    setEditingId(company.id)
    setFormData({
      name: company.name,
      slug: company.slug,
      domain: company.domain,
      logo: company.logo,
      language: company.language,
      priceType: company.priceType,
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      primaryColor: company.primaryColor || '#333333',
      secondaryColor: company.secondaryColor || '#666666',
      accentColor: company.accentColor || '#000000',
      showPrices: company.showPrices !== undefined ? company.showPrices : true,
      googleAnalyticsId: company.googleAnalyticsId || '',
      yandexMetrikaId: company.yandexMetrikaId || '',
    })
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({
      name: '',
      slug: '',
      domain: '',
      logo: null,
      language: 'en',
      priceType: 'EU',
      email: '',
      phone: '',
      address: '',
      primaryColor: '#333333',
      secondaryColor: '#666666',
      accentColor: '#000000',
      googleAnalyticsId: '',
      yandexMetrikaId: '',
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.domain) {
      toast.error('Please fill in all required fields (name, slug, domain)')
      return
    }

    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/companies/${editingId}`
        : '/api/admin/companies'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(editingId ? 'Company updated successfully' : 'Company created successfully')
        await loadCompanies()
        handleCancel()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save company')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving company:', error)
      }
      toast.error('Error saving company')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Company deleted successfully')
        await loadCompanies()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete company')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting company:', error)
      }
      toast.error('Error deleting company')
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For now, we'll just store the file name or URL
      // In production, you'd upload to S3 or similar
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#333333]"></div>
        <p className="mt-4 text-neutral-600">Loading companies...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            Companies Management
          </h2>
          <p className="text-neutral-600 mt-1">Manage company settings, domains, and branding</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({
              name: '',
              slug: '',
              domain: '',
              logo: null,
              language: 'en',
              priceType: 'EU',
              email: '',
              phone: '',
              address: '',
              primaryColor: '#333333',
              secondaryColor: '#666666',
              accentColor: '#000000',
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-neutral-900">
              {editingId ? 'Edit Company' : 'Add New Company'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-neutral-700 border-b pb-2">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="Adoris Invest Group OU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="adoris-invest-group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Domain *
                </label>
                <input
                  type="text"
                  value={formData.domain || ''}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="adorisgroup.com"
                />
                <p className="text-xs text-neutral-500 mt-1">Domain where this company site will run</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo && (
                  <div className="mt-2 relative w-32 h-32 border border-neutral-200 rounded-lg overflow-hidden">
                    <Image
                      src={formData.logo}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Settings & Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-neutral-700 border-b pb-2">Settings & Contact</h4>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Language
                </label>
                <select
                  value={formData.language || 'en'}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'ru' })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                >
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.priceType || 'EU'}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value as 'EU' | 'RU' })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                >
                  <option value="EU">EU Prices</option>
                  <option value="RU">RU Prices</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showPrices !== undefined ? formData.showPrices : true}
                    onChange={(e) => setFormData({ ...formData, showPrices: e.target.checked })}
                    className="w-5 h-5 text-[#333333] border-neutral-300 rounded focus:ring-[#333333]"
                  />
                  <div>
                    <span className="block text-sm font-medium text-neutral-700">Show Prices</span>
                    <span className="text-xs text-neutral-500">If disabled, all products will show "Price on Request"</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="info@adorisgroup.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  placeholder="+48793081310"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                  rows={3}
                  placeholder="Narva mnt 5, Tallinn, Estonia"
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-semibold text-neutral-700 border-b pb-2">Analytics</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId || ''}
                    onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Яндекс.Метрика ID
                  </label>
                  <input
                    type="text"
                    value={formData.yandexMetrikaId || ''}
                    onChange={(e) => setFormData({ ...formData, yandexMetrikaId: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                    placeholder="12345678"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Яндекс.Метрика counter ID (число)</p>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-semibold text-neutral-700 border-b pb-2 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Colors
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#333333'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-10 border border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#333333'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                      placeholder="#333333"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor || '#666666'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-16 h-10 border border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#666666'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                      placeholder="#666666"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#000000'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-16 h-10 border border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#000000'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333]/20 focus:border-[#333333]"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Company
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Company</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Domain</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Language</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Price Type</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-600">
                    No companies found. Click "Add Company" to create one.
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {company.logo && (
                          <div className="relative w-10 h-10 border border-neutral-200 rounded overflow-hidden">
                            <Image
                              src={normalizeLogoUrl(company.logo)}
                              alt={company.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-neutral-900">{company.name}</div>
                          <div className="text-sm text-neutral-600">{company.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-neutral-400" />
                        <span className="font-mono">{company.domain}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {company.language.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        {company.priceType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-neutral-600">
                        {company.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {company.email}
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {company.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(company)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Edit company"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id, company.name)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete company"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

