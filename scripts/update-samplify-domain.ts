import { PrismaClient } from '@prisma/client'
import { logger } from '../lib/logger'

const prisma = new PrismaClient()

const TARGET_DOMAIN = 'shop.samplify.org'

async function main() {
  logger.log(`Updating Samplify company domain to ${TARGET_DOMAIN}...`)

  try {
    let company = await prisma.company.findFirst({
      where: {
        OR: [
          { slug: 'samplify' },
          { domain: 'samplify.com' },
          { domain: 'samplify.org' },
          { domain: 'shop.samplify.org' },
        ],
      },
    })

    if (!company) {
      logger.error('❌ Samplify company not found. Create the company in admin or run seed-companies first.')
      return
    }

    const updated = await prisma.company.update({
      where: { id: company.id },
      data: { domain: TARGET_DOMAIN },
    })

    logger.log(`✅ Updated ${updated.name} domain to: ${updated.domain}`)
    logger.log('✨ Site shop.samplify.org will now show Samplify details.')
  } catch (error: any) {
    if (error.code === 'P2002') {
      logger.error(`❌ Another company already uses domain ${TARGET_DOMAIN}. Use admin to fix.`)
    } else {
      logger.error('❌ Error updating domain:', error)
    }
  }
}

main()
  .catch((e) => {
    logger.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
