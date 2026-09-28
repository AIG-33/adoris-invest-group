import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  MANUFACTURER_SLUG_REDIRECTS,
  CATEGORY_SLUG_REDIRECTS,
} from '@/lib/legacy-redirects'

/**
 * Middleware - lightweight, no Prisma
 * Company detection is done in server components via getServerCompany()
 * Legacy product URL redirects are handled by catch-all route
 * Cleans up legacy/spam URLs that pollute Google Search Console
 *
 * NOTE: Full WooCommerce/WP product-level 301 map still needs a GSC export
 * from the user. We only cover structural patterns here — do not invent
 * fake /product/:old → /product/:mfr/:slug mappings.
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
      const canonical = MANUFACTURER_SLUG_REDIRECTS[filterMfg] || filterMfg
      cleanUrl.searchParams.set('manufacturer', canonical)
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
  //    → Redirect to /products?category=... (with slug remap if needed)
  if (pathname === '/' && searchParams.has('category')) {
    const raw = searchParams.get('category')!
    const canonical = CATEGORY_SLUG_REDIRECTS[raw] || raw
    const cleanUrl = new URL('/products', request.url)
    cleanUrl.searchParams.set('category', canonical)
    return NextResponse.redirect(cleanUrl, 301)
  }

  // 4. Remap retired manufacturer / category query slugs on /products
  if (pathname === '/products') {
    const mfg = searchParams.get('manufacturer')
    const cat = searchParams.get('category')
    const mfgCanon = mfg ? MANUFACTURER_SLUG_REDIRECTS[mfg] : undefined
    const catCanon = cat ? CATEGORY_SLUG_REDIRECTS[cat] : undefined
    if (mfgCanon || catCanon) {
      const cleanUrl = new URL('/products', request.url)
      searchParams.forEach((value, key) => {
        if (key === 'manufacturer' && mfgCanon) {
          cleanUrl.searchParams.set(key, mfgCanon)
        } else if (key === 'category' && catCanon) {
          cleanUrl.searchParams.set(key, catCanon)
        } else {
          cleanUrl.searchParams.set(key, value)
        }
      })
      return NextResponse.redirect(cleanUrl, 301)
    }
  }

  // 5. WooCommerce / WordPress structural paths (partial — no invented product maps)
  //    /shop → /products
  if (pathname === '/shop' || pathname === '/shop/') {
    return NextResponse.redirect(new URL('/products', request.url), 301)
  }

  //    /product-category/:slug → /products?category=:mapped or /products
  const productCategoryMatch = pathname.match(/^\/product-category\/([^/]+)\/?$/)
  if (productCategoryMatch) {
    const rawSlug = decodeURIComponent(productCategoryMatch[1])
    const canonical = CATEGORY_SLUG_REDIRECTS[rawSlug] || rawSlug
    const cleanUrl = new URL('/products', request.url)
    // Only attach ?category= when we know the slug (mapped or pass-through).
    // Unknown WP slugs still land on /products rather than a soft-404 category.
    if (CATEGORY_SLUG_REDIRECTS[rawSlug] || canonical) {
      cleanUrl.searchParams.set('category', canonical)
    }
    return NextResponse.redirect(cleanUrl, 301)
  }

  // ─── Caching headers ───

  const response = NextResponse.next()

  // Cache homepage + listing. Do NOT force CDN cache on /product/* —
  // missing products must return a real HTTP 404 (soft-404s get sticky
  // when a 200 + NEXT_NOT_FOUND shell is cached at the edge).
  if (pathname === '/' || pathname === '/products') {
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
