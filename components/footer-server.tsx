import { getServerCompany } from '@/lib/server-company'
import { FooterClient } from './footer-client'
import { getDictionary } from '@/lib/translations'

export async function Footer() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return <FooterClient company={company} translations={dict.nav} />
}

