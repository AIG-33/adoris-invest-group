-- Enable Row Level Security (RLS) for all tables
-- Execute this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- This migration enables RLS and sets up appropriate policies for all tables

-- ============================================================================
-- 1. PUBLIC CATALOG TABLES (Read-only for anon, Write for authenticated)
-- ============================================================================

-- Company: Public catalog data
ALTER TABLE public."Company" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Company" FROM anon, authenticated;
GRANT SELECT ON public."Company" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Company" TO authenticated;

CREATE POLICY "public_company_read"
  ON public."Company"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "authenticated_company_all"
  ON public."Company"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Category: Public catalog data
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Category" FROM anon, authenticated;
GRANT SELECT ON public."Category" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Category" TO authenticated;

CREATE POLICY "public_category_read"
  ON public."Category"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "authenticated_category_all"
  ON public."Category"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Manufacturer: Public catalog data
ALTER TABLE public."Manufacturer" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Manufacturer" FROM anon, authenticated;
GRANT SELECT ON public."Manufacturer" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Manufacturer" TO authenticated;

CREATE POLICY "public_manufacturer_read"
  ON public."Manufacturer"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "authenticated_manufacturer_all"
  ON public."Manufacturer"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product: Public catalog data
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Product" FROM anon, authenticated;
GRANT SELECT ON public."Product" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Product" TO authenticated;

CREATE POLICY "public_product_read"
  ON public."Product"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "authenticated_product_all"
  ON public."Product"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 2. USER-OWNED DATA (Owner-based access)
-- ============================================================================

-- Account: User-owned data
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Account" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Account" TO authenticated;

CREATE POLICY "owner_account_read"
  ON public."Account"
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_account_insert"
  ON public."Account"
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_account_update"
  ON public."Account"
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId")
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_account_delete"
  ON public."Account"
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId");

-- Session: User-owned data
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Session" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Session" TO authenticated;

CREATE POLICY "owner_session_read"
  ON public."Session"
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_session_insert"
  ON public."Session"
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_session_update"
  ON public."Session"
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId")
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "owner_session_delete"
  ON public."Session"
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid())::text = "userId");

-- User: User can read own data, admins can read all
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."User" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."User" TO authenticated;

-- Users can read and update their own data
CREATE POLICY "owner_user_read"
  ON public."User"
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid())::text = id);

CREATE POLICY "owner_user_update"
  ON public."User"
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid())::text = id)
  WITH CHECK ((SELECT auth.uid())::text = id);

-- Allow users to insert their own record (for registration)
CREATE POLICY "owner_user_insert"
  ON public."User"
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = id);

-- Note: Admin access should be handled at application level
-- For now, users can only access their own data

-- Order: User-owned data (users can read their own orders)
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."Order" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Order" TO authenticated;

CREATE POLICY "owner_order_read"
  ON public."Order"
  FOR SELECT
  TO authenticated
  USING (
    "userId" IS NOT NULL AND (SELECT auth.uid())::text = "userId"
  );

CREATE POLICY "owner_order_insert"
  ON public."Order"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    "userId" IS NULL OR (SELECT auth.uid())::text = "userId"
  );

CREATE POLICY "owner_order_update"
  ON public."Order"
  FOR UPDATE
  TO authenticated
  USING (
    "userId" IS NOT NULL AND (SELECT auth.uid())::text = "userId"
  )
  WITH CHECK (
    "userId" IS NULL OR (SELECT auth.uid())::text = "userId"
  );

-- Note: Orders without userId (guest orders) are handled at application level
-- Admin access should be handled at application level

-- OrderItem: User-owned data (via Order relationship)
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."OrderItem" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."OrderItem" TO authenticated;

-- Users can read OrderItems for their own orders
CREATE POLICY "owner_orderitem_read"
  ON public."OrderItem"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND "Order"."userId" IS NOT NULL
      AND (SELECT auth.uid())::text = "Order"."userId"
    )
  );

CREATE POLICY "owner_orderitem_insert"
  ON public."OrderItem"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND ("Order"."userId" IS NULL OR (SELECT auth.uid())::text = "Order"."userId")
    )
  );

CREATE POLICY "owner_orderitem_update"
  ON public."OrderItem"
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND "Order"."userId" IS NOT NULL
      AND (SELECT auth.uid())::text = "Order"."userId"
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND ("Order"."userId" IS NULL OR (SELECT auth.uid())::text = "Order"."userId")
    )
  );

CREATE POLICY "owner_orderitem_delete"
  ON public."OrderItem"
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND "Order"."userId" IS NOT NULL
      AND (SELECT auth.uid())::text = "Order"."userId"
    )
  );

-- ============================================================================
-- 3. SERVICE-ONLY TABLES (Only service_role access)
-- ============================================================================

-- VerificationToken: Service-only (used by NextAuth)
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."VerificationToken" FROM anon, authenticated;
-- Only service_role can access this table (handled by Supabase automatically)

-- ============================================================================
-- VERIFICATION: Check RLS status
-- ============================================================================

-- Verify that RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'Account', 'Session', 'User', 'VerificationToken',
    'Company', 'Category', 'Manufacturer', 'Product',
    'Order', 'OrderItem'
)
ORDER BY tablename;

