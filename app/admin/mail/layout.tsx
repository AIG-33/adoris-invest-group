import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MailNav } from '@/components/admin-mail/mail-nav'
import { getAdminEmail } from '@/lib/rfq/auth'

export const dynamic = 'force-dynamic'

export default async function AdminMailLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminEmail()
  if (!admin) redirect('/auth/login')

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900">
                ← Админка
              </Link>
              <h1 className="text-2xl font-bold text-neutral-900">Запросы цен по почте</h1>
            </div>
            <MailNav />
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
