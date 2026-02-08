import { PrismaClient } from '@prisma/client'

/**
 * Migration script: Add SKU to product slugs
 * 
 * Why: 95% of B2B users search by SKU (article number). Having SKU in the URL
 * significantly improves Google ranking for SKU-based searches.
 * 
 * Before: /product/manufacturer/some-product-name
 * After:  /product/manufacturer/some-product-name-SKU12345
 * 
 * The script checks if SKU is already in the slug to avoid duplicates.
 * Old URLs will be handled by the legacy redirect in the product page.
 * 
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/add-sku-to-slugs.ts
 */

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('Adding SKU to product slugs...\n')

  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      sku: true,
    },
  })

  console.log(`Found ${products.length} products\n`)

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const product of products) {
    const skuSlug = slugify(product.sku)
    
    // Skip if SKU is already in the slug
    if (product.slug.includes(skuSlug) || product.slug.endsWith(`-${skuSlug}`)) {
      skipped++
      continue
    }

    const newSlug = `${product.slug}-${skuSlug}`

    try {
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: newSlug },
      })
      updated++
      console.log(`  ✅ ${product.sku}: ${product.slug} → ${newSlug}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation — slug already exists
        // Try with full SKU as-is
        const altSlug = `${product.slug}-${product.sku.toLowerCase()}`
        try {
          await prisma.product.update({
            where: { id: product.id },
            data: { slug: altSlug },
          })
          updated++
          console.log(`  ✅ ${product.sku}: ${product.slug} → ${altSlug} (alt)`)
        } catch {
          errors++
          console.error(`  ❌ ${product.sku}: Failed to update slug (conflict)`)
        }
      } else {
        errors++
        console.error(`  ❌ ${product.sku}: ${error.message}`)
      }
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped (already has SKU): ${skipped}`)
  console.log(`Errors: ${errors}`)
  console.log(`\nOld URLs will automatically 308-redirect to new URLs.`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
