import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal-page'
import { getServerCompany } from '@/lib/server-company'
import { isVienaShop } from '@/lib/tenant'
import { VIENA_PRIVACY } from '@/lib/legal/viena'

export async function generateMetadata(): Promise<Metadata> {
  if (!isVienaShop(await getServerCompany())) return {}
  return {
    title: VIENA_PRIVACY.title,
    description: VIENA_PRIVACY.description,
    alternates: { canonical: '/privacy' },
  }
}

export default async function PrivacyPage() {
  if (!isVienaShop(await getServerCompany())) notFound()
  return <LegalPage doc={VIENA_PRIVACY} />
}
