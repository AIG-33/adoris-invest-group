-- Migration: Add showPrices field to Company table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- 
-- IMPORTANT: If you get "signal timed out" error, try this step-by-step approach:
-- 1. First, add column as nullable
-- 2. Then update existing rows
-- 3. Finally, set NOT NULL constraint

-- Step 1: Add column as nullable (fast, no table lock)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "showPrices" BOOLEAN;

-- Step 2: Update existing rows to default value (if column was just added)
UPDATE "Company" 
SET "showPrices" = true 
WHERE "showPrices" IS NULL;

-- Step 3: Set NOT NULL constraint with default (only if Step 2 completed successfully)
-- Uncomment the line below ONLY after Step 2 completes:
-- ALTER TABLE "Company" ALTER COLUMN "showPrices" SET NOT NULL;
-- ALTER TABLE "Company" ALTER COLUMN "showPrices" SET DEFAULT true;

-- Add comment to column
COMMENT ON COLUMN "Company"."showPrices" IS 'Show prices or "Price on Request"';

