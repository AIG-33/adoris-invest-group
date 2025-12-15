import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../lib/db'

async function main() {
  console.log('📋 Получение списка всех производителей...\n')
  
  const manufacturers = await prisma.manufacturer.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },
  })

  console.log(`Всего производителей: ${manufacturers.length}\n`)
  console.log('Список производителей:\n')
  
  manufacturers.forEach((m, index) => {
    const hasLogo = m.logo && m.logo.length > 0
    const logoStatus = hasLogo ? '✅' : '❌'
    console.log(`${index + 1}. ${logoStatus} ${m.name}`)
    console.log(`   Slug: ${m.slug}`)
    if (hasLogo) {
      console.log(`   Logo: ${m.logo}`)
    } else {
      console.log(`   Logo: отсутствует`)
    }
    console.log('')
  })

  const withLogos = manufacturers.filter(m => m.logo && m.logo.length > 0).length
  const withoutLogos = manufacturers.length - withLogos

  console.log('\n📊 Статистика:')
  console.log(`   С логотипами: ${withLogos}`)
  console.log(`   Без логотипов: ${withoutLogos}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

