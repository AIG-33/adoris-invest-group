import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSearch } from '@/components/hero-search'
import { BentoStrip } from '@/components/bento-strip'
import { ManufacturersStrip } from '@/components/manufacturers-strip'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoryShowcase } from '@/components/category-showcase'
import { StatsSection } from '@/components/stats-section'
import { StructuredData } from '@/components/structured-data'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { getDictionary } from '@/lib/translations'
import {
  getCachedFeaturedProducts,
  getCachedManufacturersWithLogo,
  getCachedCategoriesWithCount,
} from '@/lib/cached-queries'
import { getBaseUrl } from '@/lib/get-base-url'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from '@/lib/seo'
import type { Metadata } from 'next'

// ISR: Revalidate every 5 minutes (300 seconds) for better performance
export const revalidate = 300

// Allow up to 30 seconds for DB queries on cold start
export const maxDuration = 30

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const companyName = company?.name || 'Medical Equipment'
  const baseUrl = await getBaseUrl()
  const language = company?.language || 'en'

  const title = language === 'ru'
    ? `${companyName} — Поиск по SKU · Массовый заказ · Поставщикам`
    : `${companyName} — Search by SKU · Bulk Paste · For Suppliers`
  const description = language === 'ru'
    ? `${companyName} — B2B-поставщик медицинского и лабораторного оборудования. Поиск 100 000+ SKU по артикулу или названию, массовый заказ по списку и партнёрство с поставщиками с прямыми ценами от производителя.`
    : `${companyName} — B2B medical & laboratory supply. Search 100,000+ SKUs by catalog number or product name, paste a list to build a cart instantly, or partner with us as a supplier with direct manufacturer pricing.`

  const keywords = language === 'ru'
    ? 'поиск по SKU, поиск по артикулу, массовый заказ, оптовый заказ, B2B медицинское оборудование, реагенты оптом, стать поставщиком, прямые цены производителя, лабораторное оборудование'
    : 'search by SKU, search by catalog number, bulk order, paste SKU list, B2B medical equipment, lab reagents wholesale, become a supplier, direct manufacturer pricing, laboratory supplies, IVD distributor'

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseUrl,
      type: 'website',
      siteName: companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

