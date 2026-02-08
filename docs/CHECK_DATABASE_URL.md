# ⚠️ КРИТИЧНО: Проверка DATABASE_URL в Vercel

## Проблема

Ошибки `Timed out fetching a new connection from the connection pool` продолжаются, что означает, что `DATABASE_URL` в Vercel **НЕ обновлен** или обновлен **неправильно**.

## ✅ Как проверить, что DATABASE_URL правильный:

### 1. Откройте Vercel Dashboard:
- Перейдите в ваш проект
- Settings → Environment Variables
- Найдите `DATABASE_URL`

### 2. Проверьте URL:

**❌ НЕПРАВИЛЬНО (Direct connection):**
```
postgres://postgres:password@db.xxx.supabase.co:5432/postgres
```
- Порт: **5432** ❌
- Нет параметров `?pgbouncer=true&connection_limit=1` ❌

**✅ ПРАВИЛЬНО (Connection Pooler):**
```
postgres://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```
- Порт: **6543** ✅
- Есть параметры: `?pgbouncer=true&connection_limit=1` ✅

### 3. Если URL неправильный:

1. **Получите правильный URL из Supabase:**
   - Supabase Dashboard → Settings → Database → Connection String
   - **Type:** `URI`
   - **Source:** `Primary Database`
   - **Method:** `Transaction pooler` ✅
   - Скопируйте URL (порт должен быть **6543**)

2. **Добавьте параметры:**
   - В конец URL добавьте: `?pgbouncer=true&connection_limit=1`
   - Пример:
     ```
     postgres://postgres:ВАШ_ПАРОЛЬ@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
     ```

3. **Обновите в Vercel:**
   - Vercel → Settings → Environment Variables
   - Найдите `DATABASE_URL`
   - Нажмите "Edit"
   - Вставьте новый URL
   - **ВАЖНО:** Выберите все окружения (Production, Preview, Development)
   - Сохраните

4. **Перезапустите деплой:**
   - Vercel → Deployments
   - Найдите последний деплой
   - Нажмите "..." → "Redeploy"
   - Или сделайте новый коммит и пуш

### 4. Проверка после обновления:

После обновления `DATABASE_URL` и перезапуска деплоя:
- Ошибки `P2024` должны исчезнуть
- Сайт должен загружаться быстрее
- В логах Vercel не должно быть `connection pool timeout`

## ⚠️ ВАЖНО:

- **НЕ используйте** порт 5432 (Direct connection) для Vercel
- **ОБЯЗАТЕЛЬНО используйте** порт 6543 (Connection Pooler)
- **ОБЯЗАТЕЛЬНО добавьте** параметры `?pgbouncer=true&connection_limit=1`
- **ОБЯЗАТЕЛЬНО перезапустите** деплой после обновления

## Если ошибки продолжаются:

1. Убедитесь, что URL скопирован полностью (включая пароль)
2. Проверьте, что параметры добавлены правильно (без пробелов)
3. Убедитесь, что обновлены все окружения (Production, Preview, Development)
4. Проверьте логи Vercel после перезапуска

