// @ts-nocheck
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
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
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await params
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
    if (!name || !sku || !slug || price === undefined || price === null || !categoryId || !manufacturerId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            name: !!name,
            sku: !!sku,
            slug: !!slug,
            price: price !== undefined && price !== null,
            categoryId: !!categoryId,
            manufacturerId: !!manufacturerId,
          }
        },
        { status: 400 }
      )
    }

    // Validate price is a valid number
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: 'Invalid price. Must be a positive number.' },
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        sku,
        slug,
        description: description || null,
        price: priceNum,
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
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating product:', error)
    }
    
    // Handle Prisma errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU or slug already exists' },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

