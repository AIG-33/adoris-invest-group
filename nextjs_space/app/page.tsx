import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGrid } from '@/components/product-grid'
import { Sidebar } from '@/components/sidebar'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  category?: string
  manufacturer?: string
  minPrice?: string
  maxPrice?: string
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = params?.search || ''
  const category = params?.category || ''
  const manufacturer = params?.manufacturer || ''
  const minPrice = params?.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params?.maxPrice ? parseFloat(params.maxPrice) : undefined

  // Build where clause
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (manufacturer) {
    where.manufacturer = { slug: manufacturer }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      manufacturer: true,
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  // Fetch all categories and manufacturers for filters
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  const manufacturers = await prisma.manufacturer.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-neutral-900 font-medium">
                  {categories?.find?.((c) => c?.slug === category)?.name || category}
                </span>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            <Sidebar
              categories={categories}
              manufacturers={manufacturers}
              selectedCategory={category}
              selectedManufacturer={manufacturer}
            />
            <ProductGrid products={products} search={search} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
