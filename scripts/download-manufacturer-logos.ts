import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

// Известные источники логотипов для медицинских производителей
const logoSources: Record<string, string[]> = {
  // Можно добавить известные URL паттерны
}

// Функция для скачивания файла
function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Редирект
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject)
      }
      
      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(filepath)
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      
      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      reject(err)
    })
  })
}


// Функция для поиска логотипа через известные домены и Clearbit
async function findLogoUrl(companyName: string): Promise<string | null> {
  // Сначала пробуем известные URL паттерны
  const knownDomains: Record<string, string> = {
    'Abbott': 'abbott.com',
    'Roche': 'roche.com',
    'Siemens': 'siemens.com',
    'Thermo Fisher Scientific': 'thermofisher.com',
    'Thermo': 'thermofisher.com',
    'Illumina': 'illumina.com',
    'BioLegend': 'biolegend.com',
    'NEB': 'neb.com',
    'Sigma-Aldrich': 'sigmaaldrich.com',
    'Ab Sciex': 'sciex.com',
    'DRG': 'drg-diagnostics.de',
    'Ethicon': 'ethicon.com',
    'Jena': 'analytik-jena.com',
    'Ortho': 'orthoclinicaldiagnostics.com',
    'Phadia': 'phadia.com',
    'Siemens Healthineers': 'siemens-healthineers.com',
    'Siemens Allergy': 'siemens-healthineers.com',
  }
  
  // Находим домен для компании
  let domain: string | null = null
  
  // Прямое совпадение
  if (knownDomains[companyName]) {
    domain = knownDomains[companyName]
  } else {
    // Поиск по частичному совпадению
    for (const [key, d] of Object.entries(knownDomains)) {
      if (companyName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(companyName.toLowerCase())) {
        domain = d
        break
      }
    }
  }
  
  // Если нашли домен, пробуем Clearbit
  if (domain) {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`
    // Проверяем доступность
    try {
      const available = await new Promise<boolean>((resolve) => {
        https.get(clearbitUrl, (response) => {
          resolve(response.statusCode === 200)
        }).on('error', () => resolve(false))
        setTimeout(() => resolve(false), 3000) // Таймаут 3 секунды
      })
      
      if (available) {
        return clearbitUrl
      }
    } catch (error) {
      // Игнорируем ошибки
    }
  }
  
  // Если не нашли через Clearbit, пробуем простой поиск по первому слову
  const firstWord = companyName.split(' ')[0].toLowerCase()
  const simpleUrl = `https://logo.clearbit.com/${firstWord}.com`
  
  try {
    const available = await new Promise<boolean>((resolve) => {
      https.get(simpleUrl, (response) => {
        resolve(response.statusCode === 200)
      }).on('error', () => resolve(false))
      setTimeout(() => resolve(false), 3000)
    })
    
    if (available) {
      return simpleUrl
    }
  } catch (error) {
    // Игнорируем ошибки
  }
  
  return null
}

async function main() {
  console.log('📋 Поиск и скачивание логотипов производителей...\n')
  
  // Получаем всех производителей без логотипов
  const manufacturers = await prisma.manufacturer.findMany({
    where: {
      OR: [
        { logo: null },
        { logo: '' }
      ]
    },
    orderBy: { name: 'asc' },
  })
  
  console.log(`Найдено производителей без логотипов: ${manufacturers.length}\n`)
  
  if (manufacturers.length === 0) {
    console.log('✅ Все производители уже имеют логотипы!')
    return
  }
  
  const logosDir = path.join(process.cwd(), 'public', 'logos')
  
  // Создаем папку logos если её нет
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true })
    console.log('✅ Создана папка public/logos\n')
  }
  
  let downloaded = 0
  let failed = 0
  const results: Array<{ name: string; slug: string; status: string; path?: string }> = []
  
  for (const manufacturer of manufacturers) {
    try {
      console.log(`🔍 Поиск логотипа для: ${manufacturer.name}...`)
      
      // Ищем логотип
      const logoUrl = await findLogoUrl(manufacturer.name)
      
      if (logoUrl) {
        const filename = `${manufacturer.slug}.png`
        const filepath = path.join(logosDir, filename)
        const logoPath = `/logos/${filename}`
        
        try {
          await downloadFile(logoUrl, filepath)
          
          // Обновляем в базе данных
          await prisma.manufacturer.update({
            where: { id: manufacturer.id },
            data: { logo: logoPath }
          })
          
          console.log(`✅ ${manufacturer.name} -> ${logoPath}`)
          downloaded++
          results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '✅', path: logoPath })
        } catch (error) {
          console.log(`❌ ${manufacturer.name} - ошибка скачивания: ${error}`)
          failed++
          results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '❌', path: undefined })
        }
      } else {
        console.log(`⚠️  ${manufacturer.name} - логотип не найден`)
        failed++
        results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '⚠️', path: undefined })
      }
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${manufacturer.name}:`, error)
      failed++
      results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '❌', path: undefined })
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n📊 Итого:`)
  console.log(`   Скачано: ${downloaded}`)
  console.log(`   Не найдено/Ошибки: ${failed}`)
  
  if (results.length > 0) {
    console.log(`\n📝 Результаты:`)
    results.forEach(r => {
      console.log(`   ${r.status} ${r.name}${r.path ? ` -> ${r.path}` : ''}`)
    })
  }
  
  // Список производителей, для которых не удалось найти логотип
  const notFound = results.filter(r => r.status !== '✅')
  if (notFound.length > 0) {
    console.log(`\n💡 Для этих производителей нужно найти логотип вручную:`)
    notFound.forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.name} (slug: ${m.slug})`)
      console.log(`      Сохраните логотип в public/logos/${m.slug}.png`)
      console.log(`      Затем запустите: npm run update:logos`)
    })
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

