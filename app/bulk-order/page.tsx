import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BulkOrderForm from '@/components/bulk-order-form';
import { StructuredData } from '@/components/structured-data';
import { getServerCompany } from '@/lib/server-company';
import { getDictionary } from '@/lib/translations';
import { getBaseUrl } from '@/lib/get-base-url';
import { generateHowToSchema } from '@/lib/seo';
import {
  ClipboardPaste,
  Sparkles,
  ShoppingCart,
  Zap,
  Target,
  FileCheck,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const companyName = company?.name || 'Adoris Invest Group'
  const language = (company?.language || 'en') as 'en' | 'ru'
  const baseUrl = await getBaseUrl()

  const title = language === 'ru'
    ? `Массовый заказ — вставьте список SKU, получите корзину | ${companyName}`
    : `Bulk Order — Paste SKU List, Get a Cart in Seconds | ${companyName}`
  const description = language === 'ru'
    ? 'Скопируйте каталожные номера с количеством — система автоматически сопоставит товары и соберёт корзину. Любые форматы: табы, запятые, пробелы. Для отделов закупок, лабораторий и дистрибьюторов.'
    : 'Paste catalog numbers with quantities — our system matches products and builds your cart automatically. Any format: tabs, commas, spaces. For procurement teams, labs, and distributors.'

  return {
    title,
    description,
    keywords: language === 'ru'
      ? 'массовый заказ, оптовый заказ, импорт SKU, артикулы массово, B2B закупки, инструмент закупок, заказ по списку, реагенты оптом'
      : 'bulk order, mass order, SKU import, paste SKU list, B2B procurement, catalog import, paste and order, reagents wholesale',
    openGraph: {
      title,
      description,
      url: `${baseUrl}/bulk-order`,
      type: 'website',
      siteName: companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/bulk-order`,
    },
  }
}

export default async function BulkOrderPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  const baseUrl = await getBaseUrl()
  const bulk = dict.bulkOrder

  // ─── JSON-LD: HowTo schema for the bulk-order flow ───────────────────────
  const howToSchema = generateHowToSchema(
    bulk.heroHeadline || bulk.title,
    bulk.heroTagline || bulk.subtitle,
    [
      {
        name: bulk.steps?.step1Title || 'Paste your list',
        text: bulk.steps?.step1Desc || 'Paste SKUs and quantities into the textbox.',
      },
      {
        name: bulk.steps?.step2Title || 'Process the list',
        text: bulk.steps?.step2Desc || 'Our system matches SKUs to products in our catalog.',
      },
      {
        name: bulk.steps?.step3Title || 'Add to cart',
        text: bulk.steps?.step3Desc || 'All matched products are added to your cart automatically.',
      },
    ]
  )

  const structuredData = [howToSchema, {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: language === 'ru' ? 'Инструмент массового заказа Adoris' : 'Adoris Bulk Order Tool',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: bulk.heroTagline || bulk.subtitle,
    url: `${baseUrl}/bulk-order`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  }]

  const examplePaste = language === 'ru'
    ? `10446232\t2\n07P3203\t5\n05031738, 12\nSKU002 3`
    : `10446232\t2\n07P3203\t5\n05031738, 12\nSKU002 3`

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--company-secondary, #ffffff)' }}>
        {/* ═══ HERO ════════════════════════════════════════════════════════
            Marketing hero — leads with the promise (paste → cart in
            seconds), supported by an animated 2-column visual that shows
            input on the left and the resulting cart on the right. */}
        <section
          className="relative overflow-hidden border-b border-neutral-200"
          style={{
            background:
              'radial-gradient(900px 480px at 20% 0%, var(--brand-1-soft), transparent 60%), radial-gradient(900px 480px at 80% 100%, var(--accent-blue-soft), transparent 60%), #fafafa',
          }}
        >
          <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: copy */}
              <div>
                {bulk.heroBadge && (
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm">
                    <ClipboardPaste className="h-3.5 w-3.5" style={{ color: 'var(--brand-1)' }} />
                    {bulk.heroBadge}
                  </div>
                )}
                {bulk.heroEyebrow && (
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                    {bulk.heroEyebrow}
                  </div>
                )}
                <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
                  {bulk.heroHeadline || bulk.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {bulk.heroTagline || bulk.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#bulk-form"
                    className="bg-brand-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
                    style={{ boxShadow: '0 8px 24px var(--brand-1-dim)' }}
                  >
                    <ClipboardPaste className="h-4 w-4" />
                    {bulk.enterProducts}
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:border-neutral-300"
                  >
                    {language === 'ru' ? 'Как это работает' : 'See how it works'}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right: animated paste → cart demo */}
              <div className="relative">
                <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  {/* Paste box */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-22px_rgba(15,15,30,0.18)]">
                    <div className="mb-2.5 flex items-center gap-2">
                      <span
                        className="grid h-7 w-7 place-items-center rounded-lg"
                        style={{ background: 'var(--brand-1-soft)', color: 'var(--brand-1)' }}
                      >
                        <ClipboardPaste className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {language === 'ru' ? 'Ваш список' : 'Your paste'}
                      </span>
                    </div>
                    <pre className="font-mono-brand whitespace-pre rounded-lg bg-neutral-900 p-3 text-[11px] leading-relaxed text-neutral-100">
                      {examplePaste}
                    </pre>
                  </div>

                  {/* Arrow — visible on sm+ */}
                  <div className="hidden sm:block">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-md"
                      aria-hidden
                    >
                      <ArrowRight className="h-5 w-5" style={{ color: 'var(--brand-1)' }} />
                    </div>
                  </div>

                  {/* Cart box */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-22px_rgba(15,15,30,0.18)]">
                    <div className="mb-2.5 flex items-center gap-2">
                      <span
                        className="grid h-7 w-7 place-items-center rounded-lg"
                        style={{ background: 'var(--accent-mint-soft)', color: 'var(--accent-mint)' }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {language === 'ru' ? 'Готовая корзина' : 'Your cart'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { sku: '10446232', qty: 2, ok: true },
                        { sku: '07P3203', qty: 5, ok: true },
                        { sku: '05031738', qty: 12, ok: true },
                        { sku: 'SKU002', qty: 3, ok: true },
                      ].map((item) => (
                        <div
                          key={item.sku}
                          className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/60 px-2.5 py-2 text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <Check
                              className="h-3 w-3"
                              style={{ color: 'var(--accent-mint)' }}
                              strokeWidth={3}
                            />
                            <span className="font-mono-brand text-neutral-800">{item.sku}</span>
                          </div>
                          <span className="font-mono-brand font-semibold text-neutral-900">
                            ×{item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits strip */}
            {bulk.benefits && (
              <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {([
                  { item: bulk.benefits.time, Icon: Zap, tone: 'amber' },
                  { item: bulk.benefits.accuracy, Icon: Target, tone: 'mint' },
                  { item: bulk.benefits.formats, Icon: FileCheck, tone: 'blue' },
                ] as const).map(({ item, Icon, tone }) => {
                  const colors: Record<string, { bg: string; fg: string }> = {
                    amber: { bg: 'rgba(251,191,36,0.16)', fg: 'var(--accent-amber)' },
                    mint:  { bg: 'var(--accent-mint-soft)', fg: 'var(--accent-mint)' },
                    blue:  { bg: 'var(--accent-blue-soft)', fg: 'var(--accent-blue)' },
                  }
                  const c = colors[tone]
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-neutral-200 bg-white p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                          style={{ background: c.bg, color: c.fg }}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                        <div className="font-display text-2xl font-bold tracking-tight text-neutral-900">
                          {item.value}
                        </div>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-neutral-900">
                        {item.title}
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ═══ HOW IT WORKS — 3 STEPS ════════════════════════════════════════ */}
        {bulk.steps && (
          <section id="how-it-works" className="border-b border-neutral-200 bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {language === 'ru' ? 'Как это работает' : 'How it works'}
                </div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {language === 'ru' ? '3 шага — от списка до корзины' : 'From list to cart in 3 steps'}
                </h2>
              </div>
              <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
                {[
                  { title: bulk.steps.step1Title, desc: bulk.steps.step1Desc, Icon: ClipboardPaste, tone: 'brand' },
                  { title: bulk.steps.step2Title, desc: bulk.steps.step2Desc, Icon: Sparkles, tone: 'blue' },
                  { title: bulk.steps.step3Title, desc: bulk.steps.step3Desc, Icon: ShoppingCart, tone: 'mint' },
                ].map((step, i) => {
                  const colors: Record<string, { bg: string; fg: string }> = {
                    brand: { bg: 'var(--brand-1-soft)', fg: 'var(--brand-1)' },
                    blue:  { bg: 'var(--accent-blue-soft)', fg: 'var(--accent-blue)' },
                    mint:  { bg: 'var(--accent-mint-soft)', fg: 'var(--accent-mint)' },
                  }
                  const c = colors[step.tone]
                  return (
                    <div
                      key={i}
                      className="relative rounded-2xl border border-neutral-200 bg-white p-6"
                    >
                      <span
                        className="font-mono-brand absolute -top-3 left-6 inline-flex items-center rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-white"
                      >
                        STEP {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="mt-2 grid h-11 w-11 place-items-center rounded-xl"
                        style={{ background: c.bg, color: c.fg }}
                      >
                        <step.Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600">
                        {step.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══ FORM ══════════════════════════════════════════════════════════ */}
        <section id="bulk-form" className="container mx-auto scroll-mt-20 px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <BulkOrderForm translations={{ ...bulk, items: dict.cart.items }} />
          </div>
        </section>

        {/* ═══ SEO COPY ══════════════════════════════════════════════════════ */}
        {bulk.seo && (
          <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                    {bulk.seo.whyTitle}
                  </h2>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-neutral-600">
                    {bulk.seo.whyParagraph}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {bulk.seo.idealForTitle}
                  </div>
                  <ul className="mt-4 space-y-3">
                    {bulk.seo.idealFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[14px] leading-relaxed text-neutral-700"
                      >
                        <span
                          className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full"
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
        )}
      </main>
      <Footer />
    </>
  );
}
