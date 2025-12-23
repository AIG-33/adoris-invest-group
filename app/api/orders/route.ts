// @ts-nocheck
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderPDF } from '@/lib/pdf-generator'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { getCurrentCompany } from '@/lib/company'
import type { CompanyConfig } from '@/lib/company-types'
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

    // Get company context based on domain from request headers
    const headers = new Headers(request.headers)
    const companyContext = await getCurrentCompany(headers)
    const companyId = companyContext?.id || null
    
    // Fetch full company details including showPrices
    let fullCompanyContext: CompanyConfig | null = companyContext
    if (companyId) {
      const fullCompany = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          id: true,
          name: true,
          slug: true,
          domain: true,
          logo: true,
          language: true,
          priceType: true,
          email: true,
          phone: true,
          address: true,
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          showPrices: true,
        },
      })
      if (fullCompany) {
        fullCompanyContext = {
          id: fullCompany.id,
          name: fullCompany.name,
          slug: fullCompany.slug,
          domain: fullCompany.domain,
          logo: fullCompany.logo,
          language: fullCompany.language as 'en' | 'ru',
          priceType: fullCompany.priceType as 'EU' | 'RU',
          email: fullCompany.email,
          phone: fullCompany.phone,
          address: fullCompany.address,
          primaryColor: fullCompany.primaryColor,
          secondaryColor: fullCompany.secondaryColor,
          accentColor: fullCompany.accentColor,
          showPrices: fullCompany.showPrices,
        }
      }
    }

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

    // If showPrices is false, set all prices to 0
    const shouldHidePrices = !fullCompanyContext?.showPrices
    const finalSubtotal = shouldHidePrices ? 0 : subtotal
    const finalDiscount = shouldHidePrices ? 0 : discount
    const finalTotal = shouldHidePrices ? 0 : total

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        companyId: companyId, // Add company context
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone && phone.trim() !== '' ? phone : null,
        billingAddress: billingAddress || null,
        subtotal: finalSubtotal,
        tax: 0, // VAT is always 0
        total: finalTotal,
        status: 'pending',
        items: {
          create: items?.map?.((item: any) => ({
            productId: item?.id,
            quantity: item?.quantity,
            price: shouldHidePrices ? 0 : (item?.price || 0),
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

    const pdfBuffer = await generateOrderPDF(order, body, fullCompanyContext)

    await sendOrderConfirmationEmail({
      to: email,
      orderNumber,
      customerName: `${firstName} ${lastName}`,
      pdfBuffer,
      company: fullCompanyContext,
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
