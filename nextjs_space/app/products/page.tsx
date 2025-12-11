import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { ProductGrid } from '@/components/product-grid'
import { prisma } from '@/lib/db'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type SearchParams = {
  search?: string
  category?: string
  manufacturer?: string
  minPrice?: string
  maxPrice?: string
  page?: string
}

type Props = {
  searchParams: SearchParams
}

const ITEMS_PER_PAGE = 9

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, manufacturer, minPrice, maxPrice, page } = searchParams
  const currentPage = parseInt(page || '1')

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
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where })
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  // Fetch products with pagination
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      manufacturer: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  })

  // Fetch all categories and manufacturers for filters with product counts
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

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
                categories={categories}
                manufacturers={manufacturers}
                selectedCategory={category}
                selectedManufacturer={manufacturer}
              />
            </aside>
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-neutral-400 text-sm">
                  Showing {products.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of {totalProducts} products
                </p>
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
