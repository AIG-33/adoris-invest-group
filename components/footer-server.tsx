import { getServerCompany } from '@/lib/server-company'
import { FooterClient } from './footer-client'

export async function Footer() {
  const company = await getServerCompany()
  
  return <FooterClient company={company} />
}

