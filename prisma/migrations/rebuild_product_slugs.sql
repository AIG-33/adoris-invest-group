-- Migration: Rebuild product slugs from name + SKU
-- Handles duplicates safely with a counter suffix.
-- Run in Supabase SQL Editor.

DO $$
DECLARE
  r RECORD;
  name_slug TEXT;
  new_slug TEXT;
  attempt INT;
BEGIN
  FOR r IN SELECT id, name, sku FROM "Product" ORDER BY "createdAt" ASC
  LOOP
    -- Slugify name: lowercase, non-alphanumeric → dash, collapse dashes, trim
    name_slug := regexp_replace(
      regexp_replace(
        regexp_replace(lower(r.name), '[^a-z0-9]+', '-', 'g'),
        '-+', '-', 'g'
      ),
      '^-|-$', '', 'g'
    );

    -- Base slug = name-slug + SKU as-is (preserves case, dots, uniqueness)
    new_slug := name_slug || '-' || r.sku;

    -- Check for conflict and add counter if needed
    attempt := 0;
    WHILE EXISTS (
      SELECT 1 FROM "Product" WHERE slug = new_slug AND id != r.id
    ) LOOP
      attempt := attempt + 1;
      new_slug := name_slug || '-' || r.sku || '-' || attempt;
    END LOOP;

    UPDATE "Product" SET slug = new_slug, "updatedAt" = now() WHERE id = r.id;
  END LOOP;

  RAISE NOTICE 'Done. All product slugs rebuilt.';
END $$;

-- Verify: check no duplicates
-- SELECT slug, count(*) FROM "Product" GROUP BY slug HAVING count(*) > 1;

-- Verify: see results
-- SELECT sku, name, slug FROM "Product" ORDER BY "updatedAt" DESC LIMIT 30;
