import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoryShowcase } from '@/components/category-showcase'
import { StatsSection } from '@/components/stats-section'
import { StructuredData } from '@/components/structured-data'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { getDictionary } from '@/lib/translations'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Get current company
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  // Fetch featured products
  const featuredProductsRaw = await prisma.product.findMany({
    where: { featured: true },
    include: {
      category: true,
      manufacturer: true,
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  // Convert Decimal to number and apply correct price
  const featuredProducts = featuredProductsRaw.map(p => ({
    ...p,
    price: getProductPrice(
      p.priceEU,
      p.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }))

  // Fetch products by category for showcase
  const categoriesRaw = await prisma.category.findMany({
    include: {
      products: {
        take: 6,
        include: {
          manufacturer: true,
        },
      },
    },
  })

  // Convert Decimal to number and apply correct price
  const categories = categoriesRaw.map(cat => ({
    ...cat,
    products: cat.products.map(p => ({
      ...p,
      price: getProductPrice(
        p.priceEU,
        p.priceRU,
        priceType as 'EU' | 'RU'
      ),
    })),
  }))

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const structuredData = [
    generateOrganizationSchema(company, baseUrl),
    generateWebSiteSchema(company, baseUrl),
    generateItemListSchema(featuredProducts, baseUrl, 'Featured Products'),
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <section aria-label="Hero section">
          <HeroSection translations={dict.homepage.hero} />
        </section>
        <section aria-label="Featured products">
          <FeaturedProducts products={featuredProducts} translations={dict.homepage.featuredProducts} company={company} />
        </section>
        <section aria-label="Category showcase">
          <CategoryShowcase categories={categories} company={company} />
        </section>
        <section aria-label="Statistics and company information">
          <StatsSection companyName={company?.name || 'IVD Group'} translations={dict.homepage.stats} />
        </section>
      </main>
      <Footer />
    </>
  )
}
