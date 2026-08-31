/** Orders below this product subtotal incur a logistic fee (see Terms). */
export const MIN_ORDER_VALUE_EUR = 5000

/** Delivery charge from suppliers' warehouses to Vilnius for small orders. */
export const LOGISTIC_FEE_EUR = 250

/**
 * Whether the €250 logistic fee applies.
 * Only when prices are shown and there is a real positive subtotal below the threshold.
 */
export function shouldApplyLogisticFee(
  subtotal: number,
  showPrices: boolean | undefined | null
): boolean {
  if (!showPrices) return false
  if (!subtotal || subtotal <= 0) return false
  return subtotal < MIN_ORDER_VALUE_EUR
}
