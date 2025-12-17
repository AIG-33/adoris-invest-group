'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { CompanyConfig } from '@/lib/company-types'

interface FooterClientProps {
  company: CompanyConfig | null
}

export function FooterClient({ company }: FooterClientProps) {
  // Get company data with defaults
  const companyName = company?.name || 'ADORIS INVEST GROUP OÜ'
  const companyEmail = company?.email || 'ceo@adorisgroup.com'
  const companyPhone = company?.phone || '+48793081310'
  const companyAddress = company?.address || 'Ruunaoja tn 3-36, 11415 Tallinn, Estonia'
  const companyLogo = company?.logo || '/logo.png'
  
  // Extract address parts
  const addressParts = companyAddress.split(',').map(s => s.trim())
  const streetAddress = addressParts[0] || 'Ruunaoja tn 3-36'
  const cityAddress = addressParts.slice(1).join(', ') || '11415 Tallinn, Estonia'

  return (
    <footer 
      className="text-white mt-12 sm:mt-20"
      style={{ backgroundColor: 'var(--company-primary, #333333)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <div className="relative w-28 h-9 sm:w-32 sm:h-10 mb-3 sm:mb-4">
              <Image
                src={companyLogo}
                alt={companyName}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-neutral-300 text-xs sm:text-sm">
              Professional B2B medical laboratory equipment and supplies from
              leading manufacturers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-order"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Bulk Order
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li className="text-neutral-300">
                <span className="font-semibold">Email:</span> {companyEmail}
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Phone:</span> {companyPhone}
              </li>
              {company?.domain && (
                <li className="text-neutral-300 hidden sm:block">
                  <span className="font-semibold">Website:</span> www.{company.domain}
                </li>
              )}
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Company Info</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-300">
              <li>{companyName}</li>
              <li>{streetAddress}</li>
              <li>{cityAddress}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-neutral-400">
          <p>
            © {new Date()?.getFullYear() || 2025} {companyName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

