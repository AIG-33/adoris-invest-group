-- Performance indexes — 2026-05
--
-- ⚠️ Supabase SQL Editor оборачивает запросы в транзакцию, поэтому
-- CREATE INDEX CONCURRENTLY работать НЕ БУДЕТ:
--   ERROR: 25001: CREATE INDEX CONCURRENTLY cannot run inside a transaction block
--
-- Два варианта применения — выбрать ОДИН:
--
--   ВАРИАНТ A (рекомендуется): запускать каждую команду по очереди в SQL Editor.
--                              См. блок "ВАРИАНТ A" ниже — 7 команд.
--                              Не блокирует таблицу.
--
--   ВАРИАНТ B (быстрее, проще): запустить весь блок "ВАРИАНТ B" одной кнопкой.
--                               Без CONCURRENTLY → на каталоге 100k товаров
--                               блокирует таблицу на запись ~3–10 секунд.
--                               Делать в нерабочее время / окно деплоя.
--
-- ════════════════════════════════════════════════════════════════════════════
-- ВАРИАНТ A — копировать и запускать по одной команде в SQL Editor
-- ════════════════════════════════════════════════════════════════════════════

-- Команда 1
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Команда 2
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_name_trgm_idx"
  ON "Product" USING gin (name gin_trgm_ops);

-- Команда 3
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_sku_trgm_idx"
  ON "Product" USING gin (sku gin_trgm_ops);

-- Команда 4
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_category_created_idx"
  ON "Product" ("categoryId", "createdAt" DESC);

-- Команда 5
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_manufacturer_created_idx"
  ON "Product" ("manufacturerId", "createdAt" DESC);

-- Команда 6
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_featured_partial_idx"
  ON "Product" ("createdAt" DESC) WHERE featured = true;

-- Команда 7
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_mfr_slug_idx"
  ON "Product" ("manufacturerId", "slug");

-- ════════════════════════════════════════════════════════════════════════════
-- ВАРИАНТ B — без CONCURRENTLY, можно весь блок одной кнопкой
-- ════════════════════════════════════════════════════════════════════════════
--
-- ВНИМАНИЕ: блокирует таблицу на запись на ~3–10 секунд (зависит от размера).
-- Раскомментировать (убрать `--` в начале каждой строки) и запустить.
--
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
--
-- CREATE INDEX IF NOT EXISTS "Product_name_trgm_idx"
--   ON "Product" USING gin (name gin_trgm_ops);
--
-- CREATE INDEX IF NOT EXISTS "Product_sku_trgm_idx"
--   ON "Product" USING gin (sku gin_trgm_ops);
--
-- CREATE INDEX IF NOT EXISTS "Product_category_created_idx"
--   ON "Product" ("categoryId", "createdAt" DESC);
--
-- CREATE INDEX IF NOT EXISTS "Product_manufacturer_created_idx"
--   ON "Product" ("manufacturerId", "createdAt" DESC);
--
-- CREATE INDEX IF NOT EXISTS "Product_featured_partial_idx"
--   ON "Product" ("createdAt" DESC) WHERE featured = true;
--
-- CREATE INDEX IF NOT EXISTS "Product_mfr_slug_idx"
--   ON "Product" ("manufacturerId", "slug");

-- ════════════════════════════════════════════════════════════════════════════
-- Проверка после применения (любого варианта)
-- ════════════════════════════════════════════════════════════════════════════
--
-- SELECT indexname FROM pg_indexes
--  WHERE tablename = 'Product'
--    AND indexname IN (
--      'Product_name_trgm_idx',
--      'Product_sku_trgm_idx',
--      'Product_category_created_idx',
--      'Product_manufacturer_created_idx',
--      'Product_featured_partial_idx',
--      'Product_mfr_slug_idx'
--    )
--  ORDER BY indexname;
--
-- Должно вернуться ровно 6 строк.
