/**
 * Smoke test for numeric SKU leading-zero matching.
 * Run: npx tsx scripts/smoke-sku-normalize.ts
 *
 * Examples that must match:
 *   paste 012345  ↔ DB 12345
 *   paste 12345   ↔ DB 012345
 *   paste 0000    ↔ DB 0
 *
 * Must NOT rewrite alphanumeric:
 *   07P3203 stays 07P3203 (no strip to 7P3203)
 */
import {
  buildSkuLookupMaps,
  expandNumericSkuVariants,
  isPurelyNumericSku,
  matchProductBySku,
  stripLeadingZeros,
} from '../lib/sku-normalize'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

// stripLeadingZeros
assert(stripLeadingZeros('012345') === '12345', 'strip 012345 → 12345')
assert(stripLeadingZeros('12345') === '12345', 'strip 12345 → 12345')
assert(stripLeadingZeros('0000') === '0', 'all zeros → 0')
assert(stripLeadingZeros('07P3203') === '07P3203', 'alphanumeric unchanged')
assert(stripLeadingZeros('0') === '0', 'single zero stays')

// isPurelyNumericSku
assert(isPurelyNumericSku('012345'), '012345 is numeric')
assert(!isPurelyNumericSku('07P3203'), '07P3203 is not purely numeric')
assert(!isPurelyNumericSku('ABC'), 'ABC is not numeric')

// expand variants cover both directions
const fromPadded = expandNumericSkuVariants('012345')
assert(fromPadded.includes('012345'), 'expand keeps original')
assert(fromPadded.includes('12345'), 'expand includes stripped')

const fromBare = expandNumericSkuVariants('12345')
assert(fromBare.includes('12345'), 'expand keeps bare')
assert(fromBare.includes('012345'), 'expand pads one zero for reverse match')
assert(fromBare.includes('0012345'), 'expand pads further')

assert(
  expandNumericSkuVariants('07P3203').length === 1 &&
    expandNumericSkuVariants('07P3203')[0] === '07P3203',
  'alphanumeric expands to itself only'
)

// matchProductBySku — DB without zeros, user with zeros
{
  const products = [{ sku: '12345', id: 'a' }]
  const maps = buildSkuLookupMaps(products)
  const hit = matchProductBySku('012345', maps.byExactLower, maps.byNumericNormalized)
  assert(hit?.sku === '12345', 'user 012345 matches DB 12345')
}

// matchProductBySku — DB with zeros, user without
{
  const products = [{ sku: '012345', id: 'b' }]
  const maps = buildSkuLookupMaps(products)
  const hit = matchProductBySku('12345', maps.byExactLower, maps.byNumericNormalized)
  assert(hit?.sku === '012345', 'user 12345 matches DB 012345')
}

// exact match preferred
{
  const products = [{ sku: '012345', id: 'c' }]
  const maps = buildSkuLookupMaps(products)
  const hit = matchProductBySku('012345', maps.byExactLower, maps.byNumericNormalized)
  assert(hit?.sku === '012345', 'exact match when both have zeros')
}

// alphanumeric never zero-stripped
{
  const products = [{ sku: '7P3203', id: 'd' }]
  const maps = buildSkuLookupMaps(products)
  const miss = matchProductBySku('07P3203', maps.byExactLower, maps.byNumericNormalized)
  assert(miss === undefined, '07P3203 must not match 7P3203')
}

// ambiguous numeric products → no zero-stripped match
{
  const products = [
    { sku: '123', id: 'e1' },
    { sku: '0123', id: 'e2' },
  ]
  const maps = buildSkuLookupMaps(products)
  assert(
    matchProductBySku('123', maps.byExactLower, maps.byNumericNormalized)?.id === 'e1',
    'exact still works when ambiguous'
  )
  assert(
    matchProductBySku('000123', maps.byExactLower, maps.byNumericNormalized) === undefined,
    'ambiguous normalized form refuses zero-stripped match'
  )
}

console.log('OK: sku-normalize smoke tests passed')
