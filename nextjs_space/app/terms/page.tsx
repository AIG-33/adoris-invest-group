import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, ShieldCheck, Truck, CreditCard, Clock, ThermometerSnowflake, PackageCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-[#1a8c7c] mb-4">
                Terms & Conditions
              </h1>
              <p className="text-lg text-neutral-600">
                Please review our trading conditions before placing an order
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 space-y-8">
              {/* Original Products */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2ec4b6]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#2ec4b6]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Original Products Guarantee
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">
                      We supply <strong>only original products</strong> sourced directly from European manufacturers' warehouses. 
                      All products come with manufacturer warranties and certificates of authenticity.
                    </p>
                  </div>
                </div>
              </section>

              {/* Minimum Order */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#20a895]/10 rounded-lg flex items-center justify-center">
                    <PackageCheck className="w-6 h-6 text-[#20a895]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Minimum Order Value
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      The minimum order value is <strong>€10,000</strong>.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Please note:</strong> Orders below €10,000 will incur additional delivery charges 
                        from suppliers' warehouses to our warehouse in Vilnius, approximately <strong>€300-€500</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1a8c7c]/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#1a8c7c]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Payment Terms
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      We require <strong>100% prepayment</strong> for all orders.
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      We work on <strong>EXW Vilnius</strong> (Ex Works) terms. This means that goods are available for pickup 
                      at our warehouse in Vilnius, Lithuania. Buyers are responsible for all transportation costs and risks 
                      from that point forward.
                    </p>
                    <div className="mt-4 bg-neutral-100 rounded-lg p-4">
                      <h3 className="font-semibold text-[#1a8c7c] mb-2">Bank Details:</h3>
                      <ul className="space-y-1 text-sm text-neutral-700">
                        <li><strong>Bank:</strong> PKO Bank Polski SA</li>
                        <li><strong>SWIFT:</strong> BPKOPLPWXXX</li>
                        <li><strong>IBAN (EUR):</strong> PL52102010130000010204325890</li>
                        <li><strong>Bank Address:</strong> Plac Powstańców Warszawy 4, Warsaw, Poland</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Fulfillment */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2ec4b6]/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#2ec4b6]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Order Fulfillment & Delivery Time
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-3">
                      Products are available <strong>by order only</strong>. We do not maintain permanent stock.
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      Delivery to our warehouse in Vilnius takes <strong>4-7 weeks</strong>, depending on the product type and quantity ordered.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cold Chain */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#20a895]/10 rounded-lg flex items-center justify-center">
                    <ThermometerSnowflake className="w-6 h-6 text-[#20a895]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Cold Chain Compliance
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">
                      All temperature-sensitive deliveries are made with <strong>strict adherence to the cold chain</strong>. 
                      We ensure proper handling including replacement of chill elements or dry ice at every transhipment point 
                      to maintain product integrity throughout transportation.
                    </p>
                  </div>
                </div>
              </section>

              {/* Discounts */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2ec4b6]/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#2ec4b6]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1a8c7c] mb-3">
                      Volume Discounts
                    </h2>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      We offer attractive volume discounts for larger orders:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-[#2ec4b6]/10 to-[#2ec4b6]/5 border border-[#2ec4b6]/20 rounded-lg p-4">
                        <div className="text-3xl font-bold text-[#2ec4b6] mb-2">5%</div>
                        <p className="text-sm font-semibold text-neutral-700">Orders €50,000+</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#20a895]/10 to-[#20a895]/5 border border-[#20a895]/20 rounded-lg p-4">
                        <div className="text-3xl font-bold text-[#20a895] mb-2">10%</div>
                        <p className="text-sm font-semibold text-neutral-700">Orders €100,000+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 bg-gradient-to-br from-[#1a8c7c] to-[#20a895] rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
              <p className="mb-6 text-neutral-200">
                Our team is ready to help you with any inquiries about our terms and conditions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@ivdgroup.eu"
                  className="bg-white text-[#1a8c7c] px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                >
                  📧 info@ivdgroup.eu
                </a>
                <a
                  href="tel:+48881049959"
                  className="bg-white text-[#1a8c7c] px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                >
                  📞 +48 88 1049959
                </a>
              </div>
            </div>

            {/* Company Info */}
            <div className="mt-8 text-center text-sm text-neutral-600">
              <p className="mb-2">
                <strong>IVD GROUP Sp. z o.o.</strong>
              </p>
              <p>Bartoszewicza 3-24, 00-337 Warsaw, Poland</p>
              <p>VAT: PL5252799583 | KRS: 0000800009</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
