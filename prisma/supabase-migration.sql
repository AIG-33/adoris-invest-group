-- Supabase Migration: Add missing fields to Order table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration adds: OrderStatus enum, customerEmail, customerPhone, billingAddress, subtotal, tax, total, and status fields

-- Step 0: Create OrderStatus enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        RAISE NOTICE '✅ Created OrderStatus enum';
    ELSE
        RAISE NOTICE 'ℹ️ OrderStatus enum already exists';
    END IF;
END $$;

-- Step 0.1: Create StockStatus enum if it doesn't exist (for Product table)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StockStatus') THEN
        CREATE TYPE "StockStatus" AS ENUM ('in_stock', 'out_of_stock', 'pre_order');
        RAISE NOTICE '✅ Created StockStatus enum';
    ELSE
        RAISE NOTICE 'ℹ️ StockStatus enum already exists';
    END IF;
END $$;

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
    -- Check if old 'phone' column exists and rename it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'phone'
        AND table_schema = 'public'
    ) THEN
        -- Rename phone to customerPhone
        ALTER TABLE "Order" RENAME COLUMN "phone" TO "customerPhone";
        -- Make it nullable if it's not already
        ALTER TABLE "Order" ALTER COLUMN "customerPhone" DROP NOT NULL;
        RAISE NOTICE '✅ Renamed phone column to customerPhone and made it nullable';
    -- Check if customerPhone doesn't exist at all
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerPhone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
        RAISE NOTICE '✅ Added customerPhone column';
    ELSE
        -- Ensure it's nullable
        ALTER TABLE "Order" ALTER COLUMN "customerPhone" DROP NOT NULL;
        RAISE NOTICE 'ℹ️ customerPhone column already exists, ensured it is nullable';
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

-- Step 7: Ensure status column uses OrderStatus enum
DO $$ 
BEGIN
    -- Check if status column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'status'
        AND table_schema = 'public'
    ) THEN
        -- Check if it's already the correct type
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'Order' 
            AND column_name = 'status'
            AND udt_name = 'OrderStatus'
            AND table_schema = 'public'
        ) THEN
            -- Try to alter the column type (may fail if there's existing data)
            BEGIN
                ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::text::"OrderStatus";
                RAISE NOTICE '✅ Updated status column to use OrderStatus enum';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Could not convert status column type. You may need to update it manually.';
            END;
        ELSE
            RAISE NOTICE 'ℹ️ status column already uses OrderStatus enum';
        END IF;
    ELSE
        -- Add status column if it doesn't exist
        ALTER TABLE "Order" ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'pending';
        RAISE NOTICE '✅ Added status column with OrderStatus enum';
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

