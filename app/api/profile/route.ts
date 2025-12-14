// @ts-nocheck
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - получить профиль пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const userEmail = session.user.email

    // Use id if available, otherwise use email
    if (!userId || userId === '') {
      if (!userEmail) {
        return NextResponse.json(
          { error: 'User ID or email is required' },
          { status: 400 }
        )
      }
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          vatId: true,
          phone: true,
          address: true,
          city: true,
          postalCode: true,
          country: true,
          department: true,
          paymentMethod: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ profile: user })
    }

    // Find user by id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        vatId: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        department: true,
        paymentMethod: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile: user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - обновить профиль пользователя
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const userEmail = session.user.email

    // Determine the actual user id to use
    let actualUserId = userId

    // If userId is empty or undefined, find user by email
    if (!userId || userId === '') {
      if (!userEmail) {
        return NextResponse.json(
          { error: 'User ID or email is required' },
          { status: 400 }
        )
      }
      // Find user by email first to get id
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      })

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Use the found user id
      actualUserId = existingUser.id
    }

    const body = await request.json()

    const {
      firstName,
      lastName,
      company,
      vatId,
      phone,
      address,
      city,
      postalCode,
      country,
      department,
      paymentMethod,
    } = body

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: actualUserId },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        company: company || null,
        vatId: vatId || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        country: country || null,
        department: department || null,
        paymentMethod: paymentMethod || null,
        // Update name if firstName or lastName provided
        name: firstName && lastName 
          ? `${firstName} ${lastName}` 
          : firstName || lastName || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        vatId: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        department: true,
        paymentMethod: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      profile: updatedUser 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

