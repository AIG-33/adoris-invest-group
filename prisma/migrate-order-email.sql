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

