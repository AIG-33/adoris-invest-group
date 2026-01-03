import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCompany } from '@/lib/company';
import { getProductPrice } from '@/lib/product-price';

// Cache search results for 60 seconds
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    // Search by SKU or name - optimized with select
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
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        priceEU: true,
        priceRU: true,
        image: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
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

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
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
