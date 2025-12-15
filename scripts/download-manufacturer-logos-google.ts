import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../lib/db'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { URL } from 'url'

// Функция для скачивания файла
function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url)
      const protocol = urlObj.protocol === 'https:' ? https : http
      const file = fs.createWriteStream(filepath)
      
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      }
      
      protocol.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close()
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
          }
          const redirectUrl = response.headers.location
          if (redirectUrl) {
            return downloadFile(redirectUrl, filepath).then(resolve).catch(reject)
          }
          reject(new Error('Redirect without location'))
          return
        }
        
        if (response.statusCode !== 200) {
          file.close()
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
          }
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }
        
        // Проверяем Content-Type
        const contentType = response.headers['content-type'] || ''
        if (!contentType.startsWith('image/')) {
          file.close()
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
          }
          reject(new Error('Not an image'))
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
    } catch (error) {
      reject(error)
    }
  })
}

// Функция для поиска логотипа через Google Images
async function findLogoUrl(companyName: string): Promise<string | null> {
  try {
    // Формируем поисковый запрос
    const searchQuery = encodeURIComponent(`${companyName} logo`)
    
    // Используем Google Custom Search API, если есть ключи
    const apiKey = process.env.GOOGLE_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID
    
    if (apiKey && searchEngineId) {
      const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${searchQuery}&searchType=image&num=1&safe=active&imgSize=medium&imgType=logo`
      
      try {
        const response = await fetch(apiUrl)
        if (response.ok) {
          const data = await response.json()
          if (data.items && data.items.length > 0) {
            const imageUrl = data.items[0].link
            console.log(`   🔗 Found via Google API: ${imageUrl}`)
            return imageUrl
          }
        }
      } catch (error) {
        // Игнорируем ошибки API
      }
    }
    
    // Альтернативный метод: парсинг Google Images через веб-скрапинг
    try {
      const googleImagesUrl = `https://www.google.com/search?q=${searchQuery}&tbm=isch&safe=active`
      
      const response = await fetch(googleImagesUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Ищем URL изображений в JSON данных Google Images
        // Google Images встраивает данные в виде JSON в HTML
        const jsonMatches = html.match(/AF_initDataCallback\([^)]+\)/g)
        if (jsonMatches) {
          for (const match of jsonMatches) {
            try {
              // Пытаемся найти URL изображения в JSON
              const urlMatches = match.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/gi)
              if (urlMatches && urlMatches.length > 0) {
                // Берем первую найденную картинку
                const imageUrl = urlMatches[0]
                // Проверяем, что это не иконка Google
                if (!imageUrl.includes('googleusercontent.com/icon') && 
                    !imageUrl.includes('gstatic.com')) {
                  console.log(`   🔗 Found via Google Images: ${imageUrl}`)
                  return imageUrl
                }
              }
            } catch (e) {
              // Продолжаем поиск
            }
          }
        }
        
        // Альтернативный метод: ищем в атрибутах data-src или src
        const srcMatches = html.match(/data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp)[^"]*)"/gi)
        if (srcMatches && srcMatches.length > 0) {
          const imageUrl = srcMatches[0].match(/https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp)/i)?.[0]
          if (imageUrl && !imageUrl.includes('googleusercontent.com/icon')) {
            console.log(`   🔗 Found via Google Images (data-src): ${imageUrl}`)
            return imageUrl
          }
        }
      }
    } catch (error) {
      // Игнорируем ошибки
    }
    
    // Если ничего не нашли, возвращаем null
    return null
  } catch (error) {
    return null
  }
}

async function main() {
  console.log('📋 Поиск и скачивание логотипов производителей через Google...\n')
  
  // Проверяем наличие Google API ключей
  const apiKey = process.env.GOOGLE_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID
  
  if (!apiKey || !searchEngineId) {
    console.log('⚠️  ВНИМАНИЕ: Google API ключи не найдены в .env файле')
    console.log('   Скрипт будет использовать альтернативный метод (DuckDuckGo)')
    console.log('   Для лучших результатов добавьте в .env:')
    console.log('   GOOGLE_API_KEY=your_api_key')
    console.log('   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id')
    console.log('   Получить ключи: https://developers.google.com/custom-search/v1/overview\n')
  }
  
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
          
          console.log(`✅ ${manufacturer.name} -> ${logoPath}\n`)
          downloaded++
          results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '✅', path: logoPath })
        } catch (error) {
          console.log(`❌ ${manufacturer.name} - ошибка скачивания: ${error}\n`)
          failed++
          results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '❌', path: undefined })
        }
      } else {
        console.log(`⚠️  ${manufacturer.name} - логотип не найден\n`)
        failed++
        results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '⚠️', path: undefined })
      }
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${manufacturer.name}:`, error)
      failed++
      results.push({ name: manufacturer.name, slug: manufacturer.slug, status: '❌', path: undefined })
    }
    
    // Задержка между запросами, чтобы не перегружать серверы
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log(`\n📊 Итого:`)
  console.log(`   Скачано: ${downloaded}`)
  console.log(`   Не найдено/Ошибки: ${failed}`)
  
  if (results.length > 0) {
    console.log(`\n📝 Результаты (первые 20):`)
    results.slice(0, 20).forEach(r => {
      console.log(`   ${r.status} ${r.name}${r.path ? ` -> ${r.path}` : ''}`)
    })
    if (results.length > 20) {
      console.log(`   ... и еще ${results.length - 20} производителей`)
    }
  }
  
  // Список производителей, для которых не удалось найти логотип
  const notFound = results.filter(r => r.status !== '✅')
  if (notFound.length > 0) {
    console.log(`\n💡 Для этих производителей (${notFound.length}) нужно найти логотип вручную:`)
    notFound.slice(0, 10).forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.name} (slug: ${m.slug})`)
    })
    if (notFound.length > 10) {
      console.log(`   ... и еще ${notFound.length - 10} производителей`)
    }
    console.log(`\n   Сохраните логотипы в public/logos/{slug}.png`)
    console.log(`   Затем запустите: npm run update:logos`)
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

