import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Globe, Users, TrendingUp, CheckCircle2, Target, Heart, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-black to-neutral-800 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                About Adoris Invest Group
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                Your Trusted Partner in Medical Equipment and Laboratory Supplies Since 2014
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
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] mb-6">
                    Who We Are
                  </h2>
                  <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                    ADORIS INVEST GROUP OÜ is an experienced and trusted representative of the world's largest manufacturers 
                    of medical devices, medical equipment, and consumables for clinical and sports laboratories.
                  </p>
                  <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                    Founded in 2014 in Estonia, we have grown to become a leading distributor serving clients across 
                    Russia, Belarus, Kazakhstan, and the European Union.
                  </p>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Our direct contacts with manufacturers and streamlined logistics routes enable us to promptly organize 
                    the delivery of goods under the conditions required by our customers.
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
                  <div className="text-4xl font-bold text-[#000000] mb-2">10+</div>
                  <div className="text-neutral-600 font-medium">Years Experience</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-[#000000] mb-2">5</div>
                  <div className="text-neutral-600 font-medium">Countries Served</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-[#000000] mb-2">100+</div>
                  <div className="text-neutral-600 font-medium">Global Partners</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-black">
                  <div className="text-4xl font-bold text-[#000000] mb-2">€781K</div>
                  <div className="text-neutral-600 font-medium">Annual Revenue (2018)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#000000] mb-12">
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-3">Quality Assurance</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    We partner only with top-tier manufacturers to ensure the highest quality standards for all products.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-3">Customer Focus</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Our clients' success is our success. We tailor our services to meet specific needs and deadlines.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-3">Integrity</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    We build lasting relationships based on trust, transparency, and honest communication.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-black to-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-3">Innovation</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    We continuously optimize our processes to deliver cutting-edge solutions and services.
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
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#000000] mb-12">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Globe className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-[#000000] mb-4">Global Distribution</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    We serve clients across Russia, Belarus, Kazakhstan, European Union, USA, and Austria with efficient logistics.
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Direct manufacturer contacts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Streamlined delivery routes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Flexible payment terms</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Award className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-[#000000] mb-4">Consulting Services</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    As the #1 consulting company in Belarus, we offer comprehensive healthcare consulting services.
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Marketing strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>National registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Procurement support</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-white to-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
                  <Users className="w-12 h-12 text-black mb-6" />
                  <h3 className="text-2xl font-bold text-[#000000] mb-4">Trusted Partnerships</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    We collaborate with global healthcare leaders and regional distributors.
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
        <section className="py-16 bg-gradient-to-r from-black to-neutral-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                Our Growth Story
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">160%</div>
                  <p className="text-xl text-white/90">Revenue Growth (2018)</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">1553%</div>
                  <p className="text-xl text-white/90">Profit Growth (2018)</p>
                </div>
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-white" />
                  <div className="text-5xl font-bold mb-2">96%</div>
                  <p className="text-xl text-white/90">Belarus Market Share</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] mb-6">
                Ready to Partner With Us?
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Let's discuss how we can support your medical equipment and laboratory supply needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-black to-neutral-800 text-white font-semibold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Browse Our Catalog
                </Link>
                <Link
                  href="/company/team"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  Meet Our Team
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <p className="text-neutral-600 mb-2">
                  <strong>Contact Us:</strong>
                </p>
                <p className="text-neutral-700">
                  📧 ceo@adorisgroup.com | 📞 +48 881 049 959
                </p>
                <p className="text-neutral-600 text-sm mt-2">
                  ADORIS INVEST GROUP OÜ | Ruunaoja tn 3-36, 11415 Tallinn, Estonia
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
