'use client'

import { Info } from 'lucide-react'
import { useId } from 'react'
import type { Language } from '@/lib/i18n'

const TEXT: Record<Language, { label: string; tip: string }> = {
  en: { label: 'Price to be confirmed', tip: "We'll confirm the current price in our quote" },
  ru: { label: 'Цена требует подтверждения', tip: 'Уточним актуальную цену в ответе на запрос' },
}

/** Shown next to a price that has no current supplier price behind it (Product.priceToConfirm). */
export function PriceToConfirm({
  language = 'en',
  tone = 'light',
  compact = false,
  className = '',
}: {
  language?: Language
  /** dark = on a dark card background */
  tone?: 'light' | 'dark'
  /** compact = icon-sized text for search dropdowns */
  compact?: boolean
  className?: string
}) {
  const id = useId()
  const t = TEXT[language] ?? TEXT.en
  const color = tone === 'dark' ? 'text-amber-300' : 'text-amber-700'
  return (
    <span
      tabIndex={0}
      aria-describedby={id}
      data-testid="price-to-confirm"
      className={`group relative inline-flex items-center gap-1 align-middle font-sans font-medium outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${compact ? 'text-[10px]' : 'text-xs'} ${color} ${className}`}
    >
      <Info className={compact ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} aria-hidden />
      <span>{t.label}</span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-30 mt-1.5 w-max max-w-[240px] rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100"
      >
        {t.tip}
      </span>
    </span>
  )
}
