import { NextResponse } from 'next/server'
import { getCurrentCompany } from '@/lib/company'
import { sendCartQuoteRequestEmail } from '@/lib/email'
import { CART_QUOTE_RECIPIENT, hasCartQuote, type CartQuoteItem } from '@/lib/cart-quote'

export const dynamic = 'force-dynamic'

const MAX_ITEMS = 300

function text(value: unknown, max: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
}

export async function POST(request: Request) {
  try {
    const company = await getCurrentCompany(new Headers(request.headers))
    if (!hasCartQuote(company)) {
      return NextResponse.json({ error: 'Not available' }, { status: 404 })
    }

    const body = await request.json()
    const email = text(body?.email, 200)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const items: CartQuoteItem[] = (Array.isArray(body?.items) ? body.items : [])
      .slice(0, MAX_ITEMS)
      .map((i: any) => {
        const url = text(i?.url, 500)
        return {
          sku: text(i?.sku, 100),
          name: text(i?.name, 300),
          manufacturer: text(i?.manufacturer, 120),
          quantity: Math.min(1_000_000, Math.max(1, Math.floor(Number(i?.quantity) || 1))),
          url: url.startsWith('/') && !url.startsWith('//') ? url : undefined,
        }
      })
      .filter((i: CartQuoteItem) => i.sku || i.name)

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    await sendCartQuoteRequestEmail({
      to: CART_QUOTE_RECIPIENT,
      customerEmail: email,
      items,
      company,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[cart-quote]', error)
    return NextResponse.json({ error: 'Failed to send quote request' }, { status: 500 })
  }
}
