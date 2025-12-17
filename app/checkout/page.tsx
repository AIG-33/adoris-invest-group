import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutForm } from '@/components/checkout-form'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

export default async function CheckoutPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutForm translations={dict.checkout} />
      </main>
      <Footer />
    </div>
  )
}
