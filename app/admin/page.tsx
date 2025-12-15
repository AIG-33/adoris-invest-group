import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminPanel } from '@/components/admin-panel'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session?.user as any)?.role !== 'admin') {
      redirect('/auth/login')
    }

    const [totalProducts, totalOrders, allOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ select: { status: true } }),
    ])
    const pendingOrders = allOrders.filter((o: any) => String(o.status) === 'pending').length

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                manufacturer: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Fetch all exhibitions
    let exhibitions = []
    try {
      exhibitions = await prisma.exhibition.findMany({
        orderBy: { startDate: 'desc' },
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching exhibitions:', error)
      }
      exhibitions = []
    }

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <AdminPanel
            stats={{
              totalProducts,
              totalOrders,
              pendingOrders,
            }}
            recentOrders={recentOrders || []}
            exhibitions={exhibitions || []}
          />
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin page error:', error)
    }
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Error Loading Admin Panel</h1>
            <p className="text-red-700">An error occurred while loading the admin panel. Please try refreshing the page.</p>
            <p className="text-sm text-red-600 mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}
