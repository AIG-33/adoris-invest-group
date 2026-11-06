const ENDPOINT = 'https://suppliers.adorisgroup.com/api/public/requests'

export interface WantedItem {
  id: string
  sku: string
  manufacturer: string | null
  quantity: number | null
  unit: string | null
}

export interface WantedProducts {
  count: number
  items: WantedItem[]
}

interface PortalRequest extends WantedItem {
  requestedAt?: string
  offersClosed?: boolean
}

/**
 * Open sourcing requests from the supplier portal, newest first.
 * Returns null when the portal is unreachable so the homepage still renders.
 */
export async function getWantedProducts(limit = 3): Promise<WantedProducts | null> {
  try {
    const res = await fetch(ENDPOINT, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { items?: PortalRequest[] }
    const open = (data.items ?? []).filter((i) => !i.offersClosed && i.sku)
    open.sort((a, b) => (b.requestedAt ?? '').localeCompare(a.requestedAt ?? ''))
    return {
      count: open.length,
      items: open.slice(0, limit).map(({ id, sku, manufacturer, quantity, unit }) => ({
        id,
        sku,
        manufacturer,
        quantity,
        unit,
      })),
    }
  } catch {
    return null
  }
}
