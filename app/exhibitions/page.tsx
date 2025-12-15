import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ExhibitionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-4 text-5xl font-bold md:text-6xl">
                Our Exhibitions
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-white/90">
                IVD Group actively participates in leading medical and laboratory
                equipment exhibitions across Europe
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-12 shadow-lg">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
                <h3 className="mb-2 text-2xl font-bold text-black">
                  Coming Soon
                </h3>
                <p className="text-neutral-600">
                  Exhibition information will be available here soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-black to-neutral-800 p-12 text-center text-white">
              <h3 className="mb-4 text-3xl font-bold">
                Meet Us at Our Next Event
              </h3>
              <p className="mb-8 text-xl text-white/90">
                Discover our latest products and innovations in medical technology
              </p>
              <Link
                href="mailto:info@ivdgroup.eu"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-8 py-4 text-lg font-semibold transition-all hover:bg-neutral-100 hover:scale-105 hover:shadow-xl"
              >
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
