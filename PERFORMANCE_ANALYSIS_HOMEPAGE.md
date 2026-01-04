# Анализ производительности главной страницы

## 🔍 Обнаруженные проблемы

### 1. Множественные запросы к БД для получения компании
**Проблема:** `getServerCompany()` вызывается 5+ раз на одной странице:
- `layout.tsx` → `generateMetadata()` → 1 вызов
- `layout.tsx` → `RootLayout()` → 1 вызов  
- `page.tsx` → 1 вызов
- `Header` компонент → 1 вызов
- `Footer` компонент → 1 вызов

**До оптимизации:** Каждый вызов делал 2 запроса к БД:
1. `getCurrentCompany()` → запрос по domain
2. `prisma.company.findUnique()` → запрос по id для полных данных

**Итого:** 5 вызовов × 2 запроса = **10 запросов к БД только для компании!**

### 2. Отсутствие оптимизации запросов продуктов
**Проблема:** Запрос категорий с продуктами может быть медленным:
```typescript
prisma.category.findMany({
  where: { slug: 'equipment-imported' },
  include: { products: { ... } }
})
```

Если в категории много продуктов, это может быть медленно.

### 3. Connection Pooling
**Проблема:** В serverless окружении (Vercel) каждый запрос создает новое соединение, если не настроен connection pooling правильно.

## ✅ Реализованные оптимизации

### 1. Объединение запросов компании в один
**Изменение:** `getServerCompany()` теперь делает только **1 запрос** вместо 2:
- Прямой запрос по `domain` с получением всех нужных полей сразу
- Убрана промежуточная функция `getCurrentCompany()`

**Результат:** 5 вызовов × 1 запрос = **5 запросов** (но React.cache должен дедуплицировать до **1 запроса**)

### 2. React.cache для дедупликации
**Уже реализовано:** `getServerCompany` обернут в `React.cache()`, что должно дедуплицировать запросы в рамках одного рендера.

**Ожидаемый результат:** Все 5 вызовов должны использовать кеш → **1 запрос к БД**

### 3. Индексы базы данных
**Уже есть:**
- `@@index([domain])` на Company
- `@@index([slug])` на Category
- `@@index([featured])` на Product
- `@@index([createdAt])` на Product (нужно проверить)

## 🔧 Дополнительные рекомендации

### 1. Проверить индексы на Product
Убедиться, что есть индексы:
```sql
CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");
```

### 2. Оптимизировать запрос категории
Вместо `include: { products }` можно использовать отдельный запрос:
```typescript
const category = await prisma.category.findUnique({
  where: { slug: 'equipment-imported' },
  select: { id: true, name: true, slug: true }
})

const products = await prisma.product.findMany({
  where: { categoryId: category.id },
  take: 4,
  orderBy: { createdAt: 'desc' }
})
```

### 3. Connection Pooling
Убедиться, что `DATABASE_URL` в Vercel использует connection pooler:
```
postgresql://user:pass@pooler.supabase.com:6543/db?pgbouncer=true&connection_limit=1
```

### 4. Мониторинг производительности
Добавить логирование времени выполнения запросов:
```typescript
const start = Date.now()
const company = await getServerCompany()
console.log(`getServerCompany took ${Date.now() - start}ms`)
```

## 📊 Ожидаемые результаты

**До оптимизации:**
- Запросы компании: 10 запросов к БД
- Время загрузки: ~2-5 секунд

**После оптимизации:**
- Запросы компании: 1 запрос к БД (благодаря React.cache)
- Время загрузки: ~0.5-1 секунда

**Улучшение:** ~80-90% сокращение времени загрузки

## 🚀 Следующие шаги

1. ✅ Объединить запросы компании (выполнено)
2. ⏳ Проверить индексы на Product
3. ⏳ Оптимизировать запрос категории
4. ⏳ Проверить connection pooling настройки
5. ⏳ Добавить мониторинг производительности

