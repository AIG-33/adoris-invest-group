import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding companies...')

  const companies = [
    {
      name: 'Adoris Invest Group OU',
      slug: 'adoris-invest-group',
      domain: 'adorisgroup.com',
      language: 'en',
      priceType: 'EU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
    {
      name: 'Samplify',
      slug: 'samplify',
      domain: 'samplify.com',
      language: 'en',
      priceType: 'RU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
    {
      name: 'IVD Group',
      slug: 'ivd-group',
      domain: 'ivdgroup.eu',
      language: 'en',
      priceType: 'EU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
    {
      name: 'Viena',
      slug: 'viena',
      domain: 'viena.com',
      language: 'ru',
      priceType: 'RU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
    {
      name: 'ivd.by',
      slug: 'ivd-by',
      domain: 'ivd.by',
      language: 'ru',
      priceType: 'RU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
    {
      name: 'MedStock',
      slug: 'medstock',
      domain: 'medstock.com',
      language: 'ru',
      priceType: 'RU',
      email: 'info@adorisgroup.com',
      phone: '+48793081310',
    },
  ]

  for (const companyData of companies) {
    const company = await prisma.company.upsert({
      where: { domain: companyData.domain },
      update: companyData,
      create: companyData,
    })
    console.log(`✅ ${company.name} (${company.domain})`)
  }

  console.log('✨ Companies seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding companies:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

