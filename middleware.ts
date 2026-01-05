import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware - lightweight, no Prisma
 * Company detection is done in server components via getServerCompany()
 * Legacy product URL redirects are handled by catch-all route
 * Adds caching headers for better performance
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Add caching headers for static pages (ISR with revalidate)
  // These pages use ISR (revalidate: 300) so they can be cached
  if (pathname === '/' || pathname === '/products' || pathname.startsWith('/product/')) {
    // Cache for 60 seconds, allow stale content for 120 seconds while revalidating
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    )
  }

  // Add long-term caching for static assets
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

