'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Microscope,
  Pill,
  Syringe,
  TestTubes,
  Stethoscope,
  FlaskConical,
  FlaskRound,
  Scan,
  Droplet,
  Atom,
  Layers,
  Grid3x3,
  Activity,
  Dna,
  ShieldCheck,
  Snowflake,
  Package,
  Sparkles,
} from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface CategoryTranslations {
  title: string
  subtitle: string
  products: string
  viewAll: string
}

type Props = {
  categories: Category[]
  translations: CategoryTranslations
  language?: 'en' | 'ru'
}

// Local micro-copy for things that aren't yet in the translation dict
// but are too small to justify a roundtrip through `lib/translations.ts`.
const LOCAL_COPY = {
  en: {
    categoriesLabel: 'categories',
    topCategory: 'Top category',
    skuAvailable: 'SKU available',
    explore: 'Explore',
    featureCopy: 'browse the full range and pick consumables, reagents and equipment in one click.',
  },
  ru: {
    categoriesLabel: 'категорий',
    topCategory: 'Топ категория',
    skuAvailable: 'SKU в наличии',
    explore: 'Открыть',
    featureCopy: 'смотреть весь ассортимент — расходники, реагенты и оборудование в один клик.',
  },
} as const

// ─── Icon resolution ──────────────────────────────────────────────────────
// We do a fuzzy lookup against the slug so partial matches still find a
// reasonable icon. This is much more useful than the previous rigid map
// because real category slugs often combine brand + discipline (e.g.
// "pcr-plates", "abbott-reagents").
const ICON_MAP: Array<[RegExp, any]> = [
  [/pcr|molecul/i, Atom],
  [/dna|sequenc/i, Dna],
  [/h(a|e)mato|blood/i, Droplet],
  [/blood[\s-]?gas/i, Activity],
  [/histol|cytol|patho/i, Layers],
  [/plate|microplate/i, Grid3x3],
  [/microscop|imag/i, Microscope],
  [/scan|analyz|reader/i, Scan],
  [/reagent|chem/i, FlaskRound],
  [/syringe|needl/i, Syringe],
  [/pill|tablet|capsul/i, Pill],
  [/tube|vial/i, TestTubes],
  [/equip|instrument/i, Microscope],
  [/diagn|test|assay/i, Stethoscope],
  [/cold|fridge|freezer/i, Snowflake],
  [/safety|protect|ppe/i, ShieldCheck],
  [/consum|disposab/i, Package],
  [/supply|supplies/i, TestTubes],
  [/flask/i, FlaskConical],
]

function resolveIcon(slug: string, name: string): any {
  const haystack = `${slug} ${name}`.toLowerCase()
  for (const [re, icon] of ICON_MAP) {
    if (re.test(haystack)) return icon
  }
  return Beaker
}

// 3-letter category code for the data-density label
function categoryCode(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z]/g, '')
  return (cleaned.slice(0, 3) || 'CAT').toUpperCase()
}

// ─── Tone palette ─────────────────────────────────────────────────────────
// Cycled across cards so the grid feels lively without us having to encode
// a per-category brand colour. Tones reuse the tenant-agnostic accent vars
// added to globals.css so the page stays vivid for any tenant brand.
type Tone = 'mint' | 'blue' | 'violet' | 'coral' | 'amber'
const TONES: Tone[] = ['mint', 'blue', 'violet', 'coral', 'amber']

const TONE_VARS: Record<Tone, { color: string; soft: string }> = {
  mint:   { color: 'var(--accent-mint)',   soft: 'var(--accent-mint-soft)' },
  blue:   { color: 'var(--accent-blue)',   soft: 'var(--accent-blue-soft)' },
  violet: { color: 'var(--accent-violet)', soft: 'var(--accent-violet-soft)' },
  coral:  { color: 'var(--accent-coral)',  soft: 'var(--accent-coral-soft)' },
  amber:  { color: 'var(--accent-amber)',  soft: 'var(--accent-amber-soft)' },
}

