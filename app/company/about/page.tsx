import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { StructuredData } from '@/components/structured-data'
import { AboutCTAButtons } from '@/components/about-cta-buttons'
import Image from 'next/image'
import { Award, Globe, Users, TrendingUp, CheckCircle2, Target, Heart, Lightbulb } from 'lucide-react'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'

export default async function AboutPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const breadcrumbs = [
    { name: dict.nav.home, url: `${baseUrl}/` },
    { name: dict.nav.company, url: `${baseUrl}/company/about` },
    { name: dict.nav.about, url: `${baseUrl}/company/about` },
  ]

  const structuredData = [
    generateOrganizationSchema(company, baseUrl),
    generateBreadcrumbSchema(breadcrumbs),
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {dict.about.hero.title}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                {dict.about.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
                    {dict.about.whoWeAre.title}
                  </h2>
                  <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                    {dict.about.whoWeAre.paragraph1}
                  </p>
                  <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                    {dict.about.whoWeAre.paragraph2}
                  </p>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {dict.about.whoWeAre.paragraph3}
                  </p>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop"
                    alt="Medical Laboratory"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-black mb-2">10+</div>
                  <div className="text-neutral-600 font-medium">{dict.about.stats.yearsExperience}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-black mb-2">60+</div>
                  <div className="text-neutral-600 font-medium">{dict.about.stats.countriesServed}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-black mb-2">100+</div>
                  <div className="text-neutral-600 font-medium">{dict.about.stats.globalPartners}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-black mb-2">€5M+</div>
                  <div className="text-neutral-600 font-medium">{dict.about.stats.annualRevenue}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-12">
                {dict.about.values.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{dict.about.values.quality.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {dict.about.values.quality.description}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{dict.about.values.customer.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {dict.about.values.customer.description}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{dict.about.values.integrity.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {dict.about.values.integrity.description}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{dict.about.values.innovation.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {dict.about.values.innovation.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-12">
                {dict.about.services.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Globe className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-black mb-4">{dict.about.services.distribution.title}</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    {dict.about.services.distribution.description}
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.distribution.feature1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.distribution.feature2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.distribution.feature3}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Award className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-black mb-4">{dict.about.services.consulting.title}</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    {dict.about.services.consulting.description}
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.consulting.feature1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.consulting.feature2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>{dict.about.services.consulting.feature3}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Users className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-black mb-4">{dict.about.services.partnerships.title}</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    {dict.about.services.partnerships.description}
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Becton Dickinson & Company</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Merck Millipore</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Greiner Bio-One GmbH</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Stats */}
        <section className="py-16 text-white" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                {dict.about.growth.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">160%</div>
                  <p className="text-xl text-white/90">{dict.about.growth.revenueGrowth}</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">33%</div>
                  <p className="text-xl text-white/90">{dict.about.growth.profitGrowth}</p>
                </div>
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">75%</div>
                  <p className="text-xl text-white/90">{dict.about.growth.marketReach}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
                {dict.about.cta.title}
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                {dict.about.cta.subtitle}
              </p>
              <AboutCTAButtons />
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <p className="text-neutral-600 mb-2">
                  <strong>{dict.about.cta.contactUs}</strong>
                </p>
                <p className="text-neutral-700">
                  📧 {company?.email || 'ceo@adorisgroup.com'} | 📞 {company?.phone || '+48793081310'}
                </p>
                <p className="text-neutral-600 text-sm mt-2">
                  {company?.name || 'ADORIS INVEST GROUP OÜ'} | {company?.address || 'Ruunaoja tn 3-36, 11415 Tallinn, Estonia'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
