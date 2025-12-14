-- Migration: Add customerEmail field to Order table
-- If email column exists, rename it to customerEmail
-- If customerEmail doesn't exist, add it

-- Check if email column exists and rename it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail";
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerEmail'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Also ensure customerPhone exists (if it doesn't)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'customerPhone'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
    END IF;
END $$;

