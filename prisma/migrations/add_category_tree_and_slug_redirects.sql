-- Two-level catalog categories, antibody research area, product slug redirects.
-- Additive and idempotent. Applied in Supabase as part of the catalog-categories SQL
-- (must run before deploying the code that reads these columns).

ALTER TABLE public."Category"
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS "sortOrder" integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "parentId" text;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Category_parentId_fkey') THEN
    ALTER TABLE public."Category" ADD CONSTRAINT "Category_parentId_fkey"
      FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS "Category_parentId_idx" ON public."Category" ("parentId");

ALTER TABLE public."Product" ADD COLUMN IF NOT EXISTS "researchArea" text;
CREATE INDEX IF NOT EXISTS "Product_researchArea_idx" ON public."Product" ("researchArea");

CREATE TABLE IF NOT EXISTS public."ProductSlugRedirect" (
  "oldSlug"   text PRIMARY KEY,
  "productId" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductSlugRedirect_productId_fkey" FOREIGN KEY ("productId")
    REFERENCES public."Product"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "ProductSlugRedirect_productId_idx" ON public."ProductSlugRedirect" ("productId");
ALTER TABLE public."ProductSlugRedirect" ENABLE ROW LEVEL SECURITY;
