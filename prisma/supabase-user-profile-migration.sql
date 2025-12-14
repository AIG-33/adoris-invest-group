-- Supabase Migration: Add profile fields to User table
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration adds profile fields for order checkout

-- Add firstName column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'firstName'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
        RAISE NOTICE '✅ Added firstName column';
    ELSE
        RAISE NOTICE 'ℹ️ firstName column already exists';
    END IF;
END $$;

-- Add lastName column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'lastName'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "lastName" TEXT;
        RAISE NOTICE '✅ Added lastName column';
    ELSE
        RAISE NOTICE 'ℹ️ lastName column already exists';
    END IF;
END $$;

-- Add company column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'company'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "company" TEXT;
        RAISE NOTICE '✅ Added company column';
    ELSE
        RAISE NOTICE 'ℹ️ company column already exists';
    END IF;
END $$;

-- Add vatId column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'vatId'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "vatId" TEXT;
        RAISE NOTICE '✅ Added vatId column';
    ELSE
        RAISE NOTICE 'ℹ️ vatId column already exists';
    END IF;
END $$;

-- Add phone column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'phone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "phone" TEXT;
        RAISE NOTICE '✅ Added phone column';
    ELSE
        RAISE NOTICE 'ℹ️ phone column already exists';
    END IF;
END $$;

-- Add address column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "address" TEXT;
        RAISE NOTICE '✅ Added address column';
    ELSE
        RAISE NOTICE 'ℹ️ address column already exists';
    END IF;
END $$;

-- Add city column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'city'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "city" TEXT;
        RAISE NOTICE '✅ Added city column';
    ELSE
        RAISE NOTICE 'ℹ️ city column already exists';
    END IF;
END $$;

-- Add postalCode column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'postalCode'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "postalCode" TEXT;
        RAISE NOTICE '✅ Added postalCode column';
    ELSE
        RAISE NOTICE 'ℹ️ postalCode column already exists';
    END IF;
END $$;

-- Add country column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'country'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "country" TEXT DEFAULT 'Poland';
        RAISE NOTICE '✅ Added country column';
    ELSE
        RAISE NOTICE 'ℹ️ country column already exists';
    END IF;
END $$;

-- Add department column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'department'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "department" TEXT;
        RAISE NOTICE '✅ Added department column';
    ELSE
        RAISE NOTICE 'ℹ️ department column already exists';
    END IF;
END $$;

-- Add paymentMethod column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'paymentMethod'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "paymentMethod" TEXT DEFAULT 'bank_transfer';
        RAISE NOTICE '✅ Added paymentMethod column';
    ELSE
        RAISE NOTICE 'ℹ️ paymentMethod column already exists';
    END IF;
END $$;

-- Verification: Check the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'User' 
AND column_name IN ('firstName', 'lastName', 'company', 'vatId', 'phone', 'address', 'city', 'postalCode', 'country', 'department', 'paymentMethod')
ORDER BY column_name;

