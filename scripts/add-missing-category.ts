import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('➕ Добавляю недостающую категорию...')
  
  await prisma.category.upsert({
    where: { id: 'cat_equipment' },
    create: {
      id: 'cat_equipment',
      name: 'Equipment (Imported)',
      slug: 'equipment-imported',
    },
    update: {},
  })
  
  console.log('✅ Категория cat_equipment добавлена!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error)
