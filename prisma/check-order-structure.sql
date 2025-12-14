-- Script to check current structure of Order table
-- Execute this in Supabase SQL Editor to see what columns exist

SELECT 
    column_name, 
    data_type, 
    udt_name,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND table_schema = 'public'
ORDER BY ordinal_position;

