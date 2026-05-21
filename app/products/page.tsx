import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StructuredData } from '@/components/structured-data'
import { ProductGrid } from '@/components/product-grid'
import dynamic from 'next/dynamic'

// Lazy load heavy components to reduce initial bundle size
const Sidebar = dynamic(() => import('@/components/sidebar').then(mod => ({ default: mod.Sidebar })), {
  loading: () => <div className="lg:w-64 h-64 bg-neutral-100 animate-pulse rounded-lg" />,
})
const SortDropdown = dynamic(() => import('@/components/sort-dropdown').then(mod => ({ default: mod.SortDropdown })), {
  loading: () => <div className="w-32 h-10 bg-neutral-100 animate-pulse rounded-lg" />,
})
const ProductsActionButtons = dynamic(() => import('@/components/products-action-buttons').then(mod => ({ default: mod.ProductsActionButtons })), {
  loading: () => <div className="w-24 h-10 bg-neutral-100 animate-pulse rounded-lg" />,
})
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { getDictionary } from '@/lib/translations'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import { getCachedManufacturersList } from '@/lib/cached-queries'
import { getBaseUrl } from '@/lib/get-base-url'
import {
  generateItemListSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

// ISR: Revalidate every 5 minutes (300 seconds) for better performance
export const revalidate = 300

// Allow up to 30 seconds for DB queries on cold start
export const maxDuration = 30

type SearchParams = {
  search?: string
  category?: string
  manufacturer?: string
  minPrice?: string
  maxPrice?: string
  page?: string
  sort?: string
}

type Props = {
  searchParams: SearchParams
}

const ITEMS_PER_PAGE = 9

/**
 * Dynamic metadata for /products — CRITICAL for SEO
 * When a user searches by SKU, the page title reflects the search query,
 * making it much more likely to appear in Google results for that SKU.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const company = await getServerCompany()
  const companyName = company?.name || ''
  const baseUrl = await getBaseUrl()
  const language = company?.language || 'en'

  const { search, category, manufacturer, page } = searchParams

  let title = language === 'ru'
    ? `Каталог продукции | ${companyName}`
    : `Product Catalog | ${companyName}`
  let description = language === 'ru'
    ? `Профессиональное B2B медицинское и лабораторное оборудование. Каталог продукции ${companyName}.`
    : `Professional B2B medical laboratory equipment and supplies. Product catalog by ${companyName}.`

  if (search) {
    title = language === 'ru'
      ? `${search} — поиск продукции | ${companyName}`
      : `${search} — Product Search | ${companyName}`
    description = language === 'ru'
      ? `Результаты поиска «${search}» в каталоге ${companyName}. B2B медицинское оборудование и расходные материалы.`
      : `Search results for "${search}" in ${companyName} catalog. B2B medical equipment and laboratory supplies.`
  } else if (category) {
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    title = language === 'ru'
      ? `${categoryName} — каталог | ${companyName}`
      : `${categoryName} — Catalog | ${companyName}`
    description = language === 'ru'
      ? `${categoryName} от ведущих производителей. Каталог ${companyName}.`
      : `${categoryName} from leading manufacturers. ${companyName} catalog.`
  } else if (manufacturer) {
    const manufacturerName = manufacturer.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    title = language === 'ru'
      ? `${manufacturerName} — продукция | ${companyName}`
      : `${manufacturerName} — Products | ${companyName}`
    description = language === 'ru'
      ? `Продукция ${manufacturerName}. Каталог ${companyName}. B2B медицинское оборудование.`
      : `${manufacturerName} products. ${companyName} catalog. B2B medical equipment.`
  }

  // Build canonical URL (without page param for page 1)
  const canonicalParams = new URLSearchParams()
  if (search) canonicalParams.set('search', search)
  if (category) canonicalParams.set('category', category)
  if (manufacturer) canonicalParams.set('manufacturer', manufacturer)
  const queryString = canonicalParams.toString()
  const canonical = `${baseUrl}/products${queryString ? `?${queryString}` : ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, manufacturer, minPrice, maxPrice, page, sort } = searchParams
  const currentPage = parseInt(page || '1')

  // Get current company
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const priceField = priceType === 'RU' ? 'priceRU' : 'priceEU'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  // Build where clause
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (manufacturer) {
    where.manufacturer = { slug: manufacturer }
  }

  if (minPrice || maxPrice) {
    where[priceField] = {}
    if (minPrice) where[priceField].gte = parseFloat(minPrice)
    if (maxPrice) where[priceField].lte = parseFloat(maxPrice)
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-asc') {
    orderBy = { [priceField]: 'asc' }
  } else if (sort === 'price-desc') {
    orderBy = { [priceField]: 'desc' }
  }

  // Execute database queries with retry logic to handle connection pool timeouts
  // Note: With connection_limit=1, parallel queries may timeout, so we use retry logic
  const [totalProducts, productsRaw, manufacturers] = await Promise.all([
    // Get total count for pagination - with retry
    retryPrismaQuery(() => prisma.product.count({ where })),
    
    // Fetch products with pagination - optimized with select instead of include - with retry
    retryPrismaQuery(() => prisma.product.findMany({
      where,
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
      orderBy,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })),
    
    // Fetch manufacturers for filters — cached, no DB hit on warm cache
    getCachedManufacturersList(),
  ])

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  // Convert Decimal to number and apply correct price
  const products = productsRaw.map(p => ({
    ...p,
    price: getProductPrice(
      p.priceEU,
      p.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }))

  // Build pagination URL
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (manufacturer) params.set('manufacturer', manufacturer)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)
    if (pageNum > 1) params.set('page', pageNum.toString())
    return `/products?${params.toString()}`
  }

  const baseUrl = await getBaseUrl()
  const breadcrumbs = [
    { name: dict.nav.home, url: `${baseUrl}/` },
    { name: dict.nav.products, url: `${baseUrl}/products` },
  ]
  
  const structuredData = [
    generateItemListSchema(products, baseUrl, 'Products'),
    generateBreadcrumbSchema(breadcrumbs),
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--company-secondary)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-64" aria-label="Filters sidebar">
              <Sidebar
                manufacturers={manufacturers}
                selectedManufacturer={manufacturer}
              />
            </aside>
            <main className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-neutral-400 text-sm">
                  {dict.products.showing} {products.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} {dict.products.of} {totalProducts} {dict.products.results}
                </p>
                <div className="flex items-center gap-3">
                  <ProductsActionButtons />
                  <SortDropdown currentSort={sort} translations={dict.products.sort} />
                </div>
              </div>
              
              <ProductGrid products={products} company={company} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildPageUrl(currentPage - 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{dict.common.previous}</span>
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <Link
                          key={pageNum}
                          href={buildPageUrl(pageNum)}
                          className={`px-3.5 py-2 rounded-lg transition-colors text-sm font-medium ${
                            currentPage === pageNum
                              ? 'text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          style={currentPage === pageNum ? { backgroundColor: 'var(--company-accent)' } : undefined}
                        >
                          {pageNum}
                        </Link>
                      )
                    })}
                  </div>
                  
                  {currentPage < totalPages && (
                    <Link
                      href={buildPageUrl(currentPage + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm font-medium"
                    >
                      <span>{dict.common.next}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
