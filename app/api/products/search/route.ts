import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search by SKU or name
    const products = await prisma.product.findMany({
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

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
