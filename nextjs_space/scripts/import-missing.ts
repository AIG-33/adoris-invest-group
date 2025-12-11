import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parsePrice(priceStr: string): number {
  const cleaned = priceStr
    .replace('€', '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .trim()
  return parseFloat(cleaned) || 0
}

function createSlug(name: string, sku: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30)
  const skuSlug = sku.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
  return `${nameSlug}-${skuSlug}-${Date.now().toString(36)}`
}

async function main() {
  console.log('🚀 Импорт недостающих товаров...\n')
  
  // Читаем JSON с недостающими товарами
  const missingData = JSON.parse(fs.readFileSync('/home/ubuntu/missing_skus.json', 'utf-8'))
  console.log(`📦 Найдено ${missingData.length} товаров для импорта\n`)
  
  // Загружаем производителей
  const manufacturers = await prisma.manufacturer.findMany()
  const mfrMap = new Map(manufacturers.map(m => [m.name.toLowerCase(), m.id]))
  
  // Категория по умолчанию
  const categories = await prisma.category.findMany()
  const defaultCategoryId = categories.find(c => c.slug === 'uncategorized')?.id || categories[0]?.id
  
  let created = 0
  let errors = 0
  let newMfrs = 0
  
  for (let i = 0; i < missingData.length; i++) {
    const item = missingData[i]
    
    try {
      // Находим или создаем производителя
      let mfrId = mfrMap.get(item.manufacturer.toLowerCase())
      
      if (!mfrId && item.manufacturer) {
        const slug = item.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)
        const newMfr = await prisma.manufacturer.create({
          data: {
            id: `mfr_${slug}_${Date.now().toString(36)}`,
            name: item.manufacturer,
            slug: `${slug}-${Date.now().toString(36)}`
          }
        })
        mfrId = newMfr.id
        mfrMap.set(item.manufacturer.toLowerCase(), mfrId)
        newMfrs++
      }
      
      if (!mfrId) {
        mfrId = mfrMap.get('unknown') || manufacturers[0]?.id
      }
      
      // Создаем товар
      await prisma.product.create({
        data: {
          id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
          sku: item.sku,
          name: item.product || item.sku,
          slug: createSlug(item.product || item.sku, item.sku),
          description: item.description || 'Restored in factory conditions. Guarantee 1 year.',
          shortDesc: item.description || null,
          price: parsePrice(item.price),
          image: '',
          categoryId: defaultCategoryId,
          manufacturerId: mfrId,
          stockStatus: 'in_stock',
          stockQuantity: 1,
          featured: false
        }
      })
      created++
      
    } catch (err: any) {
      errors++
      if (errors <= 3) console.log(`  ⚠️  ${item.sku}: ${err.message.split('\n')[0]}`)
    }
    
    if ((i + 1) % 1000 === 0 || i + 1 === missingData.length) {
      console.log(`  ✓ ${i + 1}/${missingData.length} | создано: ${created}, ошибок: ${errors}`)
    }
  }
  
  console.log(`\n✅ ГОТОВО!`)
  console.log(`   ➕ Создано товаров: ${created}`)
  console.log(`   ➕ Новых производителей: ${newMfrs}`)
  console.log(`   ⚠️  Ошибок: ${errors}`)
  
  await prisma.$disconnect()
}

main().catch(console.error)
