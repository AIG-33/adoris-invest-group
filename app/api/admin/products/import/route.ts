import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds for OpenAI processing

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
      // For images, use vision API
      if (mimeType.startsWith('image/')) {
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
      } else {
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
      }
    } catch (openaiError: any) {
      console.error('OpenAI error:', openaiError)
      return NextResponse.json(
        { 
          error: 'Failed to extract product data',
          details: openaiError?.message || 'OpenAI API error'
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

    for (const productData of extractedData) {
      try {
        // Validate required fields
        if (!productData.sku || !productData.name || !productData.manufacturer) {
          results.errors.push(`Missing required fields for product: ${productData.name || 'Unknown'}`)
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
            // Create new manufacturer
            const newManufacturer = await prisma.manufacturer.create({
              data: {
                name: productData.manufacturer,
                slug: generateSlug(productData.manufacturer),
              },
            })
            manufacturerId = newManufacturer.id
            manufacturerMap.set(productData.manufacturer.toLowerCase(), manufacturerId)
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

        // Check if product exists by SKU
        const existingProduct = await prisma.product.findUnique({
          where: { sku: productData.sku },
        })

        const slug = generateSlug(productData.name)
        const price = parseFloat(String(productData.price || 0))

        if (existingProduct) {
          // Update existing product
          const updated = await prisma.product.update({
            where: { id: existingProduct.id },
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

    return NextResponse.json({
      success: true,
      message: `Processed ${extractedData.length} products: ${results.created} created, ${results.updated} updated`,
      results,
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

