import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

// Простой CSV парсер
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
  console.log('🚀 Начинаю импорт...\n')
  
  try {
    // 1. Категории
    console.log('📁 Импорт категорий...')
    const categoriesContent = fs.readFileSync('/home/ubuntu/categories.csv', 'utf-8')
    const categories = parseCSV(categoriesContent)
    
    let catCreated = 0
    let catUpdated = 0
    
    for (const cat of categories) {
      // Проверяем, существует ли категория с таким именем
      const existing = await prisma.category.findFirst({
        where: { 
          OR: [
            { id: cat.id },
            { name: cat.name }
          ]
        }
      })
      
      if (existing) {
        // Обновляем существующую
        await prisma.category.update({
          where: { id: existing.id },
          data: { name: cat.name, slug: cat.slug },
        })
        catUpdated++
      } else {
        // Создаем новую
        await prisma.category.create({
          data: { id: cat.id, name: cat.name, slug: cat.slug },
        })
        catCreated++
      }
    }
    console.log(`✅ Категории: создано ${catCreated}, обновлено ${catUpdated}\n`)
    
    // 2. Производители
    console.log('🏭 Импорт производителей...')
    const manufacturersContent = fs.readFileSync('/home/ubuntu/manufacturers.csv', 'utf-8')
    const manufacturers = parseCSV(manufacturersContent)
    
    let mfrCreated = 0
    let mfrUpdated = 0
    
    for (const mfr of manufacturers) {
      const existing = await prisma.manufacturer.findFirst({
        where: { 
          OR: [
            { id: mfr.id },
            { name: mfr.name }
          ]
        }
      })
      
      if (existing) {
        await prisma.manufacturer.update({
          where: { id: existing.id },
          data: { name: mfr.name, slug: mfr.slug },
        })
        mfrUpdated++
      } else {
        await prisma.manufacturer.create({
          data: { id: mfr.id, name: mfr.name, slug: mfr.slug },
        })
        mfrCreated++
      }
    }
    console.log(`✅ Производители: создано ${mfrCreated}, обновлено ${mfrUpdated}\n`)
    
    // 3. Товары (с прогрессом)
    console.log('📦 Импорт товаров (это займет несколько минут)...')
    const productsContent = fs.readFileSync('/home/ubuntu/products.csv', 'utf-8')
    const products = parseCSV(productsContent)
    
    let prodCreated = 0
    let prodUpdated = 0
    let prodErrors = 0
    
    for (let i = 0; i < products.length; i++) {
      const prod = products[i]
      
      try {
        // Проверяем по SKU (уникальное поле)
        const existing = await prisma.product.findUnique({
          where: { sku: prod.sku }
        })
        
        const productData = {
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
        }
        
        if (existing) {
          await prisma.product.update({
            where: { sku: prod.sku },
            data: productData,
          })
          prodUpdated++
        } else {
          await prisma.product.create({
            data: {
              id: prod.id,
              sku: prod.sku,
              ...productData
            },
          })
          prodCreated++
        }
      } catch (error: any) {
        prodErrors++
        if (prodErrors <= 5) {
          console.log(`  ⚠️  Ошибка с товаром SKU ${prod.sku}: ${error.message}`)
        }
      }
      
      if ((i + 1) % 1000 === 0) {
        console.log(`  ✓ Обработано ${i + 1} / ${products.length} (создано: ${prodCreated}, обновлено: ${prodUpdated}, ошибок: ${prodErrors})`)
      }
    }
    
    console.log(`\n✅ Товары: создано ${prodCreated}, обновлено ${prodUpdated}`)
    if (prodErrors > 0) {
      console.log(`⚠️  Ошибок при импорте: ${prodErrors}`)
    }
    console.log('\n🎉 Импорт завершен!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
