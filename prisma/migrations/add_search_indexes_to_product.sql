-- Add indexes for search performance on Product table
-- Execute in Supabase SQL Editor

-- Index on name for faster name searches (contains queries)
CREATE INDEX IF NOT EXISTS "Product_name_idx" ON "Product"("name");

-- Index on sku for faster SKU searches (contains queries)
-- Note: sku already has unique constraint, but explicit index helps with contains queries
CREATE INDEX IF NOT EXISTS "Product_sku_search_idx" ON "Product"("sku");

-- Verify indexes were created
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'Product' 
AND indexname IN ('Product_name_idx', 'Product_sku_search_idx')
ORDER BY indexname;

