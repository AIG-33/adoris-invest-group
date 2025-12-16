-- Update product manufacturers from CSV
-- Part 1 of 17
-- Run this script in Supabase SQL Editor
-- This script updates products with Unknown manufacturer to correct manufacturers

-- AAT Bioquest (11 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_aat-bioquest_lx3jzc'
WHERE "sku" IN ('21027', '100341S0', '20406', '102501B0', '102511B0', '100341S1', '104401O1', '104411O1', '104431O1', '102501B1', '102511B1')
  AND "manufacturerId" = 'mfr_unknown';
