import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parseCSV(content: string) {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',')
  const results: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const row: any = {}
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : ''
    })
    results.push(row)
  }
  
  return results
}

async function main() {
  console.log('🚀 БЫСТРЫЙ импорт (batch mode)...\n')
  
  try {
    // 1. Категории (уже импортированы, пропускаем)
    console.log('📁 Категории уже импортированы, пропускаем\n')
    
    // 2. Производители (уже импортированы, пропускаем)
    console.log('🏭 Производители уже импортированы, пропускаем\n')
    
    // 3. Товары - BATCH IMPORT
    console.log('📦 BATCH импорт товаров...')
    const productsContent = fs.readFileSync('/home/ubuntu/products.csv', 'utf-8')
    const products = parseCSV(productsContent)
    
    // Получаем все существующие SKU для быстрой проверки
    console.log('   📋 Загружаю существующие SKU...')
    const existingProducts = await prisma.product.findMany({
      select: { sku: true }
    })
    const existingSKUs = new Set(existingProducts.map(p => p.sku))
    console.log(`   ✓ Найдено ${existingSKUs.size} существующих товаров\n`)
    
    // Фильтруем только новые товары
    const newProducts = products.filter(p => !existingSKUs.has(p.sku))
    console.log(`   📦 Новых товаров для импорта: ${newProducts.length}\n`)
    
    if (newProducts.length === 0) {
      console.log('✅ Все товары уже импортированы!')
      return
    }
    
    // Получаем все категории и производители для валидации
    const allCategories = await prisma.category.findMany()
    const allManufacturers = await prisma.manufacturer.findMany()
    const categoryIds = new Set(allCategories.map(c => c.id))
    const manufacturerIds = new Set(allManufacturers.map(m => m.id))
    
    // Импорт батчами по 100 товаров
    const batchSize = 100
    let imported = 0
    let errors = 0
    
    for (let i = 0; i < newProducts.length; i += batchSize) {
      const batch = newProducts.slice(i, i + batchSize)
      
      // Фильтруем товары с валидными ссылками
      const validBatch = batch.filter(prod => {
        const valid = categoryIds.has(prod.categoryId) && manufacturerIds.has(prod.manufacturerId)
        if (!valid) {
          errors++
          if (errors <= 5) {
            console.log(`   ⚠️  Пропуск SKU ${prod.sku}: нет категории ${prod.categoryId} или производителя ${prod.manufacturerId}`)
          }
        }
        return valid
      })
      
      if (validBatch.length > 0) {
        try {
          // Создаем все товары за один запрос
          await prisma.product.createMany({
            data: validBatch.map(prod => ({
              id: prod.id,
              sku: prod.sku,
              name: prod.name,
              slug: prod.slug,
              description: prod.description,
              shortDesc: prod.shortDesc || null,
              price: parseFloat(prod.price) || 0.0,
              image: prod.image || '',
              categoryId: prod.categoryId,
              manufacturerId: prod.manufacturerId,
              stockStatus: prod.stockStatus,
              stockQuantity: parseInt(prod.stockQuantity) || 0,
              featured: prod.featured === 'true',
            })),
            skipDuplicates: true
          })
          
          imported += validBatch.length
          console.log(`   ✓ Импортировано ${imported} / ${newProducts.length} (пропущено ошибок: ${errors})`)
        } catch (batchError: any) {
          console.log(`   ⚠️  Ошибка в батче: ${batchError.message}`)
          errors += batch.length
        }
      }
    }
    
    console.log(`\n✅ Импорт завершен!`)
    console.log(`   📦 Успешно: ${imported}`)
    console.log(`   ⚠️  Пропущено: ${errors}`)
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
