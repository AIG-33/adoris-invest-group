'use client'

/* ─────────────────────────────────────────────────────────────────────────
   HeroSearch — Adoris Medical (V03 "Masthead" / variant 02 direction)
   ─────────────────────────────────────────────────────────────────────────
   Layout (top → bottom, desktop reference):

     ┌─────────────────────────────────────────────────┐
     │ <photo band>   hero image + dark wash + headline │   380 px
     ├─────────────────────────────────────────────────┤
     │ <search bar>   overlaps the band (z-index 2)    │
     │ <sub + trust>  one-line description + ticks     │
     ├─────────────────────────────────────────────────┤
     │ <3 tiles>      Search · Bulk paste · Supplier   │
     └─────────────────────────────────────────────────┘

   The middle tile is rendered dark/"primary" — the visual anchor.

   Live SKU/name suggestions, Cmd+K focus, and CSV file upload are all
   preserved from the previous hero. The marketing copy comes from
   `dict.homepage.hero.pathway1..3`, kept i18n-driven.
   ───────────────────────────────────────────────────────────────────── */

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ArrowRight,
  Upload,
  ClipboardPaste,
  Package,
  Beaker,
  Microscope,
  Pill,
  Syringe,
  TestTubes,
  Stethoscope,
  FlaskConical,
  Scan,
  Layers,
  Check,
  Handshake,
} from 'lucide-react'
import { getProductUrl } from '@/lib/product-url'

// Accent used for the cyan headline tail and the on-dark primary-tile CTA.
// Kept as a literal hex so the hero stays recognisable across white-labelled
// tenants whose brand may be greyscale (e.g. Adoris brand-1 = #333).
const ACCENT = '#7ed4ee'

interface SearchResult {
  id: string
  name: string
  sku: string
  slug: string
  price: number
  imageUrl: string | null
  category: { name: string } | null
  manufacturer: { name: string; slug: string } | null
}

interface QuickCategory {
  slug: string
  name: string
  count: number
}

interface PathwayCopy {
  step: string
  title: string
  description: string
  cta: string
  microCopy: string
}

interface HeroSearchTranslations {
  searchPlaceholder: string
  browseCatalog: string
  pathwaysEyebrow?: string
  pathwaysHeading?: string
  pathway1?: PathwayCopy
  pathway2?: PathwayCopy
  pathway3?: PathwayCopy
}

interface HeroSearchProps {
  translations: HeroSearchTranslations
  language: 'en' | 'ru'
  companyName: string
  totalProducts: number
  totalManufacturers: number
  quickCategories: QuickCategory[]
}

// Decorative — only used by the live-suggestions dropdown when a product
// has no image, so we paint a category-shaped placeholder instead.
const CATEGORY_ICONS: Record<string, any> = {
  reagents: Beaker,
  equipment: Microscope,
  'equipment-imported': Microscope,
  consumables: Pill,
  disposables: Syringe,
  analyzers: Scan,
  diagnostics: Stethoscope,
  chemicals: FlaskConical,
  'lab-supplies': TestTubes,
  histology: Layers,
}

