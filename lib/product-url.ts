/**
 * Utility functions for generating product URLs
 * Format: /product/manufacturer-slug/productname-SKU
 */

interface Product {
  slug: string
  sku: string
  manufacturer: {
    slug: string
  }
}

/**
 * Generate product URL in format: /product/manufacturer-slug/productname-SKU
 */
export function getProductUrl(product: Product): string {
  const manufacturerSlug = product.manufacturer?.slug || 'unknown'
  const productSlug = product.slug || `${product.sku}`
  return `/product/${manufacturerSlug}/${productSlug}`
}

/**
 * Generate product URL from parts
 */
export function getProductUrlFromParts(
  manufacturerSlug: string,
  productSlug: string
): string {
  return `/product/${manufacturerSlug}/${productSlug}`
}

