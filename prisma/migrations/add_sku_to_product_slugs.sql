-- Migration: Add SKU to product slugs for SEO
-- 
-- Purpose: 95% of B2B users search by SKU (article number).
-- Having SKU in the URL dramatically improves Google ranking for SKU queries.
--
-- Before: /product/manufacturer/some-product-name
-- After:  /product/manufacturer/some-product-name-sku12345
--
-- Logic:
--   1. Converts SKU to lowercase slug format (replace non-alphanumeric with -)
--   2. Checks if slug already contains the SKU slug (idempotent — safe to run multiple times)
--   3. Appends -sku_slug to the existing slug
--
-- Old URLs will automatically 308-redirect to new URLs via app code.
--
-- Run this in Supabase SQL Editor.

-- Step 1: Preview what will change (run this first to check)
-- SELECT 
--   sku, 
--   slug AS old_slug,
--   slug || '-' || lower(regexp_replace(sku, '[^a-zA-Z0-9]', '-', 'g')) AS new_slug
-- FROM "Product"
-- WHERE slug NOT LIKE '%' || lower(regexp_replace(sku, '[^a-zA-Z0-9]', '-', 'g'))
-- LIMIT 20;

-- Step 2: Apply the migration
UPDATE "Product"
SET 
  slug = slug || '-' || lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(sku, '[^a-zA-Z0-9]', '-', 'g'),  -- replace non-alphanumeric with -
        '-+', '-', 'g'                                     -- collapse multiple dashes
      ),
      '^-|-$', '', 'g'                                     -- trim leading/trailing dashes
    )
  ),
  "updatedAt" = now()
WHERE slug NOT LIKE '%' || lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(sku, '[^a-zA-Z0-9]', '-', 'g'),
      '-+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
);

-- Step 3: Verify (run after migration)
-- SELECT sku, slug FROM "Product" ORDER BY "updatedAt" DESC LIMIT 20;
