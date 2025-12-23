import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartContent } from '@/components/cart-content'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

export default async function CartPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <CartContent translations={{...dict.cart, common: dict.common}} company={company} />
      </main>
      <Footer />
    </div>
  )
}
