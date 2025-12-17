import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCompany } from '@/lib/company';
import { getProductPrice } from '@/lib/product-price';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search by SKU or name
    const productsRaw = await prisma.product.findMany({
      where: {
        OR: [
          {
            sku: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
        manufacturer: true,
      },
      take: 10, // Limit to 10 results for autocomplete
      orderBy: [
        {
          sku: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    // Get current company for pricing
    const headers = new Headers(request.headers);
    const company = await getCurrentCompany(headers);
    const priceType = company?.priceType || 'EU';

    // Convert Decimal to number and apply correct price
    const products = productsRaw.map(p => ({
      ...p,
      price: getProductPrice(
        p.priceEU,
        p.priceRU,
        priceType as 'EU' | 'RU'
      ),
    }));

    return NextResponse.json(products);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Search error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
