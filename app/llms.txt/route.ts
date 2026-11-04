import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductUrl } from '@/lib/product-url'
import { getCachedCategoryTree, visibleSections } from '@/lib/catalog-taxonomy'
import { retryPrismaQuery } from '@/lib/retry-prisma'
import { getBaseUrl } from '@/lib/get-base-url'

/**
 * llms.txt — Machine-readable site description for AI search engines
 * 
 * This file helps AI assistants (ChatGPT, Perplexity, Claude, Gemini, etc.)
 * understand what this site offers and how to find products.
 * 
 * Standard: https://llmstxt.org/
 */
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const company = await getServerCompany()
  const baseUrl = await getBaseUrl()
  const companyName = company?.name || 'Medical Equipment Store'
  const companyEmail = company?.email || ''
  const language = company?.language || 'en'

  // Get product stats
  const [productCount, categoryTree, manufacturers, sampleProducts] = await Promise.all([
    retryPrismaQuery(() => prisma.product.count()),
    getCachedCategoryTree(),
    retryPrismaQuery(() => prisma.manufacturer.findMany({
      select: { name: true, slug: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })),
    retryPrismaQuery(() => prisma.product.findMany({
      select: {
        name: true,
        sku: true,
        slug: true,
        manufacturer: { select: { name: true, slug: true } },
        category: { select: { name: true } },
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    })),
  ])

  const categories = visibleSections(categoryTree)
  const categoryList = categories
    .map(s => [
      `- ${s.name} (${s.productCount} products): ${baseUrl}/products?category=${s.slug}`,
      ...s.children.map(c => `  - ${c.name} (${c.productCount} products): ${baseUrl}/products?category=${c.slug}`),
    ].join('\n'))
    .join('\n')

  const manufacturerList = manufacturers
    .map(m => `- ${m.name} (${m._count.products} products): ${baseUrl}/products?manufacturer=${m.slug}`)
    .join('\n')

  const productList = sampleProducts
    .map(p => `- ${p.name} | SKU: ${p.sku} | ${p.manufacturer?.name || ''} | ${p.category?.name || ''} | ${baseUrl}${getProductUrl(p as any)}`)
    .join('\n')

  const content = `# ${companyName}

> ${companyName} is a B2B supplier of professional medical laboratory equipment, analyzers, reagents, and consumables from leading global manufacturers.

## About

${companyName} provides medical and laboratory equipment for hospitals, clinics, and laboratories.
${language === 'ru' ? 'Primary language: Russian. Serves CIS markets.' : 'Primary language: English. Serves EU markets.'}
${companyEmail ? `Contact: ${companyEmail}` : ''}
Website: ${baseUrl}

## How to Find Products

Products can be found by:
- **SKU / Article Number** (most common): ${baseUrl}/sku/{SKU} — direct access by article number
- **Search**: ${baseUrl}/products?search={query} — search by name or SKU
- **Category**: ${baseUrl}/products?category={category-slug}
- **Manufacturer**: ${baseUrl}/products?manufacturer={manufacturer-slug}
- **Full catalog**: ${baseUrl}/products

**IMPORTANT**: In the medical equipment industry, 95% of searches are by product SKU (article number). Each SKU is unique across manufacturers.

## Catalog Statistics

- Total products: ${productCount}
- Categories: ${categories.length} sections, ${categories.reduce((n, s) => n + s.children.length, 0)} subcategories
- Manufacturers: ${manufacturers.length}

## Categories

${categoryList}

## Manufacturers

${manufacturerList}

## Sample Products (most recent)

${productList}

## Key Pages

- Homepage: ${baseUrl}
- Product Catalog: ${baseUrl}/products
- 1-Click Quote (send a list as text, photo, Excel or CSV and get prices): ${baseUrl}/bulk-order
- About: ${baseUrl}/company/about
- FAQ: ${baseUrl}/faq
- Terms: ${baseUrl}/terms
- Sitemap: ${baseUrl}/sitemap.xml

## Technical Details

- Product URLs: ${baseUrl}/product/{manufacturer-slug}/{product-slug}
- Direct SKU access: ${baseUrl}/sku/{SKU}
- Search API: ${baseUrl}/api/products/search?q={query}
- Price list export: ${baseUrl}/api/products/export-pricelist
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
