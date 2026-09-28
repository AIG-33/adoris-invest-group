/**
 * Merge manufacturer typos / Cyrillic lookalikes into canonical rows.
 *
 * Usage:
 *   npx tsx --require dotenv/config scripts/merge-manufacturers.ts --dry-run
 *   npx tsx --require dotenv/config scripts/merge-manufacturers.ts --apply
 *
 * Idempotent: re-running after a successful apply is a no-op (sources gone).
 * Strategy: reassign product.manufacturerId → canonical, then delete empty source.
 * Old manufacturer slugs are printed for middleware 301s (?manufacturer=).
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

type MergeRule = {
  /** Exact source names to merge away (case-sensitive as stored in DB) */
  sources: string[]
  /** Canonical target name (must exist, or will be created / renamed) */
  targetName: string
  /** Optional: rename target if found under an alternate exact name */
  targetAliases?: string[]
  note?: string
}

const RULES: MergeRule[] = [
  { sources: ['Merk'], targetName: 'Merck' },
  { sources: ['Satorius'], targetName: 'Sartorius' },
  { sources: ['Ocford Nanopore'], targetName: 'Oxford Nanopore Technologies' },
  { sources: ['Neofrooxx'], targetName: 'neoFroxx' },
  { sources: ['Machery Nagel'], targetName: 'Macherey-Nagel' },
  { sources: ['cityva', 'Сytiva'], targetName: 'Cytiva' },
  { sources: ['Аbcam'], targetName: 'abcam' },
  {
    sources: ['Sigma (Suplesco)'],
    targetName: 'Supelco',
    note: 'Suplesco is a typo for Supelco (Merck brand line)',
  },
  { sources: ['CarlRoth'], targetName: 'Carl Roth' },
  { sources: ['STEMCELL'], targetName: 'StemCell' },
  { sources: ['AppliChem'], targetName: 'Applichem' },
  {
    sources: ['Dr. Ehrenstorfer', 'Dr.Ehrenstorfer'],
    targetName: 'Dr Ehrenstorfer',
  },
  // Extra near-dupes found in audit (safe exact-normalized matches)
  { sources: ['ABSiex'], targetName: 'AB Siex' },
  { sources: ['Acro biosystems'], targetName: 'AcroBiosystems' },
  { sources: ['Bio X Cell'], targetName: 'BIOXCELL' },
  { sources: ['Bio-Techne'], targetName: 'Biotechne' },
  { sources: ['iba-lifesciences'], targetName: 'IBA LifeSciences' },
  { sources: ['Protein Simple'], targetName: 'ProteinSimple' },
]

/** Special case: rename IVD Group as manufacturer → private label (keep products). */
const IVD_RENAME = {
  from: 'IVD Group Sp. z o.o.',
  to: 'IVD Group Private Label',
  toSlug: 'ivd-group-private-label',
}

async function findByName(name: string) {
  return prisma.manufacturer.findUnique({
    where: { name },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { products: true } },
    },
  })
}

async function mergeInto(sourceId: string, targetId: string, sourceSlug: string, targetSlug: string) {
  const moved = await prisma.product.updateMany({
    where: { manufacturerId: sourceId },
    data: { manufacturerId: targetId },
  })
  await prisma.manufacturer.delete({ where: { id: sourceId } })
  return { moved: moved.count, fromSlug: sourceSlug, toSlug: targetSlug }
}

async function main() {
  console.log(APPLY ? '=== APPLY mode ===' : '=== DRY-RUN (pass --apply to write) ===')
  const redirectMap: Array<{ from: string; to: string; products: number }> = []

  for (const rule of RULES) {
    console.log(`\n--- ${rule.sources.join(' | ')} → ${rule.targetName}${rule.note ? ` (${rule.note})` : ''}`)

    let target =
      (await findByName(rule.targetName)) ||
      (rule.targetAliases
        ? (await Promise.all(rule.targetAliases.map(findByName))).find(Boolean)
        : null)

    if (!target) {
      console.log(`  SKIP: target "${rule.targetName}" not found`)
      continue
    }

    for (const sourceName of rule.sources) {
      const source = await findByName(sourceName)
      if (!source) {
        console.log(`  OK (already merged): "${sourceName}" absent`)
        continue
      }
      if (source.id === target.id) {
        console.log(`  OK: "${sourceName}" is already the target`)
        continue
      }

      console.log(
        `  Merge ${source._count.products} products: "${source.name}" (${source.slug}) → "${target.name}" (${target.slug})`
      )
      redirectMap.push({
        from: source.slug,
        to: target.slug,
        products: source._count.products,
      })

      if (APPLY) {
        const result = await mergeInto(source.id, target.id, source.slug, target.slug)
        console.log(`  APPLIED: moved ${result.moved}, deleted source`)
      }
    }
  }

  // IVD Group private-label rename
  console.log(`\n--- Rename "${IVD_RENAME.from}" → "${IVD_RENAME.to}"`)
  const ivd = await findByName(IVD_RENAME.from)
  const existingLabel = await findByName(IVD_RENAME.to)
  if (!ivd && existingLabel) {
    console.log(`  OK (already renamed): "${IVD_RENAME.to}" exists with ${existingLabel._count.products} products`)
  } else if (!ivd) {
    console.log(`  SKIP: "${IVD_RENAME.from}" not found`)
  } else if (existingLabel && existingLabel.id !== ivd.id) {
    // Merge into existing private-label row
    console.log(
      `  Merge ${ivd._count.products} into existing "${existingLabel.name}" then drop source`
    )
    redirectMap.push({ from: ivd.slug, to: existingLabel.slug, products: ivd._count.products })
    if (APPLY) {
      await mergeInto(ivd.id, existingLabel.id, ivd.slug, existingLabel.slug)
      console.log('  APPLIED')
    }
  } else {
    console.log(
      `  Rename manufacturer (${ivd._count.products} SKUs) — keep as private-label peer, not a Merck-class brand`
    )
    redirectMap.push({ from: ivd.slug, to: IVD_RENAME.toSlug, products: ivd._count.products })
    if (APPLY) {
      await prisma.manufacturer.update({
        where: { id: ivd.id },
        data: { name: IVD_RENAME.to, slug: IVD_RENAME.toSlug },
      })
      console.log('  APPLIED rename')
    }
  }

  console.log('\n=== Manufacturer slug redirects to add in middleware ===')
  for (const r of redirectMap) {
    console.log(`  ${r.from} → ${r.to}  (${r.products} products)`)
  }
  console.log(`\nTotal redirect rules: ${redirectMap.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
