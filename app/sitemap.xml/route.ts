import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import { getBaseUrl } from '@/lib/get-base-url'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const PRODUCTS_PER_SITEMAP = 10000

/**
 * Dynamic sitemap index — reads Host header so each domain
 * (ivdgroup.eu, shop.samplify.org, etc.) gets its own sitemap.
 *
 * Structure:
 *   /sitemap.xml              ← this file (index)
 *   /sitemaps/static          ← static pages + categories + manufacturers
 *   /sitemaps/products-0      ← products   0 … 9 999
 *   /sitemaps/products-1      ← products  10 000 … 19 999
 *   /sitemaps/sku-0           ← SKU pages  0 … 9 999
 *   /sitemaps/sku-1           ← SKU pages 10 000 … 19 999
 *   …
 */
export async function GET() {
  const baseUrl = await getBaseUrl()

  // Count products to determine how many sub-sitemaps we need
  const totalProducts = await retryPrismaQuery(() => prisma.product.count())
  const totalProductPages = Math.ceil(totalProducts / PRODUCTS_PER_SITEMAP)

  const now = new Date().toISOString()

  const sitemaps: string[] = []

  // Static sitemap (static pages + categories + manufacturers)
  sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemaps/static</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`)

  // Product sitemaps (paginated)
  for (let i = 0; i < totalProductPages; i++) {
    sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemaps/products-${i}</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`)
  }

  // SKU sitemaps (paginated, same count as products)
  for (let i = 0; i < totalProductPages; i++) {
    sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemaps/sku-${i}</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.join('')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
