import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { prisma } from '@/lib/db'
import { OrderConfirmation } from '@/components/order-confirmation'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
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

  // Get company context for email display
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={dict.nav} />
      <main className="flex-1">
        <OrderConfirmation order={order} company={company} translations={dict.orderConfirmation} />
      </main>
      <Footer translations={dict.footer} />
    </div>
  )
}
