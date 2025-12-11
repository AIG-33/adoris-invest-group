import 'dotenv/config';
import { prisma } from '../lib/db';

async function main() {
  console.log('Очистка всех изображений продуктов...');
  
  const result = await prisma.product.updateMany({
    data: {
      image: ''
    }
  });
  
  console.log(`\nОчищено изображений у ${result.count} продуктов`);
  
  // Проверка
  const count = await prisma.product.count({
    where: {
      image: {
        not: ''
      }
    }
  });
  
  console.log(`Продуктов с непустым изображением: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
