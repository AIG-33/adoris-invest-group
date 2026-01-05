import { headers } from 'next/headers'
import { cache } from 'react'
import type { CompanyConfig } from './company-types'
import { prisma } from './db'
import { getDomainFromRequest } from './company'
import { retryPrismaQuery } from './retry-prisma'

/**
 * Get current company in server components with full details including colors
 * Uses React.cache to deduplicate requests within the same render
 * OPTIMIZED: Single database query instead of two separate queries
 */
export const getServerCompany = cache(async (): Promise<CompanyConfig | null> => {
  try {
    const headersList = await headers()
    const domain = getDomainFromRequest(headersList)
    
    // Single optimized query - get company by domain with all needed fields
    // Try exact match first - with retry logic
    let company = await retryPrismaQuery(() => prisma.company.findUnique({
      where: { domain },
      select: {
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
      },
    }))
    
    // If not found and domain has subdomain (e.g., shop.ivdgroup.eu), try base domain - with retry logic
    if (!company && domain.includes('.')) {
      const parts = domain.split('.')
      if (parts.length > 2) {
        // Remove first subdomain (e.g., shop.ivdgroup.eu -> ivdgroup.eu)
        const baseDomain = parts.slice(1).join('.')
        company = await retryPrismaQuery(() => prisma.company.findUnique({
          where: { domain: baseDomain },
          select: {
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
          },
        }))
      }
    }
    
    if (!company) {
      return null
    }
    
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
  } catch (error) {
    // Log error but don't throw - return null to allow app to continue
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

