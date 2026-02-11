'use client'

import { Award, Building2, Globe, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface StatsSectionTranslations {
  whyChoose: string
  readyToOrder: string
  minimumOrder: string
  browseCatalog: string
  viewTerms: string
  stats: {
    medicalProducts: { value: string; label: string; description: string }
    manufacturers: { value: string; label: string; description: string }
    compliance: { value: string; label: string; description: string }
    delivery: { value: string; label: string; description: string }
  }
  features: {
    originalProducts: { title: string; description: string }
    volumeDiscounts: { title: string; description: string }
    coldChain: { title: string; description: string }
    exwVilnius: { title: string; description: string }
  }
}

interface StatsSectionProps {
  companyName?: string
  translations: StatsSectionTranslations
}

export function StatsSection({ companyName = 'IVD Group', translations }: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { icon: Globe, ...translations.stats.medicalProducts },
    { icon: Building2, ...translations.stats.manufacturers },
    { icon: Shield, ...translations.stats.compliance },
    { icon: Award, ...translations.stats.delivery },
  ]

  const features = [
    translations.features.originalProducts,
    translations.features.volumeDiscounts,
    translations.features.coldChain,
    translations.features.exwVilnius,
  ]

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-20">
      {/* Separator */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`group rounded-xl p-5 sm:p-6 bg-white/[0.05] backdrop-blur-sm border border-white/[0.10] transition-all duration-700 hover:bg-white/[0.09] hover:border-white/[0.16] card-glow ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <Icon className="mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 text-white/45 transition-colors group-hover:text-white/70" strokeWidth={1.5} />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/70 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-white/60">{stat.description}</div>
              </div>
            )
          })}
        </div>

        {/* Why Choose Us */}
        <div>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 sm:mb-12 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {translations.whyChoose} {companyName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group rounded-xl p-5 sm:p-6 bg-white/[0.04] border border-white/[0.08] transition-all duration-700 hover:bg-white/[0.08] hover:border-white/[0.14] card-glow ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + idx * 80}ms` }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-14 sm:mt-16 text-center transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {translations.readyToOrder}
          </h3>
          <p className="text-sm text-white/70 mb-8 max-w-lg mx-auto">
            {translations.minimumOrder}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg hover:brightness-110"
              style={{ backgroundColor: 'var(--company-accent)' }}
            >
              {translations.browseCatalog}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.14] text-white text-sm font-semibold transition-all hover:bg-white/[0.08] hover:border-white/[0.25]"
            >
              {translations.viewTerms}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
