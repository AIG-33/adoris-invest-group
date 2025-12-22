import { redirect, notFound } from 'next/navigation'
import { permanentRedirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getProductUrl } from '@/lib/product-url'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StructuredData } from '@/components/structured-data'
import { ProductDetail } from '@/components/product-detail'
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
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  
  // New format: /product/manufacturer/product-slug
  if (slug.length === 2) {
    const [manufacturerSlug, productSlug] = slug
    const company = await getServerCompany()
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        manufacturer: {
          slug: manufacturerSlug,
        },
      },
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
    const productUrl = getProductUrl(product)

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
        canonical: `${baseUrl}${productUrl}`,
      },
    }
  }
  
  // Legacy format - return basic metadata
  return {
    title: 'Product',
  }
}

/**
 * Catch-all route for product URLs
 * Handles both new format: /product/[manufacturer]/[productSlug]
 * and legacy format: /product/[slug] -> redirects to new format
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  
  // New format: /product/manufacturer/product-slug (2 segments)
  if (slug.length === 2) {
    const [manufacturerSlug, productSlug] = slug
    
    const company = await getServerCompany()
    const priceType = company?.priceType || 'EU'
    const language = (company?.language || 'en') as 'en' | 'ru'
    const dict = getDictionary(language)

    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        manufacturer: {
          slug: manufacturerSlug,
        },
      },
      include: {
        category: true,
        manufacturer: true,
      },
    })

    if (!product) {
      notFound()
    }

    // Get related products
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
    const productUrl = getProductUrl(product)
    const breadcrumbs = [
      { name: dict.product.home, url: `${baseUrl}/` },
      { name: dict.product.products, url: `${baseUrl}/products` },
      { name: product.category?.name || 'Category', url: `${baseUrl}/products?category=${product.category?.slug || ''}` },
      { name: product.name, url: `${baseUrl}${productUrl}` },
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
  
  // Legacy format: /product/old-slug (1 segment) -> redirect
  if (slug.length === 1) {
    const productSlug = slug[0]

    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      include: {
        manufacturer: true,
      },
    })

    if (!product) {
      notFound()
    }

    // Permanent redirect to new URL format (308)
    const newUrl = getProductUrl(product)
    permanentRedirect(newUrl)
  }

  // Invalid format
  notFound()
}
