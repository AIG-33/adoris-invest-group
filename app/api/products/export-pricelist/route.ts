import { prisma } from '@/lib/db'

// Never ISR-cache this response — full catalog Excel/CSV exceeds Vercel's
// ~19 MB FALLBACK_BODY_TOO_LARGE limit (~33 MB with ~75k products).
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const BATCH_SIZE = 2000

function escapeCsvField(value: string | number): string {
  const str = String(value ?? '')
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `IVD_Pricelist_${dateStr}.csv`

  const encoder = new TextEncoder()
  let cursor: string | undefined
  let isFirstBatch = true

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // UTF-8 BOM so Excel opens non-ASCII correctly; same columns as before
        controller.enqueue(
          encoder.encode('\uFEFFManufacturer,Art,Product,Description,"Price, EUR"\n')
        )

        while (true) {
          const products = await prisma.product.findMany({
            take: BATCH_SIZE,
            ...(cursor
              ? {
                  skip: 1,
                  cursor: { id: cursor },
                }
              : {}),
            select: {
              id: true,
              sku: true,
              name: true,
              description: true,
              priceEU: true,
              manufacturer: {
                select: { name: true },
              },
            },
            orderBy: { id: 'asc' },
          })

          if (products.length === 0) break

          const lines = products
            .map((product) =>
              [
                escapeCsvField(product.manufacturer.name || ''),
                escapeCsvField(product.sku || ''),
                escapeCsvField(product.name || ''),
                escapeCsvField(product.description || ''),
                escapeCsvField(Number(product.priceEU) || 0),
              ].join(',')
            )
            .join('\n')

          controller.enqueue(
            encoder.encode(isFirstBatch ? lines : `\n${lines}`)
          )
          isFirstBatch = false

          cursor = products[products.length - 1].id
          if (products.length < BATCH_SIZE) break
        }

        controller.close()
      } catch (error) {
        console.error('Error exporting pricelist:', error)
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
