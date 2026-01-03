# Настройка DATABASE_URL для Vercel

## ⚠️ КРИТИЧНО: Используйте Connection Pooler URL

Для Vercel serverless окружения **ОБЯЗАТЕЛЬНО** использовать connection pooler URL от Supabase.

## Как получить правильный URL

### Вариант 1: Через Supabase Dashboard (рекомендуется)

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите секцию **Connection Pooling**
5. Скопируйте **Connection string** (порт должен быть **6543**, не 5432!)
6. Добавьте параметры: `?pgbouncer=true&connection_limit=1`

### Вариант 2: Вручную изменить существующий URL

Если у вас есть прямой URL:
```
postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres
```

Замените на pooler URL:
```
postgresql://postgres.xxx:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

Или используйте pooler.supabase.com:
```
postgresql://postgres.xxx:password@pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## Настройка в Vercel

1. Откройте [Vercel Dashboard](https://vercel.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите `DATABASE_URL`
5. **Обновите значение** на connection pooler URL (порт 6543)
6. Убедитесь, что переменная добавлена для всех окружений (Production, Preview, Development)
7. **Перезапустите деплой** или подождите автоматического деплоя

## Проверка правильности URL

Правильный URL должен содержать:
- ✅ Порт **6543** (не 5432!)
- ✅ Параметр `?pgbouncer=true`
- ✅ Параметр `&connection_limit=1`

Пример правильного URL:
```
postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## После обновления

1. Дождитесь завершения деплоя на Vercel
2. Проверьте логи - ошибка `P2024` должна исчезнуть
3. Проверьте производительность - должно быть быстрее

## Если проблема сохраняется

1. Проверьте, что URL действительно обновился в Vercel
2. Убедитесь, что используете порт 6543 (не 5432)
3. Проверьте, что параметры `pgbouncer=true&connection_limit=1` присутствуют
4. Попробуйте использовать pooler.supabase.com вместо db.xxx.supabase.co

## Альтернативы

Если Supabase pooler не работает:

1. **Prisma Data Proxy** - https://www.prisma.io/docs/data-platform/data-proxy
2. **Neon Serverless** - встроенный connection pooling
3. **Railway** - лучше для serverless

