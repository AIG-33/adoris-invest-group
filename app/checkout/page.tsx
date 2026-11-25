import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutForm } from '@/components/checkout-form'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import { redirect } from 'next/navigation'
import { isVienaShop } from '@/lib/tenant'

export default async function CheckoutPage() {
  const company = await getServerCompany()
  if (isVienaShop(company)) redirect('/cart')
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutForm translations={dict.checkout} company={company} />
      </main>
      <Footer />
    </div>
  )
}
