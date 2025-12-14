// @ts-nocheck
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

    // Build billing address string with all additional info
    const billingAddressParts = []
    if (address) billingAddressParts.push(address)
    if (city) billingAddressParts.push(city)
    if (postalCode) billingAddressParts.push(postalCode)
    if (country) billingAddressParts.push(country)
    if (company) billingAddressParts.push(`Company: ${company}`)
    if (vatId) billingAddressParts.push(`VAT ID: ${vatId}`)
    if (department) billingAddressParts.push(`Department: ${department}`)
    if (poNumber) billingAddressParts.push(`PO Number: ${poNumber}`)
    if (preferredDeliveryDate) billingAddressParts.push(`Preferred Delivery: ${preferredDeliveryDate}`)
    if (notes) billingAddressParts.push(`Notes: ${notes}`)
    if (paymentMethod) billingAddressParts.push(`Payment Method: ${paymentMethod}`)
    
    const billingAddress = billingAddressParts.length > 0 
      ? billingAddressParts.join(', ') 
      : null

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email, // Fixed: use customerEmail instead of email
        customerPhone: phone || null,
        billingAddress: billingAddress || null,
        subtotal,
        tax: vat, // tax field in schema maps to vat from form
        total,
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
