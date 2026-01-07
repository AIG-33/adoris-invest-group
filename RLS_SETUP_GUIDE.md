# Row Level Security (RLS) Setup Guide

## Обзор

Этот файл содержит SQL миграцию для включения Row Level Security (RLS) на всех таблицах базы данных.

## Структура доступа

### 1. Публичные каталоги (Read-only для anon, Write для authenticated)
- **Company** - информация о компаниях
- **Category** - категории продуктов
- **Manufacturer** - производители
- **Product** - продукты

**Политики:**
- `anon` (неавторизованные пользователи): только чтение (SELECT)
- `authenticated` (авторизованные пользователи): полный доступ (SELECT, INSERT, UPDATE, DELETE)

### 2. Пользовательские данные (Owner-based access)
- **Account** - аккаунты пользователей
- **Session** - сессии пользователей
- **User** - профили пользователей
- **Order** - заказы
- **OrderItem** - элементы заказов

**Политики:**
- Пользователи могут читать и изменять только свои собственные данные
- Доступ основан на `auth.uid()` (ID пользователя из Supabase Auth)

### 3. Служебные таблицы (Service-only)
- **VerificationToken** - токены верификации (только для service_role)

## Как применить миграцию

### Шаг 1: Откройте Supabase SQL Editor
1. Перейдите в [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Нажмите **"New query"**

### Шаг 2: Выполните миграцию
1. Откройте файл `prisma/migrations/enable_rls_all_tables.sql`
2. Скопируйте весь SQL код
3. Вставьте в SQL Editor
4. Нажмите **"Run"** или `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Шаг 3: Проверка
После выполнения миграции, внизу вы увидите результат запроса `VERIFICATION`, который покажет статус RLS для всех таблиц.

Все таблицы должны иметь `rls_enabled = true`.

## Важные замечания

### 1. Prisma и RLS
- Prisma использует `service_role` для подключения к базе данных
- RLS политики **НЕ применяются** к `service_role`
- Это означает, что ваше приложение Next.js будет работать нормально, так как использует Prisma с `service_role`

### 2. Прямой доступ через Supabase API
Если вы используете Supabase Client напрямую (не через Prisma):
- Неавторизованные пользователи смогут только читать публичные каталоги
- Авторизованные пользователи смогут читать/писать публичные каталоги и свои собственные данные

### 3. Административный доступ
- Административный доступ (чтение всех заказов, управление пользователями) должен обрабатываться на уровне приложения
- Проверяйте роль пользователя (`role = 'admin'`) в коде приложения
- RLS политики не различают роли, только `anon` и `authenticated`

### 4. Гостевые заказы
- Заказы без `userId` (гостевые заказы) обрабатываются на уровне приложения
- RLS политики для `Order` и `OrderItem` учитывают случаи, когда `userId` может быть `NULL`

## Откат миграции (если нужно)

Если нужно отключить RLS на всех таблицах:

```sql
ALTER TABLE public."Account" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Company" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Manufacturer" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItem" DISABLE ROW LEVEL SECURITY;
```

**⚠️ ВНИМАНИЕ:** Откат отключит все политики безопасности. Используйте только в случае крайней необходимости.

## Проверка после миграции

Выполните этот запрос, чтобы проверить статус RLS:

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'Account', 'Session', 'User', 'VerificationToken',
    'Company', 'Category', 'Manufacturer', 'Product',
    'Order', 'OrderItem'
)
ORDER BY tablename;
```

Все таблицы должны показывать `rls_enabled = true`.

## Поддержка

Если возникли проблемы:
1. Проверьте логи выполнения SQL в Supabase
2. Убедитесь, что у вас есть права на выполнение ALTER TABLE
3. Проверьте, что все таблицы существуют в базе данных

