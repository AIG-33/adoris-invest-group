import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import OpenAI from 'openai'
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 300 seconds (5 minutes) for large file processing

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedProduct {
  sku: string
  name: string
  description?: string
  price: number
  manufacturer: string
  category?: string
  image?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function generateUniqueSlug(baseSlug: string, sku: string, existingSlugs: Set<string>): Promise<string> {
  let slug = baseSlug
  let counter = 0
  
  // First, try with SKU appended
  if (sku && sku.trim()) {
    const skuSlug = `${baseSlug}-${generateSlug(sku)}`
    if (!existingSlugs.has(skuSlug)) {
      return skuSlug
    }
    slug = skuSlug
  }
  
  // If still exists, add counter
  while (existingSlugs.has(slug)) {
    counter++
    slug = `${baseSlug}-${counter}`
  }
  
  return slug
}

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
    const columnMappingStr = formData.get('columnMapping') as string | null
    let columnMapping: Record<string, string> = {}
    
    if (columnMappingStr) {
      try {
        columnMapping = JSON.parse(columnMappingStr)
      } catch (e) {
        console.error('Failed to parse column mapping:', e)
      }
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64 for OpenAI Vision API
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'application/pdf'
    const fileName = file.name.toLowerCase()
    
    // Determine file type from extension if mimeType is not reliable
    let fileType = 'unknown'
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      fileType = 'excel'
    } else if (fileName.endsWith('.csv')) {
      fileType = 'csv'
    } else if (fileName.endsWith('.json')) {
      fileType = 'json'
    } else if (fileName.endsWith('.txt')) {
      fileType = 'txt'
    } else if (mimeType.startsWith('image/')) {
      fileType = 'image'
    } else if (mimeType === 'application/pdf') {
      fileType = 'pdf'
    } else if (mimeType.includes('text')) {
      fileType = 'txt'
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      fileType = 'excel'
    }

    // Use OpenAI to extract product information
    const systemPrompt = `You are an expert at extracting and normalizing product information from various document formats (spreadsheets, catalogs, price lists, images, PDFs).

Your task is to analyze the document structure, identify product data columns/fields, and extract all products into a standardized JSON format that matches our database schema.

Key requirements:
1. SKU/Catalog Number: Look for columns/fields like: "cat#", "SKU", "catalog number", "code", "product code", "item number", "ID", "artikelnummer". This is CRITICAL - it's used to match existing products.
2. Product Name: Look for: "Product", "name", "title", "description", "product name", "item name". Extract the FULL product name.
3. Manufacturer: Look for: "MNF", "manufacturer", "brand", "maker", "producer", "supplier", "vendor". Extract manufacturer name EXACTLY as written (case-sensitive).
4. Price: Look for: "price", "cost", "EUR", "€", "amount". Handle European format (comma as decimal: "358,00 €" → 358.00). If price is "no offer", "N/A", "on request", or missing, use 0.
5. Description: Optional field. Can be in "description", "details", "specifications", "notes" columns.
6. Category: Optional field. Can be in "category", "type", "group", "class" columns.
7. Image URL: Optional field. Look for image links or URLs.

CRITICAL RULES:
- Analyze the document structure FIRST - identify column headers, table layouts, or data patterns
- Adapt to different column name formats (case variations, abbreviations, different languages)
- Handle various data formats (European number format with commas, currency symbols, etc.)
- Extract ALL products from the document, even if some fields are missing
- For missing required fields (sku, name, manufacturer), try to infer from context or leave empty (will be reported as error)
- Return ONLY valid JSON - no markdown, no explanations, just the JSON object`

    const userPrompt = `Analyze this document and extract all product information. 

First, identify the document structure:
- What type of document is this? (spreadsheet, catalog, price list, image, etc.)
- What are the column names or field labels?
- How is the data organized? (rows, columns, tables, lists)

Then, extract ALL products and return them in this EXACT JSON structure:
{
  "products": [
    {
      "sku": "catalog number or product code (REQUIRED)",
      "name": "full product name (REQUIRED)",
      "description": "detailed product description (optional)",
      "price": numeric price in EUR as number, 0 if not available (REQUIRED - use 0 for "no offer", "N/A", etc.)",
      "manufacturer": "manufacturer name exactly as written (REQUIRED)",
      "category": "product category (optional)",
      "image": "image URL if available (optional)"
    }
  ]
}

SPECIFIC INSTRUCTIONS:
1. SKU extraction: Find the catalog number/SKU column. Common names: "cat#", "SKU", "catalog number", "code", "ID". Extract the exact value.
2. Name extraction: Find the product name column. Common names: "Product", "name", "title", "description". Extract the complete product name.
3. Manufacturer extraction: Find the manufacturer column. Common names: "MNF", "manufacturer", "brand", "maker". Extract exactly as written.
4. Price extraction: Find the price column. Handle formats like "358,00 €", "358.00", "€358", "no offer" → convert to number (358.00 or 0).
5. If a column name is unclear, analyze the data pattern and infer the correct mapping.
6. Extract EVERY product row/item from the document.
7. If a product is missing required fields (sku, name, or manufacturer), still include it but mark missing fields as empty strings (they will be reported as errors).

Return ONLY the JSON object - no additional text, no markdown formatting, just pure JSON.`

    let extractedData: ExtractedProduct[] = []

    try {
      // Handle JSON files directly (no AI needed)
      if (fileType === 'json') {
        try {
          const text = buffer.toString('utf-8')
          const jsonData = JSON.parse(text)
          
          // Handle different JSON structures
          if (Array.isArray(jsonData)) {
            extractedData = jsonData.map((item: any) => ({
              sku: String(item.sku || item.catalogNumber || item.code || item.id || item.SKU || ''),
              name: String(item.name || item.productName || item.title || item.Name || ''),
              description: item.description ? String(item.description) : undefined,
              price: parseFloat(String(item.price || item.cost || item.Price || 0)),
              manufacturer: String(item.manufacturer || item.brand || item.maker || item.Manufacturer || ''),
              category: item.category ? String(item.category) : undefined,
              image: item.image ? String(item.image) : undefined,
            })).filter((p: any) => p.sku && p.name && p.manufacturer)
          } else if (jsonData.products && Array.isArray(jsonData.products)) {
            extractedData = jsonData.products.map((item: any) => ({
              sku: String(item.sku || item.catalogNumber || item.code || item.id || item.SKU || ''),
              name: String(item.name || item.productName || item.title || item.Name || ''),
              description: item.description ? String(item.description) : undefined,
              price: parseFloat(String(item.price || item.cost || item.Price || 0)),
              manufacturer: String(item.manufacturer || item.brand || item.maker || item.Manufacturer || ''),
              category: item.category ? String(item.category) : undefined,
              image: item.image ? String(item.image) : undefined,
            })).filter((p: any) => p.sku && p.name && p.manufacturer)
          } else {
            return NextResponse.json(
              { error: 'Invalid JSON structure. Expected array or object with "products" array.' },
              { status: 400 }
            )
          }
          
          if (extractedData.length === 0) {
            return NextResponse.json(
              { error: 'No valid products found in JSON file. Make sure products have sku, name, and manufacturer fields.' },
              { status: 400 }
            )
          }
        } catch (jsonError: any) {
          console.error('JSON parse error:', jsonError)
          return NextResponse.json(
            { 
              error: 'Invalid JSON file',
              details: jsonError?.message || 'Parse error',
              message: 'Invalid JSON file: ' + (jsonError?.message || 'Parse error')
            },
            { status: 400 }
          )
        }
      }
      // Handle CSV files
      else if (fileType === 'csv') {
        try {
          const text = buffer.toString('utf-8')
          
          // Detect delimiter by checking first line
          const firstLine = text.split('\n')[0]
          let delimiter = ','
          if (firstLine.includes(';')) {
            delimiter = ';'
          } else if (firstLine.includes('\t')) {
            delimiter = '\t'
          }
          
          const records = parse(text, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            delimiter: delimiter,
            relax_column_count: true, // Allow different column counts per row
            relax_quotes: true, // Handle quotes more flexibly
            skip_records_with_error: false, // Don't skip records with errors, but continue
          })
          
          // First, get all manufacturers and categories to resolve IDs
          const [allCategories, allManufacturers] = await Promise.all([
            prisma.category.findMany(),
            prisma.manufacturer.findMany(),
          ])
          
          const categoryIdMap = new Map(allCategories.map((c: any) => [c.id, c.name]))
          const manufacturerIdMap = new Map(allManufacturers.map((m: any) => [m.id, m.name]))
          const manufacturerSlugMap = new Map(allManufacturers.map((m: any) => [m.slug, m.name]))
          
          // Also create a map for manufacturer IDs (in case manufacturerId in CSV is actually the database ID)
          const manufacturerIdToNameMap = new Map(allManufacturers.map((m: any) => [m.id, m.name]))
          
          extractedData = records
            .filter((record: any) => {
              // Skip completely empty rows
              const allValues = Object.values(record || {})
              const hasAnyValue = allValues.some((val: any) => val !== undefined && val !== null && String(val).trim() !== '')
              return hasAnyValue
            })
            .map((record: any, index: number) => {
            // Helper function to get value using mapping or fallback
            const getValue = (dbField: string, fallbackKeys: string[]): string => {
              // First, try mapped column
              if (columnMapping[dbField]) {
                const mappedColumn = columnMapping[dbField]
                const recordKeys = Object.keys(record)
                
                // Try exact match first
                if (record[mappedColumn] !== undefined && record[mappedColumn] !== '') {
                  const value = String(record[mappedColumn] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via exact mapping "${mappedColumn}": "${value}"`)
                  }
                  return value
                }
                
                // Try case-insensitive and trimmed match
                const normalizedMapped = mappedColumn.toLowerCase().trim()
                const caseInsensitiveMatch = recordKeys.find(key => {
                  const normalizedKey = key.toLowerCase().trim()
                  return normalizedKey === normalizedMapped
                })
                
                if (caseInsensitiveMatch && record[caseInsensitiveMatch] !== undefined && record[caseInsensitiveMatch] !== '') {
                  const value = String(record[caseInsensitiveMatch] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via normalized mapping "${mappedColumn}" -> "${caseInsensitiveMatch}": "${value}"`)
                  }
                  return value
                }
                
                if (process.env.NODE_ENV === 'development' && index < 3) {
                  console.log(`   ⚠️ Mapped column "${mappedColumn}" for ${dbField} not found`)
                  console.log(`      Available keys: ${recordKeys.join(', ')}`)
                }
              }
              
              // Then try fallback keys
              for (const key of fallbackKeys) {
                // Try exact match
                if (record[key] !== undefined && record[key] !== '') {
                  const value = String(record[key] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via fallback "${key}": "${value}"`)
                  }
                  return value
                }
                // Try case-insensitive match
                const recordKeys = Object.keys(record)
                const normalizedKey = key.toLowerCase().trim()
                const match = recordKeys.find(rk => rk.toLowerCase().trim() === normalizedKey)
                if (match && record[match] !== undefined && record[match] !== '') {
                  const value = String(record[match] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via normalized fallback "${key}" -> "${match}": "${value}"`)
                  }
                  return value
                }
              }
              
              if (process.env.NODE_ENV === 'development' && index < 3) {
                console.log(`   ❌ No value found for ${dbField}`)
              }
              return ''
            }

            // Debug: log first few records in development
            if (process.env.NODE_ENV === 'development' && index < 3) {
              console.log(`\n📋 Processing CSV record ${index + 1}:`, record)
              console.log('   Available keys:', Object.keys(record))
              console.log('   Column mapping:', columnMapping)
            }

            // Get SKU using mapping
            const sku = getValue('sku', [
              'cat#', 'Cat#', 'CAT#',
              'sku', 'SKU', 'Sku',
              'catalogNumber', 'Catalog Number',
              'code', 'Code', 'CODE',
              'id', 'ID', 'Id',
            ])

            // Get Name using mapping
            const name = getValue('name', [
              'Product', 'product',
              'name', 'Name', 'NAME',
              'productName', 'Product Name',
              'title', 'Title', 'TITLE',
            ])

            // Get Manufacturer using mapping
            let manufacturer = getValue('manufacturer', [
              'MNF', 'mnf', 'Mnf',
              'manufacturer', 'Manufacturer', 'MANUFACTURER',
              'brand', 'Brand', 'BRAND',
              'maker', 'Maker', 'MAKER',
            ])
            let manufacturerSource = ''

            // If manufacturer is an ID, resolve it
            if (manufacturer && (manufacturer.startsWith('mfr_') || manufacturerIdToNameMap.has(manufacturer))) {
              const mfrId = manufacturer.trim()
              manufacturerSource = `manufacturerId: ${mfrId}`
              
              // Try multiple strategies to find manufacturer
              // 1. Check if it's a database ID (direct match)
              manufacturer = manufacturerIdToNameMap.get(mfrId) || ''
              
              // 2. Check if it's a slug format (e.g., mfr_sysmex -> sysmex)
              if (!manufacturer && mfrId.startsWith('mfr_')) {
                const slug = mfrId.replace('mfr_', '')
                manufacturer = manufacturerSlugMap.get(slug) || ''
                
                // Try partial match on slug
                if (!manufacturer) {
                  const partialMatch = allManufacturers.find((m: any) => 
                    m.slug.includes(slug) || slug.includes(m.slug)
                  )
                  if (partialMatch) {
                    manufacturer = partialMatch.name
                  }
                }
              }
              
              // 3. Try to find by ID map (legacy)
              if (!manufacturer) {
                manufacturer = manufacturerIdMap.get(mfrId) || ''
              }
            } else if (manufacturer) {
              manufacturerSource = 'mapped column'
            }

            // Get Price using mapping
            let priceStr = getValue('price', [
              'price', 'Price', 'PRICE',
              'cost', 'Cost', 'COST',
            ])
            
            if (!priceStr || priceStr === '') {
              priceStr = '0'
            }
            
            // Remove Euro symbol and spaces, replace comma with dot
            priceStr = priceStr.replace(/€/g, '').replace(/\s/g, '').replace(/,/g, '.')
            // Handle "no offer" and similar non-numeric strings
            if (['no offer', 'n/a', 'on request', 'poa'].some(term => priceStr.toLowerCase().includes(term))) {
              priceStr = '0'
            } else {
              // Remove any non-numeric characters except dot
              priceStr = priceStr.replace(/[^\d.]/g, '')
            }
            const price = parseFloat(priceStr) || 0

            // Get Description using mapping (optional)
            const description = columnMapping.description && record[columnMapping.description]
              ? String(record[columnMapping.description]).trim()
              : (record.description || record.Description || record.desc || record.Desc || undefined)

            // Get Category using mapping (optional)
            let category = ''
            if (columnMapping.category && record[columnMapping.category]) {
              category = String(record[columnMapping.category]).trim()
            } else if (record.categoryId) {
              const catId = String(record.categoryId)
              if (catId.startsWith('cat_')) {
                const slug = catId.replace('cat_', '')
                const foundCategory = allCategories.find(c => c.slug === slug)
                category = foundCategory?.name || ''
              } else {
                category = categoryIdMap.get(catId) || ''
              }
            } else if (record.category) {
              category = String(record.category).trim()
            }

            // Get Image using mapping (optional)
            const image = columnMapping.image && record[columnMapping.image]
              ? String(record[columnMapping.image]).trim()
              : (record.image || record.Image || record.imageUrl || record.imageURL || undefined)
            
            return {
              sku: sku,
              name: name,
              description: description ? String(description).trim() : undefined,
              price: price,
              manufacturer: manufacturer,
              manufacturerSource: manufacturerSource || 'not provided',
              category: category || undefined,
              image: image ? String(image).trim() : undefined,
            }
          }).filter((p: any) => p.sku && p.name && p.manufacturer) // Filter out products missing required fields
          
          // Don't filter here - we want to show errors for missing manufacturers
          // Filter will happen later in validation
          
          if (extractedData.length === 0) {
            return NextResponse.json(
              { error: 'No valid products found in CSV file. Make sure CSV has columns: sku, name, manufacturer (and optionally: price, description, category, image).' },
              { status: 400 }
            )
          }
        } catch (csvError: any) {
          console.error('CSV parse error:', csvError)
          return NextResponse.json(
            { 
              error: 'Invalid CSV file',
              details: csvError?.message || 'Parse error',
              message: 'Invalid CSV file: ' + (csvError?.message || 'Parse error')
            },
            { status: 400 }
          )
        }
      }
      // Handle Excel files
      else if (fileType === 'excel') {
        try {
          const workbook = XLSX.read(buffer, { type: 'buffer' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          
          // Use header: 1 to get raw data first, then convert to objects
          // This preserves exact column names including special characters (like cat#)
          const rawRecords = XLSX.utils.sheet_to_json(worksheet, { 
            defval: '', // Default value for empty cells
            raw: false, // Convert all values to strings
            header: 1, // Get as array of arrays first
          })

          // Convert array of arrays to array of objects
          let records: any[] = []
          if (rawRecords.length > 0 && Array.isArray(rawRecords[0])) {
            // First row is headers - preserve exact names
            const headers = (rawRecords[0] as any[]).map((h: any) => {
              const headerStr = String(h || '').trim()
              return headerStr
            }).filter((h: string) => h !== '')
            
            // Create objects with exact header names
            records = (rawRecords.slice(1) as any[][]).map((row: any[]) => {
              const obj: any = {}
              headers.forEach((header: string, index: number) => {
                obj[header] = row[index] !== undefined ? String(row[index] || '').trim() : ''
              })
              return obj
            })
          } else {
            records = rawRecords as any[]
          }

          // Debug: log first record to see structure
          if (process.env.NODE_ENV === 'development' && records.length > 0) {
            console.log('\n📊 Excel File Analysis:')
            console.log('First Excel record:', records[0])
            console.log('Available columns:', Object.keys(records[0] || {}))
            console.log('Column mapping received:', columnMapping)
            if (Object.keys(columnMapping).length > 0) {
              console.log('Mapping check:')
              Object.entries(columnMapping).forEach(([dbField, fileColumn]) => {
                const hasColumn = records[0] && records[0][fileColumn] !== undefined
                console.log(`  ${dbField} -> "${fileColumn}": ${hasColumn ? '✅ Found' : '❌ Not found'}`)
                if (hasColumn && records[0]) {
                  console.log(`    Value: "${records[0][fileColumn]}"`)
                }
              })
            }
          }

          extractedData = records.map((record: any, index: number) => {
            // Debug: log first few records in development
            if (process.env.NODE_ENV === 'development' && index < 3) {
              console.log(`\n📋 Processing record ${index + 1}:`, record)
              console.log('   Available keys:', Object.keys(record))
              console.log('   Column mapping:', columnMapping)
            }

            // Helper function to get value using mapping or fallback
            const getValue = (dbField: string, fallbackKeys: string[]): string => {
              // First, try mapped column
              if (columnMapping[dbField]) {
                const mappedColumn = columnMapping[dbField]
                const recordKeys = Object.keys(record)
                
                // Try exact match first
                if (record[mappedColumn] !== undefined && record[mappedColumn] !== '') {
                  const value = String(record[mappedColumn] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via exact mapping "${mappedColumn}": "${value}"`)
                  }
                  return value
                }
                
                // Try case-insensitive and trimmed match
                const normalizedMapped = mappedColumn.toLowerCase().trim()
                const caseInsensitiveMatch = recordKeys.find(key => {
                  const normalizedKey = key.toLowerCase().trim()
                  return normalizedKey === normalizedMapped
                })
                
                if (caseInsensitiveMatch && record[caseInsensitiveMatch] !== undefined && record[caseInsensitiveMatch] !== '') {
                  const value = String(record[caseInsensitiveMatch] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via normalized mapping "${mappedColumn}" -> "${caseInsensitiveMatch}": "${value}"`)
                  }
                  return value
                }
                
                if (process.env.NODE_ENV === 'development' && index < 3) {
                  console.log(`   ⚠️ Mapped column "${mappedColumn}" for ${dbField} not found`)
                  console.log(`      Available keys: ${recordKeys.join(', ')}`)
                  console.log(`      Looking for: "${mappedColumn}" (normalized: "${normalizedMapped}")`)
                }
              }
              
              // Then try fallback keys
              for (const key of fallbackKeys) {
                // Try exact match
                if (record[key] !== undefined && record[key] !== '') {
                  const value = String(record[key] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via fallback "${key}": "${value}"`)
                  }
                  return value
                }
                // Try case-insensitive match
                const recordKeys = Object.keys(record)
                const normalizedKey = key.toLowerCase().trim()
                const match = recordKeys.find(rk => rk.toLowerCase().trim() === normalizedKey)
                if (match && record[match] !== undefined && record[match] !== '') {
                  const value = String(record[match] || '').trim()
                  if (process.env.NODE_ENV === 'development' && index < 3) {
                    console.log(`   ✅ Found ${dbField} via normalized fallback "${key}" -> "${match}": "${value}"`)
                  }
                  return value
                }
              }
              
              if (process.env.NODE_ENV === 'development' && index < 3) {
                console.log(`   ❌ No value found for ${dbField}`)
              }
              return ''
            }

            // SKU: use mapping or fallback to auto-detection
            const sku = getValue('sku', [
              'cat#', 'Cat#', 'CAT#',
              'sku', 'SKU', 'Sku',
              'catalogNumber', 'Catalog Number',
              'code', 'Code', 'CODE',
              'id', 'ID', 'Id',
            ])

            // Name: use mapping or fallback to auto-detection
            const name = getValue('name', [
              'Product', 'product',
              'name', 'Name', 'NAME',
              'productName', 'Product Name',
              'title', 'Title', 'TITLE',
            ])

            // Manufacturer: use mapping or fallback to auto-detection
            const manufacturer = getValue('manufacturer', [
              'MNF', 'mnf', 'Mnf',
              'manufacturer', 'Manufacturer', 'MANUFACTURER',
              'brand', 'Brand', 'BRAND',
              'maker', 'Maker', 'MAKER',
            ])

            // Price: use mapping or fallback to auto-detection
            let priceStr = getValue('price', [
              'price', 'Price', 'PRICE',
              'cost', 'Cost', 'COST',
            ])
            
            if (!priceStr || priceStr === '') {
              priceStr = '0'
            }
            
            // Remove Euro symbol and spaces, replace comma with dot
            priceStr = priceStr.replace(/€/g, '').replace(/\s/g, '').replace(/,/g, '.')
            // Remove any non-numeric characters except dot
            priceStr = priceStr.replace(/[^\d.]/g, '')
            const price = parseFloat(priceStr) || 0

            // Description: use mapping or fallback to auto-detection (OPTIONAL)
            const description = columnMapping.description && record[columnMapping.description]
              ? String(record[columnMapping.description]).trim()
              : (record.description || record.Description || record.desc || record.Desc || undefined)

            // Category: use mapping or fallback to auto-detection (OPTIONAL)
            const category = columnMapping.category && record[columnMapping.category]
              ? String(record[columnMapping.category]).trim()
              : (record.category || record.Category || record.cat || record.Cat || undefined)

            // Image: use mapping or fallback to auto-detection (OPTIONAL)
            const image = columnMapping.image && record[columnMapping.image]
              ? String(record[columnMapping.image]).trim()
              : (record.image || record.Image || record.imageUrl || record.imageURL || undefined)

            const product = {
              sku,
              name,
              description: description ? String(description).trim() : undefined,
              price,
              manufacturer,
              category: category ? String(category).trim() : undefined,
              image: image ? String(image).trim() : undefined,
            }

            // Debug: log extracted product
            if (process.env.NODE_ENV === 'development' && index < 3) {
              console.log(`   ✅ Extracted:`, {
                sku: product.sku || '(empty)',
                name: product.name || '(empty)',
                manufacturer: product.manufacturer || '(empty)',
                price: product.price,
              })
            }

            return product
          })

          // Filter: only require sku, name, and manufacturer (description is optional)
          const beforeFilter = extractedData.length
          extractedData = extractedData.filter((p: any) => {
            const hasRequired = p.sku && p.name && p.manufacturer
            if (!hasRequired && process.env.NODE_ENV === 'development') {
              console.log(`   ❌ Filtered out product:`, {
                sku: p.sku || '(missing)',
                name: p.name || '(missing)',
                manufacturer: p.manufacturer || '(missing)',
              })
            }
            return hasRequired
          })

          if (process.env.NODE_ENV === 'development') {
            console.log(`\n📊 Excel parsing results:`)
            console.log(`   Total records: ${records.length}`)
            console.log(`   Before filter: ${beforeFilter}`)
            console.log(`   After filter: ${extractedData.length}`)
          }

          if (extractedData.length === 0) {
            const sampleRecord: any = records.length > 0 ? records[0] : {}
            const foundColumns = Object.keys(sampleRecord || {})
            
            // Try to identify what columns we have
            const columnAnalysis = foundColumns.map((col: string) => {
              const value = sampleRecord[col]
              let type = 'unknown'
              if (col.toLowerCase().includes('cat') || col.toLowerCase().includes('sku') || col.toLowerCase().includes('code')) {
                type = 'likely SKU'
              } else if (col.toLowerCase().includes('product') || col.toLowerCase().includes('name') || col.toLowerCase().includes('title')) {
                type = 'likely Name'
              } else if (col.toLowerCase().includes('mnf') || col.toLowerCase().includes('manufacturer') || col.toLowerCase().includes('brand')) {
                type = 'likely Manufacturer'
              } else if (col.toLowerCase().includes('price') || col.toLowerCase().includes('cost')) {
                type = 'likely Price'
              }
              return `${col} (${type}, value: "${String(value || '').substring(0, 50)}")`
            }).join('; ')

            // If we have records but no valid products, try using ChatGPT as fallback
            if (records.length > 0) {
              console.log('⚠️ Direct Excel parsing failed, trying ChatGPT fallback...')
              
              try {
                // Convert Excel data to text format for ChatGPT
                const excelText = records.slice(0, 50).map((record: any, idx: number) => {
                  const row = Object.entries(record).map(([key, value]) => `${key}: ${value}`).join(' | ')
                  return `Row ${idx + 1}: ${row}`
                }).join('\n')

                const response = await openai.chat.completions.create({
                  model: 'gpt-4o',
                  messages: [
                    {
                      role: 'system',
                      content: systemPrompt,
                    },
                    {
                      role: 'user',
                      content: `${userPrompt}\n\nExcel data (first 50 rows):\n${excelText}`,
                    },
                  ],
                  response_format: { type: 'json_object' },
                  temperature: 0.3,
                })

                const content = response.choices[0]?.message?.content
                if (content) {
                  const parsed = JSON.parse(content)
                  const chatGPTData = Array.isArray(parsed.products) ? parsed.products : []
                  
                  if (chatGPTData.length > 0) {
                    console.log(`✅ ChatGPT extracted ${chatGPTData.length} products`)
                    extractedData = chatGPTData.map((item: any) => ({
                      sku: String(item.sku || item.catalogNumber || item.code || item.id || item.SKU || '').trim(),
                      name: String(item.name || item.productName || item.title || item.Name || '').trim(),
                      description: item.description ? String(item.description).trim() : undefined,
                      price: parseFloat(String(item.price || item.cost || item.Price || 0)),
                      manufacturer: String(item.manufacturer || item.brand || item.maker || item.Manufacturer || '').trim(),
                      category: item.category ? String(item.category).trim() : undefined,
                      image: item.image ? String(item.image).trim() : undefined,
                    })).filter((p: any) => p.sku && p.name && p.manufacturer)
                    
                    if (extractedData.length > 0) {
                      // Success! Continue with ChatGPT-extracted data
                      console.log(`✅ Using ${extractedData.length} products extracted by ChatGPT`)
                    }
                  }
                }
              } catch (chatGPTError: any) {
                console.error('ChatGPT fallback error:', chatGPTError)
                // Continue to return error below
              }
            }

            // If still no data, return error
            if (extractedData.length === 0) {
              return NextResponse.json(
                { 
                  error: 'No valid products found in Excel file. Make sure Excel sheet has columns with product data.',
                  hint: `Expected columns: cat# (or sku), Product (or name), MNF (or manufacturer), price (optional).`,
                  foundColumns: foundColumns.length > 0 ? foundColumns.join(', ') : 'none',
                  columnAnalysis: columnAnalysis || 'Could not analyze columns',
                  sampleRecord: process.env.NODE_ENV === 'development' ? sampleRecord : undefined,
                  totalRecords: records.length,
                },
                { status: 400 }
              )
            }
          }
        } catch (excelError: any) {
          console.error('Excel parse error:', excelError)
          return NextResponse.json(
            { 
              error: 'Invalid Excel file',
              details: excelError?.message || 'Parse error',
              message: 'Invalid Excel file: ' + (excelError?.message || 'Parse error')
            },
            { status: 400 }
          )
        }
      }
      // For images, use vision API
      else if (fileType === 'image' || mimeType.startsWith('image/')) {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`,
                  },
                },
              ],
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3, // Lower temperature for more consistent extraction
        })

        const content = response.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          extractedData = Array.isArray(parsed.products) ? parsed.products : []
        }
      } 
      // For text files and PDFs, use ChatGPT
      else if (fileType === 'txt' || fileType === 'pdf') {
        // For PDFs and text files, try to read as text
        // Note: For PDFs, we might need a PDF parser library in production
        let text = ''
        try {
          text = buffer.toString('utf-8')
          // If it's not valid UTF-8, it might be a binary PDF
          if (text.length < 100 && mimeType === 'application/pdf') {
            // For PDFs, we'll need to use a PDF parser or OCR
            // For now, return error suggesting to use image format
            return NextResponse.json(
              { error: 'PDF files need to be converted to images. Please upload as PNG/JPG or use a PDF-to-image converter.' },
              { status: 400 }
            )
          }
        } catch (e) {
          // Binary file, likely PDF
          return NextResponse.json(
            { error: 'Binary PDF files are not supported. Please convert to images (PNG/JPG) or extract text first.' },
            { status: 400 }
          )
        }
        
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `${userPrompt}\n\nDocument content:\n${text.substring(0, 15000)}`, // Limit text length
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        })

        const content = response.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          extractedData = Array.isArray(parsed.products) ? parsed.products : []
        }
      } else {
        return NextResponse.json(
          { error: `Unsupported file type: ${fileType}. Supported formats: Excel (.xlsx, .xls), CSV (.csv), JSON (.json), TXT (.txt), Images, PDF` },
          { status: 400 }
        )
      }
    } catch (openaiError: any) {
      console.error('OpenAI error:', openaiError)
      return NextResponse.json(
        { 
          error: 'Failed to extract product data',
          details: openaiError?.message || 'OpenAI API error',
          message: 'Failed to extract product data: ' + (openaiError?.message || 'OpenAI API error')
        },
        { status: 500 }
      )
    }

    if (!extractedData || extractedData.length === 0) {
      return NextResponse.json(
        { error: 'No products found in the document' },
        { status: 400 }
      )
    }

    // Get all categories and manufacturers for matching
    const [categories, manufacturers] = await Promise.all([
      prisma.category.findMany(),
      prisma.manufacturer.findMany(),
    ])

    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]))
    const manufacturerMap = new Map(manufacturers.map(m => [m.name.toLowerCase(), m.id]))

    // Process products in batches to prevent timeout
    const MAX_PRODUCTS_PER_BATCH = 100
    const BATCH_SIZE = 50 // Process 50 products at a time within each batch
    
    // Split products into batches of MAX_PRODUCTS_PER_BATCH
    const batches: ExtractedProduct[][] = []
    for (let i = 0; i < extractedData.length; i += MAX_PRODUCTS_PER_BATCH) {
      batches.push(extractedData.slice(i, i + MAX_PRODUCTS_PER_BATCH))
    }

    // Aggregate results from all batches
    const totalResults = {
      created: 0,
      updated: 0,
      errors: [] as string[],
      products: [] as Array<{
        action: 'created' | 'updated'
        product: any
        sku: string
        name: string
        price: number
        manufacturer: string
      }>,
      total: extractedData.length,
      batchesProcessed: 0,
      totalBatches: batches.length,
    }

    // Process each batch sequentially
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} products)`)
      }

      // Process each extracted product in this batch
      const results = {
        created: 0,
        updated: 0,
        errors: [] as string[],
        products: [] as Array<{
          action: 'created' | 'updated'
          product: any
          sku: string
          name: string
          price: number
          manufacturer: string
        }>,
      }

      // Get all existing products by SKU in one query for better performance (for this batch)
      const allSkus = batch.map(p => p.sku).filter(Boolean)
    const existingProducts = await prisma.product.findMany({
      where: {
        sku: {
          in: allSkus,
        },
      },
      select: {
        id: true,
        sku: true,
        slug: true,
      },
    })
    const existingProductsMap = new Map(existingProducts.map((p: any) => [p.sku, p.id]))
    
    // Get all existing slugs to avoid conflicts
    const existingSlugs = new Set<string>()
    existingProducts.forEach((p: any) => {
      if (p.slug && typeof p.slug === 'string') {
        existingSlugs.add(p.slug)
      }
    })
    
    // Also fetch all slugs from database to be safe
    const allExistingSlugs = await prisma.product.findMany({
      select: { slug: true },
    })
    allExistingSlugs.forEach((p: any) => {
      if (p.slug && typeof p.slug === 'string') {
        existingSlugs.add(p.slug)
      }
    })

    // Process products in batches to avoid timeout (within each main batch)
    const totalProducts = batch.length
    let processedCount = 0
    
    for (let i = 0; i < batch.length; i += BATCH_SIZE) {
      const subBatch = batch.slice(i, i + BATCH_SIZE)
      
      for (const productData of subBatch) {
        processedCount++
        try {
          // Validate required fields
          if (!productData.sku || !productData.name || !productData.manufacturer) {
            const missingFields = []
            if (!productData.sku || productData.sku.trim() === '') missingFields.push('SKU')
            if (!productData.name || productData.name.trim() === '') missingFields.push('name')
            if (!productData.manufacturer || productData.manufacturer.trim() === '') missingFields.push('manufacturer')
            
            const productIdentifier = productData.name || productData.sku || 'Unknown'
            const skuInfo = productData.sku && productData.sku.trim() ? `SKU: ${productData.sku}` : 'SKU: missing'
            const manufacturerSource = (productData as any).manufacturerSource || 'not provided'
            
            let errorMsg = `❌ Product "${productIdentifier}" [${skuInfo}]: Missing required fields: ${missingFields.join(', ')}`
            
            // Add detailed info about manufacturer if it's missing
            if (missingFields.includes('manufacturer')) {
              errorMsg += `. Manufacturer source in CSV: ${manufacturerSource}`
            }
            
            results.errors.push(errorMsg)
            continue
          }

          // Find or create manufacturer
          let manufacturerId = manufacturerMap.get(productData.manufacturer.toLowerCase())
          if (!manufacturerId) {
            // Try to find by partial match
            const partialMatch = manufacturers.find(m => 
              m.name.toLowerCase().includes(productData.manufacturer.toLowerCase()) ||
              productData.manufacturer.toLowerCase().includes(m.name.toLowerCase())
            )
            if (partialMatch) {
              manufacturerId = partialMatch.id
            } else {
              // Create new manufacturer (with error handling for duplicates)
              try {
                const newManufacturer = await prisma.manufacturer.create({
                  data: {
                    name: productData.manufacturer,
                    slug: generateSlug(productData.manufacturer),
                    updatedAt: new Date(), // Explicitly set updatedAt to avoid null constraint violation
                  },
                })
                manufacturerId = newManufacturer.id
                manufacturerMap.set(productData.manufacturer.toLowerCase(), manufacturerId)
              } catch (createError: any) {
                // If manufacturer was created by another request, try to find it
                if (createError?.code === 'P2002') {
                  const found = await prisma.manufacturer.findFirst({
                    where: {
                      OR: [
                        { name: { equals: productData.manufacturer, mode: 'insensitive' } },
                        { slug: generateSlug(productData.manufacturer) },
                      ],
                    },
                  })
                  if (found) {
                    manufacturerId = found.id
                    manufacturerMap.set(productData.manufacturer.toLowerCase(), manufacturerId)
                  } else {
                    throw createError
                  }
                } else {
                  throw createError
                }
              }
            }
          }

          // Find category (optional)
          let categoryId = categories[0]?.id // Default to first category if not found
          if (productData.category) {
            const foundCategory = categoryMap.get(productData.category.toLowerCase()) ||
              categories.find(c => c.name.toLowerCase().includes(productData.category!.toLowerCase()))?.id
            if (foundCategory) {
              categoryId = foundCategory
            }
          }

          // Check if product exists by SKU (using pre-fetched map)
          const existingProductId = existingProductsMap.get(productData.sku)

          // Generate unique slug
          const baseSlug = generateSlug(productData.name)
          const slug = await generateUniqueSlug(baseSlug, productData.sku, existingSlugs)
          existingSlugs.add(slug) // Add to set to avoid conflicts in same batch
          
          const price = parseFloat(String(productData.price || 0))

          if (existingProductId) {
            // Update existing product
            const updated = await prisma.product.update({
              where: { id: existingProductId },
              data: {
                name: productData.name,
                slug,
                description: productData.description && productData.description.trim() ? productData.description.trim() : '',
                price,
                image: productData.image && productData.image.trim() ? productData.image.trim() : '',
                categoryId,
                manufacturerId,
              },
              include: {
                category: true,
                manufacturer: true,
              },
            })
            results.updated++
            results.products.push({
              action: 'updated',
              product: updated,
              sku: productData.sku,
              name: productData.name,
              price,
              manufacturer: productData.manufacturer,
            })
          } else {
            // Create new product with retry logic for slug conflicts
            let created
            let attempts = 0
            let currentSlug = slug
            
            while (attempts < 5) {
              try {
                created = await prisma.product.create({
                  data: {
                    sku: productData.sku,
                    name: productData.name,
                    slug: currentSlug,
                    description: productData.description && productData.description.trim() ? productData.description.trim() : '',
                    price,
                    image: productData.image && productData.image.trim() ? productData.image.trim() : '',
                    categoryId,
                    manufacturerId,
                  },
                  include: {
                    category: true,
                    manufacturer: true,
                  },
                })
                existingSlugs.add(currentSlug) // Add to set for future products in batch
                break // Success, exit loop
              } catch (createError: any) {
                if (createError?.code === 'P2002' && createError?.meta?.target?.includes('slug')) {
                  // Slug conflict, generate new one
                  attempts++
                  const baseSlug = generateSlug(productData.name)
                  currentSlug = await generateUniqueSlug(baseSlug, `${productData.sku}-${attempts}`, existingSlugs)
                  existingSlugs.add(currentSlug)
                } else {
                  throw createError // Re-throw if it's a different error
                }
              }
            }
            
            if (!created) {
              throw new Error(`Failed to create product after ${attempts} attempts due to slug conflicts`)
            }
            
            results.created++
            results.products.push({
              action: 'created',
              product: created,
              sku: productData.sku,
              name: productData.name,
              price,
              manufacturer: productData.manufacturer,
            })
          }
        } catch (error: any) {
          results.errors.push(`Error processing ${productData.name || productData.sku}: ${error?.message || 'Unknown error'}`)
          console.error('Error processing product:', error)
        }
      }
    }

      // Aggregate results from this batch
      totalResults.created += results.created
      totalResults.updated += results.updated
      totalResults.errors.push(...results.errors)
      totalResults.products.push(...results.products)
      totalResults.batchesProcessed++

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Batch ${batchIndex + 1}/${batches.length} completed: ${results.created} created, ${results.updated} updated`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${totalResults.total} products in ${totalResults.totalBatches} batch(es): ${totalResults.created} created, ${totalResults.updated} updated`,
      results: {
        created: totalResults.created,
        updated: totalResults.updated,
        errors: totalResults.errors,
        products: totalResults.products,
        total: totalResults.total,
        batchesProcessed: totalResults.batchesProcessed,
        totalBatches: totalResults.totalBatches,
      },
    })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to import products',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

