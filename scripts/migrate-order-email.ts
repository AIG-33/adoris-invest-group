import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting migration: Add customerEmail to Order table...')
  
  try {
    // Check current structure
    const result = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order'
      AND column_name IN ('email', 'customerEmail', 'customerPhone')
    `
    
    console.log('Current columns:', result.map(r => r.column_name))
    
    const hasEmail = result.some(r => r.column_name === 'email')
    const hasCustomerEmail = result.some(r => r.column_name === 'customerEmail')
    const hasCustomerPhone = result.some(r => r.column_name === 'customerPhone')
    
    if (hasEmail && !hasCustomerEmail) {
      console.log('📝 Renaming email to customerEmail...')
      await prisma.$executeRaw`ALTER TABLE "Order" RENAME COLUMN "email" TO "customerEmail"`
      console.log('✅ Renamed email to customerEmail')
    } else if (!hasCustomerEmail) {
      console.log('📝 Adding customerEmail column...')
      await prisma.$executeRaw`ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT ''`
      console.log('✅ Added customerEmail column')
    } else {
      console.log('✅ customerEmail column already exists')
    }
    
    if (!hasCustomerPhone) {
      console.log('📝 Adding customerPhone column...')
      await prisma.$executeRaw`ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT`
      console.log('✅ Added customerPhone column')
    } else {
      console.log('✅ customerPhone column already exists')
    }
    
    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration error:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

