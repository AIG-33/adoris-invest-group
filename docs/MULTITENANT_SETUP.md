# Multi-Tenant Architecture Setup Guide

## Overview
This project now supports multiple companies with different domains, languages, and pricing.

## Companies Configuration

1. **Adoris Invest Group OU**
   - Domain: `adorisgroup.com`
   - Language: ENG
   - Price Type: EU

2. **Samplify**
   - Domain: `samplify.com`
   - Language: ENG
   - Price Type: RU

3. **IVD Group**
   - Domain: `ivdgroup.eu`
   - Language: ENG
   - Price Type: EU

4. **Viena**
   - Domain: `viena.com`
   - Language: RU
   - Price Type: RU

5. **ivd.by**
   - Domain: `ivd.by`
   - Language: RU
   - Price Type: RU

6. **MedStock**
   - Domain: `medstock.com`
   - Language: RU
   - Price Type: RU

## Database Migration

### Step 1: Run SQL Migration
Execute the SQL script in Supabase SQL Editor:
```sql
-- File: prisma/migrate-to-multitenant.sql
```

This will:
- Create `Company` table
- Add `priceEU` and `priceRU` columns to `Product`
- Migrate existing `price` to `priceEU`
- Add `companyId` to `Product` and `Order`

### Step 2: Seed Companies
```bash
npm run seed:companies
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

## How It Works

### Company Detection
- Middleware automatically detects company by domain from request headers
- Company info is added to request headers: `x-company-id`, `x-company-language`, `x-company-price-type`

### Pricing
- Products have `priceEU` (required) and `priceRU` (optional)
- Price is selected based on company's `priceType`:
  - EU companies → `priceEU`
  - RU companies → `priceRU` (falls back to `priceEU` if not set)

### Usage in Code

**Server Components:**
```typescript
import { getServerCompany } from '@/lib/server-company'
import { getProductPrice } from '@/lib/product-price'

const company = await getServerCompany()
const priceType = company?.priceType || 'EU'

const price = getProductPrice(product.priceEU, product.priceRU, priceType)
```

**API Routes:**
```typescript
import { getCurrentCompany } from '@/lib/company'
import { getProductPrice } from '@/lib/product-price'

const headers = new Headers(request.headers)
const company = await getCurrentCompany(headers)
const priceType = company?.priceType || 'EU'
```

## Remaining Tasks

1. ✅ Database schema updated
2. ✅ Core utilities created
3. ✅ Main pages updated
4. ⏳ Update cart/checkout components
5. ⏳ Update order creation to save companyId
6. ⏳ Add company branding to header/footer
7. ⏳ Implement i18n translations in components
8. ⏳ Create admin panel for company management

## Testing

After migration:
1. Test with different domains (use `hosts` file for local testing)
2. Verify prices show correctly for EU/RU companies
3. Test product import with priceEU/priceRU
4. Test order creation saves correct companyId

