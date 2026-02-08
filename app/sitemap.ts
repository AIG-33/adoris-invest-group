import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductUrl } from '@/lib/product-url'
import { retryPrismaQuery } from '@/lib/retry-prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const company = await getServerCompany()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bulk-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/company/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/supplier`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Get all products, categories, and manufacturers in parallel
  const [products, categories, manufacturers] = await Promise.all([
    retryPrismaQuery(() => prisma.product.findMany({
      select: {
        slug: true,
        sku: true,
        updatedAt: true,
        manufacturer: { select: { slug: true } },
      },
      take: 50000,
    })),
    retryPrismaQuery(() => prisma.category.findMany({
      select: { slug: true },
    })),
    retryPrismaQuery(() => prisma.manufacturer.findMany({
      select: { slug: true },
    })),
  ])

  // Product pages — canonical URL format
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}${getProductUrl(product as any)}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // SKU direct access pages — CRITICAL for B2B SEO
  // 95% of users search by SKU, so /sku/XXXXX must be indexed
  const skuPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/sku/${encodeURIComponent(product.sku)}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9, // Higher priority than product pages — this is the primary search entry point
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Manufacturer pages — important for SEO
  const manufacturerPages: MetadataRoute.Sitemap = manufacturers.map((m) => ({
    url: `${baseUrl}/products?manufacturer=${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...skuPages,
    ...productPages,
    ...categoryPages,
    ...manufacturerPages,
  ]
}

