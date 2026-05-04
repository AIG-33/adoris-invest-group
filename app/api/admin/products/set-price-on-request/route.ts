import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { getServerCompany } from '@/lib/server-company'

export const dynamic = 'force-dynamic'

// POST - Set all products to price on request (set priceEU and priceRU to 0)
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const company = await getServerCompany()
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Update all products for this company to have price 0 (price on request)
    const result = await prisma.product.updateMany({
      where: {
        companyId: company.id,
      },
      data: {
        priceEU: 0,
        priceRU: 0,
        price: 0,
      },
    })

    logger.info(`Set ${result.count} products to price on request for company ${company.id}`)

    revalidateTag('products')
    revalidateTag('featured-products')

    return NextResponse.json({
      success: true,
      message: `Successfully set ${result.count} products to "Price on Request"`,
      count: result.count,
    })
  } catch (error) {
    logger.error('Error setting products to price on request:', error)
    return NextResponse.json(
      { error: 'Failed to set products to price on request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

