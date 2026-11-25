import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal-page'
import { CookieRevokePanel } from '@/components/viena-consent'
import { getServerCompany } from '@/lib/server-company'
import { isVienaShop } from '@/lib/tenant'
import { VIENA_COOKIES } from '@/lib/legal/viena'

export async function generateMetadata(): Promise<Metadata> {
  if (!isVienaShop(await getServerCompany())) return {}
  return {
    title: VIENA_COOKIES.title,
    description: VIENA_COOKIES.description,
    alternates: { canonical: '/cookies' },
  }
}

export default async function CookiesPage() {
  if (!isVienaShop(await getServerCompany())) notFound()
  return <LegalPage doc={VIENA_COOKIES} appendix={<CookieRevokePanel />} />
}
