const BASE = 'https://suppliers.adorisgroup.com'

export type PortalPath = '/' | '/login' | '/login?mode=signup'

export type PortalUtmContent =
  | 'header'
  | 'header_mobile'
  | 'hero_tile'
  | 'home_section_signup'
  | 'home_section_login'
  | 'home_section_requests'
  | 'stats_cta'
  | 'footer'

/** Portal root without tracking params — for canonical/structured-data use. */
export const PORTAL_ROOT = `${BASE}/`

export const portalUrl = (path: PortalPath, content: PortalUtmContent) => {
  const u = new URL(path, BASE)
  u.searchParams.set('utm_source', 'adorisgroup.com')
  u.searchParams.set('utm_medium', 'cta')
  u.searchParams.set('utm_campaign', 'supplier_portal')
  u.searchParams.set('utm_content', content)
  return u.toString()
}
