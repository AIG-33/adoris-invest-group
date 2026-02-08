import { getServerCompany } from '@/lib/server-company'

/**
 * Component to add hreflang tags for proper language targeting.
 * 
 * Since each company/domain has a single language (not multi-language URLs),
 * we output only the actual language of this site + x-default.
 * Outputting both "en" and "ru" pointing to the same URL is invalid
 * and confuses Google.
 */
export async function HreflangTags({ path = '' }: { path?: string }) {
  const company = await getServerCompany()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const currentPath = path || ''
  const language = company?.language || 'en'
  
  return (
    <>
      <link rel="alternate" hreflang={language} href={`${baseUrl}${currentPath}`} />
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}${currentPath}`} />
    </>
  )
}

