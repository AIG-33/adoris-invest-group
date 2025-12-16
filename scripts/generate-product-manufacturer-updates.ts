import 'dotenv/config'
import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface ProductUpdate {
  manufacturerName: string
  sku: string
}

async function parseCSV(filePath: string): Promise<ProductUpdate[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  // Пропускаем заголовок
  const dataLines = lines.slice(1)
  
  const updates: ProductUpdate[] = []
  
  for (const line of dataLines) {
    const parts = line.split(';')
    if (parts.length >= 2) {
      const manufacturerName = parts[0].trim()
      const sku = parts[1].trim()
      
      if (manufacturerName && sku) {
        updates.push({ manufacturerName, sku })
      }
    }
  }
  
  return updates
}

async function main() {
  const csvPath = '/Users/gmaxby/Downloads/updM.csv'
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Файл не найден: ${csvPath}`)
    process.exit(1)
  }
  
  console.log('📖 Чтение CSV файла...')
  const updates = await parseCSV(csvPath)
  console.log(`✅ Загружено ${updates.length} записей из CSV\n`)
  
  // Найдем ID производителя "Unknown"
  const unknownManufacturer = await prisma.manufacturer.findFirst({
    where: {
      name: {
        equals: 'Unknown',
        mode: 'insensitive'
      }
    }
  })
  
  if (!unknownManufacturer) {
    console.error('❌ Производитель "Unknown" не найден в базе данных')
    process.exit(1)
  }
  
  console.log(`🔍 ID производителя "Unknown": ${unknownManufacturer.id}\n`)
  
  // Получим все производители для маппинга
  console.log('📋 Загрузка производителей из базы данных...')
  const manufacturers = await prisma.manufacturer.findMany({
    select: {
      id: true,
      name: true,
    }
  })
  
  // Создадим маппинг название -> ID
  const manufacturerMap = new Map<string, string>()
  manufacturers.forEach(m => {
    manufacturerMap.set(m.name.toLowerCase(), m.id)
  })
  
  console.log(`✅ Загружено ${manufacturers.length} производителей\n`)
  
  // Группируем обновления по производителям для оптимизации
  const updatesByManufacturer = new Map<string, string[]>()
  
  for (const update of updates) {
    const manufacturerId = manufacturerMap.get(update.manufacturerName.toLowerCase())
    
    if (!manufacturerId) {
      console.warn(`⚠️  Производитель "${update.manufacturerName}" не найден в базе`)
      continue
    }
    
    if (!updatesByManufacturer.has(manufacturerId)) {
      updatesByManufacturer.set(manufacturerId, [])
    }
    updatesByManufacturer.get(manufacturerId)!.push(update.sku)
  }
  
  // Генерируем SQL
  const sqlLines: string[] = []
  sqlLines.push('-- Update product manufacturers from CSV')
  sqlLines.push('-- Run this script in Supabase SQL Editor')
  sqlLines.push('-- This script updates products with Unknown manufacturer to correct manufacturers')
  sqlLines.push('')
  
  let totalUpdates = 0
  
  for (const [manufacturerId, skus] of updatesByManufacturer.entries()) {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId)
    if (!manufacturer) continue
    
    // Экранируем SKU для SQL (заменяем одинарные кавычки)
    const escapedSkus = skus.map(sku => `'${sku.replace(/'/g, "''")}'`).join(', ')
    
    sqlLines.push(`-- ${manufacturer.name} (${skus.length} products)`)
    sqlLines.push(`UPDATE "Product"`)
    sqlLines.push(`SET "manufacturerId" = '${manufacturerId}'`)
    sqlLines.push(`WHERE "sku" IN (${escapedSkus})`)
    sqlLines.push(`  AND "manufacturerId" = '${unknownManufacturer.id}';`)
    sqlLines.push('')
    
    totalUpdates += skus.length
  }
  
  // Добавим запрос для проверки
  sqlLines.push('-- Verify updates')
  sqlLines.push('SELECT p."sku", p."name", m."name" as manufacturer_name')
  sqlLines.push('FROM "Product" p')
  sqlLines.push('JOIN "Manufacturer" m ON p."manufacturerId" = m."id"')
  sqlLines.push(`WHERE p."sku" IN (${updates.map(u => `'${u.sku.replace(/'/g, "''")}'`).join(', ')})`)
  sqlLines.push('ORDER BY m."name", p."sku";')
  
  // Сохраняем SQL файл
  const outputPath = path.join(process.cwd(), 'prisma', 'update-product-manufacturers.sql')
  fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8')
  
  console.log(`\n✅ SQL скрипт сгенерирован: ${outputPath}`)
  console.log(`📊 Статистика:`)
  console.log(`   Всего записей в CSV: ${updates.length}`)
  console.log(`   Уникальных производителей: ${updatesByManufacturer.size}`)
  console.log(`   Продуктов для обновления: ${totalUpdates}`)
  console.log(`   Производитель "Unknown" ID: ${unknownManufacturer.id}`)
  
  // Статистика по производителям
  console.log(`\n📋 Топ-10 производителей по количеству продуктов:`)
  const sortedManufacturers = Array.from(updatesByManufacturer.entries())
    .map(([id, skus]) => ({
      id,
      name: manufacturers.find(m => m.id === id)?.name || 'Unknown',
      count: skus.length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  sortedManufacturers.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.name}: ${m.count} продуктов`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

