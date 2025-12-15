'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, ShoppingCart, AlertCircle, CheckCircle, Package, Loader2 } from 'lucide-react';

interface ProcessedProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
  manufacturer: { name: string } | null;
  requestedQuantity: number;
}

interface BulkOrderResult {
  found: ProcessedProduct[];
  notFound: string[];
}

export default function BulkOrderForm() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BulkOrderResult | null>(null);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    setError('');
    setResult(null);

    if (!inputText.trim()) {
      setError('Please enter SKUs and quantities');
      return;
    }

    setIsProcessing(true);

    try {
      // Parse input text into items
      const lines = inputText.split('\n').filter(line => line.trim());
      const items = lines.map(line => {
        const parts = line.split(/[\t,;\s]+/).filter(p => p.trim());
        return {
          sku: parts[0] || '',
          quantity: parts[1] || '1',
        };
      }).filter(item => item.sku);

      if (items.length === 0) {
        setError('No valid items found. Please enter SKU and quantity on each line.');
        setIsProcessing(false);
        return;
      }

      // Send to API
      const response = await fetch('/api/bulk-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process bulk order');
      }

      const data: BulkOrderResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCart = () => {
    if (!result || result.found.length === 0) return;

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add products to cart
    result.found.forEach(product => {
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.requestedQuantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category?.name,
          manufacturer: product.manufacturer?.name,
          quantity: product.requestedQuantity,
        });
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    // Redirect to cart
    router.push('/cart');
  };

  const exampleText = `SKU001\t5
SKU002\t3
SKU003\t10`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-[#333333]" />
          <h2 className="text-xl font-bold text-[#000000]">Enter Products</h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Paste SKUs and Quantities
            <span className="text-neutral-500 ml-2">
              (one per line, separated by tab, comma, or space)
            </span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Example:\n${exampleText}`}
            className="w-full h-64 px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-4 focus:ring-[#333333]/10 transition-all font-mono text-sm"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim()}
            className="flex-1 bg-[#333333] text-white px-6 py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Process Items
              </>
            )}
          </button>
          <button
            onClick={() => {
              setInputText('');
              setResult(null);
              setError('');
            }}
            className="px-6 py-3 border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-semibold text-neutral-700"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Format Guide */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h3 className="font-semibold text-sm text-neutral-700 mb-2">Format Guide:</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• One product per line</li>
            <li>• Format: <code className="bg-white px-2 py-0.5 rounded font-mono text-xs">SKU [TAB/COMMA/SPACE] Quantity</code></li>
            <li>• Quantity is optional (defaults to 1)</li>
            <li>• SKU must match exactly (case-insensitive)</li>
          </ul>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-[#666666]" />
          <h2 className="text-xl font-bold text-[#000000]">Results</h2>
        </div>

        {!result ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
            <Package className="w-16 h-16 mb-4" />
            <p className="text-center">Enter SKUs and click &quot;Process Items&quot; to see results</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{result.found.length}</div>
                <div className="text-sm text-green-600">Found</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{result.notFound.length}</div>
                <div className="text-sm text-red-600">Not Found</div>
              </div>
            </div>

            {/* Found Products */}
            {result.found.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Found Products ({result.found.length})
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {result.found.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                        {product.imageUrl && product.imageUrl.length > 0 ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#000000] truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-neutral-600 font-mono">{product.sku}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-[#000000]">
                          {product.requestedQuantity}x
                        </div>
                        <div className="text-xs text-neutral-500">
                          €{(product.price * product.requestedQuantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addToCart}
                  className="w-full mt-4 bg-[#666666] text-white px-6 py-3 rounded-lg hover:bg-[#059669] transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add All to Cart ({result.found.length} items)
                </button>
              </div>
            )}

            {/* Not Found SKUs */}
            {result.notFound.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Not Found SKUs ({result.notFound.length})
                </h3>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {result.notFound.map((sku, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white border border-red-300 rounded text-xs font-mono text-red-700"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
