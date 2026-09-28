/**
 * Build product-level 301 map from GSC coverage exports.
 *
 * Usage:
 *   npx tsx --require dotenv/config scripts/build-gsc-product-redirects.ts
 *
 * Reads zip extracts under /tmp/gsc-ivd/set{0..3}/ and Top pages CSV.
 * Writes:
 *   lib/product-redirects.generated.ts
 *   docs/gsc-product-redirects-report.md
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import {
  MANUFACTURER_SLUG_REDIRECTS,
  CATEGORY_SLUG_REDIRECTS,
} from '../lib/legacy-redirects'

const prisma = new PrismaClient()

const GSC_SETS = [0, 1, 2, 3].map((i) => `/tmp/gsc-ivd/set${i}/urls_0.csv`)
const TOP_PAGES =
  '/Users/gmaxby/Downloads/ivdgroup.eu-Top target pages-2026-09-28.csv'

function normalizeSku(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function slugifySku(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractSkuCandidates(slug: string): string[] {
  const cands: string[] = [slug]
  const parts = slug.split('-')
  for (let i = 1; i <= Math.min(8, parts.length); i++) {
    cands.push(parts.slice(-i).join('-'))
  }
  return [...new Set(cands)]
}

type ProductRow = {
  id: string
  slug: string
  sku: string
  manufacturer: { slug: string } | null
}

type Match = { from: string; to: string; reason: string }

function targetPath(prod: ProductRow): string {
  return `/product/${prod.manufacturer?.slug || 'unknown'}/${prod.slug}`
}

function collectUrls(): Set<string> {
  const urlSet = new Set<string>()
  for (const file of GSC_SETS) {
    if (!fs.existsSync(file)) {
      console.warn('missing', file)
      continue
    }
    const rows = parse(fs.readFileSync(file, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }) as Record<string, string>[]
    for (const r of rows) {
      const u = (r.URL || Object.values(r)[0] || '')
        .toString()
        .trim()
        .replace(/^"|"$/g, '')
      if (u.startsWith('http')) urlSet.add(u)
    }
  }
  if (fs.existsSync(TOP_PAGES)) {
    const rows = parse(fs.readFileSync(TOP_PAGES, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }) as Record<string, string>[]
    for (const r of rows) {
      const u = Object.values(r)[0]?.toString().trim()
      if (u?.startsWith('http')) urlSet.add(u)
    }
  }
  return urlSet
}

/** Paths already covered by middleware structural rules — skip product map. */
function isStructurallyHandled(pathname: string, search: string): boolean {
  if (pathname === '/shop' || pathname === '/shop/') return true
  if (pathname.startsWith('/product-category/')) return true
  if (pathname === '/products' || pathname.startsWith('/products/')) {
    const sp = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
    if (sp.has('query_type_manufacturer') || sp.has('filter_manufacturer')) return true
    const cat = sp.get('category')
    if (cat && CATEGORY_SLUG_REDIRECTS[cat]) return true
    const mfg = sp.get('manufacturer')
    if (mfg && MANUFACTURER_SLUG_REDIRECTS[mfg]) return true
  }
  if (pathname === '/' && search.includes('category=')) return true
  if (search.includes('add-to-cart=')) return true
  return false
}

