import 'dotenv/config'
import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface ProductUpdate {
  productId: string
  manufacturerId: string
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
      const productId = parts[0].trim()
      const manufacturerId = parts[1].trim()
      
      if (productId && manufacturerId) {
        updates.push({ productId, manufacturerId })
      }
    }
  }
  
  return updates
}

async function main() {
  const csvPath = '/Users/gmaxby/Downloads/Book3.csv'
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Файл не найден: ${csvPath}`)
    process.exit(1)
  }
  
  console.log('📖 Чтение CSV файла...')
  const updates = await parseCSV(csvPath)
  console.log(`✅ Загружено ${updates.length} записей из CSV\n`)
  
  // Получим все производители для проверки
  console.log('📋 Загрузка производителей из базы данных...')
  const manufacturers = await prisma.manufacturer.findMany({
    select: {
      id: true,
      name: true,
    }
  })
  
  const manufacturerSet = new Set(manufacturers.map(m => m.id))
  console.log(`✅ Загружено ${manufacturers.length} производителей\n`)
  
  // Проверим, какие manufacturerId существуют
  const missingManufacturers = new Set<string>()
  for (const update of updates) {
    if (!manufacturerSet.has(update.manufacturerId)) {
      missingManufacturers.add(update.manufacturerId)
    }
  }
  
  if (missingManufacturers.size > 0) {
    console.warn(`⚠️  Найдены несуществующие manufacturerId (${missingManufacturers.size}):`)
    Array.from(missingManufacturers).slice(0, 10).forEach(id => {
      console.warn(`   - ${id}`)
    })
    if (missingManufacturers.size > 10) {
      console.warn(`   ... и еще ${missingManufacturers.size - 10}`)
    }
    console.log('')
  }
  
  // Группируем обновления по manufacturerId для оптимизации
  const updatesByManufacturer = new Map<string, string[]>()
  
  for (const update of updates) {
    if (!updatesByManufacturer.has(update.manufacturerId)) {
      updatesByManufacturer.set(update.manufacturerId, [])
    }
    updatesByManufacturer.get(update.manufacturerId)!.push(update.productId)
  }
  
  // Генерируем SQL файлы - разбиваем на части
  const MAX_UPDATES_PER_FILE = 2000 // Максимум обновлений на файл
  const files: string[][] = []
  let currentFile: string[] = []
  let currentFileUpdates = 0
  
  // Создаем файлы
  for (const [manufacturerId, productIds] of updatesByManufacturer.entries()) {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId)
    const manufacturerName = manufacturer?.name || manufacturerId
    
    // Экранируем productId для SQL (заменяем одинарные кавычки)
    // Убираем префикс prod_ если он есть, так как это может быть SKU
    const escapedProductIds = productIds.map(id => {
      const cleanId = id.replace(/^prod_/, '') // Убираем префикс prod_
      return `'${cleanId.replace(/'/g, "''")}'`
    }).join(', ')
    
    const updateBlock = [
      `-- ${manufacturerName} (${productIds.length} products)`,
      `UPDATE "Product"`,
      `SET "manufacturerId" = '${manufacturerId}'`,
      `WHERE ("id" IN (${escapedProductIds}) OR "sku" IN (${escapedProductIds}))`,
      `  AND "manufacturerId" != '${manufacturerId}';`,
      ''
    ]
    
    // Если добавление этого блока превысит лимит, создаем новый файл
    if (currentFileUpdates + productIds.length > MAX_UPDATES_PER_FILE && currentFile.length > 0) {
      files.push(currentFile)
      currentFile = []
      currentFileUpdates = 0
    }
    
    currentFile.push(...updateBlock)
    currentFileUpdates += productIds.length
  }
  
  // Добавляем последний файл
  if (currentFile.length > 0) {
    files.push(currentFile)
  }
  
  // Сохраняем файлы
  const baseOutputPath = path.join(process.cwd(), 'prisma', 'update-product-manufacturers-from-csv')
  
  for (let i = 0; i < files.length; i++) {
    const fileNumber = i + 1
    const sqlLines: string[] = []
    
    sqlLines.push('-- Update product manufacturers from CSV')
    sqlLines.push(`-- Part ${fileNumber} of ${files.length}`)
    sqlLines.push('-- Run this script in Supabase SQL Editor')
    sqlLines.push('-- This script updates manufacturerId for products by ID or SKU')
    sqlLines.push('')
    sqlLines.push(...files[i])
    
    const outputPath = `${baseOutputPath}-part${fileNumber}.sql`
    fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8')
    console.log(`✅ Создан файл ${fileNumber}/${files.length}: ${path.basename(outputPath)}`)
  }
  
  // Создаем также один файл с проверочным запросом
  const allProductIds = updates.map(u => {
    const cleanId = u.productId.replace(/^prod_/, '')
    return `'${cleanId.replace(/'/g, "''")}'`
  }).join(', ')
  
  const verifySql = [
    '-- Verify updates',
    '-- Run this after executing all parts',
    'SELECT p."id", p."sku", p."name", m."id" as manufacturer_id, m."name" as manufacturer_name',
    'FROM "Product" p',
    'JOIN "Manufacturer" m ON p."manufacturerId" = m."id"',
    `WHERE (p."id" IN (${allProductIds}) OR p."sku" IN (${allProductIds}))`,
    'ORDER BY m."name", p."sku";'
  ]
  
  const verifyPath = `${baseOutputPath}-verify.sql`
  fs.writeFileSync(verifyPath, verifySql.join('\n'), 'utf-8')
  console.log(`✅ Создан файл проверки: ${path.basename(verifyPath)}`)
  
  console.log(`\n✅ SQL скрипты сгенерированы`)
  console.log(`📊 Статистика:`)
  console.log(`   Всего записей в CSV: ${updates.length}`)
  console.log(`   Уникальных производителей: ${updatesByManufacturer.size}`)
  console.log(`   Продуктов для обновления: ${updates.length}`)
  console.log(`   Создано файлов: ${files.length}`)
  
  // Статистика по производителям
  console.log(`\n📋 Производители по количеству продуктов:`)
  const sortedManufacturers = Array.from(updatesByManufacturer.entries())
    .map(([id, productIds]) => ({
      id,
      name: manufacturers.find(m => m.id === id)?.name || id,
      count: productIds.length
    }))
    .sort((a, b) => b.count - a.count)
  
  sortedManufacturers.forEach((m) => {
    console.log(`   - ${m.name}: ${m.count} продуктов`)
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

