import { unstable_cache } from 'next/cache'
import { prisma } from './db'
import { retryPrismaQuery } from './retry-prisma'

/**
 * All "reference data" queries cached at the Next.js Data Cache layer.
 *
 * Cache invalidation tags:
 *  - 'manufacturers'    — bumped when a manufacturer is created/updated/deleted
 *  - 'categories'       — bumped when a category is created/updated/deleted
 *  - 'products-count'   — bumped when products are imported / mass-updated
 *  - 'featured-products'— bumped when product.featured changes
 *  - 'products'         — superset, bumped on any product write
 *
 * Call `revalidateTag('<tag>')` from the relevant admin API routes after writes.
 */

export const getCachedManufacturersWithLogo = unstable_cache(
  async () =>
    retryPrismaQuery(() =>
      prisma.manufacturer.findMany({
        where: { logo: { not: null } },
        select: { name: true, slug: true, logo: true },
        orderBy: { name: 'asc' },
      })
    ),
  ['manufacturers-with-logo'],
  { revalidate: 3600, tags: ['manufacturers'] }
)

export const getCachedManufacturersList = unstable_cache(
  async () =>
    retryPrismaQuery(() =>
      prisma.manufacturer.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      })
    ),
  ['manufacturers-list'],
  { revalidate: 3600, tags: ['manufacturers'] }
)

export type CachedCategoryWithCount = {
  id: string
  name: string
  slug: string
  productCount: number
}

/**
 * Categories with product counts via a single GROUP BY query
 * (avoids Prisma's N+1 with `_count`).
 */
export const getCachedCategoriesWithCount = unstable_cache(
  async (): Promise<CachedCategoryWithCount[]> => {
    const rows = await retryPrismaQuery(
      () => prisma.$queryRaw<Array<{ id: string; name: string; slug: string; productCount: bigint }>>`
        SELECT c.id, c.name, c.slug, COUNT(p.id) AS "productCount"
        FROM "Category" c
        LEFT JOIN "Product" p ON p."categoryId" = c.id
        GROUP BY c.id, c.name, c.slug
        ORDER BY c.name ASC
      `
    )
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      productCount: Number(r.productCount),
    }))
  },
  ['categories-with-count'],
  { revalidate: 1800, tags: ['categories', 'products-count'] }
)

export const getCachedFeaturedProducts = unstable_cache(
  async () =>
    retryPrismaQuery(() =>
      prisma.product.findMany({
        where: { featured: true },
        select: {
          id: true,
          name: true,
          sku: true,
          slug: true,
          priceEU: true,
          priceRU: true,
          image: true,
          category: { select: { id: true, name: true, slug: true } },
          manufacturer: { select: { id: true, name: true, slug: true, logo: true } },
        },
        take: 6,
        orderBy: { createdAt: 'desc' },
      })
    ),
  ['featured-products'],
  { revalidate: 600, tags: ['featured-products', 'products'] }
)
