import { headers } from 'next/headers'
import { getCurrentCompany, CompanyConfig } from './company'

/**
 * Get current company in server components
 */
export async function getServerCompany(): Promise<CompanyConfig | null> {
  const headersList = await headers()
  return getCurrentCompany(headersList)
}

