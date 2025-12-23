-- Simple Migration: Add showPrices field to Company table
-- Execute this in Supabase SQL Editor if the main migration times out
-- This version adds the column without NOT NULL constraint first

-- Step 1: Add column as nullable (fast, no table lock)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "showPrices" BOOLEAN;

-- Step 2: Set default value for existing rows
UPDATE "Company" 
SET "showPrices" = true 
WHERE "showPrices" IS NULL;

-- That's it! The column is now nullable but defaults to true.
-- You can add NOT NULL constraint later if needed, but it's not required for functionality.

