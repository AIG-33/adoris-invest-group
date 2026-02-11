import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SupplierForm } from '@/components/supplier-form'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

export default async function SupplierPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-gray-950 via-[#0a0a0f] to-[#050508]">
        <SupplierForm company={company} translations={dict.supplier} />
      </main>
      <Footer />
    </div>
  )
}

