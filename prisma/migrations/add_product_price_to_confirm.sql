-- «Цена требует подтверждения» / "Price to be confirmed" next to prices with no supplier behind them.
-- Set only by the RFQ admin (adoris-rfq sql/admin/catalog-price-to-confirm.sql: rfq_catalog.sync_price_to_confirm).
-- Applied in production by that script; this file documents the column for the site.
-- Roll back (after reverting site code that selects it): ALTER TABLE "Product" DROP COLUMN IF EXISTS "priceToConfirm";
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceToConfirm" boolean NOT NULL DEFAULT false;
GRANT SELECT ("priceToConfirm") ON "Product" TO rfq_service;
