import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace('€', '').replace(/\s/g, '').replace(',', '.').trim()
  return parseFloat(cleaned) || 0
}

function createSlug(name: string, sku: string, idx: number): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)
  const skuPart = sku.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
  return `${base}-${skuPart}-${idx}`
}

async function main() {
  console.log('🚀 Импорт товаров...\n')
  
  const data = JSON.parse(fs.readFileSync('/home/ubuntu/missing_skus.json', 'utf-8'))
  console.log(`📦 Товаров для импорта: ${data.length}\n`)
  
  // Загружаем производителей
  const mfrs = await prisma.manufacturer.findMany()
  const mfrMap = new Map(mfrs.map(m => [m.name.toLowerCase(), m.id]))
  
  // Категория по умолчанию
  const cats = await prisma.category.findMany()
  const defaultCat = cats.find(c => c.slug === 'uncategorized')?.id || cats[0]?.id
  
  let created = 0, errors = 0, newMfrs = 0
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    try {
      // Производитель
      let mfrId = mfrMap.get(item.manufacturer.toLowerCase())
      if (!mfrId && item.manufacturer) {
        const slug = item.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 25)
        const m = await prisma.manufacturer.create({
          data: {
            id: `mfr_${slug}_${Date.now().toString(36)}`,
            name: item.manufacturer,
            slug: `${slug}-${Date.now().toString(36)}`
          }
        })
        mfrId = m.id
        mfrMap.set(item.manufacturer.toLowerCase(), mfrId)
        newMfrs++
      }
      if (!mfrId) mfrId = mfrs[0]?.id
      
      // Создаём товар
      await prisma.product.create({
        data: {
          id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          sku: item.sku,
          name: item.product || item.sku,
          slug: createSlug(item.product || item.sku, item.sku, i),
          description: item.description || 'Restored in factory conditions. Guarantee 1 year.',
          shortDesc: item.description || null,
          price: parsePrice(item.price),
          image: '',
          categoryId: defaultCat,
          manufacturerId: mfrId,
          stockStatus: 'in_stock',
          stockQuantity: 1,
          featured: false
        }
      })
      created++
    } catch (e: any) {
      errors++
    }
    
    if ((i+1) % 500 === 0) {
      console.log(`  ✓ ${i+1}/${data.length} | создано: ${created}`)
    }
  }
  
  console.log(`\n✅ ГОТОВО! Создано: ${created}, Производителей: ${newMfrs}, Ошибок: ${errors}`)
  await prisma.$disconnect()
}

main()
