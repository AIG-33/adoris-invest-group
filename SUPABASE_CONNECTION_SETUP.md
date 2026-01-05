# Настройка Connection Pooling в Supabase для Vercel

## ⚠️ ВАЖНО: Выберите Connection Pooling, НЕ Direct connection!

### Правильные настройки в Supabase Dashboard:

1. **Type:** `URI` ✅ (уже правильно)

2. **Source:** Выберите **"Connection Pooling"** или **"Session mode"**
   - ❌ НЕ выбирайте "Primary Database"
   - ✅ Выберите "Connection Pooling" или "Session mode"

3. **Method:** Выберите **"Connection Pooling"** или **"Session mode"**
   - ❌ НЕ выбирайте "Direct connection"
   - ✅ Выберите "Connection Pooling" или "Session mode"

### Что вы получите:

После выбора Connection Pooling, URL будет выглядеть так:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Или:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres
```

### Ключевые отличия:

**Direct connection (НЕПРАВИЛЬНО для Vercel):**
- Порт: **5432**
- Для: виртуальные машины, долгоживущие контейнеры
- ❌ Не работает с serverless (Vercel)

**Connection Pooling (ПРАВИЛЬНО для Vercel):**
- Порт: **6543**
- Для: serverless функции, короткоживущие соединения
- ✅ Идеально для Vercel

### Шаги:

1. В Supabase Dashboard:
   - Измените **Source** на "Connection Pooling"
   - Измените **Method** на "Connection Pooling" или "Session mode"

2. Скопируйте полученный URL (порт должен быть **6543**)

3. Добавьте параметры в конец URL:
   ```
   ?pgbouncer=true&connection_limit=1
   ```

4. Итоговый URL должен быть:
   ```
   postgresql://postgres.xxxxx:password@pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

5. Вставьте этот URL в Vercel → Settings → Environment Variables → `DATABASE_URL`

6. Перезапустите деплой в Vercel

### Проверка:

После настройки проверьте:
- ✅ Порт в URL: **6543** (не 5432)
- ✅ Есть параметры: `?pgbouncer=true&connection_limit=1`
- ✅ Нет ошибок connection pool timeout в логах Vercel

