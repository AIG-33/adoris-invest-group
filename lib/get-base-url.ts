import { headers } from 'next/headers'

/**
 * Get the base URL from the current request's Host header.
 * Each domain (ivdgroup.eu, shop.samplify.org, etc.) gets its own base URL.
 * Falls back to NEXTAUTH_URL env var if Host header is unavailable.
 */
export async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || headersList.get('x-forwarded-host')
    const proto = headersList.get('x-forwarded-proto') || 'https'

    if (host) {
      return `${proto}://${host}`
    }
  } catch {
    // headers() not available (e.g. during build)
  }

  return process.env.NEXTAUTH_URL || 'https://localhost:3000'
}
