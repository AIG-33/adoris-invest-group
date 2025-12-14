-- Quick migration script for Vercel/Production
-- Execute this SQL in your PostgreSQL database

-- Step 1: Check if email column exists and rename it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail";
        RAISE NOTICE 'Renamed email to customerEmail';
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerEmail'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added customerEmail column';
    ELSE
        RAISE NOTICE 'customerEmail column already exists';
    END IF;
END $$;

-- Step 2: Ensure customerPhone exists
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
        RAISE NOTICE 'Added customerPhone column';
    ELSE
        RAISE NOTICE 'customerPhone column already exists';
    END IF;
END $$;

-- Step 3: Ensure billingAddress exists
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
        RAISE NOTICE 'Added billingAddress column';
    ELSE
        RAISE NOTICE 'billingAddress column already exists';
    END IF;
END $$;

-- Step 4: Ensure subtotal exists (Decimal type)
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
        RAISE NOTICE 'Added subtotal column';
    END IF;
END $$;

-- Step 5: Ensure tax exists (Decimal type)
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
        RAISE NOTICE 'Added tax column';
    END IF;
END $$;

-- Step 6: Ensure total exists (Decimal type)
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
        RAISE NOTICE 'Added total column';
    END IF;
END $$;

