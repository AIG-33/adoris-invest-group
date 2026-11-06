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
     │ <3 tiles>      Quote · Search · Supplier        │
     └─────────────────────────────────────────────────┘

   The middle tile is rendered dark/"primary" — the visual anchor.

   Live SKU/name suggestions, Cmd+K focus, and CSV file upload are all
   preserved from the previous hero. The marketing copy comes from
   `dict.homepage.hero.pathway1..3`, kept i18n-driven.
   ───────────────────────────────────────────────────────────────────── */

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ArrowRight,
  Upload,
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
  Radar,
  ExternalLink,
  ShieldCheck,
  Grid3x3,
  Paperclip,
  Zap,
  ImagePlus,
  FileSpreadsheet,
  Type,
} from 'lucide-react'
import { getProductUrl } from '@/lib/product-url'
import { portalUrl } from '@/lib/supplier-portal'
import type { WantedProducts } from '@/lib/wanted-products'
import { parseBulkOrderText } from '@/lib/parse-bulk-order'
import { setPendingQuote } from '@/lib/quote-handoff'
import { SHEET_ACCEPT, isImageFile, isSheetFile } from '@/lib/sheet-to-text'

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
  /** Adoris tenant: the third tile points to the supplier portal. */
  isAdoris?: boolean
  portalCopy?: WantedTileCopy
  /** Live open requests from the supplier portal; null when the portal was unreachable. */
  wanted?: WantedProducts | null
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
  'primary antibodies': ShieldCheck,
  'conjugated antibodies': ShieldCheck,
  'secondary antibodies': ShieldCheck,
  'elisa kits': Grid3x3,
  'ivd elisa kits': Grid3x3,
  'laboratory chemicals & solvents': FlaskConical,
  'biochemicals & inhibitors': FlaskConical,
  'laboratory instruments & analyzers': Microscope,
  'surgical sutures': Syringe,
}

// Per-locale eyebrow, headline, subtitle and trust strip.
const COPY = {
  en: {
    eyebrow: (skus: number, brands: number) =>
      `B2B medical & lab supply · ${skus.toLocaleString()} SKUs · ${brands}+ manufacturers`,
    headline: 'Send your list in any form —',
    headlineAccent: 'get a quote in one click.',
    subtitle:
      'Paste catalog numbers, drop a photo, screenshot or Excel file — we match every item against our catalog and show prices instantly. Not in the catalog? We quote it within one business day.',
    placeholderShort: 'Paste your list',
    placeholderLong: 'Paste your list, drop a file — or type one SKU to search',
    searchCta: 'Search',
    quoteCta: 'Get quote',
    attach: 'Attach a photo, screenshot, Excel or CSV file',
    dropHint: 'Drop it here — we’ll price it in one click',
    worksWith: 'Works with',
    chipText: 'Pasted text',
    chipPhoto: 'Photo / screenshot',
    chipSheet: 'Excel / CSV',
    tryExample: 'Try an example',
    itemsDetected: (n: number) => `${n} items detected — press Get quote`,
    fileError: 'Use a photo, screenshot, Excel or CSV file.',
    trust: ['Original products', 'CE & ISO certified', 'EXW Vilnius'],
    searchHint: 'Press',
    enter: '↵',
    seeAll: 'to see all results',
    matching: 'Matching SKUs',
    of: 'of',
    nothingMatched: 'Nothing matched.',
    openCatalog: 'Open full catalog',
    uploadCsvLabel: 'Upload photo / Excel',
    forBuyers: 'For buyers',
    forSuppliers: 'For suppliers',
  },
  ru: {
    eyebrow: (skus: number, brands: number) =>
      `B2B-расходники и оборудование · ${skus.toLocaleString()} SKU · ${brands}+ производителей`,
    headline: 'Пришлите список в любом виде —',
    headlineAccent: 'получите КП в один клик.',
    subtitle:
      'Вставьте артикулы, перетащите фото, скриншот или Excel — сопоставим каждую позицию с каталогом и сразу покажем цены. Нет в каталоге? Посчитаем за один рабочий день.',
    placeholderShort: 'Вставьте список',
    placeholderLong: 'Вставьте список, перетащите файл — или введите один артикул для поиска',
    searchCta: 'Найти',
    quoteCta: 'Получить КП',
    attach: 'Прикрепить фото, скриншот, Excel или CSV',
    dropHint: 'Отпустите файл — посчитаем в один клик',
    worksWith: 'Подойдёт',
    chipText: 'Текст',
    chipPhoto: 'Фото / скриншот',
    chipSheet: 'Excel / CSV',
    tryExample: 'Попробовать на примере',
    itemsDetected: (n: number) => `Распознано позиций: ${n} — нажмите «Получить КП»`,
    fileError: 'Подойдут фото, скриншот, Excel или CSV.',
    trust: ['Оригинальная продукция', 'CE и ISO сертификация', 'EXW Вильнюс'],
    searchHint: 'Нажмите',
    enter: '↵',
    seeAll: 'чтобы увидеть все результаты',
    matching: 'Подходящие SKU',
    of: 'из',
    nothingMatched: 'Ничего не найдено.',
    openCatalog: 'Открыть весь каталог',
    uploadCsvLabel: 'Загрузить фото / Excel',
    forBuyers: 'Покупателям',
    forSuppliers: 'Поставщикам',
  },
} as const

