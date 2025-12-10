import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ArrowLeft, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
}

export default async function ExhibitionDetailPage({ params }: Props) {
  const exhibition = await prisma.exhibition.findUnique({
    where: { id: params.id },
  })

  if (!exhibition) {
    notFound()
  }

  const formattedDate = new Date(exhibition.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/exhibitions"
            className="mb-8 inline-flex items-center gap-2 text-[#2ec4b6] transition-colors hover:text-black"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Exhibitions
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {exhibition.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-6 w-6 text-[#2ec4b6]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-6 w-6 text-[#2ec4b6]" />
                <span>{exhibition.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 rounded-xl border border-[#1a8c7c]/20 bg-gray-900/50 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-bold text-white">About</h2>
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-300">
              {exhibition.description}
            </p>
          </div>

          {/* Photo Gallery */}
          {exhibition.images.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-8 text-3xl font-bold text-white">Gallery</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {exhibition.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#1a8c7c]/20 bg-gray-800 transition-all hover:border-[#1a8c7c]/50 hover:shadow-2xl hover:shadow-[#1a8c7c]/20"
                  >
                    <Image
                      src={image}
                      alt={`${exhibition.title} - Photo ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl border border-[#1a8c7c]/30 bg-gradient-to-r from-[#1a8c7c]/10 to-[#156b5f]/10 p-8 text-center backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Interested in our products?
            </h3>
            <p className="mb-6 text-gray-300">
              Contact us to learn more about our medical equipment solutions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1a8c7c] px-6 py-3 font-semibold text-white transition-all hover:bg-[#156b5f] hover:scale-105"
              >
                Browse Products
              </Link>
              <Link
                href="mailto:info@ivdgroup.eu"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1a8c7c] px-6 py-3 font-semibold text-white transition-all hover:bg-neutral-800/10"
              >
                <ExternalLink className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
