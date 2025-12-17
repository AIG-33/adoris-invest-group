import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ColorSync } from '@/components/color-sync'
import { getServerCompany } from '@/lib/server-company'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const company = await getServerCompany()
  const logo = company?.logo || '/logo.png'
  
  return {
    title: company?.name || 'ADORIS INVEST GROUP - Medical Laboratory Equipment & Supplies',
    description:
      'Professional B2B medical laboratory equipment and supplies. High-quality analyzers, reagents, and laboratory consumables from leading manufacturers.',
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    openGraph: {
      title: company?.name || 'ADORIS INVEST GROUP - Medical Laboratory Equipment & Supplies',
      description:
        'Professional B2B medical laboratory equipment and supplies',
      images: [logo],
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
      <body className={inter.className} suppressHydrationWarning>
        <ColorSync />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
