import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BulkOrderForm from '@/components/bulk-order-form';
import { getServerCompany } from '@/lib/server-company';
import { getDictionary } from '@/lib/translations';

export const dynamic = 'force-dynamic';

export default async function BulkOrderPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--company-secondary, #ffffff)' }}>
        {/* Hero Section */}
        <section className="relative text-white py-20" style={{ backgroundColor: 'var(--company-primary, #333333)' }}>
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-2">
                {dict.bulkOrder.title}
              </h1>
              <p className="text-lg text-white/90">
                {dict.bulkOrder.subtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">

            <BulkOrderForm translations={{...dict.bulkOrder, items: dict.cart.items}} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
