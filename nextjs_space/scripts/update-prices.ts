import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

interface CSVRow {
  manufacturer: string
  art: string
  product: string
  description: string
  price: string
}

function parsePrice(priceStr: string): number {
  const cleaned = priceStr
    .replace('€', '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .trim()
  
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parseCSV(filePath: string): CSVRow[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const results: CSVRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
    if (!parts || parts.length < 5) continue
    
    const manufacturer = parts[0].replace(/"/g, '').trim()
    const art = parts[1].replace(/"/g, '').trim()
    const product = parts[2].replace(/"/g, '').trim()
    const description = parts[3].replace(/"/g, '').trim()
    const price = parts[4].replace(/"/g, '').trim()
    
    if (art && product) {
      results.push({ manufacturer, art, product, description, price })
    }
  }
  
  return results
}

function createSlug(name: string, sku: string, index: number): string {
  const skuSlug = sku.toLowerCase().replace(/[^a-z0-9]/g, '')
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30)
  
  // Уникальный slug = имя + sku + индекс
  return `${nameSlug}-${skuSlug}-${index}`.substring(0, 100)
}

async function main() {
  console.log('🚀 Финальное обновление цен (v4)...\n')
  
  try {
    const filePath = '/home/ubuntu/Uploads/IVD.csv'
    const rows = parseCSV(filePath)
    console.log(`📦 Найдено ${rows.length} товаров в CSV\n`)
    
    console.log('📋 Загружаю данные из базы...')
    const existingProducts = await prisma.product.findMany({
      select: { sku: true, id: true, name: true, price: true }
    })
    
    const existingSKUs = new Map(existingProducts.map(p => [p.sku, p]))
    const existingSKUsLower = new Set(existingProducts.map(p => p.sku.toLowerCase()))
    
    const manufacturers = await prisma.manufacturer.findMany()
    const manufacturerMap = new Map(
      manufacturers.map(m => [m.name.toLowerCase(), m.id])
    )
    
    const categories = await prisma.category.findMany()
    const defaultCategory = categories.find(c => c.slug === 'uncategorized')?.id || categories[0]?.id
    
    console.log(`✓ ${existingSKUs.size} товаров в базе`)
    console.log(`✓ ${manufacturers.length} производителей\n`)
    
    let updated = 0
    let created = 0
    let skipped = 0
    let errors = 0
    let newManufacturers = 0
    
    const batchSize = 50 // Уменьшаем размер батча для стабильности
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j]
        try {
          const sku = row.art
          const skuLower = sku.toLowerCase()
          const price = parsePrice(row.price)
          
          const existing = existingSKUs.get(sku)
          
          if (existing) {
            if (Math.abs(existing.price - price) > 0.01) {
              await prisma.product.update({
                where: { id: existing.id },
                data: { price }
              })
              updated++
            } else {
              skipped++
            }
          } else if (existingSKUsLower.has(skuLower)) {
            skipped++
          } else {
            const manufacturerName = row.manufacturer.toLowerCase()
            let manufacturerId = manufacturerMap.get(manufacturerName)
            
            if (!manufacturerId) {
              const random = Math.random().toString(36).substr(2, 6)
              const newManufacturer = await prisma.manufacturer.create({
                data: {
                  id: `mfr_${row.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)}_${random}`,
                  name: row.manufacturer,
                  slug: `${row.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${random}`
                }
              })
              manufacturerId = newManufacturer.id
              manufacturerMap.set(manufacturerName, manufacturerId)
              newManufacturers++
            }
            
            if (manufacturerId) {
              const globalIndex = i + j
              await prisma.product.create({
                data: {
                  id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  sku: sku,
                  name: row.product,
                  slug: createSlug(row.product, sku, globalIndex),
                  description: row.description || 'Restored in factory conditions. Guarantee 1 year.',
                  shortDesc: row.description || null,
                  price: price,
                  image: '',
                  categoryId: defaultCategory,
                  manufacturerId: manufacturerId,
                  stockStatus: 'in_stock',
                  stockQuantity: 1,
                  featured: false
                }
              })
              created++
              existingSKUsLower.add(skuLower)
            }
          }
        } catch (error: any) {
          errors++
          if (errors <= 5) {
            console.log(`  ⚠️  ${row.art}: ${error.message.split('\n')[0]}`)
          }
        }
      }
      
      if ((i + batchSize) % 1000 === 0 || i + batchSize >= rows.length) {
        const progress = Math.min(i + batchSize, rows.length)
        console.log(`  ✓ ${progress}/${rows.length} | +${updated} цен, +${created} товаров, ${errors} ошибок`)
      }
    }
    
    console.log(`\n✅ ГОТОВО!`)
    console.log(`   🔄 Обновлено цен: ${updated}`)
    console.log(`   ➕ Создано товаров: ${created}`)
    console.log(`   ➕ Создано производителей: ${newManufacturers}`)
    console.log(`   ⏭️  Пропущено: ${skipped}`)
    console.log(`   ⚠️  Ошибок: ${errors}`)
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
