import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StructuredData } from '@/components/structured-data'
import { prisma } from '@/lib/db'
import { ProductDetail } from '@/components/product-detail'
import { notFound } from 'next/navigation'
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'
import { getDictionary } from '@/lib/translations'
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await getServerCompany()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      manufacturer: true,
    },
  })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const priceType = company?.priceType || 'EU'
  const price = getProductPrice(
    product.priceEU,
    product.priceRU,
    priceType as 'EU' | 'RU'
  )
  const imageUrl = product.image ? `${baseUrl}${product.image}` : `${baseUrl}/placeholder.svg`

  return {
    title: `${product.name} (SKU: ${product.sku}) | ${company?.name || 'ADORIS INVEST GROUP'}`,
    description: `${product.name} - SKU: ${product.sku}. ${product.description || 'Medical laboratory equipment'} from ${product.manufacturer?.name || 'leading manufacturers'}. Order now for B2B pricing.`,
    openGraph: {
      title: `${product.name} (SKU: ${product.sku})`,
      description: `${product.name} - SKU: ${product.sku}. ${product.description || 'Medical laboratory equipment'} from ${product.manufacturer?.name || 'leading manufacturers'}`,
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} (SKU: ${product.sku})`,
      description: `${product.name} - SKU: ${product.sku}. ${product.description || 'Medical laboratory equipment'}`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/product/${slug}`,
    },
  }
}

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

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const breadcrumbs = [
    { name: dict.product.home, url: `${baseUrl}/` },
    { name: dict.product.products, url: `${baseUrl}/products` },
    { name: product.category?.name || 'Category', url: `${baseUrl}/products?category=${product.category?.slug || ''}` },
    { name: product.name, url: `${baseUrl}/product/${product.slug}` },
  ]

  const structuredData = [
    generateProductSchema(productWithNumber, company, baseUrl),
    generateBreadcrumbSchema(breadcrumbs),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={structuredData} />
      <Header translations={dict.nav} />
      <main className="flex-1" itemScope itemType="https://schema.org/Product">
        <article>
          <ProductDetail product={productWithNumber} relatedProducts={relatedProducts} translations={dict.product} />
        </article>
      </main>
      <Footer translations={dict.footer} />
    </div>
  )
}
