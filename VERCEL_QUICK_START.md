# 🚀 Быстрый старт: Деплой на Vercel

## ✅ Чеклист перед деплоем

- [x] Код залит в GitHub: `AIG-33/adoris-invest-group`
- [x] `.env` в `.gitignore`
- [x] `vercel.json` создан
- [x] `.env.example` обновлен
- [x] Supabase база настроена
- [x] Gmail SMTP настроен

---

## 🎯 Пошаговая инструкция (5 минут)

### Шаг 1: Создать проект на Vercel (2 мин)

1. Перейти на https://vercel.com/new
2. Выбрать `AIG-33/adoris-invest-group`
3. **ВАЖНО:** Root Directory = `nextjs_space/`
4. Build Command = `prisma generate && next build`
5. Нажать "Deploy"

### Шаг 2: Добавить Environment Variables (2 мин)

Перейти в Settings → Environment Variables и добавить:

```env
DATABASE_URL=postgres://postgres:TBeeSOqzCwE9N7Su@db.cobszuhplxdsnajvosct.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1

NEXTAUTH_SECRET=4jux4WNqFuHaL6TRvtdcyYFZuFbnEcWK
NEXTAUTH_URL=https://shop.adorisgroup.com

AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=abacusai-apps-e6c4d2cb12d7e4e0fe8e9d06-us-west-2
AWS_FOLDER_PREFIX=13480/

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@adorisgroup.com
SMTP_PASS=vrlgmxtbmonmeerf
EMAIL_FROM=info@adorisgroup.com
EMAIL_FROM_NAME=ADORIS INVEST GROUP
```

### Шаг 3: Настроить домен (1 мин)

1. Settings → Domains → Add Domain
2. Ввести: `shop.adorisgroup.com`
3. Добавить CNAME запись у вашего DNS провайдера:
   ```
   Type: CNAME
   Name: shop
   Value: cname.vercel-dns.com
   ```

---

## 🔧 DNS настройка у разных провайдеров

### GoDaddy
1. Войти в DNS Management
2. Add Record → CNAME
3. Host: `shop`, Points to: `cname.vercel-dns.com`

### Namecheap
1. Advanced DNS
2. Add New Record → CNAME
3. Host: `shop`, Target: `cname.vercel-dns.com`

### Cloudflare
1. DNS → Add record
2. Type: CNAME, Name: `shop`, Target: `cname.vercel-dns.com`
3. **ВАЖНО:** Отключить Proxy (серый облако)

### Reg.ru
1. DNS-серверы и зона DNS
2. Добавить запись → CNAME
3. Субдомен: `shop`, Значение: `cname.vercel-dns.com`

---

## ⏱ Время ожидания

- **Vercel Deploy:** 2-5 минут
- **DNS Propagation:** 5 минут - 48 часов (обычно 15-30 минут)

---

## ✅ Проверка после деплоя

- [ ] Открыть https://shop.adorisgroup.com
- [ ] Проверить вход/регистрацию
- [ ] Создать тестовый заказ
- [ ] Проверить email уведомления
- [ ] Протестировать корзину
- [ ] Проверить admin панель

---

## 🆘 Быстрые решения проблем

### Build Failed?
→ Проверьте Build Command: `prisma generate && next build`

### 404 Error?
→ Root Directory должен быть: `nextjs_space/`

### Database Connection Error?
→ Проверьте DATABASE_URL в Environment Variables

### Email не отправляются?
→ Проверьте SMTP_PASS (без пробелов): `vrlgmxtbmonmeerf`

### NextAuth ошибки?
→ NEXTAUTH_URL должен быть: `https://shop.adorisgroup.com`

---

## 📱 Контакты

**Vercel Support:** https://vercel.com/support
**Документация:** https://vercel.com/docs

---

**Готово! 🎉 Ваш магазин теперь онлайн на shop.adorisgroup.com**
