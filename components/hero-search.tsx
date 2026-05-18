'use client'

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
  ShieldCheck,
  Snowflake,
  BadgeCheck,
  Truck,
  Handshake,
  Sparkles,
} from 'lucide-react'
import { getProductUrl } from '@/lib/product-url'

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

const COPY = {
  en: {
    eyebrow: (skus: number, brands: number) =>
      `Live · ${skus.toLocaleString()} SKUs · ${brands}+ manufacturers · ships from Vilnius`,
    headlinePart1: 'Find any lab supply.',
    headlinePart2: 'Quoted in one business day.',
    tagline:
      'From single-SKU urgent orders to full-quarter contracts — for hospitals, labs, and distributors across Europe and the CIS.',
    or: 'or',
    uploadCsv: 'Upload SKU list (.csv, .xlsx)',
    pasteQuote: "Paste competitor's quote — we benchmark",
    browseManufacturers: 'Browse by manufacturer',
    jumpToDiscipline: 'Or jump to a discipline',
    matching: 'Matching SKUs',
    pressEnter: 'Press',
    toSeeAll: 'to see all results',
    openCatalog: 'Open full catalog',
    inStock: 'in stock',
    trustBadges: [
      { icon: 'shield' as const, label: 'CE marked' },
      { icon: 'badge' as const, label: 'ISO 9001' },
      { icon: 'snow' as const, label: 'Cold-chain' },
      { icon: 'truck' as const, label: 'EXW Vilnius' },
    ],
    floatingCardsHeading: 'Live in catalog',
  },
  ru: {
    eyebrow: (skus: number, brands: number) =>
      `Онлайн · ${skus.toLocaleString()} SKU · ${brands}+ производителей · отгрузка из Вильнюса`,
    headlinePart1: 'Найдите любой расходник.',
    headlinePart2: 'Расчёт за один рабочий день.',
    tagline:
      'От срочных заказов в один SKU до квартальных контрактов — для клиник, лабораторий и дистрибьюторов в Европе и СНГ.',
    or: 'или',
    uploadCsv: 'Загрузить список SKU (.csv, .xlsx)',
    pasteQuote: 'Вставить прайс конкурента — мы сравним',
    browseManufacturers: 'По производителю',
    jumpToDiscipline: 'Или перейти к разделу',
    matching: 'Подходящие SKU',
    pressEnter: 'Нажмите',
    toSeeAll: 'чтобы увидеть все результаты',
    openCatalog: 'Открыть весь каталог',
    inStock: 'на складе',
    trustBadges: [
      { icon: 'shield' as const, label: 'CE сертификат' },
      { icon: 'badge' as const, label: 'ISO 9001' },
      { icon: 'snow' as const, label: 'Холод-цепь' },
      { icon: 'truck' as const, label: 'EXW Вильнюс' },
    ],
    floatingCardsHeading: 'Сейчас в каталоге',
  },
} as const

const TRUST_ICON: Record<string, any> = {
  shield: ShieldCheck,
  badge: BadgeCheck,
  snow: Snowflake,
  truck: Truck,
}

// Decorative cards floating to the side of the hero — purely visual, not real data.
// They give the section the "product-y" feel of Linear/Vercel landing pages.
// `tone` keys map to entries in CARD_TONE below.
const FLOATING_CARDS = {
  en: [
    {
      sku: '07P3203',
      brand: 'Beckman Coulter',
      name: 'CRP reagent kit',
      stock: '84 in stock',
      icon: 'drop' as const,
      tone: 'mint' as const,
    },
    {
      sku: '363080',
      brand: 'BD Vacutainer',
      name: 'Plasma tube ×100',
      stock: '1,240 in stock',
      icon: 'syringe' as const,
      tone: 'coral' as const,
    },
    {
      sku: '05031738',
      brand: 'Roche',
      name: 'Cobas Glucose ×500',
      stock: '220 in stock',
      icon: 'beaker' as const,
      tone: 'blue' as const,
    },
  ],
  ru: [
    {
      sku: '07P3203',
      brand: 'Beckman Coulter',
      name: 'Реагент CRP',
      stock: '84 на складе',
      icon: 'drop' as const,
      tone: 'mint' as const,
    },
    {
      sku: '363080',
      brand: 'BD Vacutainer',
      name: 'Пробирка для плазмы ×100',
      stock: '1 240 на складе',
      icon: 'syringe' as const,
      tone: 'coral' as const,
    },
    {
      sku: '05031738',
      brand: 'Roche',
      name: 'Cobas Глюкоза ×500',
      stock: '220 на складе',
      icon: 'beaker' as const,
      tone: 'blue' as const,
    },
  ],
} as const

