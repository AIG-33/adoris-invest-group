import { getServerCompany } from '@/lib/server-company'
import { HeaderClient } from './header-client'
import { getDictionary } from '@/lib/translations'

export async function Header() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return <HeaderClient company={company} translations={dict.nav} />
}

