import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BulkOrderForm from '@/components/bulk-order-form';

export const dynamic = 'force-dynamic';

export default function BulkOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Bulk Order
              </h1>
              <p className="text-neutral-400">
                Quickly add multiple products to your cart by pasting SKUs and quantities
              </p>
            </div>

            <BulkOrderForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
