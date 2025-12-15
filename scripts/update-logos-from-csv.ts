import 'dotenv/config'
import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface LogoEntry {
  name: string
  logo: string | null
}

async function parseCSV(filePath: string): Promise<LogoEntry[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  // Пропускаем заголовок
  const dataLines = lines.slice(1)
  
  const entries: LogoEntry[] = []
  
  for (const line of dataLines) {
    const parts = line.split(';')
    if (parts.length >= 2) {
      const name = parts[0].trim()
      const logo = parts[1].trim() || null
      
      if (name) {
        entries.push({ name, logo })
      }
    }
  }
  
  return entries
}

async function main() {
  // Пробуем найти файл в разных местах
  const possiblePaths = [
    path.join(process.cwd(), 'logos_updated.csv'),
    path.join(process.cwd(), '..', 'Downloads', 'logos_updated.csv'),
    path.join(process.cwd(), 'scripts', 'logos_updated.csv'),
  ]
  
  let csvPath: string | null = null
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      csvPath = possiblePath
      break
    }
  }
  
  if (!csvPath) {
    console.error(`❌ Файл logos_updated.csv не найден в следующих местах:`)
    possiblePaths.forEach(p => console.log(`   - ${p}`))
    console.log('\n💡 Скопируйте файл logos_updated.csv в корень проекта или укажите путь как аргумент')
    process.exit(1)
  }
  
  console.log(`📁 Используется файл: ${csvPath}\n`)
  
  console.log('📖 Чтение CSV файла...')
  const logoEntries = await parseCSV(csvPath)
  console.log(`✅ Загружено ${logoEntries.length} записей из CSV\n`)
  
  console.log('🔄 Обновление логотипов производителей...\n')
  
  let updated = 0
  let notFound = 0
  let skipped = 0
  const notFoundNames: string[] = []
  
  for (const entry of logoEntries) {
    try {
      // Ищем производителя по имени (case-insensitive)
      const manufacturer = await prisma.manufacturer.findFirst({
        where: {
          name: {
            equals: entry.name,
            mode: 'insensitive'
          }
        }
      })
      
      if (!manufacturer) {
        // Пробуем найти по частичному совпадению
        const partialMatch = await prisma.manufacturer.findFirst({
          where: {
            name: {
              contains: entry.name,
              mode: 'insensitive'
            }
          }
        })
        
        if (partialMatch) {
          console.log(`⚠️  Частичное совпадение: "${entry.name}" -> "${partialMatch.name}"`)
          
          if (entry.logo) {
            await prisma.manufacturer.update({
              where: { id: partialMatch.id },
              data: { logo: entry.logo }
            })
            console.log(`   ✅ Обновлено: ${entry.logo}`)
            updated++
          } else {
            console.log(`   ⏭️  Пропущено (логотип пустой)`)
            skipped++
          }
          continue
        }
        
        console.log(`❌ "${entry.name}" - не найден в базе`)
        notFound++
        notFoundNames.push(entry.name)
        continue
      }
      
      // Обновляем логотип, если он указан
      if (entry.logo) {
        await prisma.manufacturer.update({
          where: { id: manufacturer.id },
          data: { logo: entry.logo }
        })
        console.log(`✅ ${manufacturer.name} -> ${entry.logo}`)
        updated++
      } else {
        // Если логотип пустой, оставляем как есть или очищаем
        console.log(`⏭️  ${manufacturer.name} - логотип не указан в CSV, пропущено`)
        skipped++
      }
    } catch (error) {
      console.error(`❌ Ошибка при обновлении "${entry.name}":`, error)
    }
  }
  
  console.log(`\n📊 Итого:`)
  console.log(`   ✅ Обновлено: ${updated}`)
  console.log(`   ⏭️  Пропущено (логотип пустой): ${skipped}`)
  console.log(`   ❌ Не найдено в базе: ${notFound}`)
  
  if (notFoundNames.length > 0) {
    console.log(`\n📝 Производители, не найденные в базе (${notFoundNames.length}):`)
    notFoundNames.slice(0, 20).forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`)
    })
    if (notFoundNames.length > 20) {
      console.log(`   ... и еще ${notFoundNames.length - 20}`)
    }
  }
  
  // Статистика
  const totalManufacturers = await prisma.manufacturer.count()
  const withLogos = await prisma.manufacturer.count({
    where: {
      logo: {
        not: null
      }
    }
  })
  
  console.log(`\n📈 Статистика базы данных:`)
  console.log(`   Всего производителей: ${totalManufacturers}`)
  console.log(`   С логотипами: ${withLogos}`)
  console.log(`   Без логотипов: ${totalManufacturers - withLogos}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

