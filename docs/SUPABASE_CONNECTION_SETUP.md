# Настройка Connection Pooling в Supabase для Vercel

## ⚠️ ВАЖНО: Выберите Connection Pooling, НЕ Direct connection!

### Правильные настройки в Supabase Dashboard:

1. **Type:** `URI` ✅ (уже правильно)

2. **Source:** Оставьте **"Primary Database"** ✅
   - Это единственная доступная опция - это нормально
   - Важно выбрать правильный Method

3. **Method:** Выберите **"Transaction pooler"** ✅
   - ✅ Это правильный выбор для Vercel serverless
   - ❌ НЕ выбирайте "Direct connection"
   - Описание: "Ideal for stateless applications like serverless functions"

### Что вы получите:

После выбора "Transaction pooler" в Method, URL будет выглядеть так:

```
postgres://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres
```

**Важно:** Обратите внимание на:
- ✅ Порт **6543** (это connection pooler)
- ✅ Хост `db.xxxxx.supabase.co` (может быть также `pooler.supabase.com`)
- ⚠️ Примечание: "Does not support PREPARE statements" - это нормально для pooler

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
   - **Source:** Оставьте "Primary Database" (это единственная опция)
   - **Method:** Выберите **"Transaction pooler"** ✅

2. Скопируйте полученный URL (порт должен быть **6543**)

3. Добавьте параметры в конец URL:
   ```
   ?pgbouncer=true&connection_limit=1
   ```

4. Итоговый URL должен быть:
   ```
   postgres://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   
   Или если используется pooler.supabase.com:
   ```
   postgres://postgres:password@pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

5. Вставьте этот URL в Vercel → Settings → Environment Variables → `DATABASE_URL`

6. Перезапустите деплой в Vercel

### Проверка:

После настройки проверьте:
- ✅ Порт в URL: **6543** (не 5432)
- ✅ Есть параметры: `?pgbouncer=true&connection_limit=1`
- ✅ Нет ошибок connection pool timeout в логах Vercel