// Per-locale eyebrow, headline, subtitle and trust strip.
const COPY = {
  en: {
    eyebrow: (skus: number, brands: number) =>
      `B2B medical & lab supply · ${skus.toLocaleString()} SKUs · ${brands}+ manufacturers`,
    headline: 'Find any lab supply —',
    headlineAccent: 'quoted in one business day.',
    subtitle:
      'Original products from leading European manufacturers. Search by SKU or name, paste a bulk list, or partner with us — direct from the manufacturer.',
    trust: ['Original products', 'CE & ISO certified', 'EXW Vilnius'],
    searchHint: 'Press',
    enter: '↵',
    seeAll: 'to see all results',
    matching: 'Matching SKUs',
    of: 'of',
    nothingMatched: 'Nothing matched.',
    openCatalog: 'Open full catalog',
    uploadCsvLabel: 'Upload .csv / .xlsx',
  },
  ru: {
    eyebrow: (skus: number, brands: number) =>
      `B2B-расходники и оборудование · ${skus.toLocaleString()} SKU · ${brands}+ производителей`,
    headline: 'Найдите любой расходник —',
    headlineAccent: 'расчёт за один рабочий день.',
    subtitle:
      'Оригинальная продукция от ведущих европейских производителей. Поиск по артикулу или названию, массовый заказ по списку или прямое партнёрство с производителем.',
    trust: ['Оригинальная продукция', 'CE и ISO сертификация', 'EXW Вильнюс'],
    searchHint: 'Нажмите',
    enter: '↵',
    seeAll: 'чтобы увидеть все результаты',
    matching: 'Подходящие SKU',
    of: 'из',
    nothingMatched: 'Ничего не найдено.',
    openCatalog: 'Открыть весь каталог',
    uploadCsvLabel: 'Загрузить .csv / .xlsx',
  },
} as const

