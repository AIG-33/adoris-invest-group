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

  const focusSearch = () => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

          {/* ─── THREE TILES ─────────────────────────────────────────────── */}
          {translations.pathway1 && translations.pathway2 && translations.pathway3 && (
            <div className="mt-8 grid grid-cols-1 gap-4 pb-12 sm:mt-10 sm:grid-cols-3 sm:gap-5 sm:pb-16">
              <Tile
                Icon={Zap}
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
                Icon={Search}
                title={translations.pathway1.title}
                blurb={translations.pathway1.description}
                cta={translations.pathway1.cta}
                onClick={focusSearch}
              />
              {isAdoris && portalCopy ? (
                <WantedTile copy={portalCopy} wanted={wanted} />
              ) : (
                <Tile
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

// ─── WantedTile — live preview of the supplier portal's open requests ─────
interface WantedTileCopy {
  live: string
  title: string
  blurb: string
  count: string
  cta: string
  newTabLabel: string
}

function WantedTile({ copy, wanted }: { copy: WantedTileCopy; wanted: WantedProducts | null }) {
  const hasItems = !!wanted && wanted.items.length > 0
  return (
    <div className="h-full">
      <div
        className="group relative flex h-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 transition-all hover:-translate-y-0.5 sm:p-6"
        style={{ boxShadow: '0 4px 14px -10px rgba(0,0,0,0.1)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl sm:h-12 sm:w-12"
            style={{ background: '#e6f1f6', color: '#0a7ea4' }}
          >
            <Radar aria-hidden="true" className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.6} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {copy.live}
          </span>
        </div>

        <div className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.015em] sm:text-[22px]">
          {copy.title}
        </div>
        <p className="text-[14px] leading-[1.55]" style={{ color: '#4a5462' }}>
          {copy.blurb}
        </p>

        {hasItems && (
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 px-3 py-2">
            <p className="text-[12px] font-semibold text-neutral-700">
              {copy.count.replace('{count}', String(wanted!.count))}
            </p>
            <ul className="mt-1.5 space-y-1">
              {wanted!.items.map((item) => (
                <li key={item.id} className="flex min-w-0 items-baseline gap-2 text-[12px]">
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
        )}

        <div className="mt-auto pt-2">
          <a
            href={portalUrl('/#requests', 'hero_tile')}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center gap-2 text-[14px] font-bold transition-all group-hover:gap-3 focus-visible:outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-[#0a7ea4] focus-visible:after:ring-offset-2"
            style={{ color: '#0a7ea4' }}
          >
            {copy.cta}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            <ExternalLink aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only"> {copy.newTabLabel}</span>
          </a>
        </div>
      </div>
    </div>
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
  /** Off-site CTA: the CTA is the link and stretches over the whole card. */
  external?: { href: string; newTabLabel: string }
  /** Extra on-site text link; sits above the stretched CTA. Only used with `external`. */
  secondaryLink?: { href: string; label: string }
}

function Tile({ Icon, title, blurb, cta, href, onClick, primary, secondaryAction, external, secondaryLink }: TileProps) {
  const ctaColor = primary ? ACCENT : '#0a7ea4'
  const inner = (
    <div
      className={`group relative flex h-full flex-col gap-3 rounded-2xl p-5 transition-all hover:-translate-y-0.5 sm:p-6 ${
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

      <div className={`mt-auto flex flex-wrap items-center pt-2 ${external ? 'gap-x-4 gap-y-1' : 'gap-3'}`}>
        {external ? (
          <a
            href={external.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center gap-2 text-[14px] font-bold transition-all group-hover:gap-3 focus-visible:outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-[#0a7ea4] focus-visible:after:ring-offset-2"
            style={{ color: ctaColor }}
          >
            {cta}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            <ExternalLink aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only"> {external.newTabLabel}</span>
          </a>
        ) : (
          <span
            className="inline-flex items-center gap-2 text-[14px] font-bold transition-all group-hover:gap-3"
            style={{ color: ctaColor }}
          >
            {cta}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        )}

        {external && secondaryLink && (
          <Link
            href={secondaryLink.href}
            className="relative z-10 inline-flex min-h-[44px] items-center text-[13px] font-medium underline underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ea4] rounded"
            style={{ color: primary ? '#cfdde2' : '#4a5462' }}
          >
            {secondaryLink.label}
          </Link>
        )}

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

  if (external) {
    return <div className="h-full">{inner}</div>
  }

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
