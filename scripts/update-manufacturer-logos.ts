import 'dotenv/config';
import { prisma } from '../lib/db';

// Маппинг имен производителей к файлам логотипов
const logoMapping: Record<string, string> = {
  'Ab Sciex': '/logos/ab-sciex.png',
  'Abbott': '/logos/abbott.png',
  'BioLegend': '/logos/biolegend.png',
  'DRG': '/logos/drg.png',
  'Ethicon': '/logos/ethicon.png',
  'Illumina': '/logos/illumina.png',
  'Jena': '/logos/jena.png',
  'NEB': '/logos/neb.png',
  'Ortho': '/logos/ortho.png',
  'Phadia': '/logos/phadia.png',
  'Roche': '/logos/roche.png',
  'Siemens Allergy': '/logos/siemens-allergy.png',
  'Siemens': '/logos/siemens.png',
  'Sigma-Aldrich': '/logos/sigma-aldrich.png',
  'Thermo': '/logos/thermo-fisher.png',
};

async function main() {
  console.log('Обновление логотипов производителей...');
  
  let updated = 0;
  let notFound = 0;
  
  for (const [name, logoPath] of Object.entries(logoMapping)) {
    try {
      // Ищем производителя по имени
      const manufacturer = await prisma.manufacturer.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive'
          }
        }
      });
      
      if (manufacturer) {
        // Обновляем логотип
        await prisma.manufacturer.update({
          where: { id: manufacturer.id },
          data: { logo: logoPath }
        });
        console.log(`✅ ${name} -> ${logoPath}`);
        updated++;
      } else {
        console.log(`❌ ${name} - не найден в базе`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Ошибка при обновлении ${name}:`, error);
    }
  }
  
  console.log(`\nИтого:`);
  console.log(`  Обновлено: ${updated}`);
  console.log(`  Не найдено: ${notFound}`);
  
  // Проверка - сколько производителей с логотипами
  const withLogos = await prisma.manufacturer.count({
    where: {
      logo: {
        not: ''
      }
    }
  });
  
  console.log(`\nПроизводителей с логотипами: ${withLogos}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
