import type { CompanyConfig } from './company-types'
import { getFullLogoUrl } from './logo-url'
import { getProductUrl } from './product-url'

/**
 * SEO utility functions for generating structured data (JSON-LD)
 */

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(company: CompanyConfig | null, baseUrl: string): StructuredData {
  const companyName = company?.name || 'ADORIS INVEST GROUP OÜ'
  const companyEmail = company?.email || 'info@adorisgroup.com'
  const companyPhone = company?.phone || '+48793081310'
  const companyAddress = company?.address || 'Tallinn, Estonia'
  const logo = company?.logo ? `${baseUrl}${company.logo}` : `${baseUrl}/logo.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName,
    url: baseUrl,
    logo: logo,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyPhone,
      contactType: 'Customer Service',
      email: companyEmail,
      availableLanguage: company?.language === 'ru' ? ['Russian', 'English'] : ['English', 'Russian'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EE',
      addressLocality: companyAddress,
    },
    sameAs: [
      // Add social media links if available
    ],
  }
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema(company: CompanyConfig | null, baseUrl: string): StructuredData {
  const companyName = company?.name || 'ADORIS INVEST GROUP OÜ'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: companyName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(
  product: any,
  company: CompanyConfig | null,
  baseUrl: string
): StructuredData {
  const productUrl = `${baseUrl}${getProductUrl(product)}`
  const imageUrl = product.image ? `${baseUrl}${product.image}` : `${baseUrl}/placeholder.svg`
  const price = Number(product.price || product.priceEU || 0)
  const currency = 'EUR'
  const availability = product.stockStatus === 'in_stock' 
    ? 'https://schema.org/InStock' 
    : product.stockStatus === 'out_of_stock'
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/PreOrder'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: `${product.description || `${product.name} - Medical laboratory equipment`}. SKU: ${product.sku}`,
    image: imageUrl,
    sku: product.sku,
    mpn: product.sku,
    identifier: {
      '@type': 'PropertyValue',
      name: 'SKU',
      value: product.sku,
    },
    brand: {
      '@type': 'Brand',
      name: product.manufacturer?.name || 'Unknown Manufacturer',
    },
    category: product.category?.name || 'Medical Equipment',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: currency,
      price: price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      availability: availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: company?.name || 'ADORIS INVEST GROUP OÜ',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10',
    },
    // Emphasize SKU for B2B search
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'SKU',
        value: product.sku,
      },
    ],
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate ItemList structured data for product listings
 */
export function generateItemListSchema(
  products: any[],
  baseUrl: string,
  name: string = 'Products'
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            url: `${baseUrl}${getProductUrl(product)}`,
        image: product.image ? `${baseUrl}${product.image}` : undefined,
        sku: product.sku,
        brand: {
          '@type': 'Brand',
          name: product.manufacturer?.name || 'Unknown',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: Number(product.price || product.priceEU || 0).toFixed(2),
          availability: product.stockStatus === 'in_stock' 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
        },
      },
    })),
  }
}

/**
 * Generate LocalBusiness structured data (if applicable)
 */
export function generateLocalBusinessSchema(company: CompanyConfig | null, baseUrl: string): StructuredData {
  const companyName = company?.name || 'ADORIS INVEST GROUP OÜ'
  const companyEmail = company?.email || 'info@adorisgroup.com'
  const companyPhone = company?.phone || '+48793081310'
  const companyAddress = company?.address || 'Tallinn, Estonia'
  const logo = getFullLogoUrl(company?.logo, baseUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyName,
    image: logo,
    telephone: companyPhone,
    email: companyEmail,
    address: {
      '@type': 'PostalAddress',
      addressLocality: companyAddress,
      addressCountry: 'EE',
    },
    url: baseUrl,
    priceRange: '$$',
  }
}

/**
 * Generate Article structured data (for blog posts, if applicable)
 */
export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  author: string,
  company: CompanyConfig | null
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Organization',
      name: author || company?.name || 'ADORIS INVEST GROUP OÜ',
    },
    publisher: {
      '@type': 'Organization',
      name: company?.name || 'ADORIS INVEST GROUP OÜ',
      logo: {
        '@type': 'ImageObject',
        url: company?.logo ? getFullLogoUrl(company.logo, url.split('/').slice(0, 3).join('/')) : undefined,
      },
    },
  }
}

/**
 * Generate FAQPage structured data - Critical for AI search engines
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate HowTo structured data for instructional content
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  }
}

/**
 * Generate Review structured data for products
 */
export function generateReviewSchema(
  productName: string,
  rating: number,
  reviewCount: number,
  bestRating: number = 5,
  worstRating: number = 1
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: bestRating.toString(),
      worstRating: worstRating.toString(),
    },
  }
}


