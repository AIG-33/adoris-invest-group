# Исправление проблемы Connection Pooling для Vercel

## Проблема

```
Timed out fetching a new connection from the connection pool
Current connection pool timeout: 10, connection limit: 1
```

Это происходит потому, что:
1. В serverless окружении (Vercel) каждое function может создавать новое соединение
2. Прямое подключение к PostgreSQL имеет ограниченное количество соединений
3. Нужно использовать **connection pooler** (PgBouncer)

## Решение

### Для Supabase

Supabase предоставляет два типа подключений:

1. **Прямое подключение** (для миграций):
   ```
   postgres://user:password@db.xxx.supabase.co:5432/postgres
   ```

2. **Connection Pooler** (для приложений):
   ```
   postgres://user:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true
   ```
   Или через pooler URL:
   ```
   postgres://user:password@pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Шаги исправления

1. **В Supabase Dashboard:**
   - Settings → Database
   - Найдите **Connection Pooling** секцию
   - Скопируйте **Connection string** с портом **6543** (не 5432!)
   - Убедитесь, что в URL есть `?pgbouncer=true`

2. **В Vercel Environment Variables:**
   - Откройте Vercel Dashboard → Your Project → Settings → Environment Variables
   - Найдите `DATABASE_URL`
   - Замените на connection pooler URL (порт 6543)
   - Добавьте параметры: `?pgbouncer=true&connection_limit=1`

3. **Правильный формат DATABASE_URL:**
   ```
   postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

   Или для прямого pooler:
   ```
   postgresql://postgres.xxx:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
   ```

### Важные параметры

- **`pgbouncer=true`** - указывает, что используется PgBouncer
- **`connection_limit=1`** - требуется для transaction mode PgBouncer
- **Порт 6543** - порт connection pooler (не 5432!)

### Проверка

После обновления DATABASE_URL в Vercel:
1. Перезапустите деплой (или подождите автоматического деплоя)
2. Проверьте логи - ошибка connection pool должна исчезнуть
3. Проверьте производительность - должно быть быстрее

## Альтернативные решения

### Если Supabase pooler не работает:

1. **Использовать Prisma Data Proxy:**
   - https://www.prisma.io/docs/data-platform/data-proxy
   - Создать аккаунт в Prisma Data Platform
   - Использовать Data Proxy URL вместо прямого DATABASE_URL

2. **Использовать Neon Serverless:**
   - Neon имеет встроенный connection pooling
   - Автоматически работает с serverless

3. **Использовать Railway:**
   - Railway лучше работает с serverless
   - Имеет встроенный connection pooling

## Дополнительная оптимизация

После исправления connection pooling, можно добавить:

```typescript
// lib/db.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Для serverless важно не создавать много соединений
})
```

## Мониторинг

После исправления проверьте:
- Логи Vercel - не должно быть ошибок connection pool
- Supabase Dashboard → Database → Connection Pooling - проверьте активные соединения
- Производительность - должно быть быстрее

## Ссылки

- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Vercel + Prisma Best Practices](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)

