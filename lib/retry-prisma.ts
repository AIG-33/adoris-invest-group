/**
 * Retry wrapper for Prisma queries to handle connection pool timeouts
 * and other transient database errors common with Supabase + PgBouncer.
 *
 * Retryable Prisma error codes:
 *   P1001 — Can't reach database server
 *   P1002 — Database server timed out
 *   P1008 — Operations timed out
 *   P1017 — Server has closed the connection
 *   P2024 — Timed out fetching a new connection from the pool
 *   P2010 — Raw query failed (can be transient with PgBouncer)
 */

const RETRYABLE_CODES = new Set([
  'P1001', // Can't reach database server
  'P1002', // Database server timed out
  'P1008', // Operations timed out
  'P1017', // Server has closed the connection
  'P2024', // Timed out fetching a new connection from the pool
  'P2010', // Raw query failed
])

function isRetryable(error: any): boolean {
  // Prisma error codes
  if (error?.code && RETRYABLE_CODES.has(error.code)) return true

  // Generic connection / timeout errors
  const msg = (error?.message || '').toLowerCase()
  if (
    msg.includes('connection') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('econnrefused') ||
    msg.includes('econnreset') ||
    msg.includes('socket hang up') ||
    msg.includes('prepared statement') // PgBouncer "prepared statement does not exist"
  ) {
    return true
  }

  return false
}

export async function retryPrismaQuery<T>(
  query: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 200
): Promise<T> {
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await query()
    } catch (error: any) {
      lastError = error

      if (isRetryable(error) && attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), 3000)
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[retryPrisma] Attempt ${attempt}/${maxRetries} failed (${error?.code || 'unknown'}), retrying in ${delay}ms...`
          )
        }
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      throw error
    }
  }

  throw lastError
}
