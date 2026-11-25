import type { ReactNode } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { LegalDocument } from '@/lib/legal/viena'

export function LegalPage({ doc, appendix }: { doc: LegalDocument; appendix?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="text-white py-14 sm:py-16" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav className="flex items-center gap-2 text-xs text-white/70 mb-4">
              <Link href="/" className="hover:text-white">
                Главная
              </Link>
              <span aria-hidden>/</span>
              <span>{doc.title}</span>
            </nav>
            <p className="text-[11px] tracking-[0.16em] uppercase font-bold text-white/70 mb-3">Правовая информация</p>
            <h1 className="text-3xl sm:text-4xl font-bold">{doc.title}</h1>
          </div>
        </section>
        <article className="container mx-auto px-4 sm:px-6 max-w-4xl py-10 sm:py-14 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4">{section.title}</h2>
              <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed text-neutral-800">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
          {appendix}
        </article>
      </main>
      <Footer />
    </div>
  )
}
