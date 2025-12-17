import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCompanyByDomain } from '@/lib/company'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const domain = host.split(':')[0].toLowerCase()

  // Get company by domain
  const company = await getCompanyByDomain(domain)

  // If company not found, continue with default (for development)
  if (!company) {
    return NextResponse.next()
  }

  // Add company info to request headers for use in pages
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-company-id', company.id)
  requestHeaders.set('x-company-slug', company.slug)
  requestHeaders.set('x-company-language', company.language)
  requestHeaders.set('x-company-price-type', company.priceType)
  requestHeaders.set('x-company-logo', company.logo || '')
  requestHeaders.set('x-company-primary-color', company.primaryColor || '#333333')
  requestHeaders.set('x-company-secondary-color', company.secondaryColor || '#666666')
  requestHeaders.set('x-company-accent-color', company.accentColor || '#000000')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
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

