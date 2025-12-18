import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EditProductForm } from '@/components/edit-product-form'
import { prisma } from '@/lib/db'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

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

  // Try to find product by ID first
  let product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      manufacturer: true,
    },
  })

  // If not found and starts with prod_, try by SKU
  if (!product && productId.startsWith('prod_')) {
    const sku = productId.replace('prod_', '')
    product = await prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        manufacturer: true,
      },
    })
  }

  // If still not found, try by SKU directly
  if (!product) {
    product = await prisma.product.findUnique({
      where: { sku: productId },
      include: {
        category: true,
        manufacturer: true,
      },
    })
  }

  if (!product) {
    console.error('Product not found for edit:', productId)
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

  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header translations={dict.nav} />
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
      <Footer translations={dict.footer} />
    </div>
  )
}

