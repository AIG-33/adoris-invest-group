import type { CompanyConfig } from './company-types'

/** The Adoris Invest Group storefront (adorisgroup.com). */
export function isAdoris(company: Pick<CompanyConfig, 'domain' | 'slug'> | null | undefined): boolean {
  return company?.domain === 'adorisgroup.com' || company?.slug === 'adoris-invest-group'
}
