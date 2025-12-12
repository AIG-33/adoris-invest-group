import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// GET all exhibitions
export async function GET() {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(exhibitions)
  } catch (error) {
    console.error('Error fetching exhibitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' },
      { status: 500 }
    )
  }
}

// POST new exhibition (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startDate, endDate, location, images } = body

    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const exhibition = await prisma.exhibition.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        images: images || [],
      },
    })

    return NextResponse.json(exhibition, { status: 201 })
  } catch (error) {
    console.error('Error creating exhibition:', error)
    return NextResponse.json(
      { error: 'Failed to create exhibition' },
      { status: 500 }
    )
  }
}

// DELETE exhibition (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Exhibition ID is required' },
        { status: 400 }
      )
    }

    await prisma.exhibition.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exhibition:', error)
    return NextResponse.json(
      { error: 'Failed to delete exhibition' },
      { status: 500 }
    )
  }
}
