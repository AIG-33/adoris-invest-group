# Adoris GSC Coverage — 2026-10-12

## What we received

File: `~/Downloads/adorisgroup.com-Coverage-2026-10-12.zip` (~2 KB).

This export is **GSC overview charts only**, not a Coverage **Drilldown** URL list.

| File (RU names) | Contents |
|-----------------|----------|
| `Диаграмма.csv` | Daily indexed / not-indexed / impressions time series |
| `Критические проблемы.csv` | Reason → page **counts** only (no URLs) |
| `Незначительные проблемы.csv` | Empty |
| `Метаданные.csv` | Sitemap label |

There is **no** `urls_0.csv` (or equivalent) with individual page URLs. That is the opposite of the ivdgroup Coverage-Drilldown zips used to build `lib/product-redirects.generated.ts`.

### Overview counts (adorisgroup.com, snapshot in zip)

| Reason (RU) | Pages |
|-------------|------:|
| Ложная ошибка 404 (soft 404) | 14 001 |
| Страница с переадресацией | 11 042 |
| Ошибка сервера (5xx) | 1 080 |
| Canonical variant | 332 |
| noindex | 77 |
| Discovered, not indexed | 49 080 |

Without URL rows we cannot map soft-404 / 5xx / redirect targets to product paths for Adoris-specific 301s.

## Already covered (shared codebase — applies to adorisgroup.com)

Middleware and SEO fixes are **host-agnostic** (`request.url` / path only; no host allowlist). Same deploy serves ivdgroup + Adoris:

- Structural 301s: `/shop` → `/products`, `/product-category/:slug[/page/N]` → `/products?category=…`, manufacturer slug remaps, `uncategorized` → `reagents-disposables`, Woo filter / `add-to-cart` cleanup (`middleware.ts`, `lib/legacy-redirects.ts`).
- Product-level 301 map from **ivdgroup** GSC Drilldown (`lib/product-redirects.generated.ts`, 289 paths) — also runs for Adoris when the path matches.
- Soft-404 hardening: real HTTP 404 + `noindex` on missing `/product/*` (`app/product/[...slug]/page.tsx`, `not-found.tsx`); no CDN force-cache on product routes.
- Sitemap `lastmod` from catalog / product `updatedAt` (`app/sitemap.xml/route.ts`, `app/sitemaps/[id]/route.ts`).

## Wayback CDX (optional check)

Tried `python3` + `urllib` against Wayback CDX for `adorisgroup.com/product/*` (previous shell exit 127 was tooling, not Archive being unreachable).

Result: **~1 855 unique product paths**, almost all already canonical **2-segment** `/product/{manufacturer}/{slug}`. **Zero** legacy 1-segment `/product/{slug}` paths — nothing useful to merge as new product 301s the way ivdgroup Drilldown URLs were.

## What the user must re-export

In Google Search Console for **adorisgroup.com**:

1. Open **Indexing → Pages** (Индексирование → Страницы).
2. Click a **reason** row that needs URL-level work (start with **Soft 404** / Ложная ошибка 404; also export **5xx** if still high).
3. On the reason detail page, use **Export** (Экспорт) → download the **Coverage Drilldown** / URL table ZIP (should contain `urls_0.csv` or similar with full URLs).
4. Repeat per high-count reason if needed (soft 404, 5xx, redirect errors).

Do **not** export only the top-level Coverage chart ZIP again — that has no URL list.

After Drilldown ZIPs are available, regenerate / merge product 301s with `scripts/build-gsc-product-redirects.ts` the same way as ivdgroup (see `docs/gsc-product-redirects-report.md`).
