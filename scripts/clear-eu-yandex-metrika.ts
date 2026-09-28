/**
 * Clear Yandex Metrika IDs on EU-facing tenants (GDPR / compliance).
 * Keeps Metrika on .by / .ru local-market companies.
 *
 * Usage:
 *   npx tsx --require dotenv/config scripts/clear-eu-yandex-metrika.ts --dry-run
 *   npx tsx --require dotenv/config scripts/clear-eu-yandex-metrika.ts --apply
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

/** Domains where Metrika must be cleared (EU / non-CIS marketing sites). */
const EU_DOMAINS = ['ivdgroup.eu', 'adorisgroup.com']

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN ===')
  const companies = await prisma.company.findMany({
    select: { id: true, name: true, domain: true, yandexMetrikaId: true },
  })

  for (const c of companies) {
    const isEu = EU_DOMAINS.includes(c.domain) || c.domain.endsWith('.eu')
    if (!isEu) {
      console.log(`KEEP  ${c.domain}  metrika=${c.yandexMetrikaId ?? 'null'}`)
      continue
    }
    if (!c.yandexMetrikaId) {
      console.log(`OK    ${c.domain}  already null`)
      continue
    }
    console.log(`CLEAR ${c.domain}  was ${c.yandexMetrikaId}`)
    if (APPLY) {
      await prisma.company.update({
        where: { id: c.id },
        data: { yandexMetrikaId: null },
      })
      console.log(`  APPLIED`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
