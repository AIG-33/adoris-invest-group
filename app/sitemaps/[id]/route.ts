import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import { getProductUrl } from '@/lib/product-url'
import { getBaseUrl } from '@/lib/get-base-url'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PRODUCTS_PER_SITEMAP = 10000

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
 * Generate the "static" sitemap: static pages + categories + manufacturers
 */
async function generateStaticSitemap(baseUrl: string): Promise<string> {
  const now = new Date().toISOString()

  const entries: string[] = []

  // Static pages
  const staticPages = [
    { path: '',                 changefreq: 'daily',   priority: 1.0 },
    { path: '/products',        changefreq: 'daily',   priority: 0.9 },
    { path: '/bulk-order',      changefreq: 'monthly', priority: 0.7 },
    { path: '/company/about',   changefreq: 'monthly', priority: 0.6 },
    { path: '/faq',             changefreq: 'monthly', priority: 0.6 },
    { path: '/terms',           changefreq: 'monthly', priority: 0.4 },
    { path: '/supplier',        changefreq: 'monthly', priority: 0.5 },
  ]

  for (const page of staticPages) {
    entries.push(urlEntry(`${baseUrl}${page.path}`, now, page.changefreq, page.priority))
  }

  // Categories
  const categories = await retryPrismaQuery(() =>
    prisma.category.findMany({ select: { slug: true } })
  )
  for (const cat of categories) {
    entries.push(urlEntry(`${baseUrl}/products?category=${cat.slug}`, now, 'weekly', 0.7))
  }

  // Manufacturers
  const manufacturers = await retryPrismaQuery(() =>
    prisma.manufacturer.findMany({ select: { slug: true } })
  )
  for (const m of manufacturers) {
    entries.push(urlEntry(`${baseUrl}/products?manufacturer=${m.slug}`, now, 'weekly', 0.7))
  }

  return wrapUrlset(entries)
}

/**
 * Generate a paginated product-URL sitemap
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
