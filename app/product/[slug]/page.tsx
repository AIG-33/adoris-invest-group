import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { prisma } from '@/lib/db'
import { ProductDetail } from '@/components/product-detail'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      manufacturer: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Get related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product?.categoryId,
      id: { not: product?.id },
    },
    take: 4,
    include: {
      category: true,
      manufacturer: true,
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  )
}