const CHIP =
  'inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 text-[12.5px] font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900'

const EXAMPLE_LIST = '10446232\t2\n10309757, 1\n11622889190; 5'

export function HeroSearch({
  translations,
  language,
  totalProducts,
  totalManufacturers,
  isAdoris = false,
  portalCopy,
  wanted = null,
}: HeroSearchProps) {
  const router = useRouter()
  const t = COPY[language] || COPY.en

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')

  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const dragDepthRef = useRef(0)

  // One field, two jobs: a single SKU searches, a list (2+ lines) becomes a quote.
  const listCount = useMemo(() => parseBulkOrderText(query).length, [query])
  const quoteMode = query.includes('\n') || listCount >= 2

  // Grow with the pasted list, up to ~5 lines.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`
  }, [query])

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
    if (query.trim().length < 2 || quoteMode) {
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
  }, [query, quoteMode])

  const goQuote = (text: string, files: File[] = []) => {
    setPendingQuote({ text, files })
    router.push('/bulk-order#bulk-form')
  }

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    setFocused(false)
    if (quoteMode) {
      goQuote(query)
      return
    }
    router.push(`/products?search=${encodeURIComponent(q)}`)
  }

  // A dropped / attached / pasted file goes straight to pricing — no extra click.
  const acceptFiles = (list: FileList | File[] | null | undefined) => {
    const files = Array.from(list || []).filter((f) => isImageFile(f) || isSheetFile(f))
    if (files.length === 0) {
      setFileError(t.fileError)
      return
    }
    setFileError('')
    goQuote(quoteMode ? query : '', files)
  }

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const images = Array.from(e.clipboardData?.files || []).filter(isImageFile)
    if (images.length === 0) return
    e.preventDefault()
    acceptFiles(images)
  }

  const dragHandlers = {
    onDragEnter: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes('Files')) return
      e.preventDefault()
      dragDepthRef.current += 1
      setDragging(true)
    },
    onDragOver: (e: React.DragEvent) => {
      if (e.dataTransfer.types.includes('Files')) e.preventDefault()
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault()
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
      if (dragDepthRef.current === 0) setDragging(false)
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      dragDepthRef.current = 0
      setDragging(false)
      acceptFiles(e.dataTransfer.files)
    },
  }

  const showOverlay = !quoteMode && focused && (results.length > 0 || isSearching || query.trim().length >= 2)

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
            className="font-display mt-3 max-w-5xl text-balance text-[34px] font-extrabold leading-[1.04] tracking-[-0.028em] text-white sm:mt-4 sm:text-5xl lg:text-[60px] xl:text-[72px]"
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
            <form onSubmit={submit} {...dragHandlers}>
              <div
                className={`relative flex min-h-[56px] items-stretch overflow-hidden rounded-2xl border bg-white shadow-[0_18px_50px_-16px_rgba(10,17,22,0.25)] transition-all sm:min-h-[64px] ${
                  dragging ? 'border-2 border-dashed border-[#0a7ea4]' : 'border-neutral-200'
                }`}
                style={
                  focused || dragging
                    ? { boxShadow: `0 0 0 4px ${ACCENT}33, 0 18px 50px -16px rgba(10,17,22,0.25)` }
                    : undefined
                }
              >
                <span className="grid place-items-center px-3.5 text-neutral-500 sm:px-6" aria-hidden>
                  {quoteMode ? (
                    <Zap className="h-5 w-5 text-[#0a7ea4]" strokeWidth={1.75} />
                  ) : (
                    <Search className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </span>
                <div className="relative min-w-0 flex-1">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      if (fileError) setFileError('')
                    }}
                    onFocus={() => setFocused(true)}
                    onPaste={onPaste}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault()
                        submit()
                      }
                    }}
                    wrap={quoteMode ? 'soft' : 'off'}
                    spellCheck={false}
                    aria-label={t.placeholderLong}
                    className={`font-display block w-full resize-none overflow-y-auto bg-transparent py-4 text-base font-medium leading-6 text-neutral-900 outline-none sm:py-5 sm:text-lg sm:leading-6 ${
                      quoteMode ? 'font-mono-brand !text-[14px]' : ''
                    }`}
                  />
                  {!query && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 right-2 flex items-center truncate text-base font-medium text-neutral-400 sm:text-lg"
                    >
                      <span className="truncate xl:hidden">{t.placeholderShort}</span>
                      <span className="hidden truncate xl:inline">{t.placeholderLong}</span>
                    </span>
                  )}
                  {dragging && (
                    <span className="pointer-events-none absolute inset-0 flex items-center bg-white text-sm font-semibold text-[#0a7ea4] sm:text-base">
                      {t.dropHint}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={t.attach}
                  title={t.attach}
                  className="grid w-11 flex-shrink-0 place-items-center text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0a7ea4] sm:w-12"
                >
                  <Paperclip className="h-5 w-5" strokeWidth={1.75} />
                </button>
                {!quoteMode && (
                  <kbd
                    className="font-mono-brand my-auto mr-2 hidden rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-500 md:inline"
                    aria-hidden
                  >
                    ⌘K
                  </kbd>
                )}
                <button
                  type="submit"
                  className="font-display inline-flex flex-shrink-0 items-center gap-2 px-4 text-sm font-bold text-white transition-colors hover:brightness-90 sm:px-8 sm:text-[15px]"
                  style={{ background: '#0a7ea4' }}
                >
                  {quoteMode && <Zap className="h-4 w-4" strokeWidth={2.25} aria-hidden />}
                  <span>{quoteMode ? t.quoteCta : t.searchCta}</span>
                  <ArrowRight className="hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
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

          {/* ─── WHAT THE FIELD ACCEPTS / LIST STATUS ───────────────────── */}
          <div className="mt-3 flex min-h-[36px] flex-wrap items-center gap-2" aria-live="polite">
            {quoteMode ? (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: '#e6f1f6', color: '#0a7ea4' }}>
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                {t.itemsDetected(listCount)}
              </span>
            ) : (
              <>
                <span className="text-[12px] font-medium text-neutral-500">{t.worksWith}:</span>
                <button type="button" onClick={() => inputRef.current?.focus()} className={CHIP}>
                  <Type className="h-3.5 w-3.5" aria-hidden />
                  {t.chipText}
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className={CHIP}>
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                  {t.chipPhoto}
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className={CHIP}>
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                  {t.chipSheet}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(EXAMPLE_LIST)
                    inputRef.current?.focus()
                  }}
                  className="ml-1 inline-flex min-h-[36px] items-center text-[12.5px] font-semibold underline-offset-4 hover:underline"
                  style={{ color: '#0a7ea4' }}
                >
                  {t.tryExample} →
                </button>
              </>
            )}
            {fileError && <span className="text-[12.5px] font-medium text-red-700">{fileError}</span>}
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

          {/* ─── HIDDEN FILE INPUT — paperclip, format chips and the quote tile ── */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={`image/*,${SHEET_ACCEPT}`}
            className="hidden"
            onChange={(e) => {
              acceptFiles(e.target.files)
              e.target.value = ''
            }}
          />

          {/* ─── TWO FEATURE TILES: buyers (quote) and suppliers (wanted) ──── */}
          {translations.pathway2 && translations.pathway3 && (
            <div className="mt-8 grid grid-cols-1 gap-4 pb-12 sm:mt-10 md:grid-cols-2 md:gap-6 sm:pb-16">
              <FeatureTile
                variant="dark"
                eyebrow={t.forBuyers}
                Icon={Zap}
                title={translations.pathway2.title}
                blurb={translations.pathway2.description}
                cta={translations.pathway2.cta}
                href="/bulk-order"
                secondaryAction={{
                  Icon: Upload,
                  label: t.uploadCsvLabel,
                  onClick: () => fileInputRef.current?.click(),
                }}
              >
                <ul className="flex flex-wrap gap-2">
                  {[
                    { Icon: Type, label: t.chipText },
                    { Icon: ImagePlus, label: t.chipPhoto },
                    { Icon: FileSpreadsheet, label: t.chipSheet },
                  ].map(({ Icon: ChipIcon, label }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-medium text-[#dbe7ec]"
                    >
                      <ChipIcon aria-hidden="true" className="h-3.5 w-3.5 text-[#7ed4ee]" />
                      {label}
                    </li>
                  ))}
                </ul>
              </FeatureTile>
              {isAdoris && portalCopy ? (
                <FeatureTile
                  variant="live"
                  eyebrow={t.forSuppliers}
                  Icon={Radar}
                  badge={copyLiveBadge(portalCopy.live)}
                  title={portalCopy.title}
                  blurb={portalCopy.blurb}
                  cta={portalCopy.cta}
                  href={portalUrl('/#requests', 'hero_tile')}
                  newTabLabel={portalCopy.newTabLabel}
                >
                  {wanted && wanted.items.length > 0 && (
                    <WantedList count={portalCopy.count.replace('{count}', String(wanted.count))} items={wanted.items} />
                  )}
                </FeatureTile>
              ) : (
                <FeatureTile
                  variant="live"
                  eyebrow={t.forSuppliers}
                  Icon={Handshake}
                  title={translations.pathway3.title}
                  blurb={translations.pathway3.description}
                  cta={translations.pathway3.cta}
                  href="/supplier"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

interface WantedTileCopy {
  live: string
  title: string
  blurb: string
  count: string
  cta: string
  newTabLabel: string
}

function copyLiveBadge(label: string) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  )
}

function WantedList({ count, items }: { count: string; items: WantedProducts['items'] }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white/80 px-3.5 py-2.5">
      <p className="text-[12px] font-semibold text-emerald-800">{count}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex min-w-0 items-baseline gap-2 text-[12.5px]">
            <span className="font-mono-brand font-semibold text-neutral-900">{item.sku}</span>
            <span className="min-w-0 flex-1 truncate text-neutral-600">{item.manufacturer}</span>
            {item.quantity != null && (
              <span className="flex-shrink-0 tabular-nums text-neutral-600">
                ×{item.quantity.toLocaleString('en-US')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── FeatureTile — the two big entry points under the hero search ────────
// dark: ink card with cyan CTA (buyers). live: emerald-tinted card (suppliers).
// The CTA is the real link; its ::after stretches over the card so the whole
// card is clickable, while secondaryAction sits above it (z-10).
interface FeatureTileProps {
  variant: 'dark' | 'live'
  eyebrow: string
  Icon: any
  badge?: React.ReactNode
  title: string
  blurb: string
  cta: string
  href: string
  /** Set for off-site links: opens in a new tab and is announced to screen readers. */
  newTabLabel?: string
  secondaryAction?: { Icon: any; label: string; onClick: () => void }
  children?: React.ReactNode
}

function FeatureTile({
  variant,
  eyebrow,
  Icon,
  badge,
  title,
  blurb,
  cta,
  href,
  newTabLabel,
  secondaryAction,
  children,
}: FeatureTileProps) {
  const dark = variant === 'dark'
  const ctaClass = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-bold transition-all group-hover:gap-3 focus-visible:outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-offset-2 ${
    dark
      ? 'bg-[#7ed4ee] text-[#0c1116] hover:bg-[#9de0f3] focus-visible:after:ring-[#7ed4ee] focus-visible:after:ring-offset-[#0c1116]'
      : 'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:after:ring-emerald-700'
  }`
  const ctaContent = (
    <>
      {cta}
      <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
      {newTabLabel && (
        <>
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 opacity-80" />
          <span className="sr-only"> {newTabLabel}</span>
        </>
      )}
    </>
  )

  return (
    <div
      className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1 sm:p-8 ${
        dark
          ? 'bg-[#0c1116] text-white'
          : 'border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white text-neutral-900'
      }`}
      style={{
        boxShadow: dark
          ? '0 28px 60px -28px rgba(10,126,164,0.75)'
          : '0 24px 50px -30px rgba(4,120,87,0.45)',
      }}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: '#0a7ea4' }}
        />
      )}

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl ${
              dark ? 'bg-white/10 text-[#7ed4ee]' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <span
            className={`text-[12px] font-bold uppercase tracking-[0.14em] ${
              dark ? 'text-[#a8c1cc]' : 'text-emerald-800'
            }`}
          >
            {eyebrow}
          </span>
        </div>
        {badge}
      </div>

      <h2 className="relative font-display text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[30px]">
        {title}
      </h2>
      <p className={`relative text-[15px] leading-[1.6] ${dark ? 'text-[#b9cdd6]' : 'text-[#4a5462]'}`}>
        {blurb}
      </p>

      {children && <div className="relative">{children}</div>}

      <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-2">
        {newTabLabel ? (
          <a href={href} target="_blank" rel="noopener" className={ctaClass}>
            {ctaContent}
          </a>
        ) : (
          <Link href={href} className={ctaClass}>
            {ctaContent}
          </Link>
        )}

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className={`relative z-10 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${
              dark
                ? 'border border-white/20 text-[#cfdde2] hover:bg-white/10 focus-visible:ring-[#7ed4ee]'
                : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-emerald-700'
            }`}
          >
            <secondaryAction.Icon aria-hidden="true" className="h-4 w-4" />
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  )
}
