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
 * Legacy category slug → canonical slug.
 * Populated by cleanup-categories.ts; middleware 301s ?category=.
 *
 * Full GSC product-level WP→Next map still needs a user export — do not invent
 * product URL mappings here.
 */
export const CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  'reagents-and-disposables': 'reagents-disposables',
  abbott: 'reagents-disposables',
  bd: 'reagents-disposables',
  biomerieux: 'reagents-disposables',
  illumina: 'reagents-disposables',
  'jena-bioscience': 'reagents-disposables',
  phadia: 'reagents-disposables',
  promega: 'reagents-disposables',
  qiagen: 'reagents-disposables',
  siemens: 'reagents-disposables',
  'sigma-aldrich': 'reagents-disposables',
  usp: 'reagents-disposables',
  biolegend: 'reagents-disposables',
  capricorn: 'reagents-disposables',
  'cell-signaling': 'reagents-disposables',
  neb: 'reagents-disposables',
  roche: 'reagents-disposables',
  'thermo-fisher': 'reagents-disposables',
  biochemistry: 'reagents-disposables',
  coagulation: 'reagents-disposables',
  'covid-19-testing': 'reagents-disposables',
  'ilabu-kits-open-new-revenues-for-your-ivd-business': 'reagents-disposables',
  'ivd-group-products': 'reagents-disposables',
  microtubes: 'reagents-disposables',
  pcr: 'reagents-disposables',
  'pcr-tubes': 'reagents-disposables',
  'pipette-tips': 'reagents-disposables',
  tips: 'reagents-disposables',
  'laboratory-supplies': 'reagents-disposables',
  'pcr-molecular': 'reagents-disposables',
  'pcr-plates': 'reagents-disposables',
  'sars-2-covid-19': 'reagents-disposables',
  swabs: 'reagents-disposables',
}
