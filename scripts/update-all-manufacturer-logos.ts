import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'

// Маппинг имен производителей к файлам логотипов
// Если логотип не найден, можно использовать публичные URL или загрузить вручную
const logoMapping: Record<string, string> = {
  // Уже существующие логотипы
  'Ab Sciex': '/logos/ab-sciex.png',
  'Abbott': '/logos/abbott.png',
  'BioLegend': '/logos/biolegend.png',
  'DRG': '/logos/drg.png',
  'Ethicon': '/logos/ethicon.png',
  'Illumina': '/logos/illumina.png',
  'Jena': '/logos/jena.png',
  'NEB': '/logos/neb.png',
  'Ortho': '/logos/ortho.png',
  'Phadia': '/logos/phadia.png',
  'Roche': '/logos/roche.png',
  'Siemens Allergy': '/logos/siemens-allergy.png',
  'Siemens': '/logos/siemens.png',
  'Sigma-Aldrich': '/logos/sigma-aldrich.png',
  'Thermo': '/logos/thermo-fisher.png',
  'Thermo Fisher Scientific': '/logos/thermo-fisher.png',
  'Siemens Healthineers': '/logos/siemens.png',
}

async function main() {
  console.log('📋 Получение списка всех производителей...\n')
  
  // Получаем всех производителей
  const manufacturers = await prisma.manufacturer.findMany({
    orderBy: { name: 'asc' },
  })

  console.log(`Всего производителей: ${manufacturers.length}\n`)
  console.log('Обновление логотипов...\n')
  
  let updated = 0
  let notFound = 0
  let skipped = 0
  const logosDir = path.join(process.cwd(), 'public', 'logos')

  // Проверяем существование папки logos
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true })
    console.log('✅ Создана папка public/logos\n')
  }

  for (const manufacturer of manufacturers) {
    try {
      // Ищем логотип в маппинге
      let logoPath: string | null = null
      
      // Прямое совпадение
      if (logoMapping[manufacturer.name]) {
        logoPath = logoMapping[manufacturer.name]
      } else {
        // Поиск по частичному совпадению (case insensitive)
        const found = Object.keys(logoMapping).find(
          key => manufacturer.name.toLowerCase().includes(key.toLowerCase()) ||
                 key.toLowerCase().includes(manufacturer.name.toLowerCase())
        )
        if (found) {
          logoPath = logoMapping[found]
        }
      }

      if (logoPath) {
        // Проверяем, существует ли файл
        const logoFile = path.join(process.cwd(), 'public', logoPath.replace(/^\//, ''))
        if (fs.existsSync(logoFile)) {
          // Обновляем логотип в базе
          await prisma.manufacturer.update({
            where: { id: manufacturer.id },
            data: { logo: logoPath }
          })
          console.log(`✅ ${manufacturer.name} -> ${logoPath}`)
          updated++
        } else {
          console.log(`⚠️  ${manufacturer.name} -> ${logoPath} (файл не найден)`)
          skipped++
        }
      } else {
        console.log(`❌ ${manufacturer.name} - логотип не найден в маппинге`)
        notFound++
      }
    } catch (error) {
      console.error(`❌ Ошибка при обновлении ${manufacturer.name}:`, error)
    }
  }

  console.log(`\n📊 Итого:`)
  console.log(`   Обновлено: ${updated}`)
  console.log(`   Пропущено (файл не найден): ${skipped}`)
  console.log(`   Не найдено в маппинге: ${notFound}`)

  // Проверка - сколько производителей с логотипами
  const withLogos = await prisma.manufacturer.count({
    where: {
      logo: {
        not: null
      }
    }
  })

  console.log(`\n📈 Статистика:`)
  console.log(`   Производителей с логотипами: ${withLogos} из ${manufacturers.length}`)
  console.log(`   Производителей без логотипов: ${manufacturers.length - withLogos}`)

  // Список производителей без логотипов
  const withoutLogos = await prisma.manufacturer.findMany({
    where: {
      OR: [
        { logo: null },
        { logo: '' }
      ]
    },
    select: {
      name: true,
      slug: true
    },
    orderBy: { name: 'asc' }
  })

  if (withoutLogos.length > 0) {
    console.log(`\n📝 Производители без логотипов (${withoutLogos.length}):`)
    withoutLogos.forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.name} (slug: ${m.slug})`)
    })
    console.log(`\n💡 Для этих производителей нужно:`)
    console.log(`   1. Найти логотип в интернете`)
    console.log(`   2. Сохранить его в public/logos/ с именем, например: ${withoutLogos[0].slug}.png`)
    console.log(`   3. Добавить в маппинг: '${withoutLogos[0].name}': '/logos/${withoutLogos[0].slug}.png'`)
    console.log(`   4. Запустить скрипт снова`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

