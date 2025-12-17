-- Fix OrderStatus enum type in Order table
-- Execute this in Supabase SQL Editor if status column is TEXT instead of OrderStatus enum

-- Step 1: Create OrderStatus enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        RAISE NOTICE '✅ Created OrderStatus enum';
    ELSE
        RAISE NOTICE 'ℹ️ OrderStatus enum already exists';
    END IF;
END $$;

-- Step 2: Convert status column from TEXT to OrderStatus enum
DO $$ 
BEGIN
    -- Check if status column exists and is TEXT type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'status'
        AND udt_name = 'text'
        AND table_schema = 'public'
    ) THEN
        -- First, ensure all values are valid enum values
        UPDATE "Order" 
        SET "status" = 'pending' 
        WHERE "status" NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        
        -- Remove default value temporarily
        ALTER TABLE "Order" 
        ALTER COLUMN "status" DROP DEFAULT;
        
        -- Convert the column type
        ALTER TABLE "Order" 
        ALTER COLUMN "status" TYPE "OrderStatus" 
        USING "status"::"OrderStatus";
        
        -- Set default value back
        ALTER TABLE "Order" 
        ALTER COLUMN "status" SET DEFAULT 'pending'::"OrderStatus";
        
        RAISE NOTICE '✅ Converted status column from TEXT to OrderStatus enum';
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Order' 
        AND column_name = 'status'
        AND udt_name = 'OrderStatus'
        AND table_schema = 'public'
    ) THEN
        -- Ensure default is set correctly
        ALTER TABLE "Order" 
        ALTER COLUMN "status" SET DEFAULT 'pending'::"OrderStatus";
        RAISE NOTICE 'ℹ️ status column already uses OrderStatus enum, ensured default';
    ELSE
        -- Add status column if it doesn't exist
        ALTER TABLE "Order" 
        ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'pending'::"OrderStatus";
        RAISE NOTICE '✅ Added status column with OrderStatus enum';
    END IF;
END $$;

-- Step 3: Verify the change
SELECT 
    column_name, 
    udt_name as data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name = 'status'
AND table_schema = 'public';

