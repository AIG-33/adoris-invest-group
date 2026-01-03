-- Add performance indexes for faster queries
-- This migration adds indexes on frequently queried fields

-- Company indexes
CREATE INDEX IF NOT EXISTS "Company_domain_idx" ON "Company"("domain");
CREATE INDEX IF NOT EXISTS "Company_slug_idx" ON "Company"("slug");

-- Category indexes
CREATE INDEX IF NOT EXISTS "Category_slug_idx" ON "Category"("slug");

-- Manufacturer indexes
CREATE INDEX IF NOT EXISTS "Manufacturer_slug_idx" ON "Manufacturer"("slug");

-- Product indexes (most critical for performance)
CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured");
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_manufacturerId_idx" ON "Product"("manufacturerId");
CREATE INDEX IF NOT EXISTS "Product_slug_idx" ON "Product"("slug");
CREATE INDEX IF NOT EXISTS "Product_priceEU_idx" ON "Product"("priceEU");
CREATE INDEX IF NOT EXISTS "Product_priceRU_idx" ON "Product"("priceRU");

-- Composite index for common queries (featured products with category)
CREATE INDEX IF NOT EXISTS "Product_featured_categoryId_idx" ON "Product"("featured", "categoryId");

