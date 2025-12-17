-- CreateTable
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Company_domain_key" ON "Company"("domain");

-- AlterTable: Add new price columns to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceEU" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceRU" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- Migrate existing price to priceEU
UPDATE "Product" SET "priceEU" = "price" WHERE "priceEU" IS NULL AND "price" IS NOT NULL;

-- Set default for priceEU if still null (shouldn't happen, but safety check)
UPDATE "Product" SET "priceEU" = 0 WHERE "priceEU" IS NULL;

-- Make priceEU NOT NULL (after data migration)
DO $$ 
BEGIN
    -- Check if column exists and is nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' 
        AND column_name = 'priceEU' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "Product" ALTER COLUMN "priceEU" SET NOT NULL;
    END IF;
END $$;

-- AlterTable: Add companyId to Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- AddForeignKey for Product
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

-- AddForeignKey for Order
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
