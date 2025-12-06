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
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <AccountContent orders={orders} stats={stats} user={session.user} />
      <Footer />
    </div>
  )
}
