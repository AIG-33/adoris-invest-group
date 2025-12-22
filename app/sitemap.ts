import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getProductUrl } from '@/lib/product-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const company = await getServerCompany()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const language = company?.language || 'en'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/company/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/company/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exhibitions`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Get all products
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      sku: true,
      updatedAt: true,
      manufacturer: {
        select: {
          slug: true,
        },
      },
    },
    take: 10000, // Limit to prevent too large sitemap
  })

  const productPages = products.map((product) => ({
    url: `${baseUrl}${getProductUrl(product as any)}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  })

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}

