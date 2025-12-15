import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../lib/db'

async function main() {
  const userId = 'cmizo7v100001ycnc92wxeix7'
  
  console.log(`🔍 Проверка пользователя: ${userId}\n`)
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })
  
  if (!user) {
    console.log('❌ Пользователь не найден')
    return
  }
  
  console.log('📋 Данные пользователя:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Name: ${user.name || 'N/A'}`)
  console.log(`   Email: ${user.email || 'N/A'}`)
  console.log(`   Role: ${user.role || 'N/A'}`)
  console.log(`\n${user.role === 'admin' ? '✅' : '❌'} Роль: ${user.role}`)
  
  if (user.role !== 'admin') {
    console.log('\n💡 Для установки роли admin выполните:')
    console.log(`   UPDATE "User" SET role = 'admin' WHERE id = '${userId}';`)
    console.log('\n   Или запустите скрипт обновления роли')
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

