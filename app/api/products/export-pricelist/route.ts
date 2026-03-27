import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as XLSX from 'xlsx'

// Cache pricelist for 1 hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    // Get all products with their manufacturer and category - optimized with select
    const products = await prisma.product.findMany({
      select: {
        sku: true,
        name: true,
        description: true,
        priceEU: true,
        manufacturer: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { manufacturer: { name: 'asc' } },
        { name: 'asc' },
      ],
    })

    // Prepare data for Excel with the same structure as Google Sheets
    // Columns: Manufacturer | Art (SKU) | Product | Description | Price, EUR
    const excelData = products.map((product) => ({
      'Manufacturer': product.manufacturer.name || '',
      'Art': product.sku || '',
      'Product': product.name || '',
      'Description': product.description || '',
      'Price, EUR': Number(product.priceEU) || 0,
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 20 }, // Manufacturer
      { wch: 15 }, // Art (SKU)
      { wch: 50 }, // Product
      { wch: 60 }, // Description
      { wch: 12 }, // Price, EUR
    ]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pricelist')

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    })

    // Generate filename with current date
    const date = new Date()
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
    const filename = `IVD_Pricelist_${dateStr}.xlsx`

    // Return Excel file as response with caching
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error: any) {
    console.error('Error exporting pricelist:', error)
    return NextResponse.json(
      {
        error: 'Failed to export pricelist',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