const CARD_ICON: Record<string, any> = {
  drop: Beaker,
  syringe: Syringe,
  beaker: FlaskConical,
}

const CARD_TONE: Record<string, { bg: string; fg: string }> = {
  mint:   { bg: 'var(--accent-mint-soft)',   fg: 'var(--accent-mint)' },
  coral:  { bg: 'var(--accent-coral-soft)',  fg: 'var(--accent-coral)' },
  blue:   { bg: 'var(--accent-blue-soft)',   fg: 'var(--accent-blue)' },
  violet: { bg: 'var(--accent-violet-soft)', fg: 'var(--accent-violet)' },
}

export function HeroSearch({
  translations,
  language,
  companyName,
  totalProducts,
  totalManufacturers,
  quickCategories,
}: HeroSearchProps) {
  const router = useRouter()
  const t = COPY[language] || COPY.en

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeCat, setActiveCat] = useState<string | null>(quickCategories[0]?.slug ?? null)

  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Cmd+K / Ctrl+K to focus the hero search
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

  // Click-outside closes the suggestions overlay
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Debounced live suggestions
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
        // swallow — non-critical for hero search
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
    // Hand the file off to the bulk-order page; it already supports CSV/XLSX paste.
    router.push('/bulk-order')
  }

  const showOverlay = focused && (results.length > 0 || isSearching || query.trim().length >= 2)

  const floatingCards = FLOATING_CARDS[language] || FLOATING_CARDS.en

  return (
    <section
      className="relative overflow-hidden border-b border-neutral-200 bg-[#fafafa]"
    >
      {/* ─── Real laboratory photo, full-width ──────────────────────────
          A high-res shot of a scientist's hand pipetting a reagent into a
          microplate — communicates "lab consumables & reagents" instantly,
          and the heavy bokeh leaves the centre clean for the search column.
          Marked priority + fetchPriority="high" so it's the LCP. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/hero/lab-bg.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Vertical wash — keeps text legible at the top and bottom while
          letting the centre of the photo breathe. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(250,250,250,0.94) 0%, rgba(250,250,250,0.62) 28%, rgba(250,250,250,0.55) 60%, rgba(250,250,250,0.95) 100%)',
        }}
      />

      {/* Side vignette — fades the busiest edges of the photo so the
          content column always sits on a calmer background. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.55) 100%)',
        }}
      />

      {/* Brand-tint wash — a faint hint of tenant primary at the very top,
          ties the photo back to the rest of the site. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 480px at 50% -10%, var(--brand-1-soft), transparent 60%)',
        }}
      />

      {/* Content spotlight — radial halo that keeps the search bar and
          headline crisp without flattening the photograph. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(720px 360px at 50% 46%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Decorative floating SKU cards — desktop only */}
      <FloatingCard
        card={floatingCards[0]}
        className="absolute left-[3%] top-[26%] hidden xl:block"
        rotate={-6}
      />
      <FloatingCard
        card={floatingCards[1]}
        className="absolute right-[4%] top-[18%] hidden xl:block"
        rotate={5}
      />
      <FloatingCard
        card={floatingCards[2]}
        className="absolute right-[10%] top-[58%] hidden 2xl:block"
        rotate={-4}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-24">
        {/* Eyebrow pill */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-sm sm:mb-8">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--brand-1)', boxShadow: '0 0 8px var(--brand-1)' }}
          />
          <span className="font-mono-brand">
            {t.eyebrow(totalProducts, totalManufacturers)}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl">
          {t.headlinePart1}
          <br />
          <span className="text-brand-gradient">{t.headlinePart2}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-neutral-600 sm:text-lg">
          {t.tagline}
        </p>

        {/* THE SEARCH BAR */}
        <div ref={wrapRef} className="relative z-10 mx-auto mt-8 max-w-3xl sm:mt-10">
          <form onSubmit={submit}>
            <div
              className="relative flex items-stretch rounded-2xl bg-white p-1 transition-all duration-200"
              style={{
                border: focused ? '2px solid transparent' : '2px solid #e5e5e5',
                boxShadow: focused
                  ? '0 0 0 4px var(--brand-1-soft), 0 24px 60px -12px var(--brand-1-dim), 0 0 80px -20px var(--brand-2-dim)'
                  : '0 8px 32px -8px rgba(15,15,30,0.10)',
                backgroundImage: focused
                  ? 'linear-gradient(#fff,#fff), var(--brand-grad)'
                  : 'none',
                backgroundOrigin: 'border-box',
                backgroundClip: focused ? 'padding-box, border-box' : 'border-box',
              }}
            >
              <div
                className="flex items-center pl-4 pr-2 sm:pl-5"
                style={{ color: 'var(--brand-1)' }}
              >
                <Search className="h-5 w-5" strokeWidth={2} />
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder={translations.searchPlaceholder}
                className="font-display flex-1 bg-transparent px-1 py-4 text-base font-medium text-neutral-900 placeholder-neutral-400 outline-none sm:text-lg"
              />
              <div className="flex items-center gap-2 py-1.5 pl-2 pr-1.5 sm:pr-2">
                <kbd
                  className="font-mono-brand hidden rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-500 sm:inline"
                  aria-hidden
                >
                  ⌘K
                </kbd>
                <button
                  type="submit"
                  className="bg-brand-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 sm:px-5"
                  style={{ boxShadow: '0 4px 16px var(--brand-1-dim)' }}
                >
                  <span>{translations.browseCatalog.split(' ')[0]}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Suggestions overlay */}
          {showOverlay && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  {t.matching}
                </span>
                <span className="font-mono-brand text-[11px] text-neutral-400">
                  {isSearching
                    ? '…'
                    : `${results.length} ${language === 'ru' ? 'из' : 'of'} ${totalProducts.toLocaleString()}`}
                </span>
              </div>
              {results.length === 0 && !isSearching && query.trim().length >= 2 && (
                <div className="px-4 py-6 text-center text-sm text-neutral-500">
                  {language === 'ru' ? 'Ничего не найдено.' : 'Nothing matched.'}{' '}
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    className="font-medium"
                    style={{ color: 'var(--brand-1)' }}
                  >
                    {t.openCatalog} →
                  </Link>
                </div>
              )}
              {results.slice(0, 5).map((p, i) => (
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
                    style={{
                      background: 'var(--brand-1-soft)',
                      color: 'var(--brand-1)',
                    }}
                  >
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-neutral-900">
                      <span
                        className="font-mono-brand mr-2.5 text-[12px] font-semibold"
                        style={{ color: 'var(--brand-2)' }}
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
              ))}
              {results.length > 0 && (
                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[12px] text-neutral-600">
                  <span>
                    {t.pressEnter}{' '}
                    <kbd className="font-mono-brand mx-1 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px]">
                      ↵
                    </kbd>{' '}
                    {t.toSeeAll}
                  </span>
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    className="font-semibold"
                    style={{ color: 'var(--brand-1)' }}
                    onClick={() => setFocused(false)}
                  >
                    {t.openCatalog} →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden CSV input — still used by Pathway 2 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />

        {/* ─── THREE PATHWAYS ──────────────────────────────────────────────
            The single most important block of the homepage: three equally
            weighted cards that make the visitor's options crystal clear
            within the first viewport.

              01. Search by SKU / name      → focuses the hero search above
              02. Bulk paste                → links to /bulk-order
              03. Become a supplier         → links to /supplier
        */}
        {translations.pathway1 && translations.pathway2 && translations.pathway3 && (
          <div className="mx-auto mt-12 max-w-6xl text-left sm:mt-16">
            {(translations.pathwaysEyebrow || translations.pathwaysHeading) && (
              <div className="mb-6 text-center sm:mb-8">
                {translations.pathwaysEyebrow && (
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {translations.pathwaysEyebrow}
                  </div>
                )}
                {translations.pathwaysHeading && (
                  <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                    {translations.pathwaysHeading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
              <PathwayCard
                copy={translations.pathway1}
                Icon={Search}
                accent="brand"
                onClick={() => {
                  inputRef.current?.focus()
                  inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                renderMicro={(text) => (
                  <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2 text-[11px] text-neutral-600">
                    <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--brand-1)' }} />
                    <span className="font-mono-brand truncate">{text}</span>
                    <kbd
                      className="font-mono-brand ml-auto rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-neutral-500"
                      aria-hidden
                    >
                      ⌘K
                    </kbd>
                  </div>
                )}
              />
              <PathwayCard
                copy={translations.pathway2}
                Icon={ClipboardPaste}
                accent="blue"
                href="/bulk-order"
                renderMicro={(text) => (
                  <pre className="font-mono-brand overflow-hidden whitespace-pre rounded-lg border border-neutral-200 bg-neutral-900 px-3 py-2 text-[10.5px] leading-snug text-neutral-100">
                    {text}
                  </pre>
                )}
                extraBadge={{
                  icon: Upload,
                  label: language === 'ru' ? 'Загрузить .csv / .xlsx' : 'Upload .csv / .xlsx',
                  onClick: () => fileInputRef.current?.click(),
                }}
              />
              <PathwayCard
                copy={translations.pathway3}
                Icon={Handshake}
                accent="mint"
                href="/supplier"
                highlight
                renderMicro={(text) => (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800">
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--accent-mint)' }} />
                    <span>{text}</span>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Quick categories */}
        {quickCategories.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {t.jumpToDiscipline}
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {quickCategories.map((c) => {
                const Icon = CATEGORY_ICONS[c.slug] || Beaker
                const active = c.slug === activeCat
                return (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    onMouseEnter={() => setActiveCat(c.slug)}
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all"
                    style={{
                      background: active ? 'var(--brand-grad)' : '#ffffff',
                      color: active ? 'var(--on-brand)' : '#171717',
                      border: active
                        ? '1px solid transparent'
                        : '1px solid #e5e5e5',
                      boxShadow: active
                        ? '0 6px 20px var(--brand-1-dim)'
                        : '0 1px 2px rgba(15,15,30,0.04)',
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{c.name}</span>
                    <span
                      className="font-mono-brand text-[11px] font-medium"
                      style={{ opacity: active ? 0.85 : 0.55 }}
                    >
                      {c.count.toLocaleString()}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Trust badges — coloured icons add B2B credibility + visual life */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-14 sm:gap-x-8">
          {t.trustBadges.map((b, i) => {
            const Icon = TRUST_ICON[b.icon] || ShieldCheck
            const tones = [
              { bg: 'var(--accent-mint-soft)',   fg: 'var(--accent-mint)' },
              { bg: 'var(--accent-blue-soft)',   fg: 'var(--accent-blue)' },
              { bg: 'var(--accent-violet-soft)', fg: 'var(--accent-violet)' },
              { bg: 'var(--accent-coral-soft)',  fg: 'var(--accent-coral)' },
            ]
            const tone = tones[i % tones.length]
            return (
              <div
                key={b.label}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-neutral-700"
              >
                <span
                  className="grid h-6 w-6 place-items-center rounded-full"
                  style={{ background: tone.bg, color: tone.fg }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="font-mono-brand uppercase tracking-[0.08em]">
                  {b.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── PathwayCard — one of the three primary user paths in the hero ──────
// A clear, action-oriented card with: step number, title, description,
// a small inline demo (micro-copy), and a CTA. Accents are tied to the
// brand gradient (search), accent blue (bulk paste), or accent mint
// (supplier — visually highlighted to signal opportunity).
type PathwayAccent = 'brand' | 'blue' | 'mint'

const ACCENT_STYLES: Record<PathwayAccent, { iconBg: string; iconFg: string; stepBg: string; stepFg: string; ring: string }> = {
  brand: {
    iconBg: 'var(--brand-1-soft)',
    iconFg: 'var(--brand-1)',
    stepBg: 'var(--brand-1-soft)',
    stepFg: 'var(--brand-1)',
    ring: 'var(--brand-1-dim)',
  },
  blue: {
    iconBg: 'var(--accent-blue-soft)',
    iconFg: 'var(--accent-blue)',
    stepBg: 'var(--accent-blue-soft)',
    stepFg: 'var(--accent-blue)',
    ring: 'var(--accent-blue-soft)',
  },
  mint: {
    iconBg: 'var(--accent-mint-soft)',
    iconFg: 'var(--accent-mint)',
    stepBg: 'var(--accent-mint-soft)',
    stepFg: 'var(--accent-mint)',
    ring: 'var(--accent-mint-soft)',
  },
}

interface PathwayCardProps {
  copy: PathwayCopy
  Icon: any
  accent: PathwayAccent
  href?: string
  onClick?: () => void
  highlight?: boolean
  renderMicro?: (text: string) => React.ReactNode
  extraBadge?: { icon: any; label: string; onClick: () => void }
}

function PathwayCard({
  copy,
  Icon,
  accent,
  href,
  onClick,
  highlight,
  renderMicro,
  extraBadge,
}: PathwayCardProps) {
  const styles = ACCENT_STYLES[accent]

  const inner = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6 ${
        highlight ? 'border-emerald-300/70' : 'border-neutral-200'
      }`}
      style={{
        boxShadow: highlight
          ? `0 18px 50px -22px ${styles.ring}, 0 0 0 1px ${styles.ring}`
          : '0 8px 28px -14px rgba(15,15,30,0.10)',
      }}
    >
      {highlight && (
        <span
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: styles.iconBg, color: styles.iconFg }}
        >
          <Sparkles className="h-3 w-3" />
          New
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
          style={{ background: styles.iconBg, color: styles.iconFg }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <span
          className="font-mono-brand inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.12em]"
          style={{ background: styles.stepBg, color: styles.stepFg }}
        >
          {copy.step}
        </span>
      </div>

      <h3 className="font-display mt-4 text-lg font-semibold leading-snug tracking-tight text-neutral-900 sm:text-xl">
        {copy.title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600">
        {copy.description}
      </p>

      {renderMicro && <div className="mt-4">{renderMicro(copy.microCopy)}</div>}

      <div className="mt-auto pt-5">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
          style={{ color: styles.iconFg }}
        >
          {copy.cta}
          <ArrowRight className="h-4 w-4" />
        </span>

        {extraBadge && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              extraBadge.onClick()
            }}
            className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
          >
            <extraBadge.icon className="h-3 w-3" />
            {extraBadge.label}
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
    <button type="button" onClick={onClick} className="block h-full text-left">
      {inner}
    </button>
  )
}

// ─── FloatingCard — decorative product card on hero sides ────────────────
function FloatingCard({
  card,
  className,
  rotate,
}: {
  card: {
    sku: string
    brand: string
    name: string
    stock: string
    icon: 'drop' | 'syringe' | 'beaker'
    tone: 'mint' | 'coral' | 'blue' | 'violet'
  }
  className?: string
  rotate: number
}) {
  const Icon = CARD_ICON[card.icon] || FlaskConical
  const tone = CARD_TONE[card.tone] || CARD_TONE.mint
  const baseTransform = `rotate(${rotate}deg)`
  return (
    <div
      aria-hidden
      className={`hero-card-float pointer-events-none ${className ?? ''}`}
      style={
        {
          width: 240,
          '--card-base-transform': baseTransform,
          transform: baseTransform,
        } as React.CSSProperties & Record<string, string>
      }
    >
      <div
        className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-18px_rgba(15,15,30,0.18)] backdrop-blur"
      >
        <div className="flex items-start gap-3">
          <div
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
            style={{ background: tone.bg, color: tone.fg }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-mono-brand truncate text-[11px] font-semibold"
              style={{ color: tone.fg }}
            >
              {card.sku}
            </div>
            <div className="mt-0.5 truncate text-[12px] font-semibold text-neutral-900">
              {card.name}
            </div>
            <div className="truncate text-[11px] text-neutral-500">{card.brand}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent-mint)', boxShadow: '0 0 6px var(--accent-mint-soft)' }}
            />
            <span className="font-mono-brand">{card.stock}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
        </div>
      </div>
    </div>
  )
}

// ─── LabScene — DEPRECATED ────────────────────────────────────────────────
//
// The first attempt at a "laboratory background" was an inline SVG scene
// (flasks, pipette, molecules). It was visually playful but felt like a
// product illustration, not a real laboratory. The hero now uses a real
// photograph (see `/public/hero/lab-bg.jpg`), so this component is unused
// and only kept here as reference / fallback.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LabScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1600 720"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lab-mint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-mint)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-mint)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="lab-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="lab-coral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-coral)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-coral)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="lab-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-amber)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-amber)" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* ╭─ LEFT FLANK ─────────────────────────────────────────────╮ */}

        {/* Erlenmeyer flask with mint reagent + rising bubbles */}
        <g transform="translate(150, 150)" opacity="0.72">
          {/* Neck */}
          <rect x="62" y="-2" width="36" height="48" rx="3" fill="none" stroke="#1f2937" strokeWidth="2" />
          {/* Body */}
          <path
            d="M 62 46 L 18 168 Q 8 188 30 188 L 130 188 Q 152 188 142 168 L 98 46 Z"
            fill="#ffffff"
            stroke="#1f2937"
            strokeWidth="2"
          />
          {/* Liquid */}
          <path
            d="M 32 132 L 16 170 Q 8 188 30 188 L 130 188 Q 152 188 144 170 L 128 132 Z"
            fill="url(#lab-mint)"
          />
          {/* Liquid surface ellipse */}
          <ellipse cx="80" cy="132" rx="48" ry="4" fill="var(--accent-mint)" opacity="0.9" />
          {/* Volume tick marks */}
          <line x1="34" y1="100" x2="44" y2="100" stroke="#1f2937" strokeWidth="1.5" opacity="0.55" />
          <line x1="30" y1="118" x2="42" y2="118" stroke="#1f2937" strokeWidth="1.5" opacity="0.55" />
          <line x1="28" y1="136" x2="42" y2="136" stroke="#1f2937" strokeWidth="1.5" opacity="0.55" />
          {/* Highlight */}
          <path d="M 70 60 L 50 130" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          {/* Bubbles — rise and fade. Per-bubble delay set inline. */}
          <circle className="lab-bubble" cx="60" cy="170" r="3.5" fill="#ffffff" style={{ animationDelay: '0s' }} />
          <circle className="lab-bubble" cx="86" cy="174" r="2.6" fill="#ffffff" style={{ animationDelay: '-1.1s' }} />
          <circle className="lab-bubble" cx="100" cy="168" r="3.0" fill="#ffffff" style={{ animationDelay: '-2.3s' }} />
          <circle className="lab-bubble" cx="48" cy="176" r="2.2" fill="#ffffff" style={{ animationDelay: '-1.7s' }} />
          <circle className="lab-bubble" cx="76" cy="178" r="3.2" fill="#ffffff" style={{ animationDelay: '-0.5s' }} />
        </g>

        {/* Test-tube rack with three tubes (mint / blue / coral) */}
        <g transform="translate(40, 460)" opacity="0.7">
          {/* Rack frame */}
          <rect x="0" y="120" width="280" height="22" rx="4" fill="#1f2937" opacity="0.7" />
          <rect x="-6" y="138" width="292" height="10" rx="2" fill="#1f2937" opacity="0.45" />
          <rect x="0" y="60" width="280" height="8" rx="2" fill="#1f2937" opacity="0.55" />
          {/* Holes top — visual hint for tube guides */}
          <circle cx="50" cy="64" r="14" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" opacity="0.85" />
          <circle cx="140" cy="64" r="14" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" opacity="0.85" />
          <circle cx="230" cy="64" r="14" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" opacity="0.85" />
          {/* Tube 1 — mint */}
          <g>
            <path
              d="M 38 -40 L 38 110 Q 38 124 50 124 Q 62 124 62 110 L 62 -40 Z"
              fill="#ffffff"
              stroke="#1f2937"
              strokeWidth="1.8"
            />
            <path
              d="M 40 60 L 40 110 Q 40 122 50 122 Q 60 122 60 110 L 60 60 Z"
              fill="url(#lab-mint)"
            />
            <ellipse cx="50" cy="60" rx="10" ry="2.5" fill="var(--accent-mint)" opacity="0.95" />
          </g>
          {/* Tube 2 — blue */}
          <g>
            <path
              d="M 128 -40 L 128 110 Q 128 124 140 124 Q 152 124 152 110 L 152 -40 Z"
              fill="#ffffff"
              stroke="#1f2937"
              strokeWidth="1.8"
            />
            <path
              d="M 130 30 L 130 110 Q 130 122 140 122 Q 150 122 150 110 L 150 30 Z"
              fill="url(#lab-blue)"
            />
            <ellipse cx="140" cy="30" rx="10" ry="2.5" fill="var(--accent-blue)" opacity="0.95" />
          </g>
          {/* Tube 3 — coral (target tube for the pipette drip) */}
          <g>
            <path
              d="M 218 -40 L 218 110 Q 218 124 230 124 Q 242 124 242 110 L 242 -40 Z"
              fill="#ffffff"
              stroke="#1f2937"
              strokeWidth="1.8"
            />
            <path
              d="M 220 80 L 220 110 Q 220 122 230 122 Q 240 122 240 110 L 240 80 Z"
              fill="url(#lab-coral)"
            />
            <ellipse cx="230" cy="80" rx="10" ry="2.5" fill="var(--accent-coral)" opacity="0.95" />
          </g>
        </g>

        {/* ╭─ RIGHT FLANK ────────────────────────────────────────────╮ */}

        {/* Round-bottom flask with amber liquid + bubbles */}
        <g className="lab-only-md" transform="translate(1340, 110)" opacity="0.7">
          <rect x="40" y="-2" width="22" height="40" rx="2.5" fill="none" stroke="#1f2937" strokeWidth="2" />
          <circle cx="51" cy="100" r="62" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <path d="M 40 38 L 16 80" stroke="#1f2937" strokeWidth="2" fill="none" />
          <path d="M 62 38 L 86 80" stroke="#1f2937" strokeWidth="2" fill="none" />
          {/* Liquid */}
          <path
            d="M -5 110 A 62 62 0 0 0 107 110 L 107 100 L -5 100 Z"
            fill="url(#lab-amber)"
          />
          <ellipse cx="51" cy="100" rx="61" ry="3" fill="var(--accent-amber)" opacity="0.9" />
          <circle className="lab-bubble" cx="38" cy="138" r="2.5" fill="#ffffff" style={{ animationDelay: '-0.6s' }} />
          <circle className="lab-bubble" cx="58" cy="142" r="3" fill="#ffffff" style={{ animationDelay: '-1.9s' }} />
          <circle className="lab-bubble" cx="46" cy="135" r="2" fill="#ffffff" style={{ animationDelay: '-1.2s' }} />
        </g>

        {/* Pipette dripping into the right side */}
        <g transform="translate(1230, 80)" opacity="0.72">
          {/* Bulb */}
          <ellipse cx="20" cy="14" rx="14" ry="20" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
          {/* Highlight */}
          <ellipse cx="14" cy="8" rx="3" ry="6" fill="#ffffff" opacity="0.9" />
          {/* Stem */}
          <rect x="14" y="32" width="12" height="170" rx="2" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
          {/* Stem liquid (coral) */}
          <rect x="16" y="60" width="8" height="138" fill="var(--accent-coral)" opacity="0.7" />
          {/* Tip */}
          <path d="M 14 200 L 20 224 L 26 200 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
          {/* Drop forming at the tip */}
          <ellipse className="lab-drip" cx="20" cy="228" rx="3.4" ry="5" fill="var(--accent-coral)" />
          {/* Volume marks */}
          <line x1="14" y1="80" x2="22" y2="80" stroke="#1f2937" strokeWidth="1.3" opacity="0.5" />
          <line x1="14" y1="110" x2="22" y2="110" stroke="#1f2937" strokeWidth="1.3" opacity="0.5" />
          <line x1="14" y1="140" x2="22" y2="140" stroke="#1f2937" strokeWidth="1.3" opacity="0.5" />
          <line x1="14" y1="170" x2="22" y2="170" stroke="#1f2937" strokeWidth="1.3" opacity="0.5" />
        </g>

        {/* Petri dish (bottom right) with colonies — colonies softly pulse */}
        <g className="lab-only-sm" transform="translate(1380, 540)" opacity="0.7">
          <ellipse cx="80" cy="60" rx="100" ry="22" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
          <ellipse cx="80" cy="56" rx="100" ry="22" fill="none" stroke="#1f2937" strokeWidth="1.8" />
          {/* Agar */}
          <ellipse cx="80" cy="56" rx="96" ry="20" fill="var(--accent-mint-soft)" />
          {/* Colonies */}
          <circle className="lab-pulse" cx="40" cy="54" r="5" fill="var(--accent-mint)" />
          <circle className="lab-pulse" cx="60" cy="60" r="3" fill="var(--accent-mint)" style={{ animationDelay: '-1s' }} />
          <circle className="lab-pulse" cx="86" cy="48" r="6" fill="var(--accent-mint)" style={{ animationDelay: '-2.4s' }} />
          <circle className="lab-pulse" cx="108" cy="58" r="4" fill="var(--accent-mint)" style={{ animationDelay: '-3.1s' }} />
          <circle className="lab-pulse" cx="130" cy="52" r="3.5" fill="var(--accent-mint)" style={{ animationDelay: '-1.6s' }} />
          <circle className="lab-pulse" cx="74" cy="64" r="2.5" fill="var(--accent-blue)" style={{ animationDelay: '-0.4s' }} />
          <circle className="lab-pulse" cx="100" cy="64" r="2" fill="var(--accent-blue)" style={{ animationDelay: '-2.8s' }} />
        </g>

        {/* ╭─ FLOATING DECOR ─────────────────────────────────────────╮ */}

        {/* Hexagonal molecule (benzene-like), slowly rotating, top-centre-left */}
        <g className="lab-only-md" transform="translate(440, 130)" opacity="0.55">
          <g className="lab-spin">
            {/* Bonds */}
            <polygon
              points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23"
              fill="none"
              stroke="var(--accent-violet)"
              strokeWidth="2.5"
            />
            <polygon
              points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16"
              fill="none"
              stroke="var(--accent-violet)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Atoms */}
            <circle cx="0"   cy="-46" r="7" fill="var(--accent-violet)" />
            <circle cx="40"  cy="-23" r="7" fill="var(--accent-violet)" />
            <circle cx="40"  cy="23"  r="7" fill="var(--accent-violet)" />
            <circle cx="0"   cy="46"  r="7" fill="var(--accent-violet)" />
            <circle cx="-40" cy="23"  r="7" fill="var(--accent-violet)" />
            <circle cx="-40" cy="-23" r="7" fill="var(--accent-violet)" />
          </g>
        </g>

        {/* Second molecule — DNA-like double helix node pair, mid-right */}
        <g className="lab-only-md" transform="translate(1100, 410)" opacity="0.5">
          <g className="lab-spin" style={{ animationDuration: '52s' }}>
            <line x1="-30" y1="-26" x2="30" y2="-26" stroke="var(--accent-blue)" strokeWidth="1.6" />
            <line x1="-30" y1="0"   x2="30" y2="0"   stroke="var(--accent-blue)" strokeWidth="1.6" />
            <line x1="-30" y1="26"  x2="30" y2="26"  stroke="var(--accent-blue)" strokeWidth="1.6" />
            <circle cx="-30" cy="-26" r="6" fill="var(--accent-blue)" />
            <circle cx="30"  cy="-26" r="6" fill="var(--accent-coral)" />
            <circle cx="-30" cy="0"   r="6" fill="var(--accent-coral)" />
            <circle cx="30"  cy="0"   r="6" fill="var(--accent-blue)" />
            <circle cx="-30" cy="26"  r="6" fill="var(--accent-blue)" />
            <circle cx="30"  cy="26"  r="6" fill="var(--accent-coral)" />
          </g>
        </g>

        {/* Scattered floating "molecules" — small pulsing dots */}
        <g opacity="0.6">
          <circle className="lab-pulse" cx="320"  cy="80"  r="3.5" fill="var(--accent-mint)" />
          <circle className="lab-pulse" cx="600"  cy="60"  r="2.5" fill="var(--accent-blue)"  style={{ animationDelay: '-1.1s' }} />
          <circle className="lab-pulse" cx="780"  cy="160" r="3"   fill="var(--accent-coral)" style={{ animationDelay: '-2.3s' }} />
          <circle className="lab-pulse" cx="980"  cy="100" r="2.5" fill="var(--accent-amber)" style={{ animationDelay: '-1.7s' }} />
          <circle className="lab-pulse" cx="1200" cy="60"  r="3.5" fill="var(--accent-violet)" style={{ animationDelay: '-2.9s' }} />
          <circle className="lab-pulse" cx="700"  cy="600" r="3"   fill="var(--accent-mint)"   style={{ animationDelay: '-3.5s' }} />
          <circle className="lab-pulse" cx="900"  cy="640" r="2"   fill="var(--accent-blue)"   style={{ animationDelay: '-0.6s' }} />
          <circle className="lab-pulse" cx="1080" cy="600" r="2.5" fill="var(--accent-coral)"  style={{ animationDelay: '-1.4s' }} />
          <circle className="lab-pulse" cx="540"  cy="620" r="2.5" fill="var(--accent-violet)" style={{ animationDelay: '-2.1s' }} />
          <circle className="lab-pulse" cx="380"  cy="640" r="3"   fill="var(--accent-amber)"  style={{ animationDelay: '-3.0s' }} />
        </g>
      </svg>
    </div>
  )
}
