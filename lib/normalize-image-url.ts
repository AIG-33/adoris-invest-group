/**
 * Normalize image URL to ensure it starts with a slash or is a full URL
 * Handles cases where image paths are stored without leading slash in database
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '/placeholder.svg'
  }
  
  // If URL is already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Ensure URL starts with a slash
  return url.startsWith('/') ? url : `/${url}`
}

