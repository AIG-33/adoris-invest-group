import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AccountContent } from '@/components/account-content'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const userId = (session.user as any).id

  // Fetch user orders with items and products
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate stats
  const totalSpentSum = orders.reduce((sum: number, order: any) => {
    const orderTotal = Number(order.total) || 0
    return sum + orderTotal
  }, 0)
  
  const stats = {
    totalOrders: orders.length,
    totalSpent: Math.round(totalSpentSum * 100) / 100, // Round to 2 decimal places
    pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              My Account
            </h1>
            <p className="text-xl sm:text-2xl text-white/90">
              Manage your orders and profile settings
            </p>
          </div>
        </div>
      </section>
      <AccountContent orders={orders} stats={stats} user={session.user} />
      <Footer />
    </div>
  )
}
