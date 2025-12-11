import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.count()
  const manufacturers = await prisma.manufacturer.count()
  const products = await prisma.product.count()
  
  console.log('📊 Текущее состояние базы данных:')
  console.log(`   Категории: ${categories}`)
  console.log(`   Производители: ${manufacturers}`)
  console.log(`   Товары: ${products}`)
  
  if (categories > 0) {
    console.log('\n📁 Первые 5 категорий:')
    const cats = await prisma.category.findMany({ take: 5 })
    cats.forEach(c => console.log(`   - ${c.name} (${c.slug})`))
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error)
