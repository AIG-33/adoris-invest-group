-- Add Google Analytics and Yandex Metrika fields to Company table
-- This migration adds analytics tracking IDs for each company

-- Add googleAnalyticsId column (nullable)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT;

-- Add yandexMetrikaId column (nullable)
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "yandexMetrikaId" TEXT;

-- Add comments for documentation
COMMENT ON COLUMN "Company"."googleAnalyticsId" IS 'Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)';
COMMENT ON COLUMN "Company"."yandexMetrikaId" IS 'Yandex Metrika counter ID (number as text)';

