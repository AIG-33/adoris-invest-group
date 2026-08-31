-- Add logisticFee field to Order for sub-€5,000 delivery surcharge
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "logisticFee" DECIMAL(10, 2) DEFAULT 0 NOT NULL;
