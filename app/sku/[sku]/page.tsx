import { redirect, notFound } from 'next/navigation'
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>
}): Promise<Metadata> {
  const { sku } = await params
  const decodedSku = decodeURIComponent(sku)

  const product = await retryPrismaQuery(() =>
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

  const product = await retryPrismaQuery(() =>
    prisma.product.findUnique({
      where: { sku: decodedSku },
      select: {
        slug: true,
        manufacturer: { select: { slug: true } },
      },
    })
  )

  if (!product) {
    notFound()
  }

  // 308 Permanent Redirect to canonical product page
  const canonicalUrl = getProductUrl(product)
  redirect(canonicalUrl)
}
