# Чеклист перед деплоем на Vercel

## 🌐 ВАЖНО: URL для проверки деплоя
**Основной домен**: https://shop.adorisgroup.com  
**Резервный URL**: https://adorisgroup.abacusai.app

Всегда проверяйте деплой по основному домену!

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ШАГИ ПЕРЕД КАЖДЫМ ДЕПЛОЕМ

### 1. Удалить yarn.lock симлинк
```bash
cd /home/ubuntu/ivdgroup_mvp/nextjs_space
rm -f yarn.lock
```

**Причина**: Vercel использует npm, а не yarn. Символическая ссылка на `/opt/hostedapp/node/root/app/yarn.lock` не существует на серверах Vercel и вызывает ошибку:
```
Error: ENOENT: no such file or directory, stat '/vercel/path0/yarn.lock'
```

### 2. Удалить скрипты импорта данных (если они есть)
```bash
cd /home/ubuntu/ivdgroup_mvp/nextjs_space/scripts
rm -f find-and-import-missing.ts update-prices.ts fast-import.ts import-missing.ts simple-import.ts
```

**Причина**: Эти скрипты содержат пути к файлам вне проекта (например, `/home/ubuntu/Uploads/IVD.csv`), которые не существуют на Vercel.

### 3. Удалить outputFileTracingRoot из next.config.js
```bash
cd /home/ubuntu/ivdgroup_mvp/nextjs_space
```

Убедиться, что в `next.config.js` **НЕТ** секции `experimental` с `outputFileTracingRoot`:

**❌ НЕПРАВИЛЬНО** (вызывает ошибку `/vercel/path0/path0/`):
```javascript
experimental: {
  outputFileTracingRoot: path.join(__dirname, '../'),
},
```

**✅ ПРАВИЛЬНО** (для Vercel деплоя):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
};
```

**Причина**: `outputFileTracingRoot` вызывает дублирование пути в Vercel:
```
Error: ENOENT: no such file or directory, lstat '/vercel/path0/path0/.next/routes-manifest.json'
```

### 4. Проверить динамические API routes
Убедиться, что все API routes, использующие `request.url` или другие динамические функции, имеют экспорт:
```typescript
export const dynamic = 'force-dynamic';
```

**Проверенные маршруты**:
- ✅ `/app/api/products/search/route.ts` - исправлено

**Причина**: Без этого Next.js пытается статически отрендерить динамические маршруты, что вызывает предупреждения:
```
Error: Dynamic server usage: Route /api/products/search couldn't be rendered statically
```

### 5. Проверить vercel.json
Убедитесь, что `vercel.json` настроен для npm:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 6. Коммит и пуш
```bash
cd /home/ubuntu/ivdgroup_mvp/nextjs_space
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 📋 Полная последовательность команд

```bash
# 1. Удалить yarn.lock
cd /home/ubuntu/ivdgroup_mvp/nextjs_space && rm -f yarn.lock

# 2. Удалить импорт-скрипты (если есть)
cd scripts && rm -f find-and-import-missing.ts update-prices.ts fast-import.ts import-missing.ts simple-import.ts && cd ..

# 3. Проверить next.config.js (удалить outputFileTracingRoot если есть)
# Убедиться что нет секции experimental с outputFileTracingRoot

# 4. Проверить динамические API routes (выполняется автоматически, если нужно)
# Убедиться что все API routes с request.url имеют export const dynamic = 'force-dynamic'

# 5. Коммит
git add .
git commit -m "Deploy: prepare for Vercel deployment"

# 6. Пуш
git push origin main
```

## ✅ После деплоя

1. Дождаться завершения билда на Vercel (2-3 минуты)
2. **Проверить сайт**: https://shop.adorisgroup.com (основной домен)
3. Резервный URL: https://adorisgroup.abacusai.app
4. Проверить основные функции:
   - Главная страница
   - Каталог продуктов
   - Фильтры и пагинация
   - Страница продукта
   - Корзина
   - Оформление заказа

## 🔄 Восстановление локальной среды после деплоя

После деплоя yarn.lock нужно восстановить для локальной разработки:
```bash
cd /home/ubuntu/ivdgroup_mvp/nextjs_space
ln -sf /opt/hostedapp/node/root/app/yarn.lock yarn.lock
```

---

## 📊 Известные ошибки и их решения

### ✅ Исправленные ошибки:

1. **yarn.lock symlink error**:
   ```
   Error: ENOENT: no such file or directory, stat '/vercel/path0/yarn.lock'
   ```
   **Решение**: Удалить `yarn.lock` перед деплоем (шаг 1)

2. **Double path error**:
   ```
   Error: ENOENT: no such file or directory, lstat '/vercel/path0/path0/.next/routes-manifest.json'
   ```
   **Решение**: Удалить `experimental.outputFileTracingRoot` из `next.config.js` (шаг 3)

3. **Dynamic server usage warning** для `/api/products/search`:
   ```
   Search error: Route /api/products/search couldn't be rendered statically
   ```
   **Решение**: Добавить `export const dynamic = 'force-dynamic'` в API route (шаг 4)

### ⚠️ Некритичные предупреждения:

1. **npm vulnerabilities** (6 vulnerabilities: 2 low, 4 moderate):
   **Статус**: ⚠️ Не критично, связано с dev-зависимостями, не влияет на работу

---

**Последнее обновление**: 11 декабря 2025  
**Основной домен**: https://shop.adorisgroup.com  
**Резервный URL**: https://adorisgroup.abacusai.app
