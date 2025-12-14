-- Supabase Migration: Clean up Order table - remove duplicates and ensure correct structure
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration removes duplicate fields and ensures Order table matches Prisma schema

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

-- Step 1: Handle email/customerEmail - remove duplicate
DO $$ 
BEGIN
    -- If both email and customerEmail exist, copy data and drop email
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'email' AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerEmail' AND table_schema = 'public'
    ) THEN
        -- Copy data from email to customerEmail if customerEmail is empty
        UPDATE "Order" SET "customerEmail" = "email" WHERE ("customerEmail" IS NULL OR "customerEmail" = '') AND "email" IS NOT NULL;
        -- Drop old email column
        ALTER TABLE "Order" DROP COLUMN "email";
        RAISE NOTICE '✅ Removed duplicate email column, data copied to customerEmail';
    -- If only email exists, rename it
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'email' AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerEmail' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail";
        RAISE NOTICE '✅ Renamed email to customerEmail';
    -- If customerEmail doesn't exist, create it
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerEmail' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE '✅ Added customerEmail column';
    ELSE
        RAISE NOTICE 'ℹ️ customerEmail column already exists correctly';
    END IF;
    
    -- Ensure customerEmail is NOT NULL (required field)
    ALTER TABLE "Order" ALTER COLUMN "customerEmail" SET NOT NULL;
    ALTER TABLE "Order" ALTER COLUMN "customerEmail" SET DEFAULT '';
END $$;

-- Step 2: Handle phone/customerPhone - remove duplicate
DO $$ 
BEGIN
    -- If both phone and customerPhone exist, copy data and drop phone
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'phone' AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerPhone' AND table_schema = 'public'
    ) THEN
        -- Copy data from phone to customerPhone if customerPhone is empty
        UPDATE "Order" SET "customerPhone" = "phone" WHERE ("customerPhone" IS NULL OR "customerPhone" = '') AND "phone" IS NOT NULL;
        -- Drop old phone column
        ALTER TABLE "Order" DROP COLUMN "phone";
        RAISE NOTICE '✅ Removed duplicate phone column, data copied to customerPhone';
    -- If only phone exists, rename it
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'phone' AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerPhone' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "phone" TO "customerPhone";
        ALTER TABLE "Order" ALTER COLUMN "customerPhone" DROP NOT NULL;
        RAISE NOTICE '✅ Renamed phone to customerPhone and made it nullable';
    -- If customerPhone doesn't exist, create it
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'customerPhone' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
        RAISE NOTICE '✅ Added customerPhone column';
    ELSE
        -- Ensure it's nullable
        ALTER TABLE "Order" ALTER COLUMN "customerPhone" DROP NOT NULL;
        RAISE NOTICE 'ℹ️ customerPhone column already exists, ensured nullable';
    END IF;
END $$;

-- Step 3: Ensure billingAddress exists (nullable)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'billingAddress' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "billingAddress" TEXT;
        RAISE NOTICE '✅ Added billingAddress column';
    ELSE
        ALTER TABLE "Order" ALTER COLUMN "billingAddress" DROP NOT NULL;
        RAISE NOTICE 'ℹ️ billingAddress column already exists, ensured nullable';
    END IF;
END $$;

-- Step 4: Ensure subtotal exists (Decimal, NOT NULL)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'subtotal' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "subtotal" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added subtotal column';
    ELSE
        -- Ensure it's NOT NULL with default
        ALTER TABLE "Order" ALTER COLUMN "subtotal" SET NOT NULL;
        ALTER TABLE "Order" ALTER COLUMN "subtotal" SET DEFAULT 0;
        RAISE NOTICE 'ℹ️ subtotal column already exists, ensured NOT NULL with default';
    END IF;
END $$;

-- Step 5: Ensure tax exists (Decimal, NOT NULL)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'tax' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "tax" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added tax column';
    ELSE
        -- Ensure it's NOT NULL with default
        ALTER TABLE "Order" ALTER COLUMN "tax" SET NOT NULL;
        ALTER TABLE "Order" ALTER COLUMN "tax" SET DEFAULT 0;
        RAISE NOTICE 'ℹ️ tax column already exists, ensured NOT NULL with default';
    END IF;
END $$;

-- Step 6: Ensure total exists (Decimal, NOT NULL)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'total' AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "total" DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE '✅ Added total column';
    ELSE
        -- Ensure it's NOT NULL with default
        ALTER TABLE "Order" ALTER COLUMN "total" SET NOT NULL;
        ALTER TABLE "Order" ALTER COLUMN "total" SET DEFAULT 0;
        RAISE NOTICE 'ℹ️ total column already exists, ensured NOT NULL with default';
    END IF;
END $$;

-- Step 7: Ensure status column uses OrderStatus enum
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = 'status' AND table_schema = 'public'
    ) THEN
        -- Check if it's already the correct type
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'Order' AND column_name = 'status'
            AND udt_name = 'OrderStatus' AND table_schema = 'public'
        ) THEN
            -- Try to alter the column type
            BEGIN
                ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::text::"OrderStatus";
                ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';
                RAISE NOTICE '✅ Updated status column to use OrderStatus enum';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Could not convert status column type. You may need to update it manually.';
            END;
        ELSE
            ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';
            RAISE NOTICE 'ℹ️ status column already uses OrderStatus enum';
        END IF;
    ELSE
        ALTER TABLE "Order" ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'pending';
        RAISE NOTICE '✅ Added status column with OrderStatus enum';
    END IF;
END $$;

-- Step 8: Remove any other duplicate/old fields that shouldn't exist
-- Remove fields that are not in Prisma schema (if they exist)
DO $$ 
DECLARE
    field_name TEXT;
    fields_to_remove TEXT[] := ARRAY['company', 'vatId', 'address', 'city', 'postalCode', 'country', 'department', 'poNumber', 'preferredDeliveryDate', 'notes', 'paymentMethod', 'discount'];
BEGIN
    FOREACH field_name IN ARRAY fields_to_remove LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'Order' 
            AND column_name = field_name
            AND table_schema = 'public'
        ) THEN
            EXECUTE format('ALTER TABLE "Order" DROP COLUMN IF EXISTS %I', field_name);
            RAISE NOTICE '✅ Removed old field: %', field_name;
        END IF;
    END LOOP;
END $$;

-- Verification: Show final structure
SELECT 
    column_name, 
    data_type, 
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND table_schema = 'public'
ORDER BY ordinal_position;

