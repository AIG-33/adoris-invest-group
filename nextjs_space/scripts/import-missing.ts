import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace('€', '').replace(/\s/g, '').replace(',', '.').trim()
  return parseFloat(cleaned) || 0
}

async function main() {
  console.log('🚀 Импорт товаров в базу...\n')
  
  const data = JSON.parse(fs.readFileSync('/home/ubuntu/missing_skus.json', 'utf-8'))
  console.log('📦 Товаров для импорта: ' + data.length + '\n')
  
  const manufacturers = await prisma.manufacturer.findMany()
  const mfrMap = new Map(manufacturers.map((m: any) => [m.name.toLowerCase(), m.id]))
  
  const categories = await prisma.category.findMany()
  const defaultCatId = categories.find((c: any) => c.slug === 'uncategorized')?.id || categories[0]?.id
  
  let created = 0, errors = 0, newMfrs = 0
  const batchSize = 100
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const productsToCreate: any[] = []
    
    for (let j = 0; j < batch.length; j++) {
      const item = batch[j]
      try {
        let mfrId = mfrMap.get(item.manufacturer.toLowerCase())
        
        if (!mfrId && item.manufacturer) {
          const slug = item.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)
          const rnd = Math.random().toString(36).substr(2, 6)
          const newMfr = await prisma.manufacturer.create({
            data: {
              id: 'mfr_' + slug + '_' + rnd,
              name: item.manufacturer,
              slug: slug + '-' + rnd
            }
          })
          mfrId = newMfr.id
          mfrMap.set(item.manufacturer.toLowerCase(), mfrId)
          newMfrs++
        }
        
        if (!mfrId) mfrId = manufacturers[0]?.id
        
        const globalIdx = i + j
        const nameSlug = (item.product || item.sku).toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)
        const skuSlug = item.sku.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
        
        productsToCreate.push({
          id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
          sku: item.sku,
          name: item.product || item.sku,
          slug: nameSlug + '-' + skuSlug + '-' + globalIdx,
          description: item.description || 'Restored in factory conditions. Guarantee 1 year.',
          shortDesc: item.description || null,
          price: parsePrice(item.price),
          image: '',
          categoryId: defaultCatId,
          manufacturerId: mfrId,
          stockStatus: 'in_stock',
          stockQuantity: 1,
          featured: false
        })
      } catch (e: any) {
        errors++
      }
    }
    
    if (productsToCreate.length > 0) {
      try {
        await prisma.product.createMany({ data: productsToCreate, skipDuplicates: true })
        created += productsToCreate.length
      } catch (e: any) {
        for (const p of productsToCreate) {
          try {
            await prisma.product.create({ data: p })
            created++
          } catch { errors++ }
        }
      }
    }
    
    if ((i + batchSize) % 2000 === 0 || i + batchSize >= data.length) {
      console.log('  ✓ ' + Math.min(i + batchSize, data.length) + '/' + data.length + ' | создано: ' + created)
    }
  }
  
  console.log('\n✅ ГОТОВО!')
  console.log('   ➕ Создано: ' + created)
  console.log('   ➕ Новых производителей: ' + newMfrs)
  console.log('   ⚠️  Ошибок: ' + errors)
  await prisma.$disconnect()
}

main().catch(console.error)
