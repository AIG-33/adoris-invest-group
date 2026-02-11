'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { CompanyConfig } from '@/lib/company-types'

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

interface NavTranslations {
  home: string
  products: string
  catalog: string
  company: string
  about: string
  team: string
  exhibitions: string
  terms: string
  account: string
  cart: string
  checkout: string
  login: string
  logout: string
  admin: string
  bulkOrder: string
  search: string
}

interface FooterTranslations {
  description: string
  quickLinks: string
  contactUs: string
  companyInfo: string
  website: string
  email: string
  phone: string
  allRightsReserved: string
}

interface FooterClientProps {
  company: CompanyConfig | null
  navTranslations: NavTranslations
  footerTranslations: FooterTranslations
}

export function FooterClient({ company, navTranslations, footerTranslations }: FooterClientProps) {
  // Get company data with defaults (neutral when no company matched for this domain)
  const companyName = company?.name || 'Shop'
  const companyEmail = company?.email || ''
  const companyPhone = company?.phone || ''
  const companyAddress = company?.address || ''
  const companyLogo = normalizeLogoUrl(company?.logo)
  
  // Extract address parts (no Adoris fallback when company not matched)
  const addressParts = companyAddress.split(',').map(s => s.trim()).filter(Boolean)
  const streetAddress = addressParts[0] || ''
  const cityAddress = addressParts.slice(1).join(', ').trim() || ''

  return (
    <footer 
      className="text-white mt-12 sm:mt-20"
      style={{ backgroundColor: 'var(--company-primary)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div>
            <div className="relative w-28 h-9 sm:w-36 sm:h-10 mb-4">
              <Image
                src={companyLogo}
                alt={companyName}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {footerTranslations.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 text-white/90">{footerTranslations.quickLinks}</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/products" className="footer-link text-xs sm:text-sm inline-block">
                  {navTranslations.products}
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="footer-link text-xs sm:text-sm inline-block">
                  {navTranslations.bulkOrder}
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="footer-link text-xs sm:text-sm inline-block">
                  {navTranslations.exhibitions}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link text-xs sm:text-sm inline-block">
                  {navTranslations.terms}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="footer-link text-xs sm:text-sm inline-block">
                  {navTranslations.cart}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 text-white/90">{footerTranslations.contactUs}</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
              <li className="text-white/60">
                <span className="font-semibold text-white/75">{footerTranslations.email}:</span> {companyEmail}
              </li>
              <li className="text-white/60">
                <span className="font-semibold text-white/75">{footerTranslations.phone}:</span> {companyPhone}
              </li>
              {company?.domain && (
                <li className="text-white/60 hidden sm:block">
                  <span className="font-semibold text-white/75">{footerTranslations.website}:</span> www.{company.domain}
                </li>
              )}
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 text-white/90">{footerTranslations.companyInfo}</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-white/60">
              <li className="font-medium text-white/75">{companyName}</li>
              <li>{streetAddress}</li>
              <li>{cityAddress}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-white/40">
          <p>
            &copy; {new Date()?.getFullYear() || 2025} {companyName}. {footerTranslations.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  )
}
