import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ColorSync } from '@/components/color-sync'
import { HreflangTags } from '@/components/hreflang'
import { getServerCompany } from '@/lib/server-company'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const logo = company?.logo || '/logo.png'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const fullLogoUrl = logo.startsWith('http') ? logo : `${baseUrl}${logo}`
  const companyName = company?.name || 'ADORIS INVEST GROUP OÜ'
  const description = company?.language === 'ru'
    ? 'Профессиональное B2B медицинское и лабораторное оборудование и расходные материалы. Высококачественные анализаторы, реагенты и лабораторные расходные материалы от ведущих производителей.'
    : 'Professional B2B medical laboratory equipment and supplies. High-quality analyzers, reagents, and laboratory consumables from leading manufacturers.'
  
  return {
    title: {
      default: companyName,
      template: `%s | ${companyName}`,
    },
    description,
    keywords: [
      'medical equipment',
      'laboratory equipment',
      'laboratory supplies',
      'medical analyzers',
      'laboratory reagents',
      'B2B medical supplies',
      'clinical laboratory equipment',
      'diagnostic equipment',
      company?.language === 'ru' ? 'медицинское оборудование' : '',
      company?.language === 'ru' ? 'лабораторное оборудование' : '',
    ].filter(Boolean),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': baseUrl,
        'ru': baseUrl,
        'x-default': baseUrl,
      },
    },
    icons: {
      icon: fullLogoUrl,
      shortcut: fullLogoUrl,
      apple: fullLogoUrl,
    },
    openGraph: {
      type: 'website',
      locale: company?.language === 'ru' ? 'ru_RU' : 'en_US',
      url: baseUrl,
      siteName: companyName,
      title: companyName,
      description,
      images: [
        {
          url: fullLogoUrl,
          width: 1200,
          height: 630,
          alt: companyName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: companyName,
      description,
      images: [fullLogoUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add Google Search Console verification if available
      // google: 'your-verification-code',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const company = await getServerCompany()
  
  // Get company colors - use actual values from DB, fallback to defaults only if null/undefined
  // Important: Empty string should be treated as valid value, only null/undefined use defaults
  // Using nullish coalescing (??) ensures we only use defaults when value is null or undefined
  const primaryColor = (company?.primaryColor != null && company.primaryColor !== '') 
    ? company.primaryColor 
    : '#333333'
  const secondaryColor = (company?.secondaryColor != null && company.secondaryColor !== '') 
    ? company.secondaryColor 
    : '#ffffff'
  const accentColor = (company?.accentColor != null && company.accentColor !== '') 
    ? company.accentColor 
    : '#000000'
  const logo = company?.logo || null

  return (
    <html 
      lang={company?.language || 'en'} 
      suppressHydrationWarning
      style={{
        '--company-primary': primaryColor,
        '--company-secondary': secondaryColor,
        '--company-accent': accentColor,
      } as React.CSSProperties & Record<string, string>}
      data-company-logo={logo || undefined}
    >
      <head>
        <HreflangTags />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ColorSync />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
