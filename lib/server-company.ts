import { headers } from 'next/headers'
import { getCurrentCompany, CompanyConfig } from './company'
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
    })
    
    if (fullCompany) {
      return {
        ...company,
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

