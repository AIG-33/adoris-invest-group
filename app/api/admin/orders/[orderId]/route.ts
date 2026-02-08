// @ts-nocheck
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// PUT - Update order status (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = params
    const body = await request.json()
    const { status } = body

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              include: {
                manufacturer: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating order status:', error)
    }
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

// DELETE - Delete order (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = params    await prisma.order.delete({
      where: { id: orderId },
    })    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting order:', error)
    }
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}