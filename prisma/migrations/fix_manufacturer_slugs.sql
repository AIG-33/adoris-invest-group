-- ============================================================
-- Fix manufacturer slugs: remove random suffixes
-- 357 of 377 manufacturers have garbage like ab-sciex-jp69a6
-- Should be: ab-sciex (generated from name "Ab Sciex")
-- ============================================================
-- Run this FIRST, before fix_product_slugs.sql
-- ============================================================

DO $$
DECLARE
  r RECORD;
  new_slug TEXT;
  base_slug TEXT;
  suffix INT;
BEGIN
  FOR r IN SELECT id, name, slug FROM "Manufacturer" ORDER BY name
  LOOP
    -- Slugify the manufacturer name:
    -- 1. Lowercase
    -- 2. Replace any non-alphanumeric chars with hyphens
    -- 3. Collapse multiple hyphens
    -- 4. Trim leading/trailing hyphens
    new_slug := lower(r.name);
    new_slug := regexp_replace(new_slug, '[^a-z0-9]+', '-', 'g');
    new_slug := regexp_replace(new_slug, '-+', '-', 'g');
    new_slug := regexp_replace(new_slug, '^-|-$', '', 'g');

    -- Skip if slug is already correct
    IF new_slug = r.slug THEN
      CONTINUE;
    END IF;

    -- Handle conflicts: if the new slug already belongs to another manufacturer,
    -- append a numeric suffix (-1, -2, etc.)
    base_slug := new_slug;
    suffix := 0;
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM "Manufacturer"
        WHERE slug = new_slug AND id != r.id
      ) THEN
        EXIT;
      END IF;
      suffix := suffix + 1;
      new_slug := base_slug || '-' || suffix;
    END LOOP;

    UPDATE "Manufacturer" SET slug = new_slug WHERE id = r.id;

    RAISE NOTICE 'Manufacturer: % -> %', r.slug, new_slug;
  END LOOP;
END $$;
