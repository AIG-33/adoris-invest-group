'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ArrowRight,
  Upload,
  ClipboardPaste,
  Zap,
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

interface HeroSearchTranslations {
  searchPlaceholder: string
  browseCatalog: string
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
      {/* Mesh blob background — discrete bright accents that read on white
          regardless of tenant brand color. Brand-1 still seeds one blob so
          tenants with vivid palettes get extra cohesion. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="hero-blob"
          style={{
            top: '-180px',
            left: '-60px',
            width: 520,
            height: 520,
            background: 'var(--accent-mint)',
            opacity: 0.55,
            animationDelay: '0s',
          }}
        />
        <div
          className="hero-blob"
          style={{
            top: '-140px',
            right: '-100px',
            width: 560,
            height: 560,
            background: 'var(--accent-blue)',
            opacity: 0.55,
            animationDelay: '-6s',
          }}
        />
        <div
          className="hero-blob"
          style={{
            top: '38%',
            left: '52%',
            width: 420,
            height: 420,
            background: 'var(--accent-violet)',
            opacity: 0.40,
            animationDelay: '-9s',
          }}
        />
        <div
          className="hero-blob"
          style={{
            bottom: '-200px',
            left: '20%',
            width: 480,
            height: 480,
            background: 'var(--accent-coral)',
            opacity: 0.45,
            animationDelay: '-12s',
          }}
        />
        <div
          className="hero-blob"
          style={{
            bottom: '-160px',
            right: '8%',
            width: 360,
            height: 360,
            background: 'var(--accent-amber)',
            opacity: 0.40,
            animationDelay: '-3s',
          }}
        />
        {/* Brand-tinted overlay — gives the page a faint hint of the
            tenant's primary even when accent palette dominates. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 500px at 50% 0%, var(--brand-1-soft), transparent 60%)',
          }}
        />
      </div>

      {/* Frosted glass layer — softens the blobs, keeps text readable */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(40px) saturate(140%)',
          WebkitBackdropFilter: 'blur(40px) saturate(140%)',
        }}
      />

      {/* Subtle grid background — drawn over the frosted layer for crispness */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-neutral-900/[0.05]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

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

        {/* Quick actions row */}
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-neutral-700 sm:mt-6 sm:gap-2.5">
          <span className="text-neutral-500">{t.or}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            <Upload className="h-4 w-4" style={{ color: 'var(--accent-mint)' }} />
            {t.uploadCsv}
          </button>
          <Link
            href="/bulk-order"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            <ClipboardPaste className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />
            {t.pasteQuote}
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-white"
          >
            <Zap className="h-4 w-4" style={{ color: 'var(--accent-amber)' }} />
            {t.browseManufacturers}
          </Link>
        </div>

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
