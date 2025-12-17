import { prisma } from './db'
import type { CompanyConfig } from './company-types'

export type { CompanyConfig }

/**
 * Get company by domain
 */
export async function getCompanyByDomain(domain: string): Promise<CompanyConfig | null> {
  try {
    const company = await prisma.company.findUnique({
      where: { domain },
    })

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
    }
  } catch (error) {
    console.error('Error fetching company by domain:', error)
    return null
  }
}

/**
 * Get company from request headers (host)
 */
export function getDomainFromRequest(headers: Headers): string {
  const host = headers.get('host') || headers.get('x-forwarded-host') || ''
  // Remove port if present
  return host.split(':')[0].toLowerCase()
}

/**
 * Get current company from request
 */
export async function getCurrentCompany(headers: Headers): Promise<CompanyConfig | null> {
  const domain = getDomainFromRequest(headers)
  return getCompanyByDomain(domain)
}

