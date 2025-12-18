import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, ShieldCheck, Truck, CreditCard, Clock, ThermometerSnowflake, PackageCheck } from 'lucide-react';
import { getServerCompany } from '@/lib/server-company';
import { getDictionary } from '@/lib/translations';

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const company = await getServerCompany();
  const language = (company?.language || 'en') as 'en' | 'ru';
  const dict = getDictionary(language);
  return (
    <>
      <Header translations={dict.nav} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">
                {dict.terms.title}
              </h1>
              <p className="text-lg text-white/90">
                {dict.terms.intro}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 space-y-8">
              {/* Original Products */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#666666]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#666666]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.originalProducts.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">
                      {dict.terms.originalProducts.description}
                    </p>
                  </div>
                </div>
              </section>

              {/* Minimum Order */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#333333]/10 rounded-lg flex items-center justify-center">
                    <PackageCheck className="w-6 h-6 text-[#333333]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.minimumOrder.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      {dict.terms.minimumOrder.description}
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        {dict.terms.minimumOrder.note}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#000000]/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#000000]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.payment.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      {dict.terms.payment.description}
                    </p>
                    <div className="mt-4 bg-neutral-100 rounded-lg p-4">
                      <h3 className="font-semibold text-black mb-2">{dict.terms.payment.bankDetails}</h3>
                      <ul className="space-y-1 text-sm text-neutral-700">
                        <li><strong>{dict.terms.payment.bank}:</strong> PKO Bank Polski, Oddzial 18</li>
                        <li><strong>{dict.terms.payment.swift}:</strong> BPKOPLPW</li>
                        <li><strong>{dict.terms.payment.iban}:</strong> PL73102011850000410203665122</li>
                        <li><strong>{dict.terms.payment.bankAddress}:</strong> ul. Skierniewicka 21, Warsaw, Poland</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Fulfillment */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#666666]/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#666666]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.fulfillment.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      {dict.terms.fulfillment.description1}
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      {dict.terms.fulfillment.description2}
                    </p>
                  </div>
                </div>
              </section>

              {/* Cold Chain */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#333333]/10 rounded-lg flex items-center justify-center">
                    <ThermometerSnowflake className="w-6 h-6 text-[#333333]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.coldChain.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">
                      {dict.terms.coldChain.description}
                    </p>
                  </div>
                </div>
              </section>

              {/* Discounts */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#666666]/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#666666]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#000000] mb-3">
                      {dict.terms.discounts.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      {dict.terms.discounts.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-[#666666]/10 to-[#666666]/5 border border-[#666666]/20 rounded-lg p-4">
                        <div className="text-3xl font-bold text-[#666666] mb-2">5%</div>
                        <p className="text-sm font-semibold text-neutral-700">{dict.terms.discounts.order50k}</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#333333]/10 to-[#333333]/5 border border-[#333333]/20 rounded-lg p-4">
                        <div className="text-3xl font-bold text-[#333333] mb-2">10%</div>
                        <p className="text-sm font-semibold text-neutral-700">{dict.terms.discounts.order100k}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 rounded-lg p-8 text-white text-center" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
              <h2 className="text-2xl font-bold mb-4">{dict.terms.contact.title}</h2>
              <p className="mb-6 text-neutral-200">
                {dict.terms.contact.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`mailto:${company?.email || 'ceo@adorisgroup.com'}`}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                >
                  📧 {company?.email || 'ceo@adorisgroup.com'}
                </a>
                <a
                  href={`tel:${company?.phone || '+48793081310'}`}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                >
                  📞 {company?.phone || '+48793081310'}
                </a>
              </div>
            </div>

            {/* Company Info */}
            <div className="mt-8 text-center text-sm text-neutral-600">
              <p className="mb-2">
                <strong>{company?.name || 'ADORIS INVEST GROUP OÜ'}</strong>
              </p>
              <p>{company?.address || 'Ruunaoja tn 3-36, 11415 Tallinn, Estonia'}</p>
              <p>{dict.terms.companyInfoRegCode}: {company?.registrationCode || '12825289'} | {dict.terms.companyInfoVat}: {company?.vatId || 'EE102079353'}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer translations={dict.footer} />
    </>
  );
}
