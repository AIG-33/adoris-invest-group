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
 *   …
 *
 * SKU URLs (`/sku/<sku>`) are intentionally NOT listed: they always
 * 308-redirect to the canonical product page, so including them
 * pollutes the GSC "Page with redirect" report without any indexing
 * benefit. The canonical product pages are already covered above.
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.join('')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // 24h on CDN, 12h SWR — Google bots hit this constantly.
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
