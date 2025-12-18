import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { prisma } from '@/lib/db'
import { ProductDetail } from '@/components/product-detail'
import { notFound } from 'next/navigation'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { getDictionary } from '@/lib/translations'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get current company
  const company = await getServerCompany()
  const priceType = company?.priceType || 'EU'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

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
  const relatedProductsRaw = await prisma.product.findMany({
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

  // Convert Decimal to number and apply correct price
  const productWithNumber = {
    ...product,
    price: getProductPrice(
      product.priceEU,
      product.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }

  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    price: getProductPrice(
      p.priceEU,
      p.priceRU,
      priceType as 'EU' | 'RU'
    ),
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={dict.nav} />
      <main className="flex-1">
        <ProductDetail product={productWithNumber} relatedProducts={relatedProducts} translations={dict.product} />
      </main>
      <Footer translations={dict.footer} />
    </div>
  )
}
