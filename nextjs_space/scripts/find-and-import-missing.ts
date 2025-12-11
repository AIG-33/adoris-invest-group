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
  
  return `${nameSlug}-${skuSlug}-${index}`.substring(0, 100)
}

async function main() {
  console.log('🔍 Поиск товаров, которых нет в базе...\n')
  
  try {
    // 1. Загружаем все SKU из базы
    console.log('📋 Загружаю SKU из базы...')
    const existingProducts = await prisma.product.findMany({
      select: { sku: true }
    })
    const existingSKUs = new Set(existingProducts.map(p => p.sku.toLowerCase()))
    console.log(`✓ Найдено ${existingSKUs.size} товаров в базе\n`)
    
    // 2. Парсим IVD.csv
    console.log('📄 Читаю IVD.csv...')
    const filePath = '/home/ubuntu/Uploads/IVD.csv'
    const allRows = parseCSV(filePath)
    console.log(`✓ Найдено ${allRows.length} товаров в CSV\n`)
    
    // 3. Находим отсутствующие товары
    console.log('🔎 Ищу отсутствующие товары...')
    const missingRows = allRows.filter(row => {
      return !existingSKUs.has(row.art.toLowerCase())
    })
    console.log(`✓ Найдено ${missingRows.length} новых товаров\n`)
    
    if (missingRows.length === 0) {
      console.log('✅ Все товары уже есть в базе!')
      return
    }
    
    // 4. Создаем CSV с отсутствующими товарами
    console.log('📝 Создаю missing_products.csv...')
    let csvContent = 'Manufacturer,Art,Product,Description,Price EUR\n'
    missingRows.forEach(row => {
      const escaped = [
        row.manufacturer,
        row.art,
        row.product.replace(/"/g, '""'),
        row.description.replace(/"/g, '""'),
        row.price
      ]
      csvContent += escaped.map(field => `"${field}"`).join(',') + '\n'
    })
    
    fs.writeFileSync('/home/ubuntu/missing_products.csv', csvContent)
    console.log(`✓ Файл создан: /home/ubuntu/missing_products.csv\n`)
    
    // 5. Импортируем отсутствующие товары
    console.log('📦 Начинаю импорт...\n')
    
    const manufacturers = await prisma.manufacturer.findMany()
    const manufacturerMap = new Map(
      manufacturers.map(m => [m.name.toLowerCase(), m.id])
    )
    
    const categories = await prisma.category.findMany()
    const defaultCategory = categories.find(c => c.slug === 'uncategorized')?.id || categories[0]?.id
    
    let created = 0
    let errors = 0
    let newManufacturers = 0
    
    for (let i = 0; i < missingRows.length; i++) {
      const row = missingRows[i]
      
      try {
        const price = parsePrice(row.price)
        const manufacturerName = row.manufacturer.toLowerCase()
        let manufacturerId = manufacturerMap.get(manufacturerName)
        
        // Создаем производителя, если не существует
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
          await prisma.product.create({
            data: {
              id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              sku: row.art,
              name: row.product,
              slug: createSlug(row.product, row.art, i),
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
        }
      } catch (error: any) {
        errors++
        if (errors <= 5) {
          console.log(`  ⚠️  ${row.art}: ${error.message.split('\n')[0]}`)
        }
      }
      
      if ((i + 1) % 500 === 0 || i + 1 === missingRows.length) {
        console.log(`  ✓ ${i + 1}/${missingRows.length} | создано: ${created}, ошибок: ${errors}`)
      }
    }
    
    console.log(`\n✅ ГОТОВО!`)
    console.log(`   📄 CSV создан: /home/ubuntu/missing_products.csv`)
    console.log(`   ➕ Импортировано: ${created}`)
    console.log(`   ➕ Новых производителей: ${newManufacturers}`)
    console.log(`   ⚠️  Ошибок: ${errors}`)
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
