import 'dotenv/config';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.count()
  const manufacturers = await prisma.manufacturer.count()
  const products = await prisma.product.count()
  
  const manufacturersWithLogo = await prisma.manufacturer.count({
    where: {
      logo: {
        not: ''
      }
    }
  })
  
  const productsWithPrice = await prisma.product.count({
    where: {
      price: {
        gt: 0
      }
    }
  })
  
  console.log('\nСтатистика базы данных:')
  console.log('========================')
  console.log(`Категорий: ${categories}`)
  console.log(`Производителей: ${manufacturers}`)
  console.log(`Производителей с логотипами: ${manufacturersWithLogo}`)
  console.log(`Продуктов: ${products}`)
  console.log(`Продуктов с ценами: ${productsWithPrice}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
