import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware - lightweight, no Prisma
 * Company detection is done in server components via getServerCompany()
 * Legacy product URL redirects are handled by catch-all route
 */
export async function middleware(request: NextRequest) {
  // Just pass through - company detection happens in server components
  // This avoids Prisma in Edge Runtime which doesn't support it
  // Legacy product URLs are handled by app/product/[...slug]/page.tsx
  return NextResponse.next()
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

