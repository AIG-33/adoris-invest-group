import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderPDF } from '@/lib/pdf-generator'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      company,
      vatId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      department,
      poNumber,
      preferredDeliveryDate,
      notes,
      paymentMethod,
      items,
      subtotal,
      discount,
      vat,
      total,
      userId,
    } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName: `${firstName} ${lastName}`,
        email,
        phone,
        company,
        vatId,
        address: `${address}, ${city}, ${postalCode}, ${country}`,
        city,
        postalCode,
        country,
        department,
        poNumber,
        preferredDeliveryDate,
        notes,
        subtotal,
        discount,
        vat,
        total,
        paymentMethod,
        status: 'pending',
        items: {
          create: items?.map?.((item: any) => ({
            productId: item?.id,
            quantity: item?.quantity,
            price: item?.price,
          })) || [],
        },
      },
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
      },
    })

    // Generate PDF
    const pdfBuffer = await generateOrderPDF(order, body)

    // Send email with PDF
    await sendOrderConfirmationEmail({
      to: email,
      orderNumber,
      customerName: `${firstName} ${lastName}`,
      pdfBuffer,
    })

    return NextResponse.json({ success: true, orderNumber }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
