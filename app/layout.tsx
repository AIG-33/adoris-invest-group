import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
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
  
  // Get company colors or use defaults
  const primaryColor = company?.primaryColor || '#333333'
  const secondaryColor = company?.secondaryColor || '#666666'
  const accentColor = company?.accentColor || '#000000'
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
