'use client'

import { Award, Building2, Globe, Shield } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const stats = [
  {
    icon: Globe,
    value: '100,000+',
    label: 'Medical Products',
    description: 'Comprehensive catalog',
  },
  {
    icon: Building2,
    value: '50+',
    label: 'European Manufacturers',
    description: 'Original products only',
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Compliance',
    description: 'Full regulatory approval',
  },
  {
    icon: Award,
    value: '4-7',
    label: 'Weeks Delivery',
    description: 'To Vilnius warehouse',
  },
]

const features = [
  {
    title: 'Original Products',
    description: 'Only authentic products from verified European manufacturers',
  },
  {
    title: 'Volume Discounts',
    description: '5% discount for €50k+ orders, 10% for €100k+ orders',
  },
  {
    title: 'Cold Chain Compliance',
    description: 'Full temperature control for sensitive medical products',
  },
  {
    title: 'EXW Vilnius',
    description: 'Flexible delivery terms with warehouse in Vilnius',
  },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a1f1a] to-black opacity-50" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`group rounded-2xl border border-[#000000]/20 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 backdrop-blur-sm transition-all duration-700 hover:border-[#000000]/50 hover:shadow-xl hover:shadow-[#000000]/20 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <Icon className="mb-4 h-12 w-12 text-[#666666] transition-transform group-hover:scale-110" />
                <div className="mb-2 text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mb-1 text-lg font-semibold text-[#666666]">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            )
          })}
        </div>

        {/* Features Section */}
        <div>
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
            Why Choose IVD Group
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group rounded-xl border border-[#000000]/20 bg-gradient-to-r from-gray-900/30 to-black/30 p-6 backdrop-blur-sm transition-all duration-700 hover:border-[#000000]/50 hover:bg-gradient-to-r hover:from-[#000000]/10 hover:to-[#156b5f]/10 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              >
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-[#666666]">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="mb-4 text-2xl font-bold text-white">
            Ready to order?
          </h3>
          <p className="mb-8 text-gray-400">
            Minimum order €10,000 · 100% prepayment · 4-7 weeks delivery
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="rounded-lg bg-[#000000] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#156b5f] hover:scale-105 hover:shadow-xl hover:shadow-[#000000]/50"
            >
              Browse Catalog
            </a>
            <a
              href="/terms"
              className="rounded-lg border-2 border-[#000000] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#000000]/10"
            >
              View Terms
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
