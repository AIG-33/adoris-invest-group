import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ExhibitionsPage() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { startDate: 'desc' },
  })

  const upcomingExhibitions = exhibitions.filter(
    (ex: any) => new Date(ex.date) >= new Date()
  )
  const pastExhibitions = exhibitions.filter(
    (ex: any) => new Date(ex.date) < new Date()
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/20 to-[#666666]/20 opacity-20" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
                Our Exhibitions
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-gray-300">
                IVD Group actively participates in leading medical and laboratory
                equipment exhibitions across Europe
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Exhibitions */}
        {upcomingExhibitions.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-4xl font-bold text-white">
                Upcoming Events
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {upcomingExhibitions.map((exhibition: any) => (
                  <ExhibitionCard
                    key={exhibition.id}
                    exhibition={exhibition}
                    isUpcoming={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Past Exhibitions */}
        {pastExhibitions.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-4xl font-bold text-white">
                Past Events
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {pastExhibitions.map((exhibition: any) => (
                  <ExhibitionCard
                    key={exhibition.id}
                    exhibition={exhibition}
                    isUpcoming={false}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* No Exhibitions */}
        {exhibitions.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="mx-auto max-w-md rounded-xl border border-[#000000]/20 bg-gray-900/50 p-12 backdrop-blur-sm">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-[#666666]/50" />
                <h3 className="mb-2 text-2xl font-bold text-white">
                  No Exhibitions Yet
                </h3>
                <p className="text-gray-400">
                  Check back soon for upcoming events
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#000000]/30 bg-gradient-to-r from-[#000000]/10 to-[#156b5f]/10 p-12 text-center backdrop-blur-sm">
              <h3 className="mb-4 text-3xl font-bold text-white">
                Meet Us at Our Next Event
              </h3>
              <p className="mb-8 text-xl text-gray-300">
                Discover our latest products and innovations in medical technology
              </p>
              <Link
                href="mailto:info@ivdgroup.eu"
                className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#156b5f] hover:scale-105 hover:shadow-xl hover:shadow-[#000000]/50"
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

function ExhibitionCard({
  exhibition,
  isUpcoming,
}: {
  exhibition: any
  isUpcoming: boolean
}) {
  const mainImage = (exhibition.images && exhibition.images[0] && exhibition.images[0].length > 0) ? exhibition.images[0] : '/placeholder.svg'
  const formattedDate = new Date(exhibition.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/exhibitions/${exhibition.id}`}
      className="group relative overflow-hidden rounded-2xl border border-[#000000]/20 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-[#000000]/50 hover:shadow-2xl hover:shadow-[#000000]/20"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-800">
        <Image
          src={mainImage}
          alt={exhibition.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Upcoming Badge */}
        {isUpcoming && (
          <div className="absolute right-4 top-4 rounded-full bg-[#000000] px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
            Upcoming
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-[#666666]">
          {exhibition.title}
        </h3>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="h-5 w-5 text-[#666666]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="h-5 w-5 text-[#666666]" />
            <span>{exhibition.location}</span>
          </div>
        </div>

        <p className="mb-4 text-gray-400 line-clamp-3">
          {exhibition.description}
        </p>

        <div className="flex items-center gap-2 text-[#666666] transition-colors group-hover:text-[#333333]">
          <span className="font-semibold">View Gallery</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
