import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mimeType = file.type || 'application/octet-stream'
    const fileName = file.name.toLowerCase()

    let fileType: 'csv' | 'excel' | 'unsupported' = 'unsupported'
    let columns: string[] = []

    // Determine file type
    if (mimeType === 'text/csv' || fileName.endsWith('.csv')) {
      fileType = 'csv'
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls')
    ) {
      fileType = 'excel'
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload Excel (.xlsx, .xls) or CSV (.csv) file.' },
        { status: 400 }
      )
    }

    // Extract columns
    try {
      if (fileType === 'excel') {
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const records = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          raw: false,
          header: 1, // Get first row as headers
        })

        if (records.length > 0) {
          columns = (records[0] as any[]) || []
          // Filter out empty columns
          columns = columns.filter((col: any) => col && String(col).trim() !== '')
        }
      } else if (fileType === 'csv') {
        const text = buffer.toString('utf-8')
        const firstLine = text.split('\n')[0]
        let delimiter = ','
        if (firstLine.includes(';')) {
          delimiter = ';'
        } else if (firstLine.includes('\t')) {
          delimiter = '\t'
        }

        const records = parse(text, {
          columns: false,
          skip_empty_lines: false,
          trim: true,
          delimiter: delimiter,
          to_line: 1, // Only read first line
        })

        if (records.length > 0) {
          columns = (records[0] as any[]) || []
          columns = columns.filter((col: any) => col && String(col).trim() !== '')
        }
      }
    } catch (error: any) {
      console.error('Error analyzing file:', error)
      return NextResponse.json(
        { error: 'Failed to analyze file structure', details: error?.message },
        { status: 400 }
      )
    }

    // Required and optional database columns
    const dbColumns = {
      required: [
        { key: 'sku', label: 'SKU / Catalog Number', description: 'Unique product identifier' },
        { key: 'name', label: 'Product Name', description: 'Full product name' },
        { key: 'manufacturer', label: 'Manufacturer', description: 'Manufacturer name' },
      ],
      optional: [
        { key: 'price', label: 'Price', description: 'Product price in EUR' },
        { key: 'description', label: 'Description', description: 'Product description' },
        { key: 'category', label: 'Category', description: 'Product category' },
        { key: 'image', label: 'Image URL', description: 'Product image URL' },
      ],
    }

    return NextResponse.json({
      success: true,
      columns,
      dbColumns,
      fileType,
      fileName: file.name,
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze file', details: error?.message },
      { status: 500 }
    )
  }
}

