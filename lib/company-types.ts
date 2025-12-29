/**
 * Company configuration types
 * This file contains only types/interfaces and can be safely imported in client components
 */

export interface CompanyConfig {
  id: string
  name: string
  slug: string
  domain: string
  logo: string | null
  language: 'en' | 'ru'
  priceType: 'EU' | 'RU'
  email: string | null
  phone: string | null
  address: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  showPrices: boolean
  googleAnalyticsId: string | null
  yandexMetrikaId: string | null
}

