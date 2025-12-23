# Миграция: Добавление поля showPrices в таблицу Company

## Проблема
Ошибка "FATAL: bouncer config error" возникает потому, что Prisma migrate пытается использовать connection pooling URL (PgBouncer), который не поддерживает некоторые операции миграции.

## Решение: Ручная SQL миграция

### Шаг 1: Выполнить SQL миграцию в Supabase

**Если получаете ошибку "signal timed out":**

Используйте упрощенную версию миграции из файла `prisma/migrations/add_show_prices_to_company_simple.sql`

1. Откройте Supabase Dashboard: https://app.supabase.com
2. Перейдите в SQL Editor
3. Скопируйте содержимое файла `prisma/migrations/add_show_prices_to_company_simple.sql`
4. Вставьте в SQL Editor
5. Нажмите "Run" для выполнения

**Или пошагово (если все еще таймаут):**

Выполните команды по одной:

```sql
-- Команда 1: Добавить колонку (быстро)
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "showPrices" BOOLEAN;

-- Команда 2: Обновить существующие записи (может занять время)
UPDATE "Company" SET "showPrices" = true WHERE "showPrices" IS NULL;
```

Миграция добавит:
- ✅ Поле `showPrices` типа BOOLEAN в таблицу `Company`
- ✅ Значение по умолчанию: `true` (цены отображаются)
- ✅ Все существующие компании получат `showPrices = true`

### Шаг 2: Обновить Prisma Client

После успешной миграции выполните:

```bash
npx prisma generate
```

Это обновит Prisma Client с новым полем.

### Шаг 3: Проверить миграцию

Проверьте, что:
1. В таблице `Company` есть поле `showPrices`
2. Все существующие компании имеют `showPrices = true`
3. Приложение работает корректно

## Альтернативный способ (если есть прямой URL)

Если у вас есть прямой URL к базе данных (без pooling), вы можете использовать его для миграции:

1. Создайте временный файл `.env.migrate` с прямым URL:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

2. Выполните миграцию:
   ```bash
   DATABASE_URL="your-direct-url" npx prisma migrate dev --name add_show_prices_to_company
   ```

## Использование

После миграции:
- В админке → Companies → Edit Company можно включить/выключить отображение цен
- Если `showPrices = false` или цена продукта = 0, будет отображаться "Price on Request"
- Во вкладке Products есть кнопка для массового установления "Price on Request"

