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
import { retryPrismaQuery } from '@/lib/retry-prisma'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from '@/lib/seo'
import type { Metadata } from 'next'

// ISR: Revalidate every 5 minutes (300 seconds) for better performance
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const companyName = company?.name || 'Medical Equipment'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
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
  // Get current company
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  // Fetch data in parallel with retry logic to handle connection pool timeouts
  const [featuredProductsRaw, categoryRaw, categoryProductsRaw] = await Promise.all([
    // Fetch featured products - optimized query, reduced count for faster loading - with retry
    retryPrismaQuery(() => prisma.product.findMany({
      where: { featured: true },
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        priceEU: true,
        priceRU: true,
        image: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
      take: 6, // Reduced from 8 to 6 for faster initial load
      orderBy: { createdAt: 'desc' },
    })),
    // Fetch category info only (without products for better performance) - with retry
    retryPrismaQuery(() => prisma.category.findUnique({
      where: {
        slug: 'equipment-imported', // Only one category to reduce load
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })),
    // Fetch products separately for better query performance - with retry
    retryPrismaQuery(() => prisma.product.findMany({
      where: {
        category: {
          slug: 'equipment-imported',
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        priceEU: true,
        priceRU: true,
        image: true,
        manufacturer: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
      take: 4, // Reduced from 6 to 4 for faster loading
      orderBy: { createdAt: 'desc' },
    })),
  ])

  // Convert Decimal to number and apply correct price
  const featuredProducts = featuredProductsRaw.map(p => ({
    ...p,
    price: getProductPrice(
      p.priceEU,
      p.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }))

  // Convert Decimal to number and apply correct price
  // Combine category with products
  const categories = categoryRaw
    ? [
        {
          ...categoryRaw,
          products: categoryProductsRaw.map(p => ({
            ...p,
            price: getProductPrice(
              p.priceEU,
              p.priceRU,
              priceType as 'EU' | 'RU'
            ),
          })),
        },
      ]
    : []

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
