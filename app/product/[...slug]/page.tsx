import { notFound, permanentRedirect } from 'next/navigation'
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
import { getBaseUrl } from '@/lib/get-base-url'
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
    const baseUrl = await getBaseUrl()

    const metaSelect = {
      id: true, name: true, sku: true, slug: true, description: true,
      priceEU: true, priceRU: true, image: true,
      category: { select: { id: true, name: true, slug: true } },
      manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
    } as const

    // Soft-fail metadata lookup: never let DB errors turn into a 5xx page.
    let product: any = null
    try {
      product = await retryPrismaQuery(() => prisma.product.findFirst({
        where: {
          slug: productSlug,
          manufacturer: { slug: manufacturerSlug },
        },
        select: metaSelect,
      }))

      if (!product) {
        product = await retryPrismaQuery(() => prisma.product.findFirst({
          where: {
            slug: { startsWith: productSlug },
            manufacturer: { slug: manufacturerSlug },
          },
          select: metaSelect,
        }))
      }

      if (!product) {
        product = await retryPrismaQuery(() => prisma.product.findFirst({
          where: { slug: productSlug },
          select: metaSelect,
        }))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[product/${manufacturerSlug}/${productSlug}] metadata DB error:`, error)
      }
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

    // Lookup with three fallbacks. We must NOT call permanentRedirect()/notFound()
    // inside the try block, because Next.js implements them via thrown signals
    // (NEXT_REDIRECT / NEXT_NOT_FOUND) and a generic catch would swallow them.
    let product: any = null
    let needsCanonicalRedirect = false
    try {
      product = await retryPrismaQuery(() => prisma.product.findFirst({
        where: {
          slug: productSlug,
          manufacturer: { slug: manufacturerSlug },
        },
        select: productSelect,
      }))

      if (!product) {
        // Fallback 1: slug changed (e.g. SKU was appended), prefix match same manufacturer
        product = await retryPrismaQuery(() => prisma.product.findFirst({
          where: {
            slug: { startsWith: productSlug },
            manufacturer: { slug: manufacturerSlug },
          },
          select: productSelect,
        }))
        if (product) needsCanonicalRedirect = true
      }

      if (!product) {
        // Fallback 2: manufacturer slug changed (e.g. neb-m7ugfu → neb)
        product = await retryPrismaQuery(() => prisma.product.findFirst({
          where: { slug: productSlug },
          select: productSelect,
        }))
        if (product) needsCanonicalRedirect = true
      }

      if (!product) {
        // Fallback 3: both manufacturer and product slug changed
        product = await retryPrismaQuery(() => prisma.product.findFirst({
          where: { slug: { startsWith: productSlug } },
          select: productSelect,
        }))
        if (product) needsCanonicalRedirect = true
      }
    } catch (error) {
      // Pool exhaustion / DB outage: prefer 404 over 5xx so GSC clears the
      // "Server error (5xx)" bucket faster. Lost product pages will be
      // re-discovered via the sitemap on the next crawl.
      if (process.env.NODE_ENV === 'development') {
        console.error(`[product/${manufacturerSlug}/${productSlug}] DB error:`, error)
      }
      notFound()
    }

    if (!product) {
      notFound()
    }

    if (needsCanonicalRedirect) {
      permanentRedirect(getProductUrl(product))
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

    const baseUrl = await getBaseUrl()
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
        <main className="flex-1">
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

    let product: { id: string; slug: string; manufacturer: { slug: string } | null } | null = null
    try {
      product = await retryPrismaQuery(() => prisma.product.findUnique({
        where: { slug: productSlug },
        select: {
          id: true,
          slug: true,
          manufacturer: { select: { slug: true } },
        },
      }))
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[product/${productSlug}] legacy DB error:`, error)
      }
      notFound()
    }

    if (!product) {
      notFound()
    }

    permanentRedirect(getProductUrl(product))
  }

  // Invalid format
  notFound()
}
