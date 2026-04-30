import { permanentRedirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getProductUrl } from '@/lib/product-url'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import type { Metadata } from 'next'

/**
 * /sku/[sku] — Direct SKU access route
 * 
 * This is CRITICAL for SEO: 95% of B2B users search by product SKU/article number.
 * This route allows Google to index URLs like /sku/12345 directly.
 * It permanently redirects (308) to the canonical product page.
 * 
 * The 308 redirect passes SEO value to the target page while
 * keeping /sku/12345 indexed as an entry point in search results.
 */

// ISR: Revalidate every 5 minutes
export const revalidate = 300

// Allow up to 30 seconds for DB queries on cold start
export const maxDuration = 30

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>
}): Promise<Metadata> {
  const { sku } = await params
  const decodedSku = decodeURIComponent(sku)

  let product: {
    name: string
    sku: string
    description: string | null
    manufacturer: { name: string } | null
  } | null = null
  try {
    product = await retryPrismaQuery(() =>
      prisma.product.findUnique({
        where: { sku: decodedSku },
        select: {
          name: true,
          sku: true,
          description: true,
          manufacturer: { select: { name: true } },
        },
      })
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[sku/${decodedSku}] metadata DB error:`, error)
    }
  }

  if (!product) {
    return { title: `SKU ${decodedSku} — Not Found` }
  }

  return {
    title: `${product.sku} — ${product.name} | ${product.manufacturer?.name || ''}`,
    description: `${product.name} (SKU: ${product.sku}). ${product.description?.slice(0, 140) || 'Medical laboratory equipment'}. Order B2B.`,
    robots: { index: true, follow: true },
  }
}

export default async function SkuPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {
  const { sku } = await params
  const decodedSku = decodeURIComponent(sku)

  // Treat infrastructure errors as 404 instead of 5xx — Google is currently
  // reporting thousands of "Server error (5xx)" entries which originate here
  // when the connection pool is saturated.
  let product: { slug: string; manufacturer: { slug: string } | null } | null = null
  try {
    product = await retryPrismaQuery(() =>
      prisma.product.findUnique({
        where: { sku: decodedSku },
        select: {
          slug: true,
          manufacturer: { select: { slug: true } },
        },
      })
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[sku/${decodedSku}] DB error:`, error)
    }
    notFound()
  }

  if (!product) {
    notFound()
  }

  permanentRedirect(getProductUrl(product))
}
