import { prisma } from '@/lib/db'
import { getProductUrl } from '@/lib/product-url'
import { buildSkuLookupMaps, expandNumericSkuVariants, matchProductBySku } from '@/lib/sku-normalize'
import type { ClassifiedItem } from './ai'

export interface MatchedItem {
  position: number
  requestedSku: string
  quantity: number
  description: string | null
  manufacturerHint: string | null
  status: 'found' | 'not_found' | 'no_price'
  productId: string | null
  matchedSku: string | null
  productName: string | null
  unitPrice: number | null
  productUrl: string | null
  verifiedInText: boolean
}

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function skuCandidates(sku: string): string[] {
  const trimmed = sku.trim()
  const noSpaces = trimmed.replace(/\s+/g, '')
  return [...new Set([trimmed, noSpaces, ...expandNumericSkuVariants(noSpaces)])].filter(Boolean)
}

export async function matchItems(
  items: ClassifiedItem[],
  sourceText: string,
  baseUrl: string | null
): Promise<MatchedItem[]> {
  const withSku = items.filter((i) => i.sku)
  const lookup = [...new Set(withSku.flatMap((i) => skuCandidates(i.sku)))]

  const products = lookup.length
    ? await prisma.product.findMany({
        where: { sku: { in: lookup, mode: 'insensitive' } },
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          priceEU: true,
          manufacturer: { select: { slug: true } },
        },
      })
    : []

  const { byExactLower, byNumericNormalized } = buildSkuLookupMaps(products)
  const byCompact = new Map<string, (typeof products)[number]>()
  for (const p of products) byCompact.set(compact(p.sku), p)
  const haystack = compact(sourceText)

  return items.map((item, position) => {
    const base = {
      position,
      requestedSku: item.sku,
      quantity: item.quantity || 1,
      description: item.description,
      manufacturerHint: item.manufacturer,
      verifiedInText: item.sku.length > 0 && haystack.includes(compact(item.sku)),
    }
    if (!item.sku) {
      return { ...base, status: 'not_found' as const, productId: null, matchedSku: null, productName: null, unitPrice: null, productUrl: null }
    }

    const noSpaces = item.sku.replace(/\s+/g, '')
    const product =
      matchProductBySku(item.sku, byExactLower, byNumericNormalized) ||
      matchProductBySku(noSpaces, byExactLower, byNumericNormalized) ||
      byCompact.get(compact(item.sku))

    if (!product) {
      return { ...base, status: 'not_found' as const, productId: null, matchedSku: null, productName: null, unitPrice: null, productUrl: null }
    }

    const price = Number(product.priceEU)
    return {
      ...base,
      status: price > 0 ? ('found' as const) : ('no_price' as const),
      productId: product.id,
      matchedSku: product.sku,
      productName: product.name,
      unitPrice: price > 0 ? price : null,
      productUrl: baseUrl ? `${baseUrl}${getProductUrl(product)}` : null,
    }
  })
}
