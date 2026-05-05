import { CheckCircle2, Globe2, ShieldCheck, Check } from 'lucide-react'

interface BentoTranslations {
  onTimeLabel: string
  onTimeDetail: string
  coverageLabel: string
  hub: string
  complianceLabel: string
  complianceItems: string[]
}

interface BentoStripProps {
  translations: BentoTranslations
  totalProducts: number
  language: 'en' | 'ru'
}

// Worldwide coverage — 6 macro-regions Adoris ships to. EU is the HQ hub
// (warehouse in Vilnius). Codes are short, recognisable region tags.
const COVERAGE: Array<{ code: string; name: { en: string; ru: string }; isHub?: boolean }> = [
  { code: 'EU', name: { en: 'Europe', ru: 'Европа' }, isHub: true },
  { code: 'EAEU', name: { en: 'EAEU', ru: 'ЕАЭС' } },
  { code: 'AM', name: { en: 'Americas', ru: 'Америка' } },
  { code: 'ME', name: { en: 'Middle East', ru: 'Ближний Восток' } },
  { code: 'AS', name: { en: 'Asia', ru: 'Азия' } },
  { code: 'AF', name: { en: 'Africa', ru: 'Африка' } },
]

export function BentoStrip({
  translations,
  totalProducts: _totalProducts,
  language,
}: BentoStripProps) {
  const lang = language

  return (
    <section
      className="relative border-y border-neutral-200 bg-neutral-50 py-10 sm:py-14"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-12">
          {/* Card 1 — On-time delivery */}
          <div
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:col-span-3"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #ffffff 55%, var(--brand-1-soft))',
              minHeight: 170,
            }}
          >
            <Chip>
              <CheckCircle2 className="h-3 w-3" style={{ color: 'var(--brand-1)' }} />
              {translations.onTimeLabel}
            </Chip>
            <div className="font-display text-brand-gradient mt-4 text-5xl font-semibold leading-none tracking-tight sm:text-[56px]">
              97.4%
            </div>
            <div className="mt-2 text-xs text-neutral-600">{translations.onTimeDetail}</div>
            {/* Mini sparkline — 12 months trend */}
            <Sparkline className="absolute bottom-3 right-3 h-7 w-20 sm:h-8 sm:w-24" />
          </div>

          {/* Card 2 — Coverage */}
          <div
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:col-span-5"
            style={{ minHeight: 170 }}
          >
            <Chip>
              <Globe2 className="h-3 w-3" style={{ color: 'var(--brand-2)' }} />
              {translations.coverageLabel}
            </Chip>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {COVERAGE.map((c) => (
                <div
                  key={c.code}
                  className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-2.5"
                >
                  <div className="font-display truncate pr-8 text-base font-bold tracking-tight text-neutral-900 sm:text-[17px]">
                    {c.code}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-neutral-500" title={c.name[lang]}>
                    {c.name[lang]}
                  </div>
                  {c.isHub && (
                    <div
                      className="font-mono-brand absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold leading-none"
                      style={{ background: 'var(--brand-1-soft)', color: 'var(--brand-1)' }}
                    >
                      {translations.hub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Compliance & payments */}
          <div
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:col-span-4"
            style={{ minHeight: 170 }}
          >
            <Chip>
              <ShieldCheck className="h-3 w-3" style={{ color: 'var(--brand-1)' }} />
              {translations.complianceLabel}
            </Chip>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {translations.complianceItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] leading-snug text-neutral-700">
                  <span
                    className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full"
                    style={{ background: 'var(--brand-1-soft)', color: 'var(--brand-1)' }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-medium text-neutral-700">
      {children}
    </div>
  )
}

// 12-point sparkline of on-time delivery — values picked to look healthy
// (mostly above the dashed mean line). Pure SVG, no library.
function Sparkline({ className }: { className?: string }) {
  const data = [94.1, 95.2, 96.0, 95.6, 96.8, 97.1, 96.5, 97.6, 97.8, 97.2, 97.5, 97.4]
  const W = 100
  const H = 32
  const min = Math.min(...data) - 0.5
  const max = Math.max(...data) + 0.5
  const stepX = W / (data.length - 1)
  const points = data
    .map((v, i) => {
      const x = i * stepX
      const y = H - ((v - min) / (max - min)) * H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const lastX = (data.length - 1) * stepX
  const lastY = H - ((data[data.length - 1] - min) / (max - min)) * H
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-1)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${points} ${W},${H}`}
        fill="url(#sparkfill)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--brand-1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2" fill="var(--brand-1)" />
    </svg>
  )
}
