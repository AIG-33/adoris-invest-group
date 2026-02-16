import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Determine base URL from request Host header so each domain gets correct robots.txt
  let baseUrl = process.env.NEXTAUTH_URL || 'https://localhost:3000'
  try {
    const headersList = await headers()
    const host = headersList.get('host') || headersList.get('x-forwarded-host')
    const proto = headersList.get('x-forwarded-proto') || 'https'
    if (host) {
      baseUrl = `${proto}://${host}`
    }
  } catch {
    // headers() not available during build
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/order-confirmation/',
          '/auth/',
          '/refresh-session/',
          // Note: legacy URLs (query_type_manufacturer, filter_manufacturer, add-to-cart)
          // are NOT blocked here — they are 301-redirected in middleware.ts instead.
          // Blocking in robots.txt would prevent Google from seeing the 301 redirects.
        ],
      },
      // Explicitly allow AI crawlers to access llms.txt and product pages
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/sku/', '/product/', '/products'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/sku/', '/product/', '/products'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/sku/', '/product/', '/products'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt', '/sku/', '/product/', '/products'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/sku/', '/product/', '/products'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
