import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import { getProductUrl } from '@/lib/product-url'
import { getBaseUrl } from '@/lib/get-base-url'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PRODUCTS_PER_SITEMAP = 10000

/** Stable epoch for rarely changing legal/static marketing pages. */
const STATIC_PAGE_LASTMOD = '2025-01-15T00:00:00.000Z'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry(url: string, lastmod: string, changefreq: string, priority: number): string {
  return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
}

/**
 * Generate the "static" sitemap: static pages + categories + manufacturers.
 * lastmod uses real entity dates (category/manufacturer have no updatedAt —
 * fall back to max product.updatedAt for those listing pages). Static
 * marketing/legal pages use a fixed date, not wall-clock "now".
 */
async function generateStaticSitemap(baseUrl: string): Promise<string> {
  const entries: string[] = []

  const [latestProduct, categories, manufacturers] = await Promise.all([
    retryPrismaQuery(() =>
      prisma.product.findFirst({
        select: { updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      })
    ),
    retryPrismaQuery(() =>
      prisma.category.findMany({ select: { slug: true } })
    ),
    retryPrismaQuery(() =>
      prisma.manufacturer.findMany({
        select: { slug: true, updatedAt: true },
      })
    ),
  ])

  const catalogLastmod = (latestProduct?.updatedAt ?? new Date(STATIC_PAGE_LASTMOD)).toISOString()

  // Static pages — fixed lastmod (content changes are infrequent releases)
  const staticPages = [
    { path: '',                 changefreq: 'daily',   priority: 1.0, lastmod: catalogLastmod },
    { path: '/products',        changefreq: 'daily',   priority: 0.9, lastmod: catalogLastmod },
    { path: '/bulk-order',      changefreq: 'monthly', priority: 0.7, lastmod: STATIC_PAGE_LASTMOD },
    { path: '/company/about',   changefreq: 'monthly', priority: 0.6, lastmod: STATIC_PAGE_LASTMOD },
    { path: '/faq',             changefreq: 'monthly', priority: 0.6, lastmod: STATIC_PAGE_LASTMOD },
    { path: '/terms',           changefreq: 'monthly', priority: 0.4, lastmod: STATIC_PAGE_LASTMOD },
    { path: '/supplier',        changefreq: 'monthly', priority: 0.5, lastmod: STATIC_PAGE_LASTMOD },
  ]

  for (const page of staticPages) {
    entries.push(urlEntry(`${baseUrl}${page.path}`, page.lastmod, page.changefreq, page.priority))
  }

  // Categories — listing freshness tracks catalog
  for (const cat of categories) {
    entries.push(urlEntry(`${baseUrl}/products?category=${cat.slug}`, catalogLastmod, 'weekly', 0.7))
  }

  // Manufacturers — use manufacturer.updatedAt when present
  for (const m of manufacturers) {
    const lastmod = (m.updatedAt ?? latestProduct?.updatedAt ?? new Date(STATIC_PAGE_LASTMOD)).toISOString()
    entries.push(urlEntry(`${baseUrl}/products?manufacturer=${m.slug}`, lastmod, 'weekly', 0.7))
  }

  return wrapUrlset(entries)
}

/**
 * Generate a paginated product-URL sitemap.
 * Each product URL uses its own updatedAt as lastmod (already correct —
 * do not replace with new Date()).
 */
async function generateProductsSitemap(baseUrl: string, page: number): Promise<string> {
  const products = await retryPrismaQuery(() =>
    prisma.product.findMany({
      select: {
        slug: true,
        sku: true,
        updatedAt: true,
        manufacturer: { select: { slug: true } },
      },
      orderBy: { id: 'asc' },
      skip: page * PRODUCTS_PER_SITEMAP,
      take: PRODUCTS_PER_SITEMAP,
    })
  )

  const entries = products.map((p) =>
    urlEntry(
      `${baseUrl}${getProductUrl(p as any)}`,
      p.updatedAt.toISOString(),
      'weekly',
      0.8
    )
  )

  return wrapUrlset(entries)
}

function wrapUrlset(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}
</urlset>`
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const baseUrl = await getBaseUrl()

  let xml: string

  if (id === 'static') {
    xml = await generateStaticSitemap(baseUrl)
  } else if (id.startsWith('products-')) {
    const page = parseInt(id.replace('products-', ''), 10)
    if (isNaN(page) || page < 0) {
      return NextResponse.json({ error: 'Invalid sitemap id' }, { status: 404 })
    }
    xml = await generateProductsSitemap(baseUrl, page)
  } else {
    return NextResponse.json({ error: 'Unknown sitemap' }, { status: 404 })
  }

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // 24h on CDN, 12h SWR — sitemap subpages are heavy (10k product rows).
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
