import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SupplierForm } from '@/components/supplier-form'
import { StructuredData } from '@/components/structured-data'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import { getBaseUrl } from '@/lib/get-base-url'
import { generateFAQSchema } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const companyName = company?.name || 'Adoris Invest Group'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const baseUrl = await getBaseUrl()

  const title = language === 'ru'
    ? `Стать поставщиком — прямые цены от производителя | ${companyName}`
    : `Become a Supplier — Direct Manufacturer Pricing | ${companyName}`
  const description = language === 'ru'
    ? `${companyName} активно ищет новых поставщиков с прямыми ценами от производителя. Долгосрочные контракты, быстрые платежи SWIFT/SEPA, регулярный объём закупок €20M+ в год.`
    : `${companyName} is actively recruiting new suppliers with direct manufacturer pricing. Long-term contracts, fast SWIFT/SEPA payments, €20M+ annual procurement volume.`

  return {
    title,
    description,
    keywords: language === 'ru'
      ? 'стать поставщиком, прямые цены производителя, поставщик медицинского оборудования, поставщик реагентов, дистрибьюция, B2B закупки'
      : 'become a supplier, direct manufacturer prices, medical equipment supplier, reagents supplier, distribution partnership, B2B procurement, IVD supplier',
    openGraph: {
      title,
      description,
      url: `${baseUrl}/supplier`,
      type: 'website',
      siteName: companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/supplier`,
    },
  }
}

export default async function SupplierPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  const baseUrl = await getBaseUrl()
  const companyName = company?.name || 'Adoris Invest Group'

  const supplierServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: language === 'ru'
      ? 'Партнёрская программа для поставщиков'
      : 'Supplier partnership programme',
    description: dict.supplier.heroTagline || dict.supplier.description,
    provider: {
      '@type': 'Organization',
      name: companyName,
      url: baseUrl,
    },
    areaServed: ['EU', 'EAEU', 'AS', 'AF', 'AM'],
    serviceType: language === 'ru' ? 'Закупки и дистрибуция' : 'Procurement & distribution partnership',
    audience: {
      '@type': 'BusinessAudience',
      audienceType: language === 'ru'
        ? 'Производители, авторизованные дистрибьюторы, OEM-партнёры'
        : 'Manufacturers, authorized distributors, OEM partners',
    },
    url: `${baseUrl}/supplier`,
  }

  const faqSchema = dict.supplier.faqItems && dict.supplier.faqItems.length > 0
    ? generateFAQSchema(dict.supplier.faqItems)
    : null

  const structuredData = faqSchema
    ? [supplierServiceSchema, faqSchema]
    : [supplierServiceSchema]

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={structuredData} />
      <Header />
      <main className="flex-1" style={{ backgroundColor: 'var(--company-secondary)' }}>
        <SupplierForm company={company} translations={dict.supplier} />
      </main>
      <Footer />
    </div>
  )
}
