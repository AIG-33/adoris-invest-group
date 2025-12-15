-- Supabase Migration: Add startDate and endDate fields to Exhibition table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration adds: startDate and endDate fields to the Exhibition table

-- Step 1: Check if startDate column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Exhibition' 
        AND column_name = 'startDate'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Exhibition" ADD COLUMN "startDate" TIMESTAMP;
        RAISE NOTICE '✅ Added startDate column to Exhibition table';
    ELSE
        RAISE NOTICE 'ℹ️ startDate column already exists in Exhibition table';
    END IF;
END $$;

-- Step 2: Check if endDate column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Exhibition' 
        AND column_name = 'endDate'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Exhibition" ADD COLUMN "endDate" TIMESTAMP;
        RAISE NOTICE '✅ Added endDate column to Exhibition table';
    ELSE
        RAISE NOTICE 'ℹ️ endDate column already exists in Exhibition table';
    END IF;
END $$;

-- Step 3: Check if there's a 'date' column that should be migrated to startDate
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Exhibition' 
        AND column_name = 'date'
        AND table_schema = 'public'
    ) THEN
        -- Copy date to startDate if startDate is null
        UPDATE "Exhibition" 
        SET "startDate" = "date" 
        WHERE "startDate" IS NULL AND "date" IS NOT NULL;
        
        RAISE NOTICE '✅ Migrated date values to startDate';
        
        -- Optionally drop the old date column (uncomment if needed)
        -- ALTER TABLE "Exhibition" DROP COLUMN "date";
        -- RAISE NOTICE '✅ Dropped old date column';
    ELSE
        RAISE NOTICE 'ℹ️ No date column found to migrate';
    END IF;
END $$;

-- Step 4: Set endDate = startDate if endDate is null (for existing records)
DO $$ 
BEGIN
    UPDATE "Exhibition" 
    SET "endDate" = "startDate" 
    WHERE "endDate" IS NULL AND "startDate" IS NOT NULL;
    
    IF FOUND THEN
        RAISE NOTICE '✅ Set endDate = startDate for existing records';
    END IF;
END $$;

-- Verification: Check the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Exhibition' 
AND column_name IN ('startDate', 'endDate', 'date', 'title', 'description', 'location')
ORDER BY column_name;

