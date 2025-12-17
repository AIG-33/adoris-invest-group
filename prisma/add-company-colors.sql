-- Migration to add color fields to Company table
-- Run this in Supabase SQL Editor if colors are not already in the schema

-- Add color columns if they don't exist
DO $$ 
BEGIN
    -- Primary Color
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Company' AND column_name = 'primaryColor'
    ) THEN
        ALTER TABLE "Company" ADD COLUMN "primaryColor" TEXT DEFAULT '#333333';
    END IF;

    -- Secondary Color
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Company' AND column_name = 'secondaryColor'
    ) THEN
        ALTER TABLE "Company" ADD COLUMN "secondaryColor" TEXT DEFAULT '#666666';
    END IF;

    -- Accent Color
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Company' AND column_name = 'accentColor'
    ) THEN
        ALTER TABLE "Company" ADD COLUMN "accentColor" TEXT DEFAULT '#000000';
    END IF;
END $$;

-- Update existing companies with default colors if they are NULL
UPDATE "Company" 
SET 
    "primaryColor" = COALESCE("primaryColor", '#333333'),
    "secondaryColor" = COALESCE("secondaryColor", '#666666'),
    "accentColor" = COALESCE("accentColor", '#000000')
WHERE 
    "primaryColor" IS NULL 
    OR "secondaryColor" IS NULL 
    OR "accentColor" IS NULL;

