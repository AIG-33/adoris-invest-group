import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parser'

const prisma = new PrismaClient()

interface CategoryRow {
  id: string
  name: string
  slug: string
}

interface ManufacturerRow {
  id: string
  name: string
  slug: string
}

interface ProductRow {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDesc: string
  price: string
  image: string
  categoryId: string
  manufacturerId: string
  stockStatus: string
  stockQuantity: string
  featured: string
}

function readCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

async function main() {
  console.log('🚀 Начинаю импорт данных...\n')
  
  const baseDir = '/home/ubuntu'
  
  try {
    // 1. Импорт категорий
    console.log('📁 Импорт категорий...')
    const categoriesPath = path.join(baseDir, 'categories.csv')
    const categories = await readCSV(categoriesPath) as CategoryRow[]
    
    let categoryCount = 0
    for (const cat of categories) {
      try {
        await prisma.category.upsert({
          where: { id: cat.id },
          create: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          },
          update: {
            name: cat.name,
            slug: cat.slug,
          },
        })
        categoryCount++
        if (categoryCount % 10 === 0) {
          console.log(`  ✓ Создано ${categoryCount} категорий`)
        }
      } catch (error: any) {
        console.error(`  ✗ Ошибка с категорией ${cat.name}: ${error.message}`)
      }
    }
    console.log(`✅ Импортировано ${categoryCount} категорий\n`)
    
    // 2. Импорт производителей
    console.log('🏭 Импорт производителей...')
    const manufacturersPath = path.join(baseDir, 'manufacturers.csv')
    const manufacturers = await readCSV(manufacturersPath) as ManufacturerRow[]
    
    let manufacturerCount = 0
    for (const mfr of manufacturers) {
      try {
        await prisma.manufacturer.upsert({
          where: { id: mfr.id },
          create: {
            id: mfr.id,
            name: mfr.name,
            slug: mfr.slug,
          },
          update: {
            name: mfr.name,
            slug: mfr.slug,
          },
        })
        manufacturerCount++
        if (manufacturerCount % 5 === 0) {
          console.log(`  ✓ Создано ${manufacturerCount} производителей`)
        }
      } catch (error: any) {
        console.error(`  ✗ Ошибка с производителем ${mfr.name}: ${error.message}`)
      }
    }
    console.log(`✅ Импортировано ${manufacturerCount} производителей\n`)
    
    // 3. Импорт товаров (порциями по 100)
    console.log('📦 Импорт товаров...')
    const productsPath = path.join(baseDir, 'products.csv')
    const products = await readCSV(productsPath) as ProductRow[]
    
    const batchSize = 100
    let productCount = 0
    let errorCount = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      
      for (const prod of batch) {
        try {
          await prisma.product.upsert({
            where: { id: prod.id },
            create: {
              id: prod.id,
              name: prod.name,
              slug: prod.slug,
              sku: prod.sku,
              description: prod.description,
              shortDesc: prod.shortDesc || null,
              price: parseFloat(prod.price) || 0.0,
              image: prod.image || '',
              categoryId: prod.categoryId,
              manufacturerId: prod.manufacturerId,
              stockStatus: prod.stockStatus,
              stockQuantity: parseInt(prod.stockQuantity) || 0,
              featured: prod.featured === 'true',
            },
            update: {
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
            },
          })
          productCount++
        } catch (error: any) {
          errorCount++
          if (errorCount <= 10) {
            console.error(`  ✗ Ошибка с товаром ${prod.name} (SKU: ${prod.sku}): ${error.message}`)
          }
        }
      }
      
      console.log(`  ✓ Обработано ${Math.min(i + batchSize, products.length)} / ${products.length} товаров`)
    }
    
    console.log(`✅ Импортировано ${productCount} товаров`)
    if (errorCount > 0) {
      console.log(`⚠️  Пропущено ${errorCount} товаров с ошибками`)
    }
    
    console.log('\n🎉 Импорт завершен успешно!')
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('❌ Необработанная ошибка:', error)
    process.exit(1)
  })
