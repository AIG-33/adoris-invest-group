import { headers } from 'next/headers'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { CompanyConfig } from './company-types'
import { prisma } from './db'
import { getDomainFromRequest } from './company'
import { retryPrismaQuery } from './retry-prisma'

const COMPANY_SELECT = {
  id: true,
  name: true,
  slug: true,
  domain: true,
  logo: true,
  language: true,
  priceType: true,
  email: true,
  phone: true,
  address: true,
  primaryColor: true,
  secondaryColor: true,
  accentColor: true,
  showPrices: true,
  googleAnalyticsId: true,
  yandexMetrikaId: true,
} as const

/**
 * Cached domain → CompanyConfig lookup.
 * Cached for 1 hour at the data layer (Next.js Data Cache, not per-request).
 * Invalidated explicitly via `revalidateTag('company')` from admin/companies API
 * whenever a tenant is created/updated/deleted.
 */
const fetchCompanyByDomain = unstable_cache(
  async (domain: string): Promise<CompanyConfig | null> => {
    let company = await retryPrismaQuery(() =>
      prisma.company.findUnique({
        where: { domain },
        select: COMPANY_SELECT,
      })
    )

    if (!company && domain.includes('.')) {
      const parts = domain.split('.')
      if (parts.length > 2) {
        const baseDomain = parts.slice(1).join('.')
        company = await retryPrismaQuery(() =>
          prisma.company.findUnique({
            where: { domain: baseDomain },
            select: COMPANY_SELECT,
          })
        )
      }
    }

    if (!company) return null

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      domain: company.domain,
      logo: company.logo,
      language: company.language as 'en' | 'ru',
      priceType: company.priceType as 'EU' | 'RU',
      email: company.email,
      phone: company.phone,
      address: company.address,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      accentColor: company.accentColor,
      showPrices: company.showPrices !== undefined ? company.showPrices : true,
      googleAnalyticsId: company.googleAnalyticsId,
      yandexMetrikaId: company.yandexMetrikaId,
    }
  },
  ['company-by-domain'],
  { revalidate: 3600, tags: ['company'] }
)

/**
 * Get current company in server components with full details including colors.
 * - React.cache deduplicates within a single render pass (per-request).
 * - unstable_cache underneath persists across requests for 1 hour.
 */
export const getServerCompany = cache(async (): Promise<CompanyConfig | null> => {
  try {
    const headersList = await headers()
    const domain = getDomainFromRequest(headersList)
    return await fetchCompanyByDomain(domain)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching company:', error)
    }
    return null
  }
})

/**
 * Alias for getServerCompany for consistency
 */
export const getCompany = getServerCompany
