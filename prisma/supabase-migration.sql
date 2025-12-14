-- Supabase Migration: Add customerEmail to Order table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Step 1: Check if email column exists and rename it to customerEmail
DO $$ 
BEGIN
    -- Check if 'email' column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        -- Rename email to customerEmail
        ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail";
        RAISE NOTICE '✅ Renamed email column to customerEmail';
    -- Check if customerEmail doesn't exist at all
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerEmail'
        AND table_schema = 'public'
    ) THEN
        -- Add customerEmail column
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE '✅ Added customerEmail column';
    ELSE
        RAISE NOTICE 'ℹ️ customerEmail column already exists';
    END IF;
END $$;

-- Step 2: Ensure customerPhone column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerPhone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
        RAISE NOTICE '✅ Added customerPhone column';
    ELSE
        RAISE NOTICE 'ℹ️ customerPhone column already exists';
    END IF;
END $$;

-- Verification: Check the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name IN ('customerEmail', 'customerPhone', 'customerName')
ORDER BY column_name;

