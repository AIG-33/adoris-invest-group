import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EditProductForm } from '@/components/edit-product-form'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session?.user as any)?.role !== 'admin') {
    redirect('/auth/login')
  }

  const { productId } = await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      manufacturer: true,
    },
  })

  if (!product) {
    notFound()
  }

  const [categories, manufacturers] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.manufacturer.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1">
        <EditProductForm
          product={{
            ...product,
            price: Number(product.price),
          }}
          categories={categories}
          manufacturers={manufacturers}
        />
      </main>
      <Footer />
    </div>
  )
}

