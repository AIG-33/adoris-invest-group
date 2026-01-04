/**
 * Normalize logo URL to ensure it starts with a slash
 * Handles cases where logo is stored without leading slash in database
 */
export function normalizeLogoUrl(logo: string | null | undefined): string {
  if (!logo) {
    return '/logo.png'
  }
  
  // If logo is already a full URL, return as is
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }
  
  // Ensure logo starts with a slash
  return logo.startsWith('/') ? logo : `/${logo}`
}

/**
 * Get full logo URL with base URL for SEO/structured data
 */
export function getFullLogoUrl(logo: string | null | undefined, baseUrl: string): string {
  const normalizedLogo = normalizeLogoUrl(logo)
  return `${baseUrl}${normalizedLogo}`
}

