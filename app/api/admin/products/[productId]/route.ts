// @ts-nocheck
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = params

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        manufacturer: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error)
    }
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = params
    const body = await request.json()

    const {
      name,
      sku,
      slug,
      description,
      price,
      image,
      categoryId,
      manufacturerId,
    } = body

    // Validate required fields
    if (!name || !sku || !slug || !price || !categoryId || !manufacturerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if SKU is unique (excluding current product)
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku,
        id: { not: productId },
      },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Check if slug is unique (excluding current product)
    const existingSlug = await prisma.product.findFirst({
      where: {
        slug,
        id: { not: productId },
      },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        sku,
        slug,
        description: description || null,
        price: parseFloat(price),
        image: image || null,
        categoryId,
        manufacturerId,
      },
      include: {
        category: true,
        manufacturer: true,
      },
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating product:', error)
    }
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

