// @ts-nocheck
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderPDF } from '@/lib/pdf-generator'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { getCompany } from '@/lib/server-company'
import { logger } from '@/lib/logger'

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

    // Get company context based on domain
    const companyContext = await getCompany()
    const companyId = companyContext?.id || null

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

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

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        companyId: companyId, // Add company context
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone && phone.trim() !== '' ? phone : null,
        billingAddress: billingAddress || null,
        subtotal,
        tax: vat,
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

    const pdfBuffer = await generateOrderPDF(order, body)

    await sendOrderConfirmationEmail({
      to: email,
      orderNumber,
      customerName: `${firstName} ${lastName}`,
      pdfBuffer,
    })

    return NextResponse.json({ success: true, orderNumber }, { status: 201 })
  } catch (error) {
    logger.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
