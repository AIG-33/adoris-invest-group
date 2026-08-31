/**
 * Import EnkiLife products from the IVDGroup listing spreadsheet.
 *
 * Purchase prices in the sheet are marked up 20% → stored as priceEU
 * (EU selling price). RU tenants still get ×1.155 at display time.
 *
 * Usage:
 *   npx tsx scripts/import-enkilife.ts [path-to-xlsx]
 */
import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'
import { prisma } from '../lib/db'

const DEFAULT_XLSX =
  '/Users/gmaxby/Downloads/EnkiLife Product Listing-IVDGroup-20260830-w.xlsx'
const MARKUP = 1.2
const LOGO_PATH = '/logos/enkilife.png'
const BATCH_SIZE = 500

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 180)
}

function parsePrice(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  const m = String(raw).replace(/\s/g, '').match(/[\d]+(?:[.,]\d+)?/)
  if (!m) return null
  return parseFloat(m[0].replace(',', '.'))
}

function uniqueSlug(baseSlug: string, sku: string, existing: Set<string>): string {
  const skuSlug = `${baseSlug}-${generateSlug(sku)}`
  let slug = existing.has(skuSlug) ? skuSlug : skuSlug
  if (!existing.has(slug)) return slug
  let n = 1
  while (existing.has(`${slug}-${n}`)) n++
  return `${slug}-${n}`
}

async function main() {
  const xlsxPath = process.argv[2] || DEFAULT_XLSX
  if (!fs.existsSync(xlsxPath)) {
    throw new Error(`Spreadsheet not found: ${xlsxPath}`)
  }

  console.log(`Reading ${xlsxPath}…`)
  const wb = XLSX.readFile(xlsxPath, { cellDates: false })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
  })
  console.log(`Rows in sheet: ${rows.length}`)

  // Ensure category
  const category = await prisma.category.upsert({
    where: { slug: 'reagents-disposables' },
    update: {},
    create: {
      id: 'cat_reagents_001',
      name: 'Reagents & Disposables',
      slug: 'reagents-disposables',
    },
  })
  console.log(`Category: ${category.name} (${category.id})`)

  // Ensure manufacturer + logo
  const manufacturer = await prisma.manufacturer.upsert({
    where: { slug: 'enkilife' },
    update: {
      name: 'EnkiLife',
      logo: LOGO_PATH,
    },
    create: {
      name: 'EnkiLife',
      slug: 'enkilife',
      logo: LOGO_PATH,
    },
  })
  console.log(`Manufacturer: ${manufacturer.name} (${manufacturer.id}) logo=${manufacturer.logo}`)

  // Preload existing SKUs/slugs to avoid unique collisions
  console.log('Loading existing SKUs and slugs…')
  const existingProducts = await prisma.product.findMany({
    select: { sku: true, slug: true },
  })
  const existingSkus = new Set(existingProducts.map((p) => p.sku))
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))
  console.log(`Existing products: ${existingSkus.size}`)

  type Row = {
    sku: string
    name: string
    description: string | null
    priceEU: number
    slug: string
  }

  const toCreate: Row[] = []
  const toUpdate: Row[] = []
  let skipped = 0
  const seenInFile = new Set<string>()

  for (const row of rows) {
    const sku = String(row['SKU'] ?? '').trim()
    const name = String(row['Product Name'] ?? '').trim()
    const descriptionRaw = row['Product Description']
    const description =
      descriptionRaw === null || descriptionRaw === undefined
        ? null
        : String(descriptionRaw).trim() || null
    const purchase = parsePrice(row['Price(€)'])

    if (!sku || !name || purchase === null || purchase <= 0) {
      skipped++
      continue
    }
    if (seenInFile.has(sku)) {
      skipped++
      continue
    }
    seenInFile.add(sku)

    const priceEU = Math.round(purchase * MARKUP * 100) / 100
    const baseSlug = generateSlug(name) || generateSlug(sku)
    const slug = uniqueSlug(baseSlug, sku, existingSlugs)
    existingSlugs.add(slug)

    const item: Row = { sku, name, description, priceEU, slug }
    if (existingSkus.has(sku)) {
      toUpdate.push(item)
    } else {
      toCreate.push(item)
      existingSkus.add(sku)
    }
  }

  console.log(
    `Parsed: create=${toCreate.length} update=${toUpdate.length} skipped=${skipped}`
  )

  let created = 0
  for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
    const batch = toCreate.slice(i, i + BATCH_SIZE)
    await prisma.product.createMany({
      data: batch.map((p) => ({
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceEU: p.priceEU,
        priceRU: null,
        price: p.priceEU,
        image: '',
        categoryId: category.id,
        manufacturerId: manufacturer.id,
        stockStatus: 'in_stock' as const,
        stockQuantity: 0,
        featured: false,
      })),
      skipDuplicates: true,
    })
    created += batch.length
    if (created % 2000 === 0 || created === toCreate.length) {
      console.log(`  created ${created}/${toCreate.length}`)
    }
  }

  let updated = 0
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const batch = toUpdate.slice(i, i + BATCH_SIZE)
    await prisma.$transaction(
      batch.map((p) =>
        prisma.product.update({
          where: { sku: p.sku },
          data: {
            name: p.name,
            description: p.description,
            priceEU: p.priceEU,
            price: p.priceEU,
            priceRU: null,
            categoryId: category.id,
            manufacturerId: manufacturer.id,
          },
        })
      )
    )
    updated += batch.length
    if (updated % 2000 === 0 || updated === toUpdate.length) {
      console.log(`  updated ${updated}/${toUpdate.length}`)
    }
  }

  const finalCount = await prisma.product.count({
    where: { manufacturerId: manufacturer.id },
  })
  const priceSample = await prisma.product.findMany({
    where: { manufacturerId: manufacturer.id },
    select: { sku: true, name: true, priceEU: true },
    take: 3,
    orderBy: { sku: 'asc' },
  })

  console.log('\nDone.')
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  EnkiLife products in DB: ${finalCount}`)
  console.log('  Sample:', priceSample)
  console.log(
    '  Note: Next.js caches manufacturer lists for ~1h (tag "manufacturers").'
  )
  console.log(
    '  Restart the Next.js server or revalidateTag("manufacturers") after import,'
  )
  console.log(
    '  and ensure public/logos/enkilife.png is deployed with the app.'
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
