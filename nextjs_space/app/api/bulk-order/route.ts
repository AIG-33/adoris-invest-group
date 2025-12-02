import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Map products with requested quantities
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
        result.found.push({
          ...product,
          requestedQuantity: quantity,
        });
      } else {
        result.notFound.push(sku);
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Bulk order error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk order' },
      { status: 500 }
    );
  }
}
