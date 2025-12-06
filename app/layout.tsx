import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ADORIS INVEST GROUP - Medical Laboratory Equipment & Supplies',
  description:
    'Professional B2B medical laboratory equipment and supplies. High-quality analyzers, reagents, and laboratory consumables from leading manufacturers.',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ADORIS INVEST GROUP - Medical Laboratory Equipment & Supplies',
    description:
      'Professional B2B medical laboratory equipment and supplies',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
