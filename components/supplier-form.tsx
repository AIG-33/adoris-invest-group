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
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {translations.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-2">
            {translations.subtitle}
          </p>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            {translations.description}
          </p>
        </div>

        {/* File Format Info */}
        <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 sm:p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">{translations.fileFormat}</h3>
              <p className="text-sm text-blue-200/70 mb-3">{translations.fileFormatDescription}</p>
              <div className="text-sm text-blue-200/60">
                <p className="font-medium mb-2 text-blue-200/80">{translations.requiredFields}:</p>
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
        <form onSubmit={handleSubmit} className="bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.10] p-6 sm:p-8 space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-semibold text-white/80 mb-2">
              {translations.companyName} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              placeholder={translations.companyNamePlaceholder}
            />
          </div>

          {/* Contact Name */}
          <div>
            <label htmlFor="contactName" className="block text-sm font-semibold text-white/80 mb-2">
              {translations.contactName} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              placeholder={translations.contactNamePlaceholder}
            />
          </div>

          {/* Email & Phone row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                {translations.email} <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                placeholder={translations.emailPlaceholder}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white/80 mb-2">
                {translations.phone}
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                placeholder={translations.phonePlaceholder}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file-input" className="block text-sm font-semibold text-white/80 mb-2">
              {translations.uploadFile} <span className="text-red-400">*</span>
            </label>
            <div className="border-2 border-dashed border-white/[0.12] rounded-xl p-6 text-center hover:border-white/[0.25] transition-colors bg-white/[0.03]">
              <input
                type="file"
                id="file-input"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-10 h-10 text-white/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-white/70 mb-1">
                  {translations.selectFile}
                </p>
                {file && (
                  <p className="text-sm text-white/60 mt-2">
                    {translations.fileName}: <span className="font-semibold text-white/80">{file.name}</span>
                  </p>
                )}
                <p className="text-xs text-white/40 mt-2">
                  .xlsx, .xls, .csv
                </p>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-white/80 mb-2">
              {translations.notes}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none"
              placeholder={translations.notesPlaceholder}
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">{translations.success}</p>
                <p className="text-sm text-emerald-200/70 mt-1">{translations.successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">{translations.error}</p>
                <p className="text-sm text-red-200/70 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] hover:brightness-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ backgroundColor: 'var(--company-accent)' }}
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
