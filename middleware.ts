import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware - lightweight, no Prisma
 * Company detection is done in server components via getServerCompany()
 * Legacy product URL redirects are handled by catch-all route
 * Cleans up legacy/spam URLs that pollute Google Search Console
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // ─── Legacy URL cleanup (31k+ canonical issues in GSC) ───

  // 1. Legacy WooCommerce-style filter URLs:
  //    ?query_type_manufacturer=or&filter_manufacturer=abbott,acros,...
  //    These generate 981+ unique URLs that Google crawls but can't index.
  //    → 301 redirect to clean /products page (preserves any valid params)
  if (searchParams.has('query_type_manufacturer') || searchParams.has('filter_manufacturer')) {
    const cleanUrl = new URL('/products', request.url)
    // Try to extract a single manufacturer from filter_manufacturer
    const filterMfg = searchParams.get('filter_manufacturer')
    if (filterMfg && !filterMfg.includes(',')) {
      // Single manufacturer — redirect to proper filter URL
      cleanUrl.searchParams.set('manufacturer', filterMfg)
    }
    return NextResponse.redirect(cleanUrl, 301)
  }

  // 2. URLs with ?add-to-cart=ID — should never be indexed
  //    e.g. /product/some-name?add-to-cart=35138
  //    → Strip the parameter and redirect to clean product URL
  if (searchParams.has('add-to-cart')) {
    const cleanUrl = new URL(pathname, request.url)
    // Copy all params except add-to-cart
    searchParams.forEach((value, key) => {
      if (key !== 'add-to-cart') {
        cleanUrl.searchParams.set(key, value)
      }
    })
    return NextResponse.redirect(cleanUrl, 301)
  }

  // 3. Homepage with ?category= — malformed URL
  //    e.g. /?category=jena-bioscience
  //    → Redirect to /products?category=...
  if (pathname === '/' && searchParams.has('category')) {
    const cleanUrl = new URL('/products', request.url)
    cleanUrl.searchParams.set('category', searchParams.get('category')!)
    return NextResponse.redirect(cleanUrl, 301)
  }

  // ─── Caching headers ───

  const response = NextResponse.next()

  // Add caching headers for static pages (ISR with revalidate)
  if (pathname === '/' || pathname === '/products' || pathname.startsWith('/product/')) {
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
