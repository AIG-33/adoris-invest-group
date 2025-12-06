import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoryShowcase } from '@/components/category-showcase'
import { StatsSection } from '@/components/stats-section'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: {
      category: true,
      manufacturer: true,
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  // Fetch products by category for showcase
  const categories = await prisma.category.findMany({
    include: {
      products: {
        take: 6,
        include: {
          manufacturer: true,
        },
      },
    },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <HeroSection />
        <FeaturedProducts products={featuredProducts} />
        <CategoryShowcase categories={categories} />
        <StatsSection />
      </main>
      <Footer />
    </>
  )
}
