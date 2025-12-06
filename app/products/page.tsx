import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { ProductGrid } from '@/components/product-grid'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

type SearchParams = {
  search?: string
  category?: string
  manufacturer?: string
  minPrice?: string
  maxPrice?: string
}

type Props = {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, manufacturer, minPrice, maxPrice } = searchParams

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

  // Fetch products
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      manufacturer: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch all categories and manufacturers for filters
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const manufacturers = await prisma.manufacturer.findMany({
    orderBy: { name: 'asc' },
  })

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
              <ProductGrid products={products} />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
