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
    const systemPrompt = `You are an expert at extracting product information from documents. 
Extract all products from the document and return them as a JSON object with a "products" array.
Each product should have: sku (catalog number), name, description, price (number in EUR), manufacturer, category (optional), image (optional).
If price is not found, use 0. Extract manufacturer name exactly as written.`

    const userPrompt = `Extract all product information from this document. Return a JSON object with this structure:
{
  "products": [
    {
      "sku": "catalog number or product code",
      "name": "product name",
      "description": "detailed product description",
      "price": numeric price in EUR (0 if not found),
      "manufacturer": "manufacturer name",
      "category": "product category (optional)",
      "image": "image URL if available (optional)"
    }
  ]
}

Important:
- Extract the catalog number/SKU/code as "sku" - this is critical for matching existing products
- Extract the full product name as "name"
- Extract price in EUR, convert to number (0 if not found)
- Extract manufacturer name exactly as written
- If multiple products are in the document, return all of them
- Return ONLY valid JSON`

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
          
          const categoryIdMap = new Map(allCategories.map(c => [c.id, c.name]))
          const manufacturerIdMap = new Map(allManufacturers.map(m => [m.id, m.name]))
          const manufacturerSlugMap = new Map(allManufacturers.map(m => [m.slug, m.name]))
          
          extractedData = records.map((record: any) => {
            // Resolve manufacturer - check if it's an ID, slug, or name
            let manufacturer = ''
            let manufacturerSource = ''
            
            if (record.manufacturerId) {
              const mfrId = String(record.manufacturerId).trim()
              manufacturerSource = `manufacturerId: ${mfrId}`
              
              // Check if it's a full ID or slug (e.g., mfr_sysmex)
              if (mfrId.startsWith('mfr_')) {
                const slug = mfrId.replace('mfr_', '')
                manufacturer = manufacturerSlugMap.get(slug) || manufacturerIdMap.get(mfrId) || ''
                
                if (!manufacturer && process.env.NODE_ENV === 'development') {
                  console.log(`⚠️ Manufacturer not found for slug: ${slug} (from ${mfrId})`)
                }
              } else {
                manufacturer = manufacturerIdMap.get(mfrId) || ''
                
                if (!manufacturer && process.env.NODE_ENV === 'development') {
                  console.log(`⚠️ Manufacturer not found for ID: ${mfrId}`)
                }
              }
            }
            
            if (!manufacturer) {
              manufacturer = String(record.manufacturer || record.brand || record.maker || record.Manufacturer || '').trim()
              if (manufacturer) {
                manufacturerSource = 'manufacturer field'
              }
            }
            
            // Resolve category - check if it's an ID or slug
            let category = ''
            if (record.categoryId) {
              const catId = String(record.categoryId)
              if (catId.startsWith('cat_')) {
                const slug = catId.replace('cat_', '')
                const foundCategory = allCategories.find(c => c.slug === slug)
                category = foundCategory?.name || ''
              } else {
                category = categoryIdMap.get(catId) || ''
              }
            }
            if (!category) {
              category = record.category ? String(record.category) : undefined
            }
            
            return {
              sku: String(record.sku || record.catalogNumber || record.code || record.id || record.SKU || '').trim(),
              name: String(record.name || record.productName || record.title || record.Name || '').trim(),
              description: record.description ? String(record.description).trim() : undefined,
              price: parseFloat(String(record.price || record.cost || record.Price || 0)),
              manufacturer: manufacturer,
              manufacturerSource: manufacturerSource, // Store source for debugging
              category: category || undefined,
              image: record.image ? String(record.image).trim() : undefined,
            }
          })
          
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
          const records = XLSX.utils.sheet_to_json(worksheet)
          
          extractedData = records.map((record: any) => ({
            sku: record.sku || record.catalogNumber || record.code || record.id || record.SKU || '',
            name: record.name || record.productName || record.title || record.Name || '',
            description: record.description || record.desc || record.Description || '',
            price: parseFloat(String(record.price || record.cost || record.Price || 0)),
            manufacturer: record.manufacturer || record.brand || record.maker || record.Manufacturer || '',
            category: record.category || record.type || record.Category || '',
            image: record.image || record.imageUrl || record.photo || record.Image || '',
          })).filter((p: any) => p.sku && p.name && p.manufacturer)
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

    // Limit processing to prevent timeout (process in batches)
    const MAX_PRODUCTS_PER_BATCH = 100
    const BATCH_SIZE = 50 // Process 50 products at a time
    
    if (extractedData.length > MAX_PRODUCTS_PER_BATCH) {
      return NextResponse.json(
        { 
          error: `File contains too many products (${extractedData.length}). Maximum allowed: ${MAX_PRODUCTS_PER_BATCH}. Please split the file into smaller parts.`,
          maxAllowed: MAX_PRODUCTS_PER_BATCH,
          found: extractedData.length
        },
        { status: 400 }
      )
    }

    // Process each extracted product
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

    // Get all existing products by SKU in one query for better performance
    const allSkus = extractedData.map(p => p.sku).filter(Boolean)
    const existingProducts = await prisma.product.findMany({
      where: {
        sku: {
          in: allSkus,
        },
      },
      select: {
        id: true,
        sku: true,
      },
    })
    const existingProductsMap = new Map(existingProducts.map(p => [p.sku, p.id]))

    // Process products in batches to avoid timeout
    const totalProducts = extractedData.length
    let processedCount = 0
    
    for (let i = 0; i < extractedData.length; i += BATCH_SIZE) {
      const batch = extractedData.slice(i, i + BATCH_SIZE)
      
      for (const productData of batch) {
        processedCount++
        try {
          // Validate required fields
          if (!productData.sku || !productData.name || !productData.manufacturer) {
            const missingFields = []
            if (!productData.sku || productData.sku.trim() === '') missingFields.push('SKU')
            if (!productData.name || productData.name.trim() === '') missingFields.push('name')
            if (!productData.manufacturer || productData.manufacturer.trim() === '') missingFields.push('manufacturer')
            
            const productIdentifier = productData.name || productData.sku || 'Unknown'
            const skuInfo = productData.sku ? `SKU: ${productData.sku}` : 'SKU: missing'
            const manufacturerInfo = (productData as any).manufacturerSource 
              ? ` (${(productData as any).manufacturerSource})` 
              : ''
            
            const errorMsg = `❌ Product "${productIdentifier}" [${skuInfo}]: Missing required fields: ${missingFields.join(', ')}${manufacturerInfo ? `. Manufacturer source: ${manufacturerInfo}` : ''}`
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

          const slug = generateSlug(productData.name)
          const price = parseFloat(String(productData.price || 0))

          if (existingProductId) {
            // Update existing product
            const updated = await prisma.product.update({
              where: { id: existingProductId },
              data: {
                name: productData.name,
                slug,
                description: productData.description || null,
                price,
                image: productData.image || null,
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
            // Create new product
            const created = await prisma.product.create({
              data: {
                sku: productData.sku,
                name: productData.name,
                slug,
                description: productData.description || null,
                price,
                image: productData.image || null,
                categoryId,
                manufacturerId,
              },
              include: {
                category: true,
                manufacturer: true,
              },
            })
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

    return NextResponse.json({
      success: true,
      message: `Processed ${extractedData.length} products: ${results.created} created, ${results.updated} updated`,
      results: {
        ...results,
        total: extractedData.length,
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

