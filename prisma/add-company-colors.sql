-- Add color fields to Company table
-- Execute this in Supabase SQL Editor

-- Add primaryColor column
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "primaryColor" TEXT DEFAULT '#333333';

-- Add secondaryColor column
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "secondaryColor" TEXT DEFAULT '#666666';

-- Add accentColor column
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "accentColor" TEXT DEFAULT '#000000';

-- Verify the columns were added
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Company'
AND column_name IN ('primaryColor', 'secondaryColor', 'accentColor')
ORDER BY column_name;
