# GSC Adoris (adorisgroup.com) redirect report

Generated: 2026-10-12T12:25:00.000Z

## Input

`/Users/gmaxby/Downloads/adorisgroup.com-Coverage-2026-10-12.zip`

This is a **Coverage overview** export (Диаграмма / Критические проблемы / Метаданные), **not** a Coverage-Drilldown. It contains **no URL table** (`Таблица.csv` with `URL` column), so product-level matching cannot run from this file alone.

## Summary

| Metric | Count |
|--------|------:|
| Unique GSC URLs in export | **0** |
| New matched product 301s | **0** |
| Unmatched product paths | **0** (no URLs to match) |
| Existing product 301s already live (host-agnostic from ivdgroup map) | **289** |
| Structural fix shipped this pass | `/manufacturer/:slug` → `/products?manufacturer=` |

### Critical issues (from overview CSV)

| Reason (RU) | Pages |
|-------------|------:|
| Soft 404 (Ложная ошибка 404) | 14001 |
| Page with redirect | 11042 |
| Server error (5xx) | 1080 |
| Canonical variant | 332 |
| noindex | 77 |
| Duplicate, no user-chosen canonical | 72 |
| Not found (404) | 8 |
| Blocked by robots.txt | 2 |
| Crawled, not indexed | 13934 |
| Canonical mismatch (Google vs user) | 164 |

## What was fixed without URL lists

1. **Generic manufacturer archive 301** in `middleware.ts`:
   - `/manufacturer/:slug` and `/manufacturer/:slug/page/N`
   - → `/products?manufacturer=:canonical` (uses `MANUFACTURER_SLUG_REDIRECTS`)
2. Confirmed existing host-agnostic redirects already apply on adorisgroup.com (`/shop`, `/product-category/...`, Woo filters, product path map).
3. Regenerator script (`scripts/build-gsc-product-redirects.ts`) now accepts `--domain=adorisgroup.com`, `--csvs=...`, `--merge`, and writes this report path.

## What is still needed from you

Export **Coverage → Drilldown** ZIPs (same as ivdgroup) for at least:

1. Soft 404 / Ложная ошибка 404  
2. Not found (404)  
3. Optional: crawled-not-indexed, canonical issues  

Each drilldown zip should include `Таблица.csv` with a `URL` column (GSC caps ~1000 URLs per export). Drop them in Downloads and re-run:

```bash
# after extracting Таблица.csv files to e.g. /tmp/gsc-adoris/*.csv
npx tsx --require dotenv/config scripts/build-gsc-product-redirects.ts \
  --domain=adorisgroup.com \
  --csvs=/tmp/gsc-adoris/file_0.csv,/tmp/gsc-adoris/file_1.csv \
  --merge \
  --report=docs/gsc-adoris-product-redirects-report.md
```

Do **not** invent product redirects without those URL lists.

## Unmatched paths

_None — input contained no product URLs._
