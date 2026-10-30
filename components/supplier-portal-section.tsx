import {
  Mail,
  Building2,
  Inbox,
  MousePointerClick,
  FileSpreadsheet,
  ListChecks,
  UserPlus,
  LogIn,
  type LucideIcon,
} from 'lucide-react'
import type { Translations } from '@/lib/translations'
import { portalUrl } from '@/lib/supplier-portal'
import { ExternalLink } from '@/components/external-link'

const FEATURE_ICONS: LucideIcon[] = [Mail, Building2, Inbox, MousePointerClick, FileSpreadsheet, ListChecks]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950'

interface SupplierPortalSectionProps {
  translations: Translations['homepage']['supplierPortal']
  newTabLabel: string
}

function splitFeature(text: string) {
  const i = text.indexOf(':')
  if (i === -1) return { title: text, body: '' }
  const body = text.slice(i + 1).trim()
  return { title: text.slice(0, i).trim(), body: body.charAt(0).toUpperCase() + body.slice(1) }
}

export function SupplierPortalSection({ translations: t, newTabLabel }: SupplierPortalSectionProps) {
  return (
    <section
      aria-label={t.eyebrow}
      id="supplier-portal"
      className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-[#0a0a0f] to-gray-950 py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-sm">
            <span
              aria-hidden="true"
              className="h-1.5 w-6 rounded-full"
              style={{ backgroundColor: 'var(--company-accent)' }}
            />
            {t.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{t.lead}</p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {t.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i]
            const { title, body } = splitFeature(feature)
            return (
              <li
                key={title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-white/[0.14]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-white">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
              </li>
            )
          })}
        </ul>

        <ol className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {t.steps.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] px-5 py-4"
            >
              <span
                aria-hidden="true"
                className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--company-accent)' }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-white sm:text-base">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <ExternalLink
            href={portalUrl('/login?mode=signup', 'home_section_signup')}
            newTabLabel={newTabLabel}
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-90 sm:w-auto ${focusRing}`}
            style={{ backgroundColor: 'var(--company-accent)' }}
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            {t.ctaPrimary}
          </ExternalLink>
          <ExternalLink
            href={portalUrl('/login', 'home_section_login')}
            newTabLabel={newTabLabel}
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/[0.25] hover:bg-white/[0.08] sm:w-auto ${focusRing}`}
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            {t.ctaSecondary}
          </ExternalLink>
          <ExternalLink
            href={portalUrl('/', 'home_section_requests')}
            newTabLabel={newTabLabel}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline ${focusRing}`}
          >
            {t.ctaRequests}
          </ExternalLink>
        </div>
      </div>
    </section>
  )
}
