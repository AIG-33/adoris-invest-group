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

// Gradient accents for variety
const cardAccents = [
  'from-blue-500/10 to-cyan-500/5',
  'from-violet-500/10 to-purple-500/5',
  'from-emerald-500/10 to-teal-500/5',
  'from-amber-500/10 to-orange-500/5',
  'from-rose-500/10 to-pink-500/5',
  'from-sky-500/10 to-indigo-500/5',
  'from-lime-500/10 to-green-500/5',
  'from-fuchsia-500/10 to-violet-500/5',
]

const iconAccents = [
  'text-blue-400/60',
  'text-violet-400/60',
  'text-emerald-400/60',
  'text-amber-400/60',
  'text-rose-400/60',
  'text-sky-400/60',
  'text-lime-400/60',
  'text-fuchsia-400/60',
]

export function CategoryShowcase({ categories, translations }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="relative py-16 sm:py-20">
      {/* Subtle separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {translations.title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, idx) => {
            const Icon = categoryIcons[category.slug] || Beaker
            const accent = cardAccents[idx % cardAccents.length]
            const iconColor = iconAccents[idx % iconAccents.length]

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`group relative rounded-xl overflow-hidden p-4 sm:p-5 bg-gradient-to-br ${accent} border border-white/[0.06] transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-lg hover:shadow-white/[0.02]`}
              >
                {/* Icon */}
                <div className={`mb-3 sm:mb-4 ${iconColor} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>

                {/* Category name */}
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2 group-hover:text-white/90 transition-colors">
                  {category.name}
                </h3>

                {/* Product count */}
                <p className="text-xs text-white/30">
                  {category._count.products.toLocaleString()} {translations.products}
                </p>

                {/* Arrow */}
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-white/0 transition-all duration-300 group-hover:text-white/40 group-hover:translate-x-0.5" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
