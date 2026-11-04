import { NextResponse } from 'next/server'
import { getCurrentCompany } from '@/lib/company'
import { sendProductRfqEmail } from '@/lib/email'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    // 1-Click Quote sends every item that wasn't found in the catalog at once.
    const items: { sku: string; quantity: number }[] = Array.isArray(body.items)
      ? body.items
          .slice(0, 500)
          .map((i: any) => ({ sku: String(i?.sku || '').trim(), quantity: Math.max(1, Math.floor(Number(i?.quantity) || 1)) }))
          .filter((i: { sku: string }) => i.sku)
      : []
    const sku = items.length > 0
      ? `${items.length} item${items.length === 1 ? '' : 's'}`
      : String(body.sku || '').trim()
    const productName = items.length > 0
      ? `Not in catalog: ${items.map((i) => `${i.sku} × ${i.quantity}`).join('; ')}`
      : String(body.productName || '').trim()
    const quantity = items.length > 0
      ? items.reduce((sum, i) => sum + i.quantity, 0)
      : Number(body.quantity)
    const message = items.length > 0
      ? [String(body.message || '').trim(), items.map((i) => `${i.sku}\t${i.quantity}`).join('\n')].filter(Boolean).join('\n\n')
      : String(body.message || '').trim()
    const productUrl = String(body.productUrl || '').trim()

    if (!name || !email || !sku || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const headers = new Headers(request.headers)
    const companyContext = await getCurrentCompany(headers)

    let company = companyContext
    if (companyContext?.id) {
      const full = await prisma.company.findUnique({
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
      if (full) {
        company = {
          ...full,
          language: full.language as 'en' | 'ru',
          priceType: full.priceType as 'EU' | 'RU',
          googleAnalyticsId: null,
          yandexMetrikaId: null,
        }
      }
    }

    const to = company?.email || process.env.EMAIL_FROM || ''
    if (!to) {
      return NextResponse.json(
        { error: 'Company email not configured' },
        { status: 500 }
      )
    }

    await sendProductRfqEmail({
      to,
      customerName: name,
      customerEmail: email,
      sku,
      productName: productName || sku,
      quantity: Math.floor(quantity),
      message: message || undefined,
      productUrl: productUrl
        ? productUrl.startsWith('http')
          ? productUrl
          : `https://${company?.domain || 'localhost'}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`
        : undefined,
      company,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[rfq]', error)
    }
    return NextResponse.json({ error: 'Failed to send RFQ' }, { status: 500 })
  }
}
