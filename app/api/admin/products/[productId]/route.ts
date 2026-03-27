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
  let productId: string | undefined
  let body: any = null
  
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const paramsData = await params
    productId = paramsData.productId
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Product ID from params:', productId)
    }

    body = await request.json()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Request body:', JSON.stringify(body, null, 2))
    }

    const {
      name,
      sku,
      slug,
      description,
      price,
      priceEU,
      priceRU,
      image,
      categoryId,
      manufacturerId,
    } = body

    // Validate required fields
    // priceEU is required, priceRU is optional
    const finalPriceEU = priceEU !== undefined ? priceEU : (price !== undefined ? price : null)
    if (!name || !sku || !slug || finalPriceEU === null || finalPriceEU === undefined || !categoryId || !manufacturerId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            name: !!name,
            sku: !!sku,
            slug: !!slug,
            priceEU: finalPriceEU !== null && finalPriceEU !== undefined,
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
    if (!existingProduct) {
      if (productId.startsWith('prod_')) {
        const skuFromId = productId.replace('prod_', '')
        console.log('Product not found by ID, trying SKU:', skuFromId)
        existingProduct = await prisma.product.findUnique({
          where: { sku: skuFromId },
        })
        
        if (existingProduct) {
          console.log('✅ Found product by SKU:', skuFromId, 'Actual ID:', existingProduct.id)
        } else {
          console.log('❌ Product not found by SKU either:', skuFromId)
        }
      } else {
        // Try to find by SKU directly (without prod_ prefix)
        console.log('Product not found by ID, trying SKU directly:', productId)
        existingProduct = await prisma.product.findUnique({
          where: { sku: productId },
        })
        
        if (existingProduct) {
          console.log('✅ Found product by SKU:', productId, 'Actual ID:', existingProduct.id)
        }
      }
    }

    if (!existingProduct) {
      console.error('❌ Product not found:', {
        productId,
        triedAsId: true,
        triedAsSku: productId.startsWith('prod_') || true,
      })
      return NextResponse.json(
        { 
          error: 'Product not found',
          productId,
          message: `Product with ID/SKU "${productId}" was not found in the database`
        },
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

    // Prepare update data
    const updateData: any = {
      name,
      sku,
      slug,
      description: description || null,
      priceEU: priceEUNum,
      priceRU: priceRUNum,
      price: priceEUNum,
      categoryId,
      manufacturerId,
    }

    // Handle image field - only update if provided
    // If image is empty string or null, set to empty string (not null) to avoid constraint violation
    if (image !== undefined) {
      updateData.image = image && image.trim() !== '' ? image.trim() : ''
    }
    // If image is not provided in the request, don't update it (keep existing value)

    const updatedProduct = await prisma.product.update({
      where: { id: actualProductId },
      data: updateData,
      include: {
        category: true,
        manufacturer: true,
      },
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error: any) {
    // Always log errors for debugging
    console.error('❌ Error updating product:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
      meta: error?.meta,
      productId: productId || 'not defined',
      body: body ? (process.env.NODE_ENV === 'development' ? body : 'defined') : 'not defined',
    })
    
    // Handle Prisma errors
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { 
          error: `${field} already exists`, 
          code: 'P2002',
          field: field,
          target: error?.meta?.target
        },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found', code: 'P2025' },
        { status: 404 }
      )
    }

    // Return detailed error in development, generic in production
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN',
        name: error?.name,
        details: {
          message: error?.message,
          code: error?.code,
          name: error?.name,
          meta: error?.meta,
          productId: productId || 'not defined',
        }
      },
      { status: 500 }
    )
  }
}

