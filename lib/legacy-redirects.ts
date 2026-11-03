/**
 * Legacy manufacturer slug → canonical slug.
 * Used by middleware for /products?manufacturer= 301s after merge-manufacturers.ts.
 * Keep in sync when re-running manufacturer merges.
 */
export const MANUFACTURER_SLUG_REDIRECTS: Record<string, string> = {
  merk: 'merck',
  satorius: 'sartorius',
  'ocford-nanopore': 'oxford-nanopore-technologies',
  neofrooxx: 'neofroxx',
  'machery-nagel': 'macherey-nagel',
  cityva: 'cytiva',
  ytiva: 'cytiva',
  bcam: 'abcam',
  'sigma-suplesco': 'supelco',
  carlroth: 'carl-roth',
  'stemcell-1': 'stemcell',
  'applichem-1': 'applichem',
  'dr-ehrenstorfer-1': 'dr-ehrenstorfer',
  'dr-ehrenstorfer-2': 'dr-ehrenstorfer',
  absiex: 'ab-siex',
  'acro-biosystems': 'acrobiosystems',
  'bio-x-cell': 'bioxcell',
  'bio-techne': 'biotechne',
  'iba-lifesciences-1': 'iba-lifesciences',
  'protein-simple': 'proteinsimple',
  'ivd-group-sp-z-o-o': 'ivd-group-private-label',
}

/**
 * Legacy category slug → current category slug (two-level taxonomy).
 * Middleware 301s ?category= and /product-category/:slug.
 * Product-level WP→Next paths live in product-redirects.generated.ts.
 */
export const CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  'equipment-imported': 'equipment',
  biochemistry: 'clinical-chemistry',
  'covid-19-testing': 'rapid-tests',
  'sars-2-covid-19': 'rapid-tests',
  microtubes: 'tubes-vials',
  pcr: 'pcr-qpcr',
  'pcr-molecular': 'molecular-biology',
  'pcr-tubes': 'tubes-vials',
  'pcr-plates': 'microplates',
  'pipette-tips': 'pipette-tips-filtration',
  tips: 'pipette-tips-filtration',
  'laboratory-supplies': 'labware',
  swabs: 'sample-collection',
  uncategorized: 'other',
}

/**
 * Legacy WP categories that were really brands → manufacturer filter.
 * Values are current Manufacturer slugs.
 */
export const CATEGORY_TO_MANUFACTURER_REDIRECTS: Record<string, string> = {
  abbott: 'abbott',
  bd: 'bd',
  biomerieux: 'biomerieux',
  illumina: 'illumina',
  'jena-bioscience': 'jena',
  phadia: 'phadia',
  promega: 'promega',
  qiagen: 'qiagen',
  siemens: 'siemens',
  'sigma-aldrich': 'sigma-aldrich',
  usp: 'usp',
  biolegend: 'biolegend',
  capricorn: 'capricorn',
  'cell-signaling': 'cell-signaling',
  neb: 'neb',
  roche: 'roche',
  'thermo-fisher': 'thermo',
  'ivd-group-products': 'ivd-group-private-label',
}

/** Catch-all categories with no successor: drop the filter (→ full catalog). */
export const RETIRED_CATEGORY_SLUGS = new Set<string>([
  'reagents-disposables',
  'reagents-and-disposables',
  'disposables',
  'ilabu-kits-open-new-revenues-for-your-ivd-business',
])

export type LegacyCategoryTarget =
  | { category: string }
  | { manufacturer: string }
  | { none: true }

/** Where a legacy `?category=` slug should point now; null if the slug is current. */
export function resolveLegacyCategory(slug: string): LegacyCategoryTarget | null {
  const key = slug.toLowerCase()
  if (CATEGORY_SLUG_REDIRECTS[key]) return { category: CATEGORY_SLUG_REDIRECTS[key] }
  if (CATEGORY_TO_MANUFACTURER_REDIRECTS[key]) return { manufacturer: CATEGORY_TO_MANUFACTURER_REDIRECTS[key] }
  if (RETIRED_CATEGORY_SLUGS.has(key)) return { none: true }
  return null
}
