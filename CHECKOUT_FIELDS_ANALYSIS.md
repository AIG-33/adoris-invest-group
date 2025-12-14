# Анализ полей со страницы Checkout

## Поля, собираемые в checkout-form.tsx

### Личная информация
- `firstName` (String) - Имя
- `lastName` (String) - Фамилия
- `email` (String) - Email
- `phone` (String) - Телефон

### Информация о компании
- `company` (String) - Название компании
- `vatId` (String) - VAT ID
- `department` (String) - Отдел

### Адрес доставки
- `address` (String) - Улица и номер
- `city` (String) - Город
- `postalCode` (String) - Почтовый индекс
- `country` (String) - Страна (по умолчанию "Poland")

### Детали заказа
- `poNumber` (String) - Purchase Order Number
- `preferredDeliveryDate` (String/Date) - Предпочтительная дата доставки
- `notes` (String) - Заметки к заказу

### Оплата
- `paymentMethod` (String) - Способ оплаты (по умолчанию "bank_transfer")

### Вычисляемые поля
- `subtotal` (Number) - Подытог (сумма всех товаров)
- `discount` (Number) - Скидка (5% для заказов €50K+, 10% для €100K+)
- `vat` (Number) - НДС (23% от subtotal после скидки)
- `total` (Number) - Итоговая сумма (subtotal - discount + vat)

### Дополнительные поля
- `items` (Array) - Массив товаров из корзины
- `userId` (String | null) - ID пользователя (если авторизован)

---

## Что отправляется в API (/api/orders)

Все поля из `formData` отправляются в API через POST запрос:

```javascript
const orderData = {
  ...formData,  // Все поля формы
  items: cart,  // Товары из корзины
  subtotal,     // Вычисленный подытог
  discount,     // Вычисленная скидка
  vat,          // Вычисленный НДС
  total,        // Итоговая сумма
  userId: session?.user ? (session.user as any).id : null
}
```

---

## Как API обрабатывает поля и сохраняет в базу данных

### Прямое сохранение в Order:

| Поле формы | Поле в Order | Преобразование |
|------------|--------------|----------------|
| `firstName + lastName` | `customerName` | Объединяется: `${firstName} ${lastName}` |
| `email` | `customerEmail` | Прямое копирование |
| `phone` | `customerPhone` | Прямое копирование (null если пусто) |
| `subtotal` | `subtotal` | Прямое копирование (Decimal) |
| `vat` | `tax` | Переименование: `vat` → `tax` |
| `total` | `total` | Прямое копирование (Decimal) |
| - | `status` | Всегда `'pending'` |
| - | `orderNumber` | Генерируется: `ORD-{timestamp}-{random}` |
| - | `userId` | Из сессии или null |

### Объединение в billingAddress:

Все остальные поля объединяются в одно поле `billingAddress` (TEXT):

```
address, city, postalCode, country, Company: {company}, VAT ID: {vatId}, Department: {department}, PO Number: {poNumber}, Preferred Delivery: {preferredDeliveryDate}, Notes: {notes}, Payment Method: {paymentMethod}
```

**Поля, которые попадают в billingAddress:**
- `address`
- `city`
- `postalCode`
- `country`
- `company` (с префиксом "Company: ")
- `vatId` (с префиксом "VAT ID: ")
- `department` (с префиксом "Department: ")
- `poNumber` (с префиксом "PO Number: ")
- `preferredDeliveryDate` (с префиксом "Preferred Delivery: ")
- `notes` (с префиксом "Notes: ")
- `paymentMethod` (с префиксом "Payment Method: ")

### Сохранение в OrderItem:

| Поле из items | Поле в OrderItem | Преобразование |
|---------------|------------------|----------------|
| `item.id` | `productId` | ID товара |
| `item.quantity` | `quantity` | Количество |
| `item.price` | `price` | Цена (Decimal) |

---

## Итоговая структура в базе данных

### Таблица Order:
- `id` - генерируется автоматически
- `orderNumber` - генерируется
- `userId` - из сессии или null
- `customerName` - из firstName + lastName
- `customerEmail` - из email
- `customerPhone` - из phone (может быть null)
- `billingAddress` - объединение всех остальных полей
- `status` - всегда 'pending'
- `subtotal` - вычисленное значение
- `tax` - из vat
- `total` - вычисленное значение
- `createdAt` - автоматически
- `updatedAt` - автоматически

### Таблица OrderItem (связанные записи):
- `id` - генерируется автоматически
- `orderId` - связь с Order
- `productId` - из items[].id
- `quantity` - из items[].quantity
- `price` - из items[].price

---

## Проблемы и рекомендации

### ✅ Что работает правильно:
1. Все поля формы собираются корректно
2. Вычисляемые поля (subtotal, discount, vat, total) рассчитываются правильно
3. Данные преобразуются в правильные поля Order
4. Дополнительные поля объединяются в billingAddress

### ⚠️ Потенциальные проблемы:
1. `discount` отправляется в API, но не сохраняется в Order (только используется для расчета)
2. Все дополнительные поля теряют структуру при объединении в billingAddress (трудно парсить обратно)
3. Нет валидации обязательных полей на стороне API

### 💡 Рекомендации:
1. Если нужно сохранять discount отдельно, добавить поле в схему Order
2. Если нужен доступ к отдельным полям (company, vatId и т.д.), рассмотреть сохранение их отдельно или в JSON формате
3. Добавить валидацию на стороне API для обязательных полей

