import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimize Prisma client for serverless (Vercel) with connection pooling
// For Supabase: Use connection pooler URL (port 6543 or pooler.supabase.com)
// Connection string should include: ?pgbouncer=true&connection_limit=1
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings for serverless
  // connection_limit: 1 is required for PgBouncer in transaction mode
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
