'use client'

import { useState } from 'react'
import {
  Upload,
  FileSpreadsheet,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Wallet,
  Factory,
  ShieldCheck,
  Truck,
  Handshake,
  Building2,
  Network,
  Package,
  BadgeCheck,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
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
  // Marketing-rich hero & sales copy
  heroBadge?: string
  heroEyebrow?: string
  heroHeadline?: string
  heroHeadlineAccent?: string
  heroTagline?: string
  heroCtaPrimary?: string
  heroCtaSecondary?: string
  benefits?: {
    title: string
    subtitle: string
    items: Array<{ title: string; description: string; icon: string }>
  }
  whoTitle?: string
  whoSubtitle?: string
  whoItems?: Array<{ title: string; description: string }>
  processTitle?: string
  processSubtitle?: string
  processSteps?: Array<{ title: string; description: string }>
  statsTitle?: string
  statsItems?: Array<{ value: string; label: string }>
  formTitle?: string
  formSubtitle?: string
  faqTitle?: string
  faqItems?: Array<{ question: string; answer: string }>
}

const BENEFIT_ICONS: Record<string, any> = {
  trending: TrendingUp,
  wallet: Wallet,
  factory: Factory,
  shield: ShieldCheck,
  truck: Truck,
  handshake: Handshake,
}

const WHO_ICONS = [Factory, Network, Package, BadgeCheck]

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
    <div>
      {/* ═══ HERO ═══════════════════════════════════════════════════════════
          Dark marketing hero — reframes the page from "submit a form" to
          "we are actively recruiting suppliers with direct manufacturer
          pricing". This is the sales pitch, not the form. */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-[#0a0a0f] to-[#08080d] py-16 sm:py-24">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--accent-mint)' }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--accent-blue)' }}
        />

        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            {translations.heroBadge && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm">
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                  aria-hidden
                />
                {translations.heroBadge}
              </div>
            )}
            {translations.heroEyebrow && (
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                {translations.heroEyebrow}
              </div>
            )}
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              {translations.heroHeadline || translations.title}
              {translations.heroHeadlineAccent && (
                <>
                  <br />
                  <span
                    className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-cyan-200 bg-clip-text text-transparent"
                  >
                    {translations.heroHeadlineAccent}
                  </span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              {translations.heroTagline || translations.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#supplier-form"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-300 hover:shadow-emerald-500/40"
              >
                <Send className="h-4 w-4" />
                {translations.heroCtaPrimary || translations.submit}
              </a>
              {translations.heroCtaSecondary && (
                <a
                  href="#who-we-want"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
                >
                  {translations.heroCtaSecondary}
                  <ChevronDown className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Stats strip */}
          {translations.statsItems && translations.statsItems.length > 0 && (
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {translations.statsItems.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm"
                >
                  <div className="font-display bg-gradient-to-br from-white to-white/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ BENEFITS ═══════════════════════════════════════════════════════ */}
      {translations.benefits && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {translations.benefits.title}
              </h2>
              {translations.benefits.subtitle && (
                <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                  {translations.benefits.subtitle}
                </p>
              )}
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {translations.benefits.items.map((item) => {
                const Icon = BENEFIT_ICONS[item.icon] || ShieldCheck
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg"
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: 'var(--accent-mint-soft)', color: 'var(--accent-mint)' }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHO WE WANT ═════════════════════════════════════════════════════ */}
      {translations.whoItems && translations.whoItems.length > 0 && (
        <section
          id="who-we-want"
          className="border-y border-neutral-200 py-16 sm:py-20"
          style={{ backgroundColor: 'var(--company-secondary)' }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {translations.whoTitle || 'Who we are looking for'}
              </h2>
              {translations.whoSubtitle && (
                <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                  {translations.whoSubtitle}
                </p>
              )}
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
              {translations.whoItems.map((item, i) => {
                const Icon = WHO_ICONS[i % WHO_ICONS.length] || Building2
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
                  >
                    <span
                      className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                      style={{ background: 'var(--brand-1-soft)', color: 'var(--brand-1)' }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PROCESS ═════════════════════════════════════════════════════════ */}
      {translations.processSteps && translations.processSteps.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {translations.processTitle || 'How it works'}
              </h2>
              {translations.processSubtitle && (
                <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                  {translations.processSubtitle}
                </p>
              )}
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
              {translations.processSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <span
                    className="font-mono-brand absolute -top-3 left-6 inline-flex items-center rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-white"
                  >
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display mt-2 text-lg font-semibold tracking-tight text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                  {i < (translations.processSteps?.length ?? 0) - 1 && (
                    <ArrowRight
                      className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-neutral-300 md:block"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FORM ════════════════════════════════════════════════════════════ */}
      <div id="supplier-form" className="container mx-auto scroll-mt-20 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          {(translations.formTitle || translations.formSubtitle) && (
            <div className="mb-8 text-center">
              {translations.formTitle && (
                <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {translations.formTitle}
                </h2>
              )}
              {translations.formSubtitle && (
                <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                  {translations.formSubtitle}
                </p>
              )}
            </div>
          )}
          {/* File Format Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-8">
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
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': 'var(--company-accent)' } as React.CSSProperties}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--company-accent)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
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
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 transition-all"
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--company-accent)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
                placeholder={translations.contactNamePlaceholder}
              />
            </div>

            {/* Email & Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 transition-all"
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--company-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
                  placeholder={translations.emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                  {translations.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 transition-all"
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--company-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
                  placeholder={translations.phonePlaceholder}
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file-input" className="block text-sm font-semibold text-neutral-700 mb-2">
                {translations.uploadFile} <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-neutral-400 transition-colors">
                <input
                  type="file"
                  id="file-input"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
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
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 transition-all resize-none"
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--company-accent)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '' }}
                placeholder={translations.notesPlaceholder}
              />
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">{translations.success}</p>
                  <p className="text-sm text-green-800 mt-1">{translations.successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
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

      {/* ═══ FAQ ═════════════════════════════════════════════════════════════ */}
      {translations.faqItems && translations.faqItems.length > 0 && (
        <section
          className="border-t border-neutral-200 py-16 sm:py-20"
          style={{ backgroundColor: 'var(--company-secondary)' }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {translations.faqTitle || 'Frequently asked questions'}
              </h2>
            </div>
            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {translations.faqItems.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-neutral-200 bg-white p-5 transition-all open:shadow-md"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                    <span className="font-display text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-600 sm:text-sm">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
