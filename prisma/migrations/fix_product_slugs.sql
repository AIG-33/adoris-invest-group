-- ============================================================
-- Fix product slugs: rebuild from name + SKU
-- Fixes: 1,704 slugs with spaces, 3 with double dashes,
-- and ensures all slugs are properly URL-safe.
-- ============================================================
-- Run this AFTER fix_manufacturer_slugs.sql
-- ============================================================

DO $$
DECLARE
  r RECORD;
  name_part TEXT;
  sku_part TEXT;
  new_slug TEXT;
  base_slug TEXT;
  suffix INT;
  fixed INT := 0;
  skipped INT := 0;
BEGIN
  FOR r IN
    SELECT id, name, sku, slug
    FROM "Product"
    -- Only process slugs that have problems:
    -- spaces, double dashes, or uppercase chars (SKU not properly slugified)
    WHERE slug ~ '[ A-Z]|--'
    ORDER BY id
  LOOP
    -- Slugify the product name:
    -- 1. Lowercase
    -- 2. Replace non-alphanumeric with hyphens
    -- 3. Collapse multiple hyphens
    -- 4. Trim hyphens
    name_part := lower(r.name);
    name_part := regexp_replace(name_part, '[^a-z0-9]+', '-', 'g');
    name_part := regexp_replace(name_part, '-+', '-', 'g');
    name_part := regexp_replace(name_part, '^-|-$', '', 'g');

    -- Slugify the SKU similarly (preserve original casing in lowercase)
    sku_part := lower(r.sku);
    sku_part := regexp_replace(sku_part, '[^a-z0-9]+', '-', 'g');
    sku_part := regexp_replace(sku_part, '-+', '-', 'g');
    sku_part := regexp_replace(sku_part, '^-|-$', '', 'g');

    -- Combine: name-sku
    IF sku_part = '' OR sku_part IS NULL THEN
      new_slug := name_part;
    ELSE
      new_slug := name_part || '-' || sku_part;
    END IF;

    -- Truncate if too long (max 200 chars for slug)
    IF length(new_slug) > 200 THEN
      new_slug := left(new_slug, 200);
      new_slug := regexp_replace(new_slug, '-$', '', 'g');
    END IF;

    -- Skip if slug is already the same
    IF new_slug = r.slug THEN
      skipped := skipped + 1;
      CONTINUE;
    END IF;

    -- Handle conflicts
    base_slug := new_slug;
    suffix := 0;
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM "Product"
        WHERE slug = new_slug AND id != r.id
      ) THEN
        EXIT;
      END IF;
      suffix := suffix + 1;
      new_slug := base_slug || '-' || suffix;
    END LOOP;

    UPDATE "Product" SET slug = new_slug WHERE id = r.id;
    fixed := fixed + 1;
  END LOOP;

  RAISE NOTICE 'Fixed: %, Skipped (already clean): %', fixed, skipped;
END $$;
