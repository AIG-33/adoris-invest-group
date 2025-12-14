# Миграция базы данных: Добавление поля customerEmail

## Проблема
В базе данных отсутствует поле `customerEmail` в таблице `Order`, которое требуется схемой Prisma.

## Решение

### Вариант 1: Выполнить SQL миграцию напрямую

Подключитесь к вашей базе данных PostgreSQL и выполните следующий SQL:

```sql
-- Проверьте, есть ли поле email, и переименуйте его в customerEmail
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail";
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerEmail'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Убедитесь, что customerPhone существует
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerPhone'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
    END IF;
END $$;
```

### Вариант 2: Использовать скрипт миграции

Выполните команду (требуется доступ к базе данных с переменной DATABASE_URL):

```bash
npm run migrate:order-email
```

### Вариант 3: Через Vercel

1. Перейдите в настройки проекта на Vercel
2. Откройте вкладку "Storage" или используйте Vercel CLI
3. Подключитесь к базе данных и выполните SQL из Варианта 1

## После миграции

После выполнения миграции перезапустите приложение, чтобы изменения вступили в силу.

