/**
 * Retry wrapper for Prisma queries to handle connection pool timeouts
 * Uses exponential backoff for retries
 */
export async function retryPrismaQuery<T>(
  query: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 100
): Promise<T> {
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await query()
    } catch (error: any) {
      lastError = error

      // If it's a connection pool error, retry with exponential backoff
      if (error?.code === 'P2024' && attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), 2000) // Max 2 seconds
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // For other errors or last attempt, throw
      throw error
    }
  }

  throw lastError
}

