# ⚠️ СРОЧНО: Исправление Connection Pool Timeout

## Проблема

```
Timed out fetching a new connection from the connection pool
Current connection pool timeout: 10, connection limit: 1
```

Это происходит потому что:
1. **Параллельные запросы** (`Promise.all`) пытаются использовать несколько соединений одновременно
2. **Connection pooler** с `connection_limit=1` может обработать только **1 запрос за раз**
3. Остальные запросы ждут и таймаутят через 10 секунд

## ✅ Временное решение (уже применено)

Добавлена retry логика для автоматических повторов при ошибках connection pool. Это поможет, но **не решает проблему полностью**.

## 🔧 ПОСТОЯННОЕ РЕШЕНИЕ: Настроить Connection Pooler URL

### Шаг 1: Получить Connection Pooler URL из Supabase

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите секцию **Connection Pooling**
5. Скопируйте **Connection string** с портом **6543** (НЕ 5432!)

### Шаг 2: Обновить DATABASE_URL в Vercel

1. Откройте [Vercel Dashboard](https://vercel.com)
2. Выберите проект `adoris-invest-group`
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите переменную `DATABASE_URL`
5. **Замените** значение на connection pooler URL

### Шаг 3: Правильный формат URL

URL должен выглядеть так:

```
postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Или:

```
postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Критически важно:

- ✅ **Порт 6543** (connection pooler), НЕ 5432 (прямое подключение)
- ✅ **`?pgbouncer=true`** - указывает использование PgBouncer
- ✅ **`&connection_limit=1`** - требуется для transaction mode

### Шаг 4: Перезапустить деплой

После обновления `DATABASE_URL`:
1. Vercel автоматически перезапустит деплой
2. Или вручную: **Deployments** → **Redeploy**

## 🔍 Проверка

После обновления проверьте:

1. **Логи Vercel:**
   - Не должно быть ошибок `Timed out fetching a new connection`
   - Запросы должны выполняться успешно

2. **Производительность:**
   - Страница `/products` должна загружаться < 5 секунд
   - Главная страница должна загружаться < 3 секунд

3. **Supabase Dashboard:**
   - **Database** → **Connection Pooling**
   - Проверьте активные соединения
   - Не должно быть большого количества ожидающих соединений

## 📊 Ожидаемые результаты

**До исправления:**
- Connection pool timeout ошибки
- Задержки 10+ секунд
- Запросы падают с ошибкой P2024

**После исправления:**
- Нет ошибок connection pool
- Запросы выполняются успешно
- Параллельные запросы работают корректно

## ⚠️ Если проблема сохраняется

Если после настройки connection pooler проблема остается:

1. **Проверьте формат URL:**
   ```bash
   # Должен содержать:
   # - Порт 6543
   # - ?pgbouncer=true
   # - &connection_limit=1
   ```

2. **Попробуйте другой pooler URL:**
   - Если используете `db.xxx.supabase.co:6543`, попробуйте `pooler.supabase.com:6543`
   - Или наоборот

3. **Увеличьте connection_limit (не рекомендуется):**
   ```
   ?pgbouncer=true&connection_limit=5
   ```
   Но это может вызвать другие проблемы.

4. **Альтернативные решения:**
   - Использовать Prisma Data Proxy
   - Перейти на Neon Serverless (лучший connection pooling)
   - Использовать Railway (встроенный pooling)

## 📝 Дополнительная информация

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Vercel + Prisma Best Practices](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)

