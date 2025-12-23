import { prisma } from './db'
import type { CompanyConfig } from './company-types'

export type { CompanyConfig }

/**
 * Get company by domain (supports subdomains)
 * Tries exact match first, then tries to match base domain
 */
export async function getCompanyByDomain(domain: string): Promise<CompanyConfig | null> {
  try {
    // Try exact match first
    let company = await prisma.company.findUnique({
      where: { domain },
    })

    // If not found and domain has subdomain (e.g., shop.ivdgroup.eu), try base domain
    if (!company && domain.includes('.')) {
      const parts = domain.split('.')
      if (parts.length > 2) {
        // Remove first subdomain (e.g., shop.ivdgroup.eu -> ivdgroup.eu)
        const baseDomain = parts.slice(1).join('.')
        company = await prisma.company.findUnique({
          where: { domain: baseDomain },
        })
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
  let domain = host.split(':')[0].toLowerCase()
  
  // Remove 'www.' prefix if present
  if (domain.startsWith('www.')) {
    domain = domain.substring(4)
  }
  
  return domain
}

/**
 * Get current company from request
 */
export async function getCurrentCompany(headers: Headers): Promise<CompanyConfig | null> {
  const domain = getDomainFromRequest(headers)
  return getCompanyByDomain(domain)
}

