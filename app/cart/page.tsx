import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartContent } from '@/components/cart-content'

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main className="flex-1">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
