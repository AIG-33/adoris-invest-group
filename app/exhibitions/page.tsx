import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ExhibitionImage } from '@/components/exhibition-image'
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

interface Exhibition {
  id: string
  name: string
  date: string
  location: string
  description: string
  highlights?: string[]
  images: string[]
}

const exhibitions: Exhibition[] = [
  {
    id: 'worldlab-2024',
    name: 'WorldLab',
    date: 'May 2024',
    location: 'Dubai, UAE',
    description: 'WorldLab is one of the most important international exhibitions for clinical laboratory diagnostics. We showcased our latest innovations in laboratory equipment and solutions.',
    highlights: [
      'Latest laboratory equipment and solutions',
      'Networking with industry professionals',
      'Product demonstrations'
    ],
    images: [
      '/exhibitions/worldlab-2024-1.jpg',
      '/exhibitions/worldlab-2024-2.jpg',
      '/exhibitions/worldlab-2024-3.jpg'
    ]
  },
  {
    id: 'worldlab-2023',
    name: 'WorldLab',
    date: 'May 2023',
    location: 'Rome, Italy',
    description: 'Our participation at WorldLab 2023 allowed us to connect with leading professionals in the clinical laboratory diagnostics field and present our comprehensive range of products.',
    highlights: [
      'Clinical laboratory diagnostics showcase',
      'Industry networking opportunities',
      'Innovation presentations'
    ],
    images: [
      '/exhibitions/worldlab-2023-1.jpg',
      '/exhibitions/worldlab-2023-2.jpg',
      '/exhibitions/worldlab-2023-3.jpg'
    ]
  },
  {
    id: 'euromedlab-2022',
    name: 'Euromedlab',
    date: 'April 2022',
    location: 'Milan, Italy',
    description: 'At Euromedlab 2022, we presented MedNAIS™ and our innovative sampling process solutions. This exhibition provided an excellent platform to demonstrate our commitment to improving preanalytical quality in laboratory diagnostics.',
    highlights: [
      'MedNAIS™ / SAMPLING PROCESS presentation',
      'Preanalytical quality solutions',
      'Interactive product demonstrations'
    ],
    images: [
      '/exhibitions/euromedlab-2022-1.jpg',
      '/exhibitions/euromedlab-2022-2.jpg',
      '/exhibitions/euromedlab-2022-3.jpg'
    ]
  },
  {
    id: 'preanalytical-2022',
    name: '6th Preanalytical Conference',
    date: 'April 2022',
    location: 'Munich, Germany',
    description: 'The 6th Preanalytical Conference focused on preanalytical quality as an interdisciplinary journey. We participated in this important event to share knowledge and showcase solutions for improving the preanalytical phase in laboratory diagnostics.',
    highlights: [
      'Preanalytical Quality focus',
      'Interdisciplinary approach to laboratory diagnostics',
      'Knowledge sharing and networking'
    ],
    images: [
      '/exhibitions/preanalytical-2022-1.jpg',
      '/exhibitions/preanalytical-2022-2.jpg',
      '/exhibitions/preanalytical-2022-3.jpg'
    ]
  },
  {
    id: 'medica-2021',
    name: 'Medica',
    date: 'November 2021',
    location: 'Düsseldorf, Germany',
    description: 'Medica is the world\'s leading trade fair for the medical industry. Our participation in 2021 allowed us to showcase our products to an international audience of healthcare professionals and industry leaders.',
    highlights: [
      'International medical trade fair',
      'Healthcare professionals networking',
      'Product showcase to global audience'
    ],
    images: [
      '/exhibitions/medica-2021-1.jpg',
      '/exhibitions/medica-2021-2.jpg',
      '/exhibitions/medica-2021-3.jpg'
    ]
  },
  {
    id: 'medlab-arabhealth-2021',
    name: 'Medlab / ArabHealth',
    date: 'June 2021',
    location: 'Dubai, UAE',
    description: 'Our participation in Medlab and ArabHealth 2021 marked our presence in the Middle Eastern market. These concurrent exhibitions provided an excellent opportunity to connect with regional healthcare professionals and showcase our laboratory solutions.',
    highlights: [
      'Middle Eastern market presence',
      'Regional healthcare networking',
      'Laboratory solutions showcase'
    ],
    images: [
      '/exhibitions/medlab-arabhealth-2021-1.jpg',
      '/exhibitions/medlab-arabhealth-2021-2.jpg',
      '/exhibitions/medlab-arabhealth-2021-3.jpg'
    ]
  }
]

export default async function ExhibitionsPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  return (
    <>
      <Header translations={dict.nav} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-4 text-5xl font-bold md:text-6xl">
                {dict.exhibitions.title}
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-white/90">
                {dict.exhibitions.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Exhibitions List */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-16">
              {exhibitions.map((exhibition, index) => (
                <article
                  key={exhibition.id}
                  className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Images Section */}
                    <div className="relative bg-neutral-100">
                      <div className="grid grid-cols-2 gap-2 p-4 h-full">
                        {exhibition.images.slice(0, 4).map((image, imgIndex) => (
                          <ExhibitionImage
                            key={imgIndex}
                            src={image}
                            alt={`${exhibition.name} ${imgIndex + 1}`}
                            index={imgIndex}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Calendar className="w-5 h-5" />
                          <time className="font-semibold" dateTime={exhibition.date}>
                            {exhibition.date}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <MapPin className="w-5 h-5" />
                          <span className="font-semibold">{exhibition.location}</span>
                        </div>
                      </div>

                      <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                        {exhibition.name}
                      </h2>

                      <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                        {exhibition.description}
                      </p>

                      {exhibition.highlights && exhibition.highlights.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                            {dict.exhibitions.highlights}
                          </h3>
                          <ul className="space-y-2">
                            {exhibition.highlights.map((highlight, highlightIndex) => (
                              <li key={highlightIndex} className="flex items-start gap-2 text-neutral-700">
                                <span className="text-[#333333] mt-1.5">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-neutral-200">
                        <div className="text-sm text-neutral-500">
                          {dict.exhibitions.exhibition} #{exhibitions.length - index} {dict.exhibitions.of} {exhibitions.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-neutral-200 p-12 text-center text-white" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
              <h3 className="mb-4 text-3xl font-bold">
                {dict.exhibitions.meetUsTitle}
              </h3>
              <p className="mb-8 text-xl text-white/90">
                {dict.exhibitions.meetUsSubtitle}
              </p>
              <a
                href={`mailto:${company?.email || 'info@adorisgroup.com'}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-8 py-4 text-lg font-semibold transition-all hover:bg-neutral-100 hover:scale-105 hover:shadow-xl"
              >
                {dict.exhibitions.contactUs}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer translations={dict.footer} />
    </>
  )
}
