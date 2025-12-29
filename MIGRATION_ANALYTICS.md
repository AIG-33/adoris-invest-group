# Миграция: Добавление полей аналитики в таблицу Company

Эта миграция добавляет поддержку Google Analytics и Яндекс.Метрики для каждого домена.

## Шаги миграции

### 1. Выполнить SQL миграцию в Supabase

Откройте Supabase SQL Editor и выполните SQL из файла:
```
prisma/migrations/add_analytics_to_company.sql
```

Или выполните вручную:

```sql
-- Add googleAnalyticsId column (nullable)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT;

-- Add yandexMetrikaId column (nullable)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "yandexMetrikaId" TEXT;
```

### 2. Обновить Prisma Client

После выполнения миграции, обновите Prisma Client:

```bash
npx prisma generate
```

## Использование

### В админ-панели

1. Перейдите в админ-панель → Companies
2. Откройте компанию для редактирования
3. В разделе "Analytics" введите:
   - **Google Analytics ID**: Measurement ID (например, `G-XXXXXXXXXX`)
   - **Яндекс.Метрика ID**: Counter ID (например, `12345678`)

### Формат ID

- **Google Analytics**: Формат `G-XXXXXXXXXX` (например, `G-ABC123XYZ`)
- **Яндекс.Метрика**: Числовой ID счетчика (например, `12345678`)

## Как получить ID

### Google Analytics 4

1. Перейдите в [Google Analytics](https://analytics.google.com/)
2. Выберите свой аккаунт и свойство
3. Перейдите в **Admin** → **Data Streams**
4. Выберите ваш веб-поток
5. Скопируйте **Measurement ID** (формат: `G-XXXXXXXXXX`)

### Яндекс.Метрика

1. Перейдите в [Яндекс.Метрика](https://metrika.yandex.ru/)
2. Выберите ваш счетчик
3. Перейдите в **Настройки** → **Информация о счетчике**
4. Скопируйте **Номер счетчика** (число, например, `12345678`)

## Проверка работы

После добавления ID:

1. Откройте сайт компании в браузере
2. Откройте DevTools (F12) → Network
3. Проверьте загрузку скриптов:
   - Google Analytics: `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
   - Яндекс.Метрика: `https://mc.yandex.ru/metrika/tag.js`

4. В Google Analytics: **Realtime** → должны появиться активные пользователи
5. В Яндекс.Метрике: **Мониторинг** → должны появиться визиты

## Примечания

- Поля опциональные - если не заполнены, аналитика не будет загружаться
- Каждая компания может иметь свой набор аналитики
- Скрипты загружаются асинхронно и не блокируют рендеринг страницы
- Используется стратегия `afterInteractive` для оптимизации производительности