export default async function HomePage() {
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  // Fetch all data in parallel — all three queries are cached by unstable_cache,
  // so on a warm cache this turns into ~0 DB roundtrips.
  const [featuredProductsRaw, manufacturersRaw, categoriesRaw] = await Promise.all([
    getCachedFeaturedProducts(),
    getCachedManufacturersWithLogo(),
    getCachedCategoriesWithCount(),
  ])

  // Convert prices
  const featuredProducts = featuredProductsRaw.map(p => ({
    ...p,
    price: getProductPrice(p.priceEU, p.priceRU, priceType as 'EU' | 'RU'),
  }))

  // Adapt to CategoryShowcase shape and filter categories with at least 1 product
  const categories = categoriesRaw
    .filter(c => c.productCount > 0)
    .map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      _count: { products: c.productCount },
    }))

  // Hero v6 metrics — totals from cached queries (no extra DB roundtrips)
  const totalProducts = categoriesRaw.reduce((sum, c) => sum + c.productCount, 0)
  const totalManufacturers = manufacturersRaw.length
  // Show the most populated categories first (by SKU count) so the chips
  // surface real disciplines, not alphabetically-first brand-named buckets.
  // Skip "uncategorized" — it's a fallback bucket, not a discipline.
  const quickCategories = [...categories]
    .filter((c) => c.slug !== 'uncategorized')
    .sort((a, b) => b._count.products - a._count.products)
    .slice(0, 6)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: c._count.products,
    }))

  // Bento copy depends on language
  const bentoCopy = language === 'ru'
    ? {
        onTimeLabel: 'Доставка вовремя · 12 мес',
        onTimeDetail: 'из всех отгрузок прибыли в срок.',
        coverageLabel: 'География · по всему миру',
        hub: 'ХАБ',
        complianceLabel: 'Комплаенс и платежи',
        complianceItems: [
          'AML / KYC проверка контрагентов',
          'Скрининг по санкциям ЕС, ООН, OFAC',
          'SWIFT / SEPA, мульти-валютные счёта',
          'GDPR, защита данных, EU VAT',
        ],
      }
    : {
        onTimeLabel: 'On-time delivery · 12 mo',
        onTimeDetail: 'of shipments arrived in window.',
        coverageLabel: 'Coverage · worldwide',
        hub: 'HUB',
        complianceLabel: 'Compliance & payments',
        complianceItems: [
          'AML / KYC counterparty due diligence',
          'EU, UN & OFAC sanctions screening',
          'SWIFT / SEPA, multi-currency accounts',
          'GDPR, data protection, EU VAT registered',
        ],
      }

  const baseUrl = await getBaseUrl()
  const companyName = company?.name || 'IVD Group'

  // Service schemas for the two non-product "products" the homepage promotes:
  // the supplier-recruitment programme and the bulk-paste ordering tool.
  // Search-by-SKU is already covered by the WebSite SearchAction schema.
  const supplierServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: language === 'ru'
      ? 'Партнёрская программа для поставщиков'
      : 'Supplier partnership programme',
    description: dict.homepage.hero.pathway3.description,
    provider: { '@type': 'Organization', name: companyName, url: baseUrl },
    serviceType: language === 'ru' ? 'Закупки и дистрибуция' : 'Procurement & distribution partnership',
    areaServed: ['EU', 'EAEU', 'AS', 'AF', 'AM'],
    url: `${baseUrl}/supplier`,
  }
  const bulkOrderServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: language === 'ru' ? 'Инструмент массового заказа' : 'Bulk order tool',
    description: dict.homepage.hero.pathway2.description,
    provider: { '@type': 'Organization', name: companyName, url: baseUrl },
    serviceType: language === 'ru' ? 'B2B-инструмент закупок' : 'B2B procurement tool',
    url: `${baseUrl}/bulk-order`,
  }

  const structuredData = [
    generateOrganizationSchema(company, baseUrl),
    generateWebSiteSchema(company, baseUrl),
    generateItemListSchema(featuredProducts, baseUrl, 'Featured Products'),
    supplierServiceSchema,
    bulkOrderServiceSchema,
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <main className="min-h-screen">
        {/* DARK — Hero v6 (search-as-hero) */}
        <section aria-label="Hero section">
          <HeroSearch
            translations={{
              searchPlaceholder: dict.homepage.hero.searchPlaceholder,
              browseCatalog: dict.homepage.hero.browseCatalog,
              pathwaysEyebrow: dict.homepage.hero.pathwaysEyebrow,
              pathwaysHeading: dict.homepage.hero.pathwaysHeading,
              pathway1: dict.homepage.hero.pathway1,
              pathway2: dict.homepage.hero.pathway2,
              pathway3: dict.homepage.hero.pathway3,
            }}
            language={language}
            companyName={company?.name || 'IVD Group'}
            totalProducts={totalProducts}
            totalManufacturers={totalManufacturers}
            quickCategories={quickCategories}
          />
        </section>

        {/* DARK — Bento metrics strip */}
        <section aria-label="Operational metrics">
          <BentoStrip
            translations={bentoCopy}
            language={language}
            totalProducts={totalProducts}
          />
        </section>

        {/* LIGHT — Trusted Manufacturers */}
        <section aria-label="Trusted manufacturers" style={{ backgroundColor: 'var(--company-secondary)' }}>
          <ManufacturersStrip
            manufacturers={manufacturersRaw}
            title={dict.homepage.manufacturers.title}
          />
        </section>

        {/* DARK — Featured Products */}
        <section aria-label="Featured products" className="bg-gradient-to-b from-gray-950 via-[#0a0a0f] to-gray-950">
          <FeaturedProducts
            products={featuredProducts}
            translations={dict.homepage.featuredProducts}
            company={company}
          />
        </section>

        {/* LIGHT — Product Categories */}
        <section aria-label="Product categories" style={{ backgroundColor: 'var(--company-secondary)' }}>
          <CategoryShowcase
            categories={categories}
            translations={dict.homepage.categories}
            language={language}
          />
        </section>

        {/* DARK — Stats & CTA */}
        <section aria-label="Statistics and company information" className="bg-gradient-to-b from-gray-950 via-[#0a0a0f] to-[#050508]">
          <StatsSection
            companyName={company?.name || 'IVD Group'}
            translations={dict.homepage.stats}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}
