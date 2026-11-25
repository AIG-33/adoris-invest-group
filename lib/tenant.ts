import type { CompanyConfig } from './company-types'

/** The Adoris Invest Group storefront (adorisgroup.com). */
export function isAdoris(company: Pick<CompanyConfig, 'domain' | 'slug'> | null | undefined): boolean {
  return company?.domain === 'adorisgroup.com' || company?.slug === 'adoris-invest-group'
}

/**
 * shop.viena.by — owned by a Belarusian legal entity: personal-data consent on every form,
 * privacy/cookie policies, analytics only after cookie consent, no online checkout (quotes only).
 */
export function isVienaShop(company: Pick<CompanyConfig, 'domain'> | null | undefined): boolean {
  return company?.domain === 'shop.viena.by'
}
