import { NextResponse } from 'next/server'
import { getCurrentCompany } from '@/lib/company'
import { sendSupplierEmail } from '@/lib/email'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const companyName = formData.get('companyName') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const notes = formData.get('notes') as string

    if (!file || !companyName || !contactName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!validExtensions.some(ext => fileExtension === ext)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload .xlsx, .xls, or .csv file' },
        { status: 400 }
      )
    }

    // Get company context
    const headers = new Headers(request.headers)
    const companyContext = await getCurrentCompany(headers)
    
    // Fetch full company details
    let fullCompanyContext = companyContext
    if (companyContext?.id) {
      const fullCompany = await prisma.company.findUnique({
        where: { id: companyContext.id },
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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Send email with attachment
    await sendSupplierEmail({
      to: fullCompanyContext?.email || process.env.EMAIL_FROM || '',
      supplierCompanyName: companyName,
      supplierContactName: contactName,
      supplierEmail: email,
      supplierPhone: phone || 'Not provided',
      notes: notes || 'No additional notes',
      fileBuffer: buffer,
      fileName: file.name,
      company: fullCompanyContext,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('Supplier submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit supplier request' },
      { status: 500 }
    )
  }
}

