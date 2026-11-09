import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimize Prisma client for serverless (Vercel) with connection pooling
// For Supabase: Use connection pooler URL (port 6543 or pooler.supabase.com)
// Connection string should include: ?pgbouncer=true&connection_limit=1
const base = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings for serverless
  // connection_limit: 1 is required for PgBouncer in transaction mode
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = base

const PRODUCT_READS = new Set([
  'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy',
])

/**
 * Unfiltered client for admin screens and imports: they must also see unpublished products
 * (SKU and slug are unique across all of them).
 */
export const prismaAll = base

/**
 * Public client: products with "unpublishedAt" set (removed from the public price list by the
 * RFQ admin, restorable) are hidden from every product read. Pass `unpublishedAt` in `where`
 * to opt out. Relation filters, `_count` and raw SQL must filter on it themselves.
 */
export const prisma = base.$extends({
  query: {
    product: {
      async $allOperations({ operation, args, query }) {
        if (PRODUCT_READS.has(operation)) {
          const a = args as { where?: Record<string, unknown> }
          if (!a.where || !('unpublishedAt' in a.where)) a.where = { ...a.where, unpublishedAt: null }
        }
        return query(args)
      },
    },
  },
})
