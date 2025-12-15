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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Product ID from params:', productId)
    }

    const body = await request.json()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Request body:', JSON.stringify(body, null, 2))
    }

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

    // Check if product exists
    let existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    // If not found by ID, try to find by SKU (in case productId is actually a SKU)
    if (!existingProduct && productId.startsWith('prod_')) {
      const skuFromId = productId.replace('prod_', '')
      existingProduct = await prisma.product.findUnique({
        where: { sku: skuFromId },
      })
      
      if (existingProduct && process.env.NODE_ENV === 'development') {
        console.log('Found product by SKU:', skuFromId, 'Actual ID:', existingProduct.id)
      }
    }

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found', productId },
        { status: 404 }
      )
    }

    // Use the actual product ID from database
    const actualProductId = existingProduct.id

    // Check if SKU is unique (excluding current product)
    const existingSkuProduct = await prisma.product.findFirst({
      where: {
        sku,
        id: { not: actualProductId },
      },
    })

    if (existingSkuProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Check if slug is unique (excluding current product)
    const existingSlug = await prisma.product.findFirst({
      where: {
        slug,
        id: { not: actualProductId },
      },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: actualProductId },
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
    console.error('Error updating product:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error code:', error?.code)
    console.error('Error meta:', error?.meta)
    
    // Handle Prisma errors
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `${field} already exists`, code: 'P2002' },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found', code: 'P2025' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error?.message || 'Unknown error',
        code: error?.code,
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message,
          code: error?.code,
          meta: error?.meta,
        } : undefined
      },
      { status: 500 }
    )
  }
}

