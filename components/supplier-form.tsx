'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, Send, CheckCircle, AlertCircle } from 'lucide-react'
import type { CompanyConfig } from '@/lib/company-types'

interface SupplierTranslations {
  title: string
  subtitle: string
  description: string
  fileFormat: string
  fileFormatDescription: string
  requiredFields: string
  fields: {
    manufacturer: string
    sku: string
    productName: string
    productDescription: string
    price: string
  }
  uploadFile: string
  selectFile: string
  fileName: string
  submit: string
  submitting: string
  success: string
  successMessage: string
  error: string
  errorMessage: string
  companyName: string
  companyNamePlaceholder: string
  contactName: string
  contactNamePlaceholder: string
  email: string
  emailPlaceholder: string
  phone: string
  phonePlaceholder: string
  notes: string
  notesPlaceholder: string
}

interface SupplierFormProps {
  company: CompanyConfig | null
  translations: SupplierTranslations
}

export function SupplierForm({ company, translations }: SupplierFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0]
    if (selectedFile) {
      // Check if file is Excel format
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
      
      if (!validExtensions.some(ext => fileExtension === ext)) {
        setError(translations.errorMessage)
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!file) {
      setError(translations.errorMessage)
      return
    }

    if (!companyName || !contactName || !email) {
      setError(translations.errorMessage)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('companyName', companyName)
      formData.append('contactName', contactName)
      formData.append('email', email)
      formData.append('phone', phone || '')
      formData.append('notes', notes || '')

      const response = await fetch('/api/supplier', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || translations.errorMessage)
      }

      setSuccess(true)
      setFile(null)
      setCompanyName('')
      setContactName('')
      setEmail('')
      setPhone('')
      setNotes('')
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err: any) {
      setError(err.message || translations.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {translations.title}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 mb-2">
            {translations.subtitle}
          </p>
          <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
            {translations.description}
          </p>
        </div>

        {/* File Format Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">{translations.fileFormat}</h3>
              <p className="text-sm text-blue-800 mb-3">{translations.fileFormatDescription}</p>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">{translations.requiredFields}:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{translations.fields.manufacturer}</li>
                  <li>{translations.fields.sku}</li>
                  <li>{translations.fields.productName}</li>
                  <li>{translations.fields.productDescription}</li>
                  <li>{translations.fields.price}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 sm:p-8 space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.companyName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]/10"
              placeholder={translations.companyNamePlaceholder}
            />
          </div>

          {/* Contact Name */}
          <div>
            <label htmlFor="contactName" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.contactName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]/10"
              placeholder={translations.contactNamePlaceholder}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]/10"
              placeholder={translations.emailPlaceholder}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.phone}
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]/10"
              placeholder={translations.phonePlaceholder}
            />
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file-input" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.uploadFile} <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-[#333333] transition-colors">
              <input
                type="file"
                id="file-input"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-700 mb-1">
                  {translations.selectFile}
                </p>
                {file && (
                  <p className="text-sm text-neutral-600 mt-2">
                    {translations.fileName}: <span className="font-semibold">{file.name}</span>
                  </p>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  .xlsx, .xls, .csv
                </p>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-neutral-700 mb-2">
              {translations.notes}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]/10"
              placeholder={translations.notesPlaceholder}
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">{translations.success}</p>
                <p className="text-sm text-green-800 mt-1">{translations.successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">{translations.error}</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#333333] text-white rounded-lg font-semibold text-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {translations.submitting}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {translations.submit}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