export function CategoryShowcase({ categories, translations, language = 'en' }: Props) {
  if (categories.length === 0) return null

  const lc = LOCAL_COPY[language] || LOCAL_COPY.en
  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0)
  const [feature, ...rest] = categories

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      {/* Soft brand wash behind the section — extremely subtle, just gives
          the categories block its own visual "room". */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 480px at 12% 0%, var(--brand-1-soft), transparent 55%), radial-gradient(700px 420px at 88% 100%, var(--accent-violet-soft), transparent 60%)',
          opacity: 0.55,
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section header ────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <div
              className="font-mono-brand mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{
                background: 'var(--brand-1-soft)',
                borderColor: 'var(--brand-1-dim)',
                color: 'var(--brand-1)',
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--brand-1)', boxShadow: '0 0 8px var(--brand-1)' }}
              />
              <span>{totalProducts.toLocaleString()} SKU</span>
              <span className="text-neutral-400">·</span>
              <span>{categories.length} {lc.categoriesLabel}</span>
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[42px]">
              {translations.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-500 sm:text-base">
              {translations.subtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ color: 'var(--brand-1)' }}
          >
            {translations.viewAll}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ─── Bento grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[176px]">
          {/* Feature card — 2×2 on lg+, 2×1 on sm/md, 1×1 on mobile. */}
          <FeatureCard
            category={feature}
            translations={translations}
            lc={lc}
          />

          {/* Remaining categories. Three-way cycle of card *styles* so the
              grid reads as deliberately rhythmic instead of a wall of
              identical pills:
                · 0 mod 3 → pastel-tinted card (opaque colour wash, dark text)
                · 1 mod 3 → white card with coloured chrome
                · 2 mod 3 → solid bright accent card with white text
              Combined with the 5-colour cycle of `TONES`, no two adjacent
              cards end up looking the same. */}
          {rest.map((category, idx) => {
            const Icon = resolveIcon(category.slug, category.name)
            const tone = TONES[(idx + 1) % TONES.length]
            const t = TONE_VARS[tone]
            const variant = (idx % 3) as 0 | 1 | 2

            const isSolid = variant === 2
            const isPastel = variant === 0
            // Pastel = opaque accent-tinted background. We mix the bright
            // accent with white so the result reads as a soft fill rather
            // than the original `*-soft` semi-transparent var.
            const pastelBg = `color-mix(in srgb, ${t.color} 14%, white)`
            const pastelBgHover = `color-mix(in srgb, ${t.color} 22%, white)`

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 sm:p-5 ${
                  isSolid
                    ? 'border-transparent shadow-[0_10px_30px_-12px_rgba(15,15,30,0.30)] hover:shadow-[0_22px_50px_-18px_rgba(15,15,30,0.45)]'
                    : isPastel
                    ? 'border-transparent shadow-[0_1px_0_rgba(15,15,30,0.04)] hover:shadow-[0_18px_40px_-18px_rgba(15,15,30,0.20)]'
                    : 'border-neutral-200/80 bg-white shadow-[0_1px_0_rgba(15,15,30,0.04)] hover:border-neutral-300 hover:shadow-[0_18px_40px_-18px_rgba(15,15,30,0.18)]'
                }`}
                style={
                  {
                    '--card-accent': t.color,
                    '--card-accent-soft': t.soft,
                    '--pastel-bg': pastelBg,
                    '--pastel-bg-hover': pastelBgHover,
                    background: isSolid ? t.color : isPastel ? pastelBg : undefined,
                    color: isSolid ? '#ffffff' : undefined,
                  } as React.CSSProperties & Record<string, string>
                }
              >
                {/* Pastel-on-hover deepens the wash without changing layout. */}
                {isPastel && (
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: pastelBgHover }}
                  />
                )}

                {/* Top accent stripe — only meaningful on white cards;
                    on pastel/solid the colour is already everywhere. */}
                {variant === 1 && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: 'var(--card-accent)' }}
                  />
                )}

                {/* Decorative big-icon watermark in the corner. Brightness
                    adapts so it stays readable across all 3 variants. */}
                <Icon
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  strokeWidth={1.25}
                  style={{
                    color: isSolid ? '#ffffff' : 'var(--card-accent)',
                    opacity: isSolid ? 0.18 : isPastel ? 0.18 : 0.10,
                  }}
                />

                {/* Top row: small icon tile + 3-letter code chip */}
                <div className="relative flex items-start justify-between">
                  <div
                    className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={
                      isSolid
                        ? { background: 'rgba(255,255,255,0.20)', color: '#ffffff' }
                        : isPastel
                        ? { background: t.color, color: '#ffffff' }
                        : { background: 'var(--card-accent-soft)', color: 'var(--card-accent)' }
                    }
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span
                    className="font-mono-brand rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wider"
                    style={
                      isSolid
                        ? { background: 'rgba(255,255,255,0.18)', color: '#ffffff' }
                        : { background: 'rgba(15,15,30,0.06)', color: 'rgba(15,15,30,0.6)' }
                    }
                  >
                    {categoryCode(category.slug)}
                  </span>
                </div>

                {/* Category name */}
                <h3
                  className={`font-display relative mt-3 line-clamp-2 text-[15px] font-semibold leading-snug sm:text-base ${
                    isSolid ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {category.name}
                </h3>

                {/* SKU count + arrow */}
                <div className="relative mt-3 flex items-end justify-between">
                  <div className="leading-none">
                    <span
                      className={`font-display text-2xl font-semibold tracking-tight ${
                        isSolid ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {category._count.products.toLocaleString()}
                    </span>
                    <span
                      className={`ml-1 text-[11px] font-medium ${
                        isSolid ? 'text-white/75' : 'text-neutral-500'
                      }`}
                    >
                      {translations.products}
                    </span>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{
                      color: isSolid ? '#ffffff' : 'var(--card-accent)',
                    }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FeatureCard ─────────────────────────────────────────────────────────
// Top-1 category gets prime real estate: 2×2 tile on lg+ with a coloured
// gradient, large watermark icon, headline, supporting copy, and a clear
// CTA. Falls back to a normal-sized cell on small viewports so it doesn't
// dominate mobile layout.
function FeatureCard({
  category,
  translations,
  lc,
}: {
  category: Category
  translations: CategoryTranslations
  lc: typeof LOCAL_COPY['en']
}) {
  const Icon = resolveIcon(category.slug, category.name)
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative col-span-2 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 p-5 shadow-[0_8px_30px_-12px_rgba(15,15,30,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_rgba(15,15,30,0.25)] sm:col-span-2 sm:p-6 lg:row-span-2 lg:p-7"
      style={{
        background: 'linear-gradient(135deg, var(--brand-1-soft) 0%, rgba(255,255,255,0.85) 60%, var(--accent-violet-soft) 100%)',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Large decorative watermark icon — only big on lg+ where the card
          actually has room for it. */}
      <Icon
        aria-hidden
        className="pointer-events-none absolute -right-12 -bottom-12 h-56 w-56 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
        strokeWidth={1}
        style={{ color: 'var(--brand-1)', opacity: 0.10 }}
      />

      {/* Top: badge + small icon tile */}
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <span
            className="font-mono-brand inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(15,15,30,0.08)',
              color: 'var(--brand-1)',
            }}
          >
            <Sparkles className="h-3 w-3" strokeWidth={2.25} />
            <span>{lc.topCategory}</span>
          </span>
        </div>
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          style={{ background: 'var(--brand-1)', color: 'var(--on-brand)' }}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
        </div>
      </div>

      {/* Middle: headline + sub-copy */}
      <div className="relative mt-4 lg:mt-8">
        <h3 className="font-display max-w-[80%] text-balance text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-[34px]">
          {category.name}
        </h3>
        <p className="mt-2 max-w-md text-sm text-neutral-600 sm:text-[15px]">
          <span className="font-mono-brand text-neutral-500">
            {categoryCode(category.slug)}
          </span>
          {' · '}
          <span className="font-semibold text-neutral-700">
            {category._count.products.toLocaleString()} {translations.products}
          </span>
          {' — '}{lc.featureCopy}
        </p>
      </div>

      {/* Bottom: explicit CTA */}
      <div className="relative mt-6 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
          style={{ color: 'var(--brand-1)' }}
        >
          {lc.explore} {category.name}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>

        {/* Big SKU number, mono, lives on the bottom-right of the card */}
        <div className="text-right leading-none">
          <div className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {category._count.products.toLocaleString()}
          </div>
          <div className="font-mono-brand mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            {lc.skuAvailable}
          </div>
        </div>
      </div>
    </Link>
  )
}
