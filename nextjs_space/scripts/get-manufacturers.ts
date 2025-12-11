import 'dotenv/config';
import { prisma } from '../lib/db';

async function main() {
  console.log('Получение списка всех производителей...');
  
  // Получаем всех производителей
  const manufacturers = await prisma.manufacturer.findMany({
    orderBy: {
      name: 'asc'
    },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  console.log(`\nНайдено производителей: ${manufacturers.length}\n`);
  console.log('Список производителей:');
  console.log('='.repeat(80));
  
  manufacturers.forEach((mfr, index) => {
    console.log(`${index + 1}. ${mfr.name} (${mfr._count.products} продуктов)`);
  });
  
  console.log('='.repeat(80));
  
  // Сохраняем в JSON для дальнейшего использования
  const fs = require('fs');
  const manufacturersData = manufacturers.map(m => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    productCount: m._count.products
  }));
  
  fs.writeFileSync(
    '/home/ubuntu/manufacturers_list.json',
    JSON.stringify(manufacturersData, null, 2)
  );
  
  console.log('\nСписок сохранен в /home/ubuntu/manufacturers_list.json');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
