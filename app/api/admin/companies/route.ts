import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// GET - Get all companies
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ companies })
  } catch (error) {
    logger.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST - Create new company
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Validate required fields
    if (!name || !slug || !domain) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, domain' },
        { status: 400 }
      )
    }

    // Validate language
    if (language && !['en', 'ru'].includes(language)) {
      return NextResponse.json(
        { error: 'Language must be "en" or "ru"' },
        { status: 400 }
      )
    }

    // Validate priceType
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

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        domain,
        logo: logo || null,
        language: language || 'en',
        priceType: priceType || 'EU',
        email: email || null,
        phone: phone || null,
        address: address || null,
        primaryColor: primaryColor || '#333333',
        secondaryColor: secondaryColor || '#666666',
        accentColor: accentColor || '#000000',
        showPrices: showPrices !== undefined ? showPrices : true,
      },
    })

    return NextResponse.json({ company }, { status: 201 })
  } catch (error: any) {
    logger.error('Error creating company:', error)
    
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `Duplicate value for ${field}. This ${field} already exists.` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create company', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
