import { getServerCompany } from '@/lib/server-company'

/**
 * Component to add hreflang tags for proper language targeting
 * This helps search engines understand language versions of pages
 */
export async function HreflangTags({ path = '' }: { path?: string }) {
  const company = await getServerCompany()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const currentPath = path || ''
  
  return (
    <>
      <link rel="alternate" hreflang="en" href={`${baseUrl}${currentPath}`} />
      <link rel="alternate" hreflang="ru" href={`${baseUrl}${currentPath}`} />
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}${currentPath}`} />
    </>
  )
}

