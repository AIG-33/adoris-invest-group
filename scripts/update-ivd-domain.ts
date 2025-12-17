import { PrismaClient } from '@prisma/client'
import { logger } from '../lib/logger'

const prisma = new PrismaClient()

async function main() {
  logger.log('Updating IVD Group domain to shop.ivdgroup.eu...')

  try {
    // Try to find by current domain
    let company = await prisma.company.findUnique({
      where: { domain: 'ivdgroup.eu' },
    })

    if (!company) {
      // Try to find by slug
      company = await prisma.company.findUnique({
        where: { slug: 'ivd-group' },
      })
    }

    if (!company) {
      logger.error('❌ IVD Group company not found. Please check the database.')
      return
    }

    // Update domain
    const updated = await prisma.company.update({
      where: { id: company.id },
      data: {
        domain: 'shop.ivdgroup.eu',
      },
    })

    logger.log(`✅ Updated ${updated.name} domain to: ${updated.domain}`)
    logger.log('✨ Domain update complete!')
    logger.log('')
    logger.log('📝 Note: Middleware supports subdomains, so both shop.ivdgroup.eu and ivdgroup.eu will work.')
  } catch (error: any) {
    if (error.code === 'P2025') {
      logger.error('❌ Company not found. Please check the database.')
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

