/**
 * Category cleanup:
 *   a) Merge "Reagents and Disposables" → "Reagents & Disposables"
 *   b) Delete empty (0) junk categories
 *   c) Retire brand-named categories that duplicate a manufacturer
 *      (reassign products to Reagents & Disposables; manufacturer filter still works)
 *   d) Merge tiny (1–2) junk categories into Reagents & Disposables
 *   e) Leave Uncategorized mass-recategorization as a documented follow-up
 *
 * Usage:
 *   npx tsx --require dotenv/config scripts/cleanup-categories.ts --dry-run
 *   npx tsx --require dotenv/config scripts/cleanup-categories.ts --apply
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

const CANONICAL_REAGENTS = {
  name: 'Reagents & Disposables',
  slug: 'reagents-disposables',
}

const DUP_REAGENTS = {
  name: 'Reagents and Disposables',
  slug: 'reagents-and-disposables',
}

/** Brand categories that mirror a manufacturer — retire into Reagents. */
const BRAND_CATEGORIES = [
  'Abbott',
  'BD',
  'Biomerieux',
  'Illumina',
  'Jena Bioscience',
  'Phadia',
  'Promega',
  'Qiagen',
  'Siemens',
  'Sigma-Aldrich',
  'USP',
  'BioLegend',
  'Capricorn',
  'Cell Signaling',
  'NEB',
  'Roche',
  'Thermo Fisher',
]

/** Empty/tiny junk safe to drop or fold into Reagents. */
const JUNK_OR_TINY = [
  'Biochemistry',
  'Coagulation',
  'COVID-19 testing',
  'ILabU™ kits. Open new revenues for your IVD business',
  'IVD GROUP Products',
  'MicroTubes',
  'PCR',
  'PCR-tubes',
  'Pipette tips',
  'Tips',
  'Laboratory Supplies',
  'PCR & Molecular',
  'PCR-plates',
  'SARS-2 COVID 19',
  'Swabs',
]

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN ===')
  const redirects: Array<{ from: string; to: string }> = []

  const reagents = await prisma.category.findUnique({
    where: { name: CANONICAL_REAGENTS.name },
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
  })
  if (!reagents) {
    throw new Error(`Canonical category "${CANONICAL_REAGENTS.name}" not found`)
  }
  console.log(`Canonical: ${reagents.name} (${reagents._count.products} products, slug=${reagents.slug})`)

  // a) Merge Reagents and Disposables → Reagents & Disposables
  const dup = await prisma.category.findUnique({
    where: { name: DUP_REAGENTS.name },
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
  })
  if (!dup) {
    console.log(`\n(a) OK: "${DUP_REAGENTS.name}" already merged`)
  } else {
    console.log(`\n(a) Merge ${dup._count.products} products: "${dup.name}" → "${reagents.name}"`)
    redirects.push({ from: dup.slug, to: reagents.slug })
    if (APPLY) {
      await prisma.product.updateMany({
        where: { categoryId: dup.id },
        data: { categoryId: reagents.id },
      })
      await prisma.category.delete({ where: { id: dup.id } })
      console.log('  APPLIED')
    }
  }

  // Helper: move products to reagents then delete category
  async function retireCategory(name: string, reason: string) {
    const cat = await prisma.category.findUnique({
      where: { name },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
    })
    if (!cat) {
      console.log(`  OK (gone): ${name}`)
      return
    }
    if (cat.id === reagents!.id) return
    console.log(`  ${reason}: "${cat.name}" (${cat._count.products}) → ${reagents!.name}`)
    redirects.push({ from: cat.slug, to: reagents!.slug })
    if (APPLY) {
      if (cat._count.products > 0) {
        await prisma.product.updateMany({
          where: { categoryId: cat.id },
          data: { categoryId: reagents!.id },
        })
      }
      await prisma.category.delete({ where: { id: cat.id } })
      console.log('    APPLIED')
    }
  }

  console.log('\n(b+d) Empty / tiny junk categories')
  for (const name of JUNK_OR_TINY) {
    await retireCategory(name, 'junk/tiny')
  }

  console.log('\n(c) Brand-named categories → Reagents (manufacturer filter remains)')
  for (const name of BRAND_CATEGORIES) {
    await retireCategory(name, 'brand-dupe')
  }

  // Also delete any remaining empty categories except Uncategorized + Reagents
  console.log('\n(b+) Sweep remaining empty categories')
  const empties = await prisma.category.findMany({
    where: { products: { none: {} } },
    select: { id: true, name: true, slug: true },
  })
  for (const cat of empties) {
    if (cat.id === reagents.id || cat.name === 'Uncategorized') continue
    console.log(`  delete empty: "${cat.name}"`)
    redirects.push({ from: cat.slug, to: reagents.slug })
    if (APPLY) {
      await prisma.category.delete({ where: { id: cat.id } })
      console.log('    APPLIED')
    }
  }

  const uncategorized = await prisma.category.findUnique({
    where: { name: 'Uncategorized' },
    select: { _count: { select: { products: true } } },
  })
  console.log(
    `\n(e) FOLLOW-UP: Uncategorized still has ${uncategorized?._count.products ?? 0} products — do NOT auto-recategorize in this pass.`
  )

  console.log('\n=== Category slug redirects ===')
  const unique = new Map(redirects.map((r) => [r.from, r.to]))
  for (const [from, to] of unique) console.log(`  ${from} → ${to}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
