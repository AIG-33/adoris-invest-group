import { Decimal } from '@prisma/client/runtime/library'

export type PriceType = 'EU' | 'RU'

/**
 * Get product price based on company price type
 * For RU price type: priceEU * 1.1 * 1.05 = priceEU * 1.155
 */
export function getProductPrice(
  priceEU: number | Decimal,
  priceRU: number | Decimal | null | undefined,
  priceType: PriceType
): number {
  const euPrice = typeof priceEU === 'object' ? Number(priceEU) : priceEU
  
  if (priceType === 'RU') {
    // Calculate RU price as EU * 1.1 * 1.05 = EU * 1.155
    return euPrice * 1.155
  }
  
  return euPrice
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = '€'): string {
  return `${currency}${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

