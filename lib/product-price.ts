import { Decimal } from '@prisma/client/runtime/library'

export type PriceType = 'EU' | 'RU'

/**
 * Get product price based on company price type
 */
export function getProductPrice(
  priceEU: number | Decimal,
  priceRU: number | Decimal | null | undefined,
  priceType: PriceType
): number {
  const euPrice = typeof priceEU === 'object' ? Number(priceEU) : priceEU
  
  if (priceType === 'RU') {
    const ruPrice = priceRU 
      ? (typeof priceRU === 'object' ? Number(priceRU) : priceRU)
      : null
    
    // If RU price is not set, fallback to EU price
    return ruPrice ?? euPrice
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

