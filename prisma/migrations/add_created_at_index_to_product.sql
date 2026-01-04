-- Add index on Product.createdAt for faster sorting
-- This index significantly improves performance of queries with orderBy createdAt
-- Execute in Supabase SQL Editor

CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");

-- Verify index was created
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'Product' 
AND indexname = 'Product_createdAt_idx';

