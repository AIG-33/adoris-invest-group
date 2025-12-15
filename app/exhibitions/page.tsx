import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ExhibitionsPage() {
  let exhibitions = []
  try {
    exhibitions = await prisma.exhibition.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching exhibitions:', error)
    }
    exhibitions = []
  }

  const upcomingExhibitions = exhibitions.filter(
    (ex: any) => new Date(ex.startDate || ex.endDate) >= new Date()
  )
  const pastExhibitions = exhibitions.filter(
    (ex: any) => new Date(ex.endDate || ex.startDate) < new Date()
  )

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

        {/* Upcoming Exhibitions */}
        {upcomingExhibitions.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-4xl font-bold text-black">
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
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-4xl font-bold text-black">
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
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
              <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-12 shadow-lg">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
                <h3 className="mb-2 text-2xl font-bold text-black">
                  No Exhibitions Yet
                </h3>
                <p className="text-neutral-600">
                  Check back soon for upcoming events
                </p>
              </div>
            </div>
          </section>
        )}

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

function ExhibitionCard({
  exhibition,
  isUpcoming,
}: {
  exhibition: any
  isUpcoming: boolean
}) {
  const mainImage = (exhibition.images && exhibition.images[0] && exhibition.images[0].length > 0) ? exhibition.images[0] : '/placeholder.svg'
  const exhibitionDate = exhibition.startDate || exhibition.endDate || new Date()
  const formattedDate = new Date(exhibitionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/exhibitions/${exhibition.id}`}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:border-[#333333] hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-neutral-100">
        <Image
          src={mainImage}
          alt={exhibition.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Upcoming Badge */}
        {isUpcoming && (
          <div className="absolute right-4 top-4 rounded-full bg-[#000000] px-4 py-2 text-sm font-bold text-white">
            Upcoming
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-3 text-2xl font-bold text-black transition-colors group-hover:text-[#333333]">
          {exhibition.title}
        </h3>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-neutral-600">
            <Calendar className="h-5 w-5 text-[#666666]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <MapPin className="h-5 w-5 text-[#666666]" />
            <span>{exhibition.location}</span>
          </div>
        </div>

        <p className="mb-4 text-neutral-600 line-clamp-3">
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
