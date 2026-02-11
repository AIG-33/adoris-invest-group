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

// Light-theme card accent backgrounds
const cardAccents = [
  'bg-blue-50 hover:bg-blue-100/80',
  'bg-violet-50 hover:bg-violet-100/80',
  'bg-emerald-50 hover:bg-emerald-100/80',
  'bg-amber-50 hover:bg-amber-100/80',
  'bg-rose-50 hover:bg-rose-100/80',
  'bg-sky-50 hover:bg-sky-100/80',
  'bg-lime-50 hover:bg-lime-100/80',
  'bg-fuchsia-50 hover:bg-fuchsia-100/80',
]

const iconAccents = [
  'text-blue-500',
  'text-violet-500',
  'text-emerald-500',
  'text-amber-500',
  'text-rose-500',
  'text-sky-500',
  'text-lime-600',
  'text-fuchsia-500',
]

const borderAccents = [
  'border-blue-200 hover:border-blue-300',
  'border-violet-200 hover:border-violet-300',
  'border-emerald-200 hover:border-emerald-300',
  'border-amber-200 hover:border-amber-300',
  'border-rose-200 hover:border-rose-300',
  'border-sky-200 hover:border-sky-300',
  'border-lime-200 hover:border-lime-300',
  'border-fuchsia-200 hover:border-fuchsia-300',
]

export function CategoryShowcase({ categories, translations }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            {translations.title}
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, idx) => {
            const Icon = categoryIcons[category.slug] || Beaker
            const accent = cardAccents[idx % cardAccents.length]
            const iconColor = iconAccents[idx % iconAccents.length]
            const border = borderAccents[idx % borderAccents.length]

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`group relative rounded-xl overflow-hidden p-4 sm:p-5 ${accent} border ${border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                {/* Icon */}
                <div className={`mb-3 sm:mb-4 ${iconColor} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>

                {/* Category name */}
                <h3 className="text-sm sm:text-base font-semibold text-neutral-800 mb-1 line-clamp-2 group-hover:text-neutral-900 transition-colors">
                  {category.name}
                </h3>

                {/* Product count */}
                <p className="text-xs text-neutral-500 font-medium">
                  {category._count.products.toLocaleString()} {translations.products}
                </p>

                {/* Arrow */}
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-neutral-300 transition-all duration-300 group-hover:text-neutral-500 group-hover:translate-x-0.5" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
