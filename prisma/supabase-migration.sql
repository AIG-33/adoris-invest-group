-- Supabase Migration: Add missing fields to Order table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration adds: customerEmail, customerPhone, billingAddress, subtotal, tax, and total fields

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

-- Step 3: Ensure billingAddress column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'billingAddress'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "billingAddress" TEXT;
        RAISE NOTICE '✅ Added billingAddress column';
    ELSE
        RAISE NOTICE 'ℹ️ billingAddress column already exists';
    END IF;
END $$;

-- Step 4: Ensure subtotal column exists (Decimal type)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'subtotal'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "subtotal" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added subtotal column';
    ELSE
        RAISE NOTICE 'ℹ️ subtotal column already exists';
    END IF;
END $$;

-- Step 5: Ensure tax column exists (Decimal type)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'tax'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "tax" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added tax column';
    ELSE
        RAISE NOTICE 'ℹ️ tax column already exists';
    END IF;
END $$;

-- Step 6: Ensure total column exists (Decimal type)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'total'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "total" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added total column';
    ELSE
        RAISE NOTICE 'ℹ️ total column already exists';
    END IF;
END $$;

-- Verification: Check the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name IN ('customerEmail', 'customerPhone', 'customerName', 'billingAddress', 'subtotal', 'tax', 'total')
ORDER BY column_name;

