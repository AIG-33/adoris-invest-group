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

const NOINDEX_META: Metadata = {
  title: 'Product Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // Explicitly clear any inherited homepage canonical
  alternates: { canonical: null },
}

const metaSelect = {
  id: true, name: true, sku: true, slug: true, description: true,
  priceEU: true, priceRU: true, image: true,
  category: { select: { id: true, name: true, slug: true } },
  manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
} as const

/**
 * Look up a product for the 2-segment URL. Returns null when missing.
 * Must not call notFound()/redirect — those throw and must stay outside try/catch.
 */
async function lookupProduct(manufacturerSlug: string, productSlug: string) {
  let product = await retryPrismaQuery(() => prisma.product.findFirst({
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

  if (!product) {
    product = await retryPrismaQuery(() => prisma.product.findFirst({
      where: { slug: { startsWith: productSlug } },
      select: metaSelect,
    }))
  }

  return product
}

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

    let product: Awaited<ReturnType<typeof lookupProduct>> = null
    try {
      product = await lookupProduct(manufacturerSlug, productSlug)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[product/${manufacturerSlug}/${productSlug}] metadata DB error:`, error)
      }
      // Real HTTP 404 — must be thrown outside try/catch of the page body,
      // and preferably from generateMetadata so the status is set before
      // the HTML shell flushes (avoids soft-404 200 + NEXT_NOT_FOUND).
      notFound()
    }

    if (!product) {
      // Calling notFound() here ensures HTTP 404 before the response body
      // is streamed. Returning noindex meta as a belt-and-suspenders in case
      // a future Next.js change softens the throw path.
      notFound()
      return NOINDEX_META
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

  // Legacy single-segment or invalid: resolve or 404 (no homepage canonical)
  if (slug.length === 1) {
    const productSlug = slug[0]
    let product: { slug: string; manufacturer: { slug: string } | null } | null = null
    try {
      product = await retryPrismaQuery(() => prisma.product.findUnique({
        where: { slug: productSlug },
        select: {
          slug: true,
          manufacturer: { select: { slug: true } },
        },
      }))
    } catch {
      notFound()
    }
    if (!product) {
      notFound()
      return NOINDEX_META
    }
    // Will 308 in the page; keep a temporary title without homepage canonical
    return {
      title: 'Product',
      alternates: { canonical: null },
      robots: { index: false, follow: false },
    }
  }

  notFound()
  return NOINDEX_META
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