async function main() {
  const urlSet = collectUrls()
  console.log('unique GSC urls', urlSet.size)

  type Cand = { path: string; mfg?: string; slug?: string }
  const productPaths = new Map<string, Cand>()
  const otherUrls: string[] = []
  let structurallySkipped = 0

  for (const u of urlSet) {
    let url: URL
    try {
      url = new URL(u)
    } catch {
      continue
    }
    if (!url.hostname.replace(/^www\./, '').endsWith('ivdgroup.eu')) continue

    const pathname = decodeURIComponent(url.pathname)
    const cleanPath = pathname.replace(/\/+$/, '') || '/'

    if (isStructurallyHandled(cleanPath, url.search) || isStructurallyHandled(pathname, url.search)) {
      structurallySkipped++
      continue
    }

    if (!cleanPath.startsWith('/product/') || cleanPath.startsWith('/product-category')) {
      otherUrls.push(u)
      continue
    }

    const parts = cleanPath.split('/').filter(Boolean)
    if (parts.length === 2) {
      productPaths.set(cleanPath, { path: cleanPath, slug: parts[1] })
    } else if (parts.length >= 3) {
      productPaths.set(cleanPath, {
        path: cleanPath,
        mfg: parts[1],
        slug: parts.slice(2).join('/'),
      })
    }
  }

  console.log(
    'product paths',
    productPaths.size,
    'other',
    otherUrls.length,
    'structurally skipped',
    structurallySkipped
  )

  console.log('Loading products...')
  const products = (await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      sku: true,
      manufacturer: { select: { slug: true } },
    },
  })) as ProductRow[]
  console.log('products', products.length)

  const bySlug = new Map<string, ProductRow[]>()
  const bySkuNorm = new Map<string, ProductRow>()
  const bySkuSlug = new Map<string, ProductRow>()
  /** Old WC slug (no SKU) → products whose slug is `{base}-{sku}` */
  const byPrefixBase = new Map<string, ProductRow[]>()

  for (const p of products) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, [])
    bySlug.get(p.slug)!.push(p)
    if (p.sku) {
      const n = normalizeSku(p.sku)
      const ss = slugifySku(p.sku)
      if (n && !bySkuNorm.has(n)) bySkuNorm.set(n, p)
      if (ss && !bySkuSlug.has(ss)) bySkuSlug.set(ss, p)
      if (ss && p.slug.endsWith('-' + ss)) {
        const base = p.slug.slice(0, -(ss.length + 1))
        if (base.length >= 6) {
          if (!byPrefixBase.has(base)) byPrefixBase.set(base, [])
          byPrefixBase.get(base)!.push(p)
        }
      }
    }
  }

  const sortedSlugs = [...bySlug.keys()].sort()

  function productsWithPrefix(prefix: string): ProductRow[] {
    if (prefix.length < 6) return []
    // lower bound
    let lo = 0
    let hi = sortedSlugs.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (sortedSlugs[mid] < prefix) lo = mid + 1
      else hi = mid
    }
    const out: ProductRow[] = []
    for (let i = lo; i < sortedSlugs.length; i++) {
      const s = sortedSlugs[i]
      if (!s.startsWith(prefix)) break
      if (s === prefix || s.startsWith(prefix + '-')) {
        out.push(...bySlug.get(s)!)
        if (out.length > 5) break
      }
    }
    return out
  }

  // Secondary index: slug suffix → products (for endswith when unique)
  const bySuffix = new Map<string, ProductRow[]>()
  for (const p of products) {
    const parts = p.slug.split('-')
    for (let i = 2; i <= Math.min(6, parts.length); i++) {
      const suf = parts.slice(-i).join('-')
      if (suf.length < 6) continue
      if (!bySuffix.has(suf)) bySuffix.set(suf, [])
      const list = bySuffix.get(suf)!
      if (list.length < 5) list.push(p)
    }
  }

  /** Strip trailing WP duplicate markers: -2, -3, ... (not SKU-like) */
  function stripWpNumericSuffix(slug: string): string[] {
    const out = [slug]
    const m = slug.match(/^(.*?)-(\d{1,2})$/)
    if (m && m[1].length >= 6) out.push(m[1])
    return out
  }

  function uniqueHit(
    list: ProductRow[] | undefined,
    preferMfg?: string
  ): ProductRow | undefined {
    if (!list?.length) return undefined
    if (list.length === 1) return list[0]
    if (preferMfg) {
      const canon = MANUFACTURER_SLUG_REDIRECTS[preferMfg] || preferMfg
      const same = list.filter(
        (h) =>
          h.manufacturer?.slug === preferMfg ||
          h.manufacturer?.slug === canon
      )
      if (same.length === 1) return same[0]
    }
    return undefined
  }

  const matches: Match[] = []
  const unmatched: Array<{ path: string; reason: string }> = []
  const alreadyCanonical: string[] = []

  for (const [p, cand] of productPaths) {
    const slugHits = cand.slug ? bySlug.get(cand.slug) : undefined

    if (cand.slug && slugHits?.length) {
      const canonMfg = cand.mfg
        ? MANUFACTURER_SLUG_REDIRECTS[cand.mfg] || cand.mfg
        : undefined
      const same = canonMfg
        ? slugHits.find(
            (h) =>
              h.manufacturer?.slug === canonMfg ||
              h.manufacturer?.slug === cand.mfg
          )
        : undefined
      const hit =
        same || (slugHits.length === 1 ? slugHits[0] : undefined)

      if (hit) {
        const to = targetPath(hit)
        if (to === p) {
          alreadyCanonical.push(p)
          continue
        }
        matches.push({
          from: p,
          to,
          reason: same
            ? 'exact-slug+mfg'
            : cand.mfg
              ? 'exact-slug-wrong-mfg'
              : 'legacy-1seg-exact-slug',
        })
        continue
      }

      unmatched.push({
        path: p,
        reason: `ambiguous-slug (${slugHits.length})`,
      })
      continue
    }

    // SKU from path tail
    let skuHit: ProductRow | undefined
    let skuReason = ''
    if (cand.slug) {
      for (const c of extractSkuCandidates(cand.slug)) {
        if (c.length < 4) continue
        const n = normalizeSku(c)
        const ss = slugifySku(c)
        if (n && bySkuNorm.has(n)) {
          skuHit = bySkuNorm.get(n)
          skuReason = `sku-norm:${c}`
          break
        }
        if (ss && bySkuSlug.has(ss)) {
          skuHit = bySkuSlug.get(ss)
          skuReason = `sku-slug:${c}`
          break
        }
      }
    }

    if (skuHit) {
      const to = targetPath(skuHit)
      if (to === p) {
        alreadyCanonical.push(p)
        continue
      }
      matches.push({ from: p, to, reason: skuReason })
      continue
    }

    // Old WC slug without SKU → current `{base}-{sku}` (unique only)
    if (cand.slug && cand.slug.length >= 6) {
      let prefixHit: ProductRow | undefined
      let prefixReason = ''
      let ambiguous = false
      for (const base of stripWpNumericSuffix(cand.slug)) {
        const fromBase = uniqueHit(byPrefixBase.get(base), cand.mfg)
        if (fromBase) {
          prefixHit = fromBase
          prefixReason =
            base === cand.slug ? 'prefix-base+sku' : 'prefix-base-strip-wp+sku'
          break
        }
        const starts = productsWithPrefix(base)
        if (starts.length > 1 && !uniqueHit(starts, cand.mfg)) {
          unmatched.push({
            path: p,
            reason: `ambiguous-prefix (${starts.length})`,
          })
          ambiguous = true
          break
        }
        const u = uniqueHit(starts, cand.mfg)
        if (u) {
          prefixHit = u
          prefixReason =
            base === cand.slug ? 'startsWith-base' : 'startsWith-base-strip-wp'
          break
        }
      }
      if (ambiguous) continue
      if (prefixHit) {
        const to = targetPath(prefixHit)
        if (to === p) {
          alreadyCanonical.push(p)
          continue
        }
        matches.push({ from: p, to, reason: prefixReason })
        continue
      }
    }

    // Unique suffix / endswith via slug candidates
    if (cand.slug && cand.slug.length >= 10) {
      const sufHits = bySuffix.get(cand.slug)
      const u = uniqueHit(sufHits, cand.mfg)
      if (u) {
        const to = targetPath(u)
        if (to !== p) {
          matches.push({ from: p, to, reason: 'slug-as-suffix' })
          continue
        }
      }
      let endHit: ProductRow | undefined
      for (const c of extractSkuCandidates(cand.slug)) {
        if (c.length < 10) continue
        endHit =
          uniqueHit(bySlug.get(c), cand.mfg) ||
          uniqueHit(bySuffix.get(c), cand.mfg)
        if (endHit) break
      }
      if (endHit) {
        const to = targetPath(endHit)
        if (to !== p) {
          matches.push({ from: p, to, reason: 'slug-endswith-unique' })
          continue
        }
      }
    }

    unmatched.push({ path: p, reason: 'no-match' })
  }

  // Deduplicate matches (same from → keep first)
  const map = new Map<string, Match>()
  for (const m of matches) {
    if (!map.has(m.from)) map.set(m.from, m)
  }
  const uniqueMatches = [...map.values()].sort((a, b) =>
    a.from.localeCompare(b.from)
  )

  // Also add manufacturer path redirects for GSC /manufacturer/* URLs
  const mfgRedirects: Match[] = []
  for (const u of otherUrls) {
    let url: URL
    try {
      url = new URL(u)
    } catch {
      continue
    }
    const cleanPath = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/'
    const m = cleanPath.match(/^\/manufacturer\/([^/]+)$/)
    if (!m) continue
    const raw = m[1]
    const canon = MANUFACTURER_SLUG_REDIRECTS[raw] || raw
    mfgRedirects.push({
      from: cleanPath,
      to: `/products?manufacturer=${canon}`,
      reason: 'manufacturer-path',
    })
  }
  const mfgMap = new Map(mfgRedirects.map((m) => [m.from, m]))
  const uniqueMfg = [...mfgMap.values()]

  const reasonCounts = uniqueMatches.reduce(
    (a, m) => {
      const key = m.reason.startsWith('sku-') ? 'sku-*' : m.reason
      a[key] = (a[key] || 0) + 1
      return a
    },
    {} as Record<string, number>
  )
  const unmatchedReasons = unmatched.reduce(
    (a, m) => {
      const key = m.reason.startsWith('ambiguous') ? 'ambiguous' : m.reason
      a[key] = (a[key] || 0) + 1
      return a
    },
    {} as Record<string, number>
  )

  console.log(
    JSON.stringify(
      {
        gscUrls: urlSet.size,
        productPaths: productPaths.size,
        matches: uniqueMatches.length,
        alreadyCanonical: alreadyCanonical.length,
        unmatched: unmatched.length,
        mfgPathRedirects: uniqueMfg.length,
        structurallySkipped,
        reasonCounts,
        unmatchedReasons,
      },
      null,
      2
    )
  )

  // Write generated TS module
  const outTs = path.join(process.cwd(), 'lib/product-redirects.generated.ts')
  const productEntries = uniqueMatches
    .map((m) => `  ${JSON.stringify(m.from)}: ${JSON.stringify(m.to)},`)
    .join('\n')
  const mfgEntries = uniqueMfg
    .map((m) => `  ${JSON.stringify(m.from)}: ${JSON.stringify(m.to)},`)
    .join('\n')

  const ts = `/**
 * AUTO-GENERATED by scripts/build-gsc-product-redirects.ts — do not edit by hand.
 * Product-level + /manufacturer/* 301 map from GSC exports (${new Date().toISOString().slice(0, 10)}).
 * Matches: ${uniqueMatches.length} product, ${uniqueMfg.length} manufacturer-path.
 */
export const PRODUCT_PATH_REDIRECTS: Record<string, string> = {
${productEntries}
}

export const MANUFACTURER_PATH_REDIRECTS: Record<string, string> = {
${mfgEntries}
}
`
  fs.writeFileSync(outTs, ts)
  console.log('wrote', outTs)

  // Report
  const reportPath = path.join(
    process.cwd(),
    'docs/gsc-product-redirects-report.md'
  )
  const report = `# GSC product redirect map report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Count |
|--------|------:|
| Unique GSC URLs (all exports + top pages) | ${urlSet.size} |
| Unique \`/product/...\` paths considered | ${productPaths.size} |
| Structurally skipped (shop/category/filters/etc.) | ${structurallySkipped} |
| Already canonical (no redirect needed) | ${alreadyCanonical.length} |
| Matched product 301s | ${uniqueMatches.length} |
| Unmatched product paths | ${unmatched.length} |
| \`/manufacturer/...\` path 301s | ${uniqueMfg.length} |

### Match reasons

\`\`\`
${JSON.stringify(reasonCounts, null, 2)}
\`\`\`

### Unmatched reasons

\`\`\`
${JSON.stringify(unmatchedReasons, null, 2)}
\`\`\`

## Unmatched paths (do not invent redirects)

${unmatched.map((u) => `- \`${u.path}\` — ${u.reason}`).join('\n')}

## Sample matches

${uniqueMatches
  .slice(0, 40)
  .map((m) => `- \`${m.from}\` → \`${m.to}\` (${m.reason})`)
  .join('\n')}
`
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, report)
  console.log('wrote', reportPath)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
