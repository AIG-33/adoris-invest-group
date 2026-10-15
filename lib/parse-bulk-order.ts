export interface BulkOrderLineItem {
  sku: string
  quantity: number
}

/** How likely a token is a catalog number / SKU (higher = more likely). */
function scoreSkuToken(token: string): number {
  const t = token.trim()
  if (!t) return -Infinity

  // Quantity-like decimals from ERP/Excel (14.000, 3,000) — never SKUs
  if (/^\d{1,6}[.,]\d+$/.test(t)) return 0

  // Tiny integers are almost always quantities, not catalog numbers
  if (/^\d{1,2}$/.test(t)) return 5

  // Pure numeric catalog numbers (e.g. Diagon 10445724, Roche 03000087122)
  if (/^\d{5,}$/.test(t)) return 100

  // Short numeric codes (2215, 90310) — weaker than long catalog numbers
  if (/^\d{3,4}$/.test(t)) return 40

  // Alphanumeric with digits (KK38.2, 16089-100mg, sc-29527)
  if (/[0-9]/.test(t) && /^[A-Za-z0-9][A-Za-z0-9.\-_*\/,]+$/.test(t)) {
    const digits = (t.match(/\d/g)?.length ?? 0) / t.length
    if (digits >= 0.5) return 85
    if (digits >= 0.2) return 70
    return 55
  }

  // Letter prefix + digits (MA00801000)
  if (/^[A-Za-z]{1,4}\d/.test(t)) return 65

  // Plain words from product names
  if (/^[A-Za-z]+$/.test(t)) return 1

  if (/[0-9]/.test(t)) return 45

  return 10
}

/**
 * Parse a quantity token. Accepts:
 * - integers: "14"
 * - ERP/Excel decimals that mean whole packs: "14.000", "14,000", "3.0"
 * - other simple decimals rounded to nearest int: "3.5" → 4
 */
function parseQuantityToken(token: string): number | null {
  const t = token.trim().replace(/\s/g, '')
  if (!t) return null

  if (/^\d{1,6}$/.test(t)) {
    const q = parseInt(t, 10)
    return q >= 1 && q <= 999_999 ? q : null
  }

  // 14.000 / 14,000 / 3.5 / 3,5
  const m = t.match(/^(\d{1,6})([.,])(\d+)$/)
  if (!m) return null

  const whole = parseInt(m[1], 10)
  const frac = m[3]
  if (Number.isNaN(whole)) return null

  // Trailing zeros after decimal → integer quantity (SAP/Roche style)
  if (/^0+$/.test(frac)) {
    return whole >= 1 && whole <= 999_999 ? whole : null
  }

  const q = Math.round(Number(`${m[1]}.${frac}`))
  return q >= 1 && q <= 999_999 ? q : null
}

function pickSkuToken(tokens: string[]): string | null {
  if (tokens.length === 0) return null
  if (tokens.length === 1) return tokens[0]

  let bestIdx = 0
  let bestScore = -Infinity
  for (let i = 0; i < tokens.length; i++) {
    const s = scoreSkuToken(tokens[i])
    if (s > bestScore) {
      bestScore = s
      bestIdx = i
    }
  }

  return bestScore >= 10 ? tokens[bestIdx] : tokens[0]
}

function shouldTreatLastTokenAsQuantity(
  tokens: string[],
  lastToken: string
): boolean {
  const qty = parseQuantityToken(lastToken)
  if (qty === null || tokens.length < 2) return false

  const skuCandidates = tokens.slice(0, -1)
  const bestSkuScore = Math.max(...skuCandidates.map(scoreSkuToken))
  const lastSkuScore = scoreSkuToken(lastToken)

  // Stronger catalog token before a weaker quantity-like token
  // Covers "03000087122 14.000", "10445724 2", "SKU001 5"
  if (bestSkuScore >= 40 && lastSkuScore < bestSkuScore && qty <= 10_000) return true

  // "name sku qty" with clear catalog number before quantity
  if (tokens.length >= 3 && bestSkuScore >= 50 && qty <= 10_000) return true

  return false
}

/** Split a structured line; prefer tab/semicolon so EU "14,000" stays intact. */
function splitStructuredColumns(line: string): string[] | null {
  if (!/[\t,;]/.test(line)) return null

  let parts: string[]
  if (/\t/.test(line)) {
    parts = line.split(/\t+/).map((p) => p.trim()).filter(Boolean)
  } else if (/;/.test(line)) {
    parts = line.split(/;+/).map((p) => p.trim()).filter(Boolean)
  } else {
    // Comma-separated — may be "SKU,14,000" (EU decimal qty)
    parts = line.split(/,/).map((p) => p.trim()).filter(Boolean)
    if (parts.length >= 3) {
      const a = parts[parts.length - 2]
      const b = parts[parts.length - 1]
      if (/^\d{1,6}$/.test(a) && /^\d{1,3}$/.test(b) && parseQuantityToken(`${a},${b}`) !== null) {
        parts = [...parts.slice(0, -2), `${a},${b}`]
      }
    }
  }

  return parts.length >= 2 ? parts : null
}

function parseStructuredParts(parts: string[]): BulkOrderLineItem | null {
  if (parts.length === 2) {
    const asQty = parseQuantityToken(parts[1])
    const score0 = scoreSkuToken(parts[0])
    const score1 = scoreSkuToken(parts[1])
    if (asQty !== null && score0 >= score1) {
      return { sku: parts[0], quantity: asQty }
    }
    if (asQty !== null && score1 > score0) {
      const qty0 = parseQuantityToken(parts[0])
      return { sku: parts[1], quantity: qty0 ?? 1 }
    }
    // Qty parse failed but first token looks like SKU — still try first as SKU with qty 1
    return null
  }

  if (parts.length >= 3) {
    const last = parts[parts.length - 1]
    const qty = parseQuantityToken(last)
    if (qty !== null) {
      const sku = pickSkuToken(parts.slice(0, -1))
      if (sku) return { sku, quantity: qty }
    }
  }

  return null
}

export function parseBulkOrderLine(line: string): BulkOrderLineItem | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  const structured = splitStructuredColumns(trimmed)
  if (structured) {
    const parsed = parseStructuredParts(structured)
    if (parsed) return parsed
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return null

  if (tokens.length === 1) {
    return { sku: tokens[0], quantity: 1 }
  }

  let quantity = 1
  let skuTokens = tokens

  const lastToken = tokens[tokens.length - 1]
  if (shouldTreatLastTokenAsQuantity(tokens, lastToken)) {
    quantity = parseQuantityToken(lastToken)!
    skuTokens = tokens.slice(0, -1)
  }

  const sku = pickSkuToken(skuTokens)
  if (!sku) return null

  return { sku, quantity }
}

export function parseBulkOrderText(text: string): BulkOrderLineItem[] {
  return text
    .split(/\r?\n/)
    .map(parseBulkOrderLine)
    .filter((item): item is BulkOrderLineItem => item !== null && Boolean(item.sku.trim()))
}
