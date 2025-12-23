import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCompany } from '@/lib/company';
import { getProductPrice } from '@/lib/product-price';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected { items: [{sku: string, quantity: number}] }' },
        { status: 400 }
      );
    }

    // Extract SKUs
    const skus = items.map(item => item.sku?.trim()).filter(Boolean);

    if (skus.length === 0) {
      return NextResponse.json(
        { error: 'No valid SKUs provided' },
        { status: 400 }
      );
    }

    // Get current company for pricing
    const headers = new Headers(request.headers);
    const company = await getCurrentCompany(headers);
    const priceType = company?.priceType || 'EU';
    
    // Debug logging (always log for troubleshooting)
    const host = headers.get('host') || headers.get('x-forwarded-host') || 'unknown';
    console.log('[Bulk Order] Host:', host);
    console.log('[Bulk Order] Company:', company?.name || 'NOT FOUND', 'Domain:', company?.domain, 'PriceType:', priceType);
    
    if (!company) {
      console.error('[Bulk Order] Company not found for domain:', host);
    }

    // Find products by SKUs
    const products = await prisma.product.findMany({
      where: {
        sku: {
          in: skus,
        },
      },
      include: {
        category: true,
        manufacturer: true,
      },
    });

    // Map products with requested quantities and correct prices
    const result = {
      found: [] as any[],
      notFound: [] as string[],
    };

    // Create a map of SKU to product
    const productMap = new Map(
      products.map((p: any) => [p.sku.toLowerCase(), p])
    );

    // Process each requested item
    items.forEach(item => {
      const sku = item.sku?.trim();
      const quantity = parseInt(item.quantity) || 1;

      if (!sku) return;

      const product = productMap.get(sku.toLowerCase());

      if (product) {
        // Apply correct price based on company priceType
        const priceEU = typeof product.priceEU === 'object' ? Number(product.priceEU) : product.priceEU;
        const priceRU = product.priceRU ? (typeof product.priceRU === 'object' ? Number(product.priceRU) : product.priceRU) : null;
        
        const price = getProductPrice(
          priceEU,
          priceRU,
          priceType as 'EU' | 'RU'
        );

        // Debug logging (always log for troubleshooting)
        console.log(`[Bulk Order] Product ${product.sku}: priceEU=${priceEU}, priceRU=${priceRU}, calculated=${price}`);
        
        if (price === 0 || isNaN(price)) {
          console.warn(`[Bulk Order] WARNING: Product ${product.sku} has price 0 or NaN!`);
        }

        result.found.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          price: price, // Use calculated price
          imageUrl: product.image || null,
          category: product.category ? { name: product.category.name } : null,
          manufacturer: product.manufacturer ? {
            name: product.manufacturer.name,
            logo: product.manufacturer.logo,
          } : null,
          requestedQuantity: quantity,
        });
      } else {
        result.notFound.push(sku);
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Bulk order error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to process bulk order' },
      { status: 500 }
    );
  }
}
