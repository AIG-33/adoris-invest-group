import { headers } from 'next/headers'
import { getCurrentCompany } from './company'
import type { CompanyConfig } from './company-types'
import { prisma } from './db'

/**
 * Get current company in server components with full details including colors
 */
export async function getServerCompany(): Promise<CompanyConfig | null> {
  const headersList = await headers()
  const company = await getCurrentCompany(headersList)
  
  // If company found via headers, fetch full details including colors
  if (company) {
    const fullCompany = await prisma.company.findUnique({
      where: { id: company.id },
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
      },
    })
    
    if (fullCompany) {
      return {
        id: fullCompany.id,
        name: fullCompany.name,
        slug: fullCompany.slug,
        domain: fullCompany.domain,
        logo: fullCompany.logo,
        language: fullCompany.language as 'en' | 'ru',
        priceType: fullCompany.priceType as 'EU' | 'RU',
        email: fullCompany.email,
        phone: fullCompany.phone,
        address: fullCompany.address,
        primaryColor: fullCompany.primaryColor,
        secondaryColor: fullCompany.secondaryColor,
        accentColor: fullCompany.accentColor,
      }
    }
  }
  
  return company
}

/**
 * Alias for getServerCompany for consistency
 */
export const getCompany = getServerCompany

