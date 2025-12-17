import { PrismaClient } from '@prisma/client'
import { logger } from '../lib/logger'

const prisma = new PrismaClient()

async function main() {
  logger.log('Updating IVD Group domain to shop.ivdgroup.eu...')

  // Update IVD Group domain
  const company = await prisma.company.update({
    where: { domain: 'ivdgroup.eu' },
    data: {
      domain: 'shop.ivdgroup.eu',
    },
  })

  logger.log(`✅ Updated ${company.name} domain to: ${company.domain}`)
  logger.log('✨ Domain update complete!')
}

main()
  .catch((e) => {
    logger.error('❌ Error updating domain:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

