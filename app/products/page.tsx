import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { ProductGrid } from '@/components/product-grid'
import { SortDropdown } from '@/components/sort-dropdown'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { ChevronLeft, ChevronRight, Download, Package } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, manufacturer, minPrice, maxPrice, page, sort } = searchParams
  const currentPage = parseInt(page || '1')

  // Get current company
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const priceField = priceType === 'RU' ? 'priceRU' : 'priceEU'

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

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where })
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  // Fetch products with pagination
  const productsRaw = await prisma.product.findMany({
    where,
    include: {
      category: true,
      manufacturer: true,
    },
    orderBy,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  })

  // Convert Decimal to number and apply correct price
  const products = productsRaw.map(p => ({
    ...p,
    price: getProductPrice(
      p.priceEU,
      p.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }))

  // Fetch manufacturers for filters with product counts
  const manufacturers = await prisma.manufacturer.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-64">
              <Sidebar
                manufacturers={manufacturers}
                selectedManufacturer={manufacturer}
              />
            </aside>
            <main className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-neutral-400 text-sm">
                  Showing {products.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of {totalProducts} products
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="/api/products/export-pricelist"
                    download
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm"
                    style={{ backgroundColor: 'var(--company-accent, #000000)' }}
                    onMouseEnter={(e) => {
                      const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
                      e.currentTarget.style.backgroundColor = darkenColor(currentColor)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Pricelist</span>
                  </a>
                  <Link
                    href="/bulk-order"
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm"
                    style={{ backgroundColor: 'var(--company-accent, #000000)' }}
                    onMouseEnter={(e) => {
                      const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--company-accent').trim() || '#000000'
                      e.currentTarget.style.backgroundColor = darkenColor(currentColor)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--company-accent, #000000)'
                    }}
                  >
                    <Package className="w-4 h-4" />
                    <span>Bulk Order</span>
                  </Link>
                  <SortDropdown currentSort={sort} />
                </div>
              </div>
              
              <ProductGrid products={products} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildPageUrl(currentPage - 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-2">
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
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-white text-black font-bold'
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      )
                    })}
                  </div>
                  
                  {currentPage < totalPages && (
                    <Link
                      href={buildPageUrl(currentPage + 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <span>Next</span>
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
