import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StructuredData } from '@/components/structured-data'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import { getBaseUrl } from '@/lib/get-base-url'
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { HelpCircle, Mail, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FAQPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  const baseUrl = await getBaseUrl()

  const breadcrumbs = [
    { name: dict.nav.home, url: `${baseUrl}/` },
    { name: dict.nav.faq, url: `${baseUrl}/faq` },
  ]

  // Generate FAQ structured data
  const faqSchema = generateFAQSchema(
    dict.faq.items.map(item => ({
      question: item.question,
      answer: item.answer,
    }))
  )

  const structuredData = [
    faqSchema,
    generateBreadcrumbSchema(breadcrumbs),
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header translations={dict.nav} />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <HelpCircle className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {dict.faq.title}
              </h1>
              <p className="text-lg text-white/90">
                {dict.faq.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content — structured data is provided via JSON-LD above (single source of truth). */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4" role="list">
                {dict.faq.items.map((item, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 group"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-neutral-900 pr-4 group-open:text-[#333333]">
                        {item.question}
                      </h3>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 group-open:bg-[#333333] transition-colors">
                        <svg
                          className="w-4 h-4 text-neutral-600 group-open:text-white transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-neutral-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>

              {/* Contact Section */}
              <address className="mt-16 bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center not-italic">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  {dict.faq.contactTitle}
                </h2>
                <p className="text-neutral-600 mb-6">
                  {dict.faq.contactDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`mailto:${company?.email || ''}`}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors border border-neutral-200"
                  >
                    <Mail className="w-5 h-5" />
                    {company?.email || ''}
                  </a>
                  <a
                    href={`tel:${company?.phone || ''}`}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors border border-neutral-200"
                  >
                    <Phone className="w-5 h-5" />
                    {company?.phone || ''}
                  </a>
                </div>
              </address>
            </div>
          </div>
        </section>
      </main>
      <Footer translations={dict.footer} />
    </>
  )
}

