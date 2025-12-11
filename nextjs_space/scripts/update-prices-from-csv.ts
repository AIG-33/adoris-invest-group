import 'dotenv/config';
import { prisma } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

// Парсинг цены из формата "€0,70" или "€1 234,56"
function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === '') return 0;
  
  // Удаляем символ евро и пробелы
  let cleaned = priceStr.replace(/€/g, '').replace(/\s/g, '');
  
  // Заменяем запятую на точку для десятичного разделителя
  cleaned = cleaned.replace(',', '.');
  
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

// Парсинг CSV строки с учетом кавычек
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

async function updatePricesFromCSV() {
  console.log('🔄 Начинаем обновление цен из файла IVD.csv...');
  console.log('=' .repeat(80));
  
  const csvPath = '/home/ubuntu/Uploads/IVD.csv';
  
  // Проверяем существование файла
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Файл не найден:', csvPath);
    return;
  }
  
  // Читаем файл
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');
  
  console.log(`📁 Всего строк в файле: ${lines.length}`);
  console.log(`📦 Продуктов для обработки: ${lines.length - 1}`);
  console.log('=' .repeat(80));
  
  // Сначала собираем все данные из CSV
  const priceMap = new Map<string, number>();
  let skippedCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      skippedCount++;
      continue;
    }
    
    try {
      const columns = parseCSVLine(line);
      
      if (columns.length < 5) {
        skippedCount++;
        continue;
      }
      
      const [manufacturer, sku, product, description, priceStr] = columns;
      
      if (!sku || sku.trim() === '') {
        skippedCount++;
        continue;
      }
      
      const price = parsePrice(priceStr);
      priceMap.set(sku.trim(), price);
      
    } catch (error) {
      console.error(`❌ Ошибка в строке ${i}:`, error);
      skippedCount++;
    }
  }
  
  console.log(`📊 Обработано SKU из CSV: ${priceMap.size}`);
  console.log(`⚠️  Пропущено строк: ${skippedCount}`);
  console.log('=' .repeat(80));
  console.log('🔍 Получаем все продукты из БД...');
  
  // Получаем все продукты из БД
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      price: true
    }
  });
  
  console.log(`📦 Всего продуктов в БД: ${allProducts.length}`);
  console.log('=' .repeat(80));
  console.log('🔄 Формируем SQL для массового обновления...');
  
  let updatedCount = 0;
  let notFoundCount = 0;
  let unchangedCount = 0;
  
  // Собираем продукты для обновления
  const updates: Array<{ id: string; sku: string; oldPrice: number; newPrice: number }> = [];
  
  for (const product of allProducts) {
    const newPrice = priceMap.get(product.sku);
    
    if (newPrice !== undefined) {
      if (newPrice !== product.price) {
        updates.push({
          id: product.id,
          sku: product.sku,
          oldPrice: product.price,
          newPrice: newPrice
        });
      } else {
        unchangedCount++;
      }
    }
  }
  
  console.log(`📊 Найдено для обновления: ${updates.length} продуктов`);
  console.log(`✓ Цены не изменились: ${unchangedCount} продуктов`);
  console.log('=' .repeat(80));
  
  if (updates.length > 0) {
    console.log('💾 Выполняем массовое обновление через SQL...');
    
    // Обновляем пакетами по 500 через SQL
    const BATCH_SIZE = 500;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      
      // Формируем CASE WHEN для массового обновления
      const cases = batch.map(u => `WHEN '${u.id}' THEN ${u.newPrice}`).join(' ');
      const ids = batch.map(u => `'${u.id}'`).join(', ');
      
      const sql = `
        UPDATE "Product"
        SET price = CASE id
          ${cases}
        END
        WHERE id IN (${ids})
      `;
      
      try {
        await prisma.$executeRawUnsafe(sql);
        updatedCount += batch.length;
        console.log(`✅ Обновлено: ${updatedCount} / ${updates.length} продуктов...`);
      } catch (error) {
        console.error(`❌ Ошибка обновления батча:`, error);
      }
    }
  }
  
  // Подсчитываем сколько SKU из CSV не найдено в БД
  for (const sku of priceMap.keys()) {
    const found = allProducts.some(p => p.sku === sku);
    if (!found) {
      notFoundCount++;
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 РЕЗУЛЬТАТЫ ОБНОВЛЕНИЯ ЦЕН:');
  console.log('=' .repeat(80));
  console.log(`✅ Обновлено цен: ${updatedCount}`);
  console.log(`❌ SKU не найдено в БД: ${notFoundCount}`);
  console.log(`⚠️  Пропущено строк CSV: ${skippedCount}`);
  console.log('=' .repeat(80));
  
  // Проверяем статистику БД после обновления
  const totalProducts = await prisma.product.count();
  const productsWithPrice = await prisma.product.count({
    where: {
      price: { gt: 0 }
    }
  });
  
  console.log('\n📈 СТАТИСТИКА БАЗЫ ДАННЫХ:');
  console.log('=' .repeat(80));
  console.log(`📦 Всего продуктов: ${totalProducts.toLocaleString()}`);
  console.log(`💰 Продуктов с ценой > 0: ${productsWithPrice.toLocaleString()}`);
  console.log('=' .repeat(80));
}

updatePricesFromCSV()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
