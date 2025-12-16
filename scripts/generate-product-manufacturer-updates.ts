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
  
  // Генерируем SQL файлы - разбиваем на части по производителям
  // Каждый файл будет содержать обновления для группы производителей
  const manufacturersArray = Array.from(updatesByManufacturer.entries())
    .map(([manufacturerId, skus]) => ({
      id: manufacturerId,
      name: manufacturers.find(m => m.id === manufacturerId)?.name || 'Unknown',
      skus
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
  
  const MAX_UPDATES_PER_FILE = 2000 // Максимум обновлений на файл
  const files: string[][] = []
  let currentFile: string[] = []
  let currentFileUpdates = 0
  
  // Создаем файлы
  for (const manufacturer of manufacturersArray) {
    const escapedSkus = manufacturer.skus.map(sku => `'${sku.replace(/'/g, "''")}'`).join(', ')
    const updateBlock = [
      `-- ${manufacturer.name} (${manufacturer.skus.length} products)`,
      `UPDATE "Product"`,
      `SET "manufacturerId" = '${manufacturer.id}'`,
      `WHERE "sku" IN (${escapedSkus})`,
      `  AND "manufacturerId" = '${unknownManufacturer.id}';`,
      ''
    ]
    
    // Если добавление этого блока превысит лимит, создаем новый файл
    if (currentFileUpdates + manufacturer.skus.length > MAX_UPDATES_PER_FILE && currentFile.length > 0) {
      files.push(currentFile)
      currentFile = []
      currentFileUpdates = 0
    }
    
    currentFile.push(...updateBlock)
    currentFileUpdates += manufacturer.skus.length
  }
  
  // Добавляем последний файл
  if (currentFile.length > 0) {
    files.push(currentFile)
  }
  
  // Сохраняем файлы
  const baseOutputPath = path.join(process.cwd(), 'prisma', 'update-product-manufacturers')
  
  for (let i = 0; i < files.length; i++) {
    const fileNumber = i + 1
    const sqlLines: string[] = []
    
    sqlLines.push('-- Update product manufacturers from CSV')
    sqlLines.push(`-- Part ${fileNumber} of ${files.length}`)
    sqlLines.push('-- Run this script in Supabase SQL Editor')
    sqlLines.push('-- This script updates products with Unknown manufacturer to correct manufacturers')
    sqlLines.push('')
    sqlLines.push(...files[i])
    
    const outputPath = `${baseOutputPath}-part${fileNumber}.sql`
    fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8')
    console.log(`✅ Создан файл ${fileNumber}/${files.length}: ${path.basename(outputPath)}`)
  }
  
  // Создаем также один файл с проверочным запросом
  const verifySql = [
    '-- Verify updates',
    '-- Run this after executing all parts',
    'SELECT p."sku", p."name", m."name" as manufacturer_name',
    'FROM "Product" p',
    'JOIN "Manufacturer" m ON p."manufacturerId" = m."id"',
    `WHERE p."sku" IN (${updates.map(u => `'${u.sku.replace(/'/g, "''")}'`).join(', ')})`,
    'ORDER BY m."name", p."sku";'
  ]
  
  const verifyPath = `${baseOutputPath}-verify.sql`
  fs.writeFileSync(verifyPath, verifySql.join('\n'), 'utf-8')
  console.log(`✅ Создан файл проверки: ${path.basename(verifyPath)}`)
  
  console.log(`\n✅ SQL скрипты сгенерированы`)
  console.log(`📊 Статистика:`)
  console.log(`   Всего записей в CSV: ${updates.length}`)
  console.log(`   Уникальных производителей: ${updatesByManufacturer.size}`)
  console.log(`   Продуктов для обновления: ${manufacturersArray.reduce((sum, m) => sum + m.skus.length, 0)}`)
  console.log(`   Производитель "Unknown" ID: ${unknownManufacturer.id}`)
  console.log(`   Создано файлов: ${files.length}`)
  
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

