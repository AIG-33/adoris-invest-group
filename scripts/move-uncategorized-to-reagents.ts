/**
 * Move all products in "Uncategorized" → "Reagents & Disposables",
 * then delete the empty Uncategorized category.
 *
 * Middleware already 301s ?category=uncategorized → reagents-disposables
 * (see CATEGORY_SLUG_REDIRECTS).
 *
 * Usage:
 *   npx tsx --require dotenv/config scripts/move-uncategorized-to-reagents.ts
 *   npx tsx --require dotenv/config scripts/move-uncategorized-to-reagents.ts --apply
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

const CANONICAL = {
  name: 'Reagents & Disposables',
  slug: 'reagents-disposables',
}

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN ===')

  const [uncategorized, reagents] = await Promise.all([
    prisma.category.findFirst({
      where: {
        OR: [{ name: 'Uncategorized' }, { slug: 'uncategorized' }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    }),
    prisma.category.findFirst({
      where: {
        OR: [{ name: CANONICAL.name }, { slug: CANONICAL.slug }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    }),
  ])

  if (!reagents) {
    throw new Error(
      `Canonical category "${CANONICAL.name}" (${CANONICAL.slug}) not found`
    )
  }

  if (!uncategorized) {
    console.log('Uncategorized category already gone — nothing to do.')
    console.log(
      `Reagents & Disposables currently has ${reagents._count.products} products.`
    )
    return
  }

  const toMove = uncategorized._count.products
  console.log(
    `Uncategorized (${uncategorized.slug}): ${toMove} products → ${reagents.name} (${reagents.slug}, currently ${reagents._count.products})`
  )

  if (!APPLY) {
    console.log('Dry-run only. Re-run with --apply to update.')
    return
  }

  if (toMove > 0) {
    const result = await prisma.product.updateMany({
      where: { categoryId: uncategorized.id },
      data: { categoryId: reagents.id },
    })
    console.log(`Updated ${result.count} products.`)
  } else {
    console.log('No products to move.')
  }

  const remaining = await prisma.product.count({
    where: { categoryId: uncategorized.id },
  })
  if (remaining > 0) {
    throw new Error(
      `Refusing to delete Uncategorized — still has ${remaining} products`
    )
  }

  await prisma.category.delete({ where: { id: uncategorized.id } })
  console.log('Deleted empty Uncategorized category.')

  const after = await prisma.category.findUnique({
    where: { id: reagents.id },
    select: { _count: { select: { products: true } } },
  })
  console.log(
    `Reagents & Disposables now has ${after?._count.products ?? '?'} products.`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
