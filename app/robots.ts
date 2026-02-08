import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

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

