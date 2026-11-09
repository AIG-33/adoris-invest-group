-- Products removed from the public price list by the RFQ admin: hidden on the site (lib/db.ts
-- filters them out), product URLs 308 to the manufacturer listing. Restore = set back to NULL.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "unpublishedAt" timestamptz;
CREATE INDEX IF NOT EXISTS "Product_unpublishedAt_idx" ON "Product" ("unpublishedAt") WHERE "unpublishedAt" IS NOT NULL;
-- rfq_service reads Product through column grants
GRANT SELECT ("unpublishedAt") ON "Product" TO rfq_service;
