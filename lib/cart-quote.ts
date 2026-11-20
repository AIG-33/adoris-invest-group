import type { CompanyConfig } from './company-types'

/** "Request a quote" from the cart exists only on this tenant; requests go to its sales inbox. */
export const CART_QUOTE_DOMAIN = 'shop.viena.by'
export const CART_QUOTE_RECIPIENT = 'med@viena.by'

export function hasCartQuote(company: Pick<CompanyConfig, 'domain'> | null | undefined): boolean {
  return company?.domain === CART_QUOTE_DOMAIN
}

export interface CartQuoteItem {
  sku: string
  name: string
  manufacturer: string
  quantity: number
  url?: string
}
