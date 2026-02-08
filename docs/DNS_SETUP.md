# Настройка DNS для домена ivdgroup.eu

## Шаг 1: Добавление домена в Vercel

1. Откройте ваш проект в Vercel: https://vercel.com/dashboard
2. Перейдите в **Settings** → **Domains**
3. Добавьте домен:
   - **Основной домен**: `ivdgroup.eu`
   - **Поддомен** (опционально): `shop.ivdgroup.eu`

## Шаг 2: Настройка DNS записей

После добавления домена в Vercel, вы получите инструкции по настройке DNS. Обычно нужно настроить следующие записи:

### Вариант A: Использование основного домена (ivdgroup.eu)

Если вы хотите использовать `ivdgroup.eu` как основной домен:

**A Record:**
```
Type: A
Name: @ (или оставить пустым)
Value: 76.76.21.21
TTL: 3600 (или Auto)
```

**CNAME для www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (или Auto)
```

### Вариант B: Использование поддомена (shop.ivdgroup.eu)

Если вы хотите использовать `shop.ivdgroup.eu`:

**CNAME Record:**
```
Type: CNAME
Name: shop
Value: cname.vercel-dns.com
TTL: 3600 (или Auto)
```

**Или A Record:**
```
Type: A
Name: shop
Value: 76.76.21.21
TTL: 3600 (или Auto)
```

## Шаг 3: Обновление домена в базе данных

После настройки DNS, обновите домен в базе данных:

### Если используете ivdgroup.eu:
```sql
UPDATE "Company" 
SET domain = 'ivdgroup.eu' 
WHERE slug = 'ivd-group';
```

### Если используете shop.ivdgroup.eu:
```sql
UPDATE "Company" 
SET domain = 'shop.ivdgroup.eu' 
WHERE slug = 'ivd-group';
```

Или выполните скрипт:
```bash
npm run update:ivd-domain
```

## Шаг 4: Проверка настройки

1. Дождитесь распространения DNS (обычно 5-60 минут)
2. Проверьте DNS записи: https://dnschecker.org/#A/ivdgroup.eu
3. Проверьте SSL сертификат в Vercel (должен быть автоматически выдан)
4. Откройте домен в браузере и проверьте работу сайта

## Важные замечания

- **TTL (Time To Live)**: Рекомендуется использовать 3600 секунд (1 час) или Auto
- **SSL**: Vercel автоматически выдает SSL сертификаты через Let's Encrypt
- **Поддомены**: Middleware поддерживает поддомены, поэтому `shop.ivdgroup.eu` будет работать даже если в базе указан `ivdgroup.eu`
- **Проверка**: После настройки DNS может потребоваться до 24 часов для полного распространения

## Текущие IP адреса Vercel (2024)

- **A Record**: `76.76.21.21`
- **CNAME**: `cname.vercel-dns.com`

**Примечание**: IP адреса могут измениться. Всегда проверяйте актуальные значения в Vercel Dashboard → Settings → Domains после добавления домена.

