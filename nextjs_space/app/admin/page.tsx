import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminPanel } from '@/components/admin-panel'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session?.user as any)?.role !== 'admin') {
    redirect('/auth/login')
  }

  // Get statistics
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const pendingOrders = await prisma.order.count({
    where: { status: 'pending' },
  })

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AdminPanel
          stats={{
            totalProducts,
            totalOrders,
            pendingOrders,
          }}
          recentOrders={recentOrders}
        />
      </main>
      <Footer />
    </div>
  )
}
