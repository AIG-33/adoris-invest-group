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
import { retryPrismaQuery } from '@/lib/retry-prisma'
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'
import type { Metadata } from 'next'

// ISR: Revalidate every 5 minutes (300 seconds) for better performance
export const revalidate = 300

// Allow up to 30 seconds for DB queries on cold start (Vercel Pro)
export const maxDuration = 30

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

    // Optimized query for metadata generation - with retry logic
    let product = await retryPrismaQuery(() => prisma.product.findFirst({
      where: {
        slug: productSlug,
        manufacturer: { slug: manufacturerSlug },
      },
      select: {
        id: true, name: true, sku: true, slug: true, description: true,
        priceEU: true, priceRU: true, image: true,
        category: { select: { id: true, name: true, slug: true } },
        manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
      },
    }))

    // Fallback: prefix match for old URLs (before SKU was added to slug)
    if (!product) {
      product = await retryPrismaQuery(() => prisma.product.findFirst({
        where: {
          slug: { startsWith: productSlug },
          manufacturer: { slug: manufacturerSlug },
        },
        select: {
          id: true, name: true, sku: true, slug: true, description: true,
          priceEU: true, priceRU: true, image: true,
          category: { select: { id: true, name: true, slug: true } },
          manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
        },
      }))
    }

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
    const imageUrl = (product.image && product.image.length > 0)
      ? `${baseUrl}${product.image}`
      : (product.manufacturer?.logo && product.manufacturer.logo.length > 0)
      ? `${baseUrl}${product.manufacturer.logo}`
      : `${baseUrl}/placeholder.svg`
    const productUrl = getProductUrl(product)

    const companyName = company?.name || ''

    return {
      title: `${product.sku} — ${product.name} | ${product.manufacturer?.name || ''} | ${companyName}`,
      description: `${product.sku} — ${product.name}. ${product.description?.slice(0, 140) || 'Medical laboratory equipment'} from ${product.manufacturer?.name || 'leading manufacturers'}. B2B order at ${companyName}.`,
      openGraph: {
        title: `${product.sku} — ${product.name}`,
        description: `Article ${product.sku}. ${product.name} from ${product.manufacturer?.name || 'leading manufacturers'}. ${product.description?.slice(0, 120) || ''}`,
        images: [imageUrl],
        url: `${baseUrl}${productUrl}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.sku} — ${product.name}`,
        description: `Article ${product.sku}. ${product.name} from ${product.manufacturer?.name || ''}. B2B medical equipment.`,
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

    const productSelect = {
      id: true,
      name: true,
      sku: true,
      slug: true,
      description: true,
      priceEU: true,
      priceRU: true,
      image: true,
      categoryId: true,
      category: { select: { id: true, name: true, slug: true } },
      manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
    } as const

    // Optimized query for product data - with retry logic
    let product = await retryPrismaQuery(() => prisma.product.findFirst({
      where: {
        slug: productSlug,
        manufacturer: { slug: manufacturerSlug },
      },
      select: productSelect,
    }))

    // Fallback: if slug changed (e.g. SKU was appended), try prefix match
    // This handles old URLs like /product/mfg/old-slug when slug is now old-slug-sku123
    if (!product) {
      product = await retryPrismaQuery(() => prisma.product.findFirst({
        where: {
          slug: { startsWith: productSlug },
          manufacturer: { slug: manufacturerSlug },
        },
        select: productSelect,
      }))
      // If found via prefix, redirect to canonical URL
      if (product) {
        const canonicalUrl = getProductUrl(product)
        permanentRedirect(canonicalUrl)
      }
    }

    if (!product) {
      notFound()
    }

    // Get related products - soft-fail: if this query fails, show page without related products
    let relatedProductsRaw: any[] = []
    try {
      relatedProductsRaw = await retryPrismaQuery(() => prisma.product.findMany({
        where: {
          categoryId: product?.categoryId,
          id: { not: product?.id },
        },
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
        take: 4,
      }))
    } catch {
      // Non-critical: page renders fine without related products
    }

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
            <ProductDetail product={productWithNumber} relatedProducts={relatedProducts} translations={dict.product} company={company} />
          </article>
        </main>
        <Footer translations={dict.footer} />
      </div>
    )
  }
  
  // Legacy format: /product/old-slug (1 segment) -> redirect
  if (slug.length === 1) {
    const productSlug = slug[0]

    // Optimized query for legacy redirect - with retry logic
    const product = await retryPrismaQuery(() => prisma.product.findUnique({
      where: { slug: productSlug },
      select: {
        id: true,
        slug: true,
        manufacturer: {
          select: {
            slug: true,
          },
        },
      },
    }))

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
