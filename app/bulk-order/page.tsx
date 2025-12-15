import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BulkOrderForm from '@/components/bulk-order-form';

export const dynamic = 'force-dynamic';

export default function BulkOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-2">
                Bulk Order
              </h1>
              <p className="text-lg text-white/90">
                Quickly add multiple products to your cart by pasting SKUs and quantities
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">

            <BulkOrderForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
