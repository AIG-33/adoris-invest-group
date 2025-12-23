import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// GET - Get company by ID
export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId } = params

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ company })
  } catch (error) {
    logger.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

// PUT - Update company
export async function PUT(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId } = params
    const body = await request.json()

    const {
      name,
      slug,
      domain,
      logo,
      language,
      priceType,
      email,
      phone,
      address,
      primaryColor,
      secondaryColor,
      accentColor,
      showPrices,
    } = body

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Validate language if provided
    if (language && !['en', 'ru'].includes(language)) {
      return NextResponse.json(
        { error: 'Language must be "en" or "ru"' },
        { status: 400 }
      )
    }

    // Validate priceType if provided
    if (priceType && !['EU', 'RU'].includes(priceType)) {
      return NextResponse.json(
        { error: 'PriceType must be "EU" or "RU"' },
        { status: 400 }
      )
    }

    // Validate color format (hex)
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return NextResponse.json(
        { error: 'Primary color must be a valid hex color (e.g., #333333)' },
        { status: 400 }
      )
    }
    if (secondaryColor && !colorRegex.test(secondaryColor)) {
      return NextResponse.json(
        { error: 'Secondary color must be a valid hex color (e.g., #666666)' },
        { status: 400 }
      )
    }
    if (accentColor && !colorRegex.test(accentColor)) {
      return NextResponse.json(
        { error: 'Accent color must be a valid hex color (e.g., #000000)' },
        { status: 400 }
      )
    }

    // Build update data (only include provided fields)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (domain !== undefined) updateData.domain = domain
    if (logo !== undefined) updateData.logo = logo || null
    if (language !== undefined) updateData.language = language
    if (priceType !== undefined) updateData.priceType = priceType
    if (email !== undefined) updateData.email = email || null
    if (phone !== undefined) updateData.phone = phone || null
    if (address !== undefined) updateData.address = address || null
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor
    if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor
    if (accentColor !== undefined) updateData.accentColor = accentColor
    if (showPrices !== undefined) updateData.showPrices = showPrices

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    })

    return NextResponse.json({ company: updatedCompany })
  } catch (error: any) {
    logger.error('Error updating company:', error)

    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `Duplicate value for ${field}. This ${field} already exists.` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update company', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete company
export async function DELETE(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId } = params

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    await prisma.company.delete({
      where: { id: companyId },
    })

    return NextResponse.json({ success: true, message: 'Company deleted successfully' })
  } catch (error: any) {
    logger.error('Error deleting company:', error)

    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete company. It is referenced by products or orders.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete company', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
