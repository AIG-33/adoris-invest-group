# Чеклист перед деплоем на Vercel

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

### 3. Проверить vercel.json
Убедитесь, что `vercel.json` настроен для npm:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 4. Коммит и пуш
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

# 3. Коммит
git add .
git commit -m "Deploy: remove yarn.lock symlink and import scripts"

# 4. Пуш
git push origin main
```

## ✅ После деплоя

1. Дождаться завершения билда на Vercel (2-3 минуты)
2. Проверить сайт: https://adorisgroup.abacusai.app
3. Проверить основные функции:
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

**Последнее обновление**: 11 декабря 2025
**Deployment URL**: https://adorisgroup.abacusai.app
