# 🚀 Быстрый старт: Выполнение миграции

## Шаг 1: Выполнить SQL миграцию в Supabase

1. Откройте https://app.supabase.com
2. Выберите ваш проект
3. Перейдите в **SQL Editor** (в левом меню)
4. Скопируйте **весь** SQL из файла `prisma/migrate-to-multitenant.sql`
5. Вставьте в SQL Editor
6. Нажмите кнопку **"Run"** (или `Ctrl/Cmd + Enter`)

✅ Дождитесь сообщения об успешном выполнении

---

## Шаг 2: Выполнить команды в терминале

### Открыть терминал:

**В VS Code:**
- Нажмите `Ctrl + ~` (или `Cmd + ~` на Mac)
- Или меню: Terminal → New Terminal

**В отдельном терминале:**
- Откройте Terminal (Mac) или Command Prompt (Windows)
- Перейдите в папку проекта:
  ```bash
  cd /Users/gmaxby/AIG/adoris-invest-group
  ```

### Выполнить команды:

```bash
# 1. Создать компании в базе данных
npm run seed:companies

# 2. Обновить Prisma Client
npx prisma generate
```

### Что делают команды:

1. **`npm run seed:companies`**
   - Создает 6 компаний в таблице `Company`
   - Компании: Adoris Invest Group OU, Samplify, IVD Group, Viena, ivd.by, MedStock

2. **`npx prisma generate`**
   - Обновляет Prisma Client с новыми полями (`priceEU`, `priceRU`, `Company` модель)
   - Нужно для того, чтобы TypeScript знал о новых полях

---

## Шаг 3: Проверить результат

После выполнения команд проверьте:

1. В Supabase → Table Editor → `Company` - должно быть 6 компаний
2. В Supabase → Table Editor → `Product` - должны быть колонки `priceEU` и `priceRU`
3. В терминале не должно быть ошибок

---

## ❓ Если возникли ошибки

**Ошибка: "Cannot find module"**
```bash
npm install
```

**Ошибка: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Ошибка подключения к БД**
- Проверьте файл `.env` - должен быть правильный `DATABASE_URL`

---

## ✅ Готово!

После выполнения всех шагов мультитенантная архитектура будет полностью настроена.

