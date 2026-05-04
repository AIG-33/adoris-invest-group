import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
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
    ? `${companyName} — B2B медицинское и лабораторное оборудование`
    : `${companyName} — B2B Medical & Laboratory Equipment`
  const description = language === 'ru'
    ? `${companyName} — профессиональный поставщик медицинского и лабораторного оборудования, анализаторов, реагентов и расходных материалов от ведущих мировых производителей. Поиск по артикулу.`
    : `${companyName} — professional B2B supplier of medical laboratory equipment, analyzers, reagents, and consumables from leading global manufacturers. Search by SKU.`

  return {
    title,
    description,
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

  const baseUrl = await getBaseUrl()
  const structuredData = [
    generateOrganizationSchema(company, baseUrl),
    generateWebSiteSchema(company, baseUrl),
    generateItemListSchema(featuredProducts, baseUrl, 'Featured Products'),
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <main className="min-h-screen">
        {/* DARK — Hero */}
        <section aria-label="Hero section">
          <HeroSection translations={dict.homepage.hero} />
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
