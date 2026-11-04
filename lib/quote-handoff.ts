/**
 * Hands a list the visitor dropped on the homepage over to /bulk-order.
 * Lives in module memory, so it survives client-side navigation (router.push)
 * but not a full reload — files can be far larger than sessionStorage allows.
 */
export interface PendingQuote {
  text: string
  files: File[]
}

let pending: PendingQuote | null = null

export function setPendingQuote(quote: PendingQuote) {
  pending = quote
}

export function takePendingQuote(): PendingQuote | null {
  const quote = pending
  pending = null
  return quote
}
