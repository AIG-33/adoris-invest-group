-- Migration script to convert to multi-tenant architecture
-- This script:
-- 1. Creates Company table
-- 2. Adds priceEU and priceRU to Product (migrates existing price to priceEU)
-- 3. Adds companyId to Product and Order
-- 4. Creates default company

-- Step 1: Create Company table
CREATE TABLE IF NOT EXISTS "Company" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "logo" TEXT,
  "language" TEXT NOT NULL DEFAULT 'en',
  "priceType" TEXT NOT NULL DEFAULT 'EU',
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Company_name_key" ON "Company"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Company_slug_key" ON "Company"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Company_domain_key" ON "Company"("domain");

-- Step 2: Add priceEU and priceRU to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceEU" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceRU" DECIMAL(10,2);

-- Migrate existing price to priceEU
UPDATE "Product" SET "priceEU" = "price" WHERE "priceEU" IS NULL;

-- Step 3: Add companyId to Product (nullable for now)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- Step 4: Add companyId to Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- Step 5: Create default company (Adoris Invest Group OU)
INSERT INTO "Company" ("id", "name", "slug", "domain", "language", "priceType", "email", "phone", "createdAt", "updatedAt")
VALUES (
  'default-company-id',
  'Adoris Invest Group OU',
  'adoris-invest-group',
  'adorisgroup.com',
  'en',
  'EU',
  'info@adorisgroup.com',
  '+48793081310',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("domain") DO NOTHING;

-- Step 6: Add foreign key constraints (after data migration)
-- Note: These will be added by Prisma migration, but we can add them manually if needed
-- ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

