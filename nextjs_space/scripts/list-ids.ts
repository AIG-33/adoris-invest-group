import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const mfrs = await prisma.manufacturer.findMany({ orderBy: { name: 'asc' } })
  
  console.log('📁 КАТЕГОРИИ В БАЗЕ (' + cats.length + '):')
  cats.forEach(c => console.log(`   ${c.id} → ${c.name}`))
  
  console.log('\n🏭 ПРОИЗВОДИТЕЛИ В БАЗЕ (' + mfrs.length + '):')
  mfrs.forEach(m => console.log(`   ${m.id} → ${m.name}`))
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error)
