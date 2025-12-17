import { getServerCompany } from '@/lib/server-company'
import { HeaderClient } from './header-client'

export async function Header() {
  const company = await getServerCompany()
  
  return <HeaderClient company={company} />
}

