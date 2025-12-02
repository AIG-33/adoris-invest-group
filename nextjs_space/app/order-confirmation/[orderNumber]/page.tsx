import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { prisma } from '@/lib/db'
import { OrderConfirmation } from '@/components/order-confirmation'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
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
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <OrderConfirmation order={order} />
      </main>
      <Footer />
    </div>
  )
}
