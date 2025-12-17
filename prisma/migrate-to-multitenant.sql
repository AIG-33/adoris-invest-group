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
-- Check if priceEU column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' AND column_name = 'priceEU'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "priceEU" DECIMAL(10,2);
    END IF;
END $$;

-- Check if priceRU column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' AND column_name = 'priceRU'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "priceRU" DECIMAL(10,2);
    END IF;
END $$;

-- Migrate existing price to priceEU (if price column exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' AND column_name = 'price'
    ) THEN
        UPDATE "Product" SET "priceEU" = "price" WHERE "priceEU" IS NULL AND "price" IS NOT NULL;
        -- Set default for any remaining NULL values
        UPDATE "Product" SET "priceEU" = 0 WHERE "priceEU" IS NULL;
    ELSE
        -- If price column doesn't exist, set default for priceEU
        UPDATE "Product" SET "priceEU" = 0 WHERE "priceEU" IS NULL;
    END IF;
END $$;

-- Make priceEU NOT NULL after migration
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' 
        AND column_name = 'priceEU' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "Product" ALTER COLUMN "priceEU" SET NOT NULL;
    END IF;
END $$;

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
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Product_companyId_fkey'
        AND table_name = 'Product'
    ) THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" 
        FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Order_companyId_fkey'
        AND table_name = 'Order'
    ) THEN
        ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" 
        FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

