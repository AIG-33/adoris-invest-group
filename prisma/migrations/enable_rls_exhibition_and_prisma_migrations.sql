-- Fix Supabase Security Advisor: "RLS Disabled in Public"
-- for leftover / internal tables not covered by enable_rls_all_tables.sql
--
-- Exhibition: not in current Prisma schema (exhibitions page is hardcoded)
-- _prisma_migrations: Prisma internal — must not be exposed via PostgREST
--
-- App access via Prisma (postgres / bypass role) is unaffected: RLS does not
-- apply to table owners / superusers unless FORCE ROW LEVEL SECURITY is set.

-- ============================================================================
-- Exhibition
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public."Exhibition"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."Exhibition" ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON public."Exhibition" FROM anon, authenticated';
    -- No policies for anon/authenticated → denied via PostgREST API
    -- Optional: allow authenticated admin reads if needed later
  END IF;
END $$;

-- ============================================================================
-- _prisma_migrations
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON public._prisma_migrations FROM anon, authenticated';
  END IF;
END $$;

-- Verification
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('Exhibition', '_prisma_migrations')
ORDER BY c.relname;
