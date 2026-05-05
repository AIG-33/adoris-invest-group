'use client'

import Link from 'next/link'
import { ArrowRight, Beaker, Microscope, Pill, Syringe, TestTubes, Stethoscope, FlaskConical, Scan } from 'lucide-react'

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
}

// Map category slugs to icons for visual variety
const categoryIcons: Record<string, any> = {
  'reagents': Beaker,
  'equipment': Microscope,
  'equipment-imported': Microscope,
  'consumables': Pill,
  'disposables': Syringe,
  'analyzers': Scan,
  'diagnostics': Stethoscope,
  'chemicals': FlaskConical,
  'lab-supplies': TestTubes,
}

// Generate a 3-letter category code from slug for the data-density label
function categoryCode(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z]/g, '')
  return (cleaned.slice(0, 3) || 'CAT').toUpperCase()
}

export function CategoryShowcase({ categories, translations }: Props) {
  if (categories.length === 0) return null

  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0)

  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--brand-1)' }}
          >
            {translations.viewAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category, idx) => {
            const Icon = categoryIcons[category.slug] || Beaker
            const useBrand2 = idx % 2 === 1

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg sm:p-6"
              >
                {/* Icon tile (uses brand-1 / brand-2 alternation) */}
                <div
                  className="mb-4 grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: useBrand2 ? 'var(--brand-2-soft)' : 'var(--brand-1-soft)',
                    color: useBrand2 ? 'var(--brand-2)' : 'var(--brand-1)',
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                {/* Category name */}
                <h3 className="font-display line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900">
                  {category.name}
                </h3>

                {/* 3-letter code */}
                <div className="font-mono-brand mt-1 text-[11px] uppercase tracking-wider text-neutral-400">
                  {categoryCode(category.slug)}
                </div>

                {/* SKU count + arrow */}
                <div className="mt-5 flex items-end justify-between">
                  <div className="leading-none">
                    <span className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
                      {category._count.products.toLocaleString()}
                    </span>
                    <span className="ml-1.5 text-[11px] font-medium text-neutral-500">
                      {translations.products}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-500" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
