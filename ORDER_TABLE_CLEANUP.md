# Очистка таблицы Order от дубликатов

## Проблема
В таблице `Order` могут быть дублирующиеся поля (старые и новые версии):
- `email` и `customerEmail`
- `phone` и `customerPhone`
- Другие поля, которых нет в схеме Prisma

## Решение

### Шаг 1: Проверка текущей структуры

Выполните в Supabase SQL Editor:
```sql
-- Файл: prisma/check-order-structure.sql
```

Это покажет все существующие колонки в таблице `Order`.

### Шаг 2: Очистка и исправление структуры

Выполните в Supabase SQL Editor:
```sql
-- Файл: prisma/supabase-cleanup-order-table.sql
```

Эта миграция:
1. ✅ Создает enum `OrderStatus` (если не существует)
2. ✅ Удаляет дубликат `email`, оставляя только `customerEmail`
3. ✅ Удаляет дубликат `phone`, оставляя только `customerPhone`
4. ✅ Удаляет поля, которых нет в схеме Prisma:
   - `company`, `vatId`, `address`, `city`, `postalCode`, `country`
   - `department`, `poNumber`, `preferredDeliveryDate`, `notes`
   - `paymentMethod`, `discount`
5. ✅ Создает недостающие поля: `billingAddress`, `subtotal`, `tax`, `total`, `status`
6. ✅ Устанавливает правильные типы и ограничения

## Правильная структура таблицы Order (по Prisma schema)

| Поле | Тип | Nullable | Описание |
|------|-----|----------|---------|
| `id` | String | NO | Primary key |
| `orderNumber` | String | NO | Unique order number |
| `userId` | String | YES | Foreign key to User |
| `customerName` | String | NO | Customer full name |
| `customerEmail` | String | NO | Customer email |
| `customerPhone` | String | YES | Customer phone |
| `billingAddress` | Text | YES | Full billing address (includes all details) |
| `status` | OrderStatus | NO | Order status enum |
| `subtotal` | Decimal(10,2) | NO | Subtotal amount |
| `tax` | Decimal(10,2) | NO | Tax amount |
| `total` | Decimal(10,2) | NO | Total amount |
| `createdAt` | DateTime | NO | Creation timestamp |
| `updatedAt` | DateTime | NO | Update timestamp |

## Важно

- Все дополнительные поля (company, vatId, address, city, etc.) хранятся в `billingAddress` как текст
- Эти поля также хранятся в профиле пользователя (таблица `User`) для автозаполнения
- При создании заказа все дополнительные данные объединяются в `billingAddress`

## После миграции

После выполнения миграции структура таблицы будет соответствовать схеме Prisma, и создание заказов будет работать корректно.

