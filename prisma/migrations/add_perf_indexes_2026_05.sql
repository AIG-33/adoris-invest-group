-- Performance indexes — 2026-05
-- Apply in Supabase SQL Editor.
-- IMPORTANT: each CREATE INDEX CONCURRENTLY must run in its own transaction.
-- If the SQL Editor wraps everything in one transaction, run statements one by one.

-- 1) pg_trgm enables fast ILIKE %substring% on Product.name / Product.sku
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_name_trgm_idx"
  ON "Product" USING gin (name gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_sku_trgm_idx"
  ON "Product" USING gin (sku gin_trgm_ops);

-- 2) Composite indexes for /products listing with category/manufacturer filters
--    plus default ORDER BY createdAt DESC.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_category_created_idx"
  ON "Product" ("categoryId", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_manufacturer_created_idx"
  ON "Product" ("manufacturerId", "createdAt" DESC);

-- 3) Partial index for the "featured products" query on the homepage.
--    Featured rows are usually <1% of the table; partial index is much smaller
--    and lets Postgres skip the WHERE clause entirely.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_featured_partial_idx"
  ON "Product" ("createdAt" DESC) WHERE featured = true;

-- 4) Composite for /product/[manufacturer]/[slug] lookup (hottest path).
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_mfr_slug_idx"
  ON "Product" ("manufacturerId", "slug");

-- ── Verification ──────────────────────────────────────────────────────────
-- Run after applying:
--
-- SELECT indexname FROM pg_indexes
--  WHERE tablename = 'Product'
--  ORDER BY indexname;
--
-- Expected new entries:
--   Product_name_trgm_idx
--   Product_sku_trgm_idx
--   Product_category_created_idx
--   Product_manufacturer_created_idx
--   Product_featured_partial_idx
--   Product_mfr_slug_idx
