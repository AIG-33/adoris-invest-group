# Инструкция по выполнению миграции для мультитенантной архитектуры

## Шаг 1: Выполнить SQL миграцию в Supabase

1. Откройте Supabase Dashboard: https://app.supabase.com
2. Перейдите в SQL Editor
3. Скопируйте содержимое файла `prisma/migrate-to-multitenant.sql`
4. Вставьте в SQL Editor
5. Нажмите "Run" для выполнения

Миграция выполнит:
- ✅ Создание таблицы `Company`
- ✅ Добавление полей `priceEU` и `priceRU` в `Product`
- ✅ Миграцию существующих цен из `price` в `priceEU`
- ✅ Добавление `companyId` в `Product` и `Order`
- ✅ Создание дефолтной компании "Adoris Invest Group OU"
- ✅ Добавление foreign key constraints

## Шаг 2: Запустить seed компаний

После успешной миграции выполните:

```bash
npm run seed:companies
```

Это создаст все 6 компаний:
- Adoris Invest Group OU (adorisgroup.com)
- Samplify (samplify.com)
- IVD Group (ivdgroup.eu)
- Viena (viena.com)
- ivd.by (ivd.by)
- MedStock (medstock.com)

## Шаг 3: Обновить Prisma Client

```bash
npx prisma generate
```

## Шаг 4: Проверить миграцию

Проверьте, что:
1. Таблица `Company` создана
2. В таблице `Product` есть поля `priceEU` и `priceRU`
3. Все существующие продукты имеют `priceEU` (мигрировано из `price`)
4. В таблице `Company` есть 6 компаний

## Важно!

⚠️ После миграции старое поле `price` в таблице `Product` можно будет удалить, но это нужно сделать вручную после проверки, что все работает корректно.

## Откат миграции (если нужно)

Если нужно откатить миграцию:

```sql
-- Удалить foreign keys
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_companyId_fkey";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_companyId_fkey";

-- Удалить колонки
ALTER TABLE "Product" DROP COLUMN IF EXISTS "companyId";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "priceEU";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "priceRU";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "companyId";

-- Удалить таблицу Company
DROP TABLE IF EXISTS "Company";
```