export function HeroSearch({
  translations,
  language,
  totalProducts,
  totalManufacturers,
}: HeroSearchProps) {
  const router = useRouter()
  const t = COPY[language] || COPY.en

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Cmd+K / Ctrl+K focuses the hero search from anywhere on the homepage.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click-outside closes the suggestions overlay.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Debounced live suggestions — same backend as before.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        if (res.ok) setResults(await res.json())
      } catch {
        // ignore — suggestions are non-critical
      } finally {
        setIsSearching(false)
      }
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setFocused(false)
    router.push(`/products?search=${encodeURIComponent(q)}`)
  }

  const onFile = (file: File | null) => {
    if (!file) return
    // Hand off to the bulk-order page, which accepts the same formats.
    router.push('/bulk-order')
  }

  const focusSearch = () => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const showOverlay = focused && (results.length > 0 || isSearching || query.trim().length >= 2)

  return (
    <section className="relative" aria-label="Hero">
      {/* ╭─ PHOTO MASTHEAD BAND ────────────────────────────────────────────╮
          A horizontal band with the hero photograph behind a dark wash
          and the headline overlaid on the left half. Height scales down
          on smaller viewports so the headline still dominates the fold. */}
      <div className="relative h-[340px] overflow-hidden bg-[#0c1116] sm:h-[380px] lg:h-[420px]">
        <Image
          src="/hero/lab-pipette.jpg"
          alt={
            language === 'ru'
              ? 'Лабораторный пипетка дозирует реагент в микропланшет'
              : 'Pipette dispensing reagent into a 96-well microplate'
          }
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 55%' }}
        />
        {/* Dark wash — keeps the left side legible while letting the photo breathe on the right. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(12,17,22,0.88) 0%, rgba(12,17,22,0.55) 55%, rgba(12,17,22,0.25) 100%)',
          }}
        />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8 lg:px-12">
          <div
            className="font-mono-brand text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px]"
            style={{ color: ACCENT }}
          >
            · {t.eyebrow(totalProducts, totalManufacturers)} ·
          </div>
          <h1
            className="font-display mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.028em] text-white sm:mt-4 sm:text-5xl md:text-6xl lg:text-[78px]"
          >
            {t.headline}
            <br className="hidden sm:block" />
            <span style={{ color: ACCENT }}> {t.headlineAccent}</span>
          </h1>
        </div>
      </div>

      {/* ╭─ CONTENT BLOCK ───────────────────────────────────────────────────╮
          Search bar floats up over the photo band by -32px, then the
          subtitle + trust ticks line, then the three tiles. */}
      <div className="bg-[#f7f8fa]">
        <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 sm:-mt-10 sm:px-8 lg:px-12">
          {/* ─── SEARCH BAR ────────────────────────────────────────────── */}
          <div ref={wrapRef} className="relative">
            <form onSubmit={submit}>
              <div
                className="relative flex h-14 items-stretch overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_50px_-16px_rgba(10,17,22,0.25)] transition-all sm:h-16"
                style={
                  focused
                    ? { boxShadow: `0 0 0 4px ${ACCENT}33, 0 18px 50px -16px rgba(10,17,22,0.25)` }
                    : undefined
                }
              >
                <span className="grid place-items-center px-5 text-neutral-500 sm:px-6">
                  <Search className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  placeholder={translations.searchPlaceholder}
                  className="font-display flex-1 bg-transparent text-base font-medium text-neutral-900 placeholder-neutral-400 outline-none sm:text-lg"
                  aria-label={translations.searchPlaceholder}
                />
                <kbd
                  className="font-mono-brand my-auto mr-2 hidden rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-500 sm:inline"
                  aria-hidden
                >
                  ⌘K
                </kbd>
                <button
                  type="submit"
                  className="font-display inline-flex items-center gap-2 px-5 text-sm font-bold text-white transition-colors sm:px-8 sm:text-[15px]"
                  style={{ background: '#0a7ea4' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#086a89'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0a7ea4'
                  }}
                >
                  <span>{translations.browseCatalog.split(' ')[0]}</span>
                  <ArrowRight className="hidden h-4 w-4 sm:inline" strokeWidth={2} />
                </button>
              </div>
            </form>

            {/* ─── LIVE SUGGESTIONS OVERLAY ────────────────────────────── */}
            {showOverlay && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-2xl">
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    {t.matching}
                  </span>
                  <span className="font-mono-brand text-[11px] text-neutral-400">
                    {isSearching
                      ? '…'
                      : `${results.length} ${t.of} ${totalProducts.toLocaleString()}`}
                  </span>
                </div>

                {results.length === 0 && !isSearching && query.trim().length >= 2 && (
                  <div className="px-4 py-6 text-center text-sm text-neutral-500">
                    {t.nothingMatched}{' '}
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      className="font-medium"
                      style={{ color: '#0a7ea4' }}
                    >
                      {t.openCatalog} →
                    </Link>
                  </div>
                )}

                {results.slice(0, 5).map((p, i) => {
                  const CatIcon = CATEGORY_ICONS[p.category?.name?.toLowerCase() ?? ''] || Package
                  return (
                    <Link
                      key={p.id}
                      href={getProductUrl({
                        slug: p.slug,
                        sku: p.sku,
                        manufacturer: { slug: p.manufacturer?.slug || 'unknown' },
                      })}
                      className={`grid grid-cols-[40px_1fr_auto_auto] items-center gap-3.5 px-4 py-3 transition-colors hover:bg-neutral-50 ${
                        i < Math.min(results.length, 5) - 1 ? 'border-b border-neutral-100' : ''
                      }`}
                      onClick={() => setFocused(false)}
                    >
                      <div
                        className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg"
                        style={{ background: '#e6f1f6', color: '#0a7ea4' }}
                      >
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <CatIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-neutral-900">
                          <span
                            className="font-mono-brand mr-2.5 text-[12px] font-semibold"
                            style={{ color: '#0a7ea4' }}
                          >
                            {p.sku}
                          </span>
                          {p.manufacturer?.name ? `${p.manufacturer.name} · ` : ''}
                          {p.name}
                        </div>
                        {p.category?.name && (
                          <div className="mt-0.5 truncate text-[11px] text-neutral-500">
                            {p.category.name}
                          </div>
                        )}
                      </div>
                      <div className="font-mono-brand text-sm font-bold text-neutral-900">
                        {p.price > 0 ? `€${Number(p.price).toLocaleString()}` : '—'}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                    </Link>
                  )
                })}

                {results.length > 0 && (
                  <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[12px] text-neutral-600">
                    <span>
                      {t.searchHint}{' '}
                      <kbd className="font-mono-brand mx-1 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px]">
                        {t.enter}
                      </kbd>{' '}
                      {t.seeAll}
                    </span>
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      className="font-semibold"
                      style={{ color: '#0a7ea4' }}
                      onClick={() => setFocused(false)}
                    >
                      {t.openCatalog} →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── SUBTITLE + TRUST TICKS ──────────────────────────────────── */}
          <div className="mt-5 flex flex-col gap-3 text-[14px] text-neutral-600 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="max-w-2xl leading-relaxed">{t.subtitle}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-neutral-700 sm:flex-shrink-0">
              {t.trust.map((label) => (
                <li key={label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span
                    className="grid h-4 w-4 place-items-center rounded-full"
                    style={{ background: '#e6f1f6', color: '#0a7ea4' }}
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* ─── HIDDEN FILE INPUT — driven by tile 2's secondary upload ──── */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />

          {/* ─── THREE TILES ─────────────────────────────────────────────── */}
          {translations.pathway1 && translations.pathway2 && translations.pathway3 && (
            <div className="mt-8 grid grid-cols-1 gap-4 pb-12 sm:mt-10 sm:grid-cols-3 sm:gap-5 sm:pb-16">
              <Tile
                Icon={Search}
                title={translations.pathway1.title}
                blurb={translations.pathway1.description}
                cta={translations.pathway1.cta}
                onClick={focusSearch}
              />
              <Tile
                Icon={ClipboardPaste}
                title={translations.pathway2.title}
                blurb={translations.pathway2.description}
                cta={translations.pathway2.cta}
                href="/bulk-order"
                primary
                secondaryAction={{
                  Icon: Upload,
                  label: t.uploadCsvLabel,
                  onClick: () => fileInputRef.current?.click(),
                }}
              />
              <Tile
                Icon={Handshake}
                title={translations.pathway3.title}
                blurb={translations.pathway3.description}
                cta={translations.pathway3.cta}
                href="/supplier"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Tile — one of the three entry-point cards under the search bar ──────
// Non-primary: white card with cyan icon backplate and cyan CTA.
// Primary:     dark ink card with cyan accents — anchors the visual hierarchy.
interface TileProps {
  Icon: any
  title: string
  blurb: string
  cta: string
  href?: string
  onClick?: () => void
  primary?: boolean
  secondaryAction?: {
    Icon: any
    label: string
    onClick: () => void
  }
}

function Tile({ Icon, title, blurb, cta, href, onClick, primary, secondaryAction }: TileProps) {
  const inner = (
    <div
      className={`group flex h-full flex-col gap-3 rounded-2xl p-5 transition-all hover:-translate-y-0.5 sm:p-6 ${
        primary
          ? 'bg-[#0c1116] text-white'
          : 'border border-neutral-200 bg-white text-neutral-900'
      }`}
      style={{
        boxShadow: primary
          ? '0 18px 40px -24px rgba(10,126,164,0.55)'
          : '0 4px 14px -10px rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="grid h-11 w-11 place-items-center rounded-xl sm:h-12 sm:w-12"
        style={{
          background: primary ? 'rgba(255,255,255,0.12)' : '#e6f1f6',
          color: primary ? '#fff' : '#0a7ea4',
        }}
      >
        <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.6} />
      </div>

      <div className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.015em] sm:text-[22px]">
        {title}
      </div>
      <p
        className="text-[14px] leading-[1.55]"
        style={{ color: primary ? '#a8c1cc' : '#4a5462' }}
      >
        {blurb}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
        <span
          className="inline-flex items-center gap-2 text-[14px] font-bold transition-all group-hover:gap-3"
          style={{ color: primary ? ACCENT : '#0a7ea4' }}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>

        {secondaryAction && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              secondaryAction.onClick()
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors"
            style={{
              border: primary ? '1px solid rgba(255,255,255,0.16)' : '1px solid #e5e7eb',
              background: primary ? 'rgba(255,255,255,0.04)' : '#fff',
              color: primary ? '#cfdde2' : '#4a5462',
            }}
          >
            <secondaryAction.Icon className="h-3 w-3" />
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="block h-full w-full text-left">
      {inner}
    </button>
  )
}
