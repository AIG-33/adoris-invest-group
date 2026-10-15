/**
 * SKU helpers for bulk-order matching.
 *
 * Purely numeric catalog numbers (e.g. Roche) often differ only by leading zeros:
 * DB `12345` vs pasted `012345`. Alphanumeric SKUs like `07P3203` are left unchanged.
 */

/** True when the SKU is digits only (optional leading zeros). */
export function isPurelyNumericSku(sku: string): boolean {
  return /^\d+$/.test(sku)
}

/**
 * Strip leading zeros from a purely numeric SKU.
 * Keeps a single `0` if the value is all zeros.
 * Non-numeric SKUs are returned unchanged.
 */
export function stripLeadingZeros(sku: string): string {
  if (!isPurelyNumericSku(sku)) return sku
  const stripped = sku.replace(/^0+/, '')
  return stripped === '' ? '0' : stripped
}

/**
 * Expand a SKU into lookup variants so both directions work:
 * - user `012345` ↔ DB `12345`
 * - user `12345` ↔ DB `012345`
 *
 * Non-numeric SKUs yield only the original string.
 */
export function expandNumericSkuVariants(sku: string): string[] {
  const trimmed = sku.trim()
  if (!trimmed || !isPurelyNumericSku(trimmed)) return trimmed ? [trimmed] : []

  const stripped = stripLeadingZeros(trimmed)
  const variants = new Set<string>([trimmed, stripped])

  // Pad with leading zeros up to a reasonable catalog length so DB values
  // stored with extra zeros still match via `sku IN (...)`.
  const maxLen = Math.min(Math.max(trimmed.length + 4, stripped.length + 6, 12), 20)
  for (let len = stripped.length + 1; len <= maxLen; len++) {
    variants.add(stripped.padStart(len, '0'))
  }

  return [...variants]
}

/**
 * Resolve a requested SKU against loaded products.
 * Prefer exact (case-insensitive) match; for numeric SKUs fall back to
 * zero-stripped equality against numeric product SKUs only.
 */
export function matchProductBySku<T extends { sku: string }>(
  requestedSku: string,
  productsByExactLower: Map<string, T>,
  productsByNumericNormalized: Map<string, T | null>
): T | undefined {
  const key = requestedSku.trim()
  if (!key) return undefined

  const exact = productsByExactLower.get(key.toLowerCase())
  if (exact) return exact

  if (!isPurelyNumericSku(key)) return undefined

  const normalized = stripLeadingZeros(key)
  const candidate = productsByNumericNormalized.get(normalized)
  // null means ambiguous (multiple products share the same normalized form)
  if (candidate === null || candidate === undefined) return undefined
  return candidate
}

/** Build lookup maps from a product list for {@link matchProductBySku}. */
export function buildSkuLookupMaps<T extends { sku: string }>(products: T[]): {
  byExactLower: Map<string, T>
  byNumericNormalized: Map<string, T | null>
} {
  const byExactLower = new Map<string, T>()
  const byNumericNormalized = new Map<string, T | null>()

  for (const product of products) {
    byExactLower.set(product.sku.toLowerCase(), product)

    if (!isPurelyNumericSku(product.sku)) continue
    const norm = stripLeadingZeros(product.sku)
    if (byNumericNormalized.has(norm)) {
      const existing = byNumericNormalized.get(norm)
      if (existing && existing.sku.toLowerCase() !== product.sku.toLowerCase()) {
        // Ambiguous: e.g. both "123" and "0123" as distinct rows — skip zero-stripped match
        byNumericNormalized.set(norm, null)
      }
    } else {
      byNumericNormalized.set(norm, product)
    }
  }

  return { byExactLower, byNumericNormalized }
}
