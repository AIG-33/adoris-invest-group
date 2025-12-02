import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create Users
  console.log('Creating users...')
  const hashedPassword1 = await bcrypt.hash('johndoe123', 10)
  const hashedPassword2 = await bcrypt.hash('Admin123!', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword1,
      role: 'admin',
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'ceo@adorisgroup.com' },
    update: {},
    create: {
      email: 'ceo@adorisgroup.com',
      name: 'Admin User',
      password: hashedPassword2,
      role: 'admin',
    },
  })

  console.log('✅ Users created')

  // Create Categories
  console.log('Creating categories...')
  const categories = [
    { name: 'Equipment', slug: 'equipment' },
    { name: 'Reagents & Disposables', slug: 'reagents-disposables' },
    { name: 'PCR & Molecular', slug: 'pcr-molecular' },
    { name: 'Laboratory Supplies', slug: 'laboratory-supplies' },
  ]

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  console.log('✅ Categories created')

  // Create Manufacturers
  console.log('Creating manufacturers...')
  const manufacturers = [
    { name: 'Thermo Fisher Scientific', slug: 'thermo-fisher' },
    { name: 'Abbott', slug: 'abbott' },
    { name: 'Roche', slug: 'roche' },
    { name: 'Siemens Healthineers', slug: 'siemens' },
  ]

  const createdManufacturers = await Promise.all(
    manufacturers.map((man) =>
      prisma.manufacturer.upsert({
        where: { slug: man.slug },
        update: {},
        create: man,
      })
    )
  )

  console.log('✅ Manufacturers created')

  // Create Products
  console.log('Creating products...')
  const products = [
    {
      name: 'Clinical Chemistry Analyzer System Pro 5000',
      slug: 'clinical-chemistry-analyzer-pro-5000',
      sku: 'TFS-CCA-5000',
      description: 'Advanced automated clinical chemistry analyzer with high throughput capacity. Designed for high-throughput laboratories, this advanced system delivers accurate, reliable results with exceptional efficiency. Process up to 800 tests per hour with continuous loading capability. Features 12 wavelengths (340-800nm) for exceptional analytical precision. Includes on-board refrigerated reagent storage with RFID tracking.',
      shortDesc: 'Advanced automated clinical chemistry analyzer with high throughput capacity. Ideal for large laboratories.',
      price: 42500.00,
      image: 'https://static.horiba.com/fileadmin/Horiba/_processed_/6/c/csm_C150_13062025_1578796c0b.png',
      categoryId: createdCategories[0].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 8,
      featured: true,
    },
    {
      name: 'Real-Time PCR Detection System RT-450',
      slug: 'real-time-pcr-detection-system-rt-450',
      sku: 'TFS-PCR-RT-450',
      description: 'High-precision real-time PCR system with 96-well capacity and advanced thermal control. State-of-the-art thermal cycling technology ensures accurate and reproducible results. Features fast ramp rates, precise temperature control, and gradient capabilities. Intuitive software with comprehensive data analysis tools. Ideal for gene expression analysis, genotyping, and viral load quantification.',
      shortDesc: 'High-precision real-time PCR system with 96-well capacity and advanced thermal control.',
      price: 28900.00,
      image: 'https://www.labtron.com/assets/products/LRTP-B10/17428972911.webp',
      categoryId: createdCategories[2].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 12,
      featured: true,
    },
    {
      name: 'Automated Hematology Analyzer HX-3500',
      slug: 'automated-hematology-analyzer-hx-3500',
      sku: 'ABT-HEM-3500',
      description: 'Complete blood count analyzer with 5-part differential and advanced flagging algorithms. Delivers accurate and reliable results for complete blood counts with differential. Features impedance and optical measurement technologies. Automated sample handling reduces manual intervention. Advanced flagging system identifies abnormal cells. Throughput of 60 samples per hour.',
      shortDesc: 'Complete blood count analyzer with 5-part differential and advanced flagging algorithms.',
      price: 35750.00,
      image: 'https://www.diagnocine.com/Content/Upload/Product/BK-6500-main-diagnocine_1200.jpg',
      categoryId: createdCategories[0].id,
      manufacturerId: createdManufacturers[1].id,
      stockStatus: 'in_stock',
      stockQuantity: 5,
      featured: false,
    },
    {
      name: 'UV-Visible Spectrophotometer SP-2000',
      slug: 'uv-visible-spectrophotometer-sp-2000',
      sku: 'TFS-SPEC-2000',
      description: 'Dual-beam spectrophotometer with wavelength range 190-1100nm for precise measurements. Superior optical system ensures high photometric accuracy and low stray light. Dual-beam design provides excellent baseline stability. Wavelength accuracy ±0.3nm. Ideal for quantitative analysis in clinical, pharmaceutical, and research laboratories. Includes comprehensive software package.',
      shortDesc: 'Dual-beam spectrophotometer with wavelength range 190-1100nm for precise measurements.',
      price: 18500.00,
      image: 'https://www.dotbglobal.com/wp-content/uploads/2023/11/UV-VIS-Spectrophotometer-UV-1900i.jpg',
      categoryId: createdCategories[0].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 15,
      featured: false,
    },
    {
      name: 'High-Speed Refrigerated Centrifuge RC-12000',
      slug: 'high-speed-refrigerated-centrifuge-rc-12000',
      sku: 'TFS-CENT-RC12',
      description: 'Refrigerated centrifuge with 12,000 RPM max speed and temperature control -10°C to 40°C. Powerful brushless motor provides consistent performance. Refrigeration system maintains sample integrity during high-speed runs. Microprocessor control ensures precise speed and temperature regulation. Multiple rotor options available. Quick-stop feature for time-sensitive applications.',
      shortDesc: 'Refrigerated centrifuge with 12,000 RPM max speed and temperature control -10°C to 40°C.',
      price: 22300.00,
      image: 'https://www.labtron.com/assets/products/LRF-C22/LRF-C22.webp',
      categoryId: createdCategories[0].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 10,
      featured: false,
    },
    {
      name: 'Digital Microscope System DM-4000 Pro',
      slug: 'digital-microscope-system-dm-4000-pro',
      sku: 'TFS-MICRO-4000',
      description: 'Advanced digital microscope with 4K imaging, AI-powered analysis, and cloud connectivity. High-resolution 4K camera captures stunning images and videos. AI-assisted image analysis accelerates workflows. Motorized stage enables automated scanning and tiling. Integrated LED illumination provides consistent, daylight-balanced lighting. Cloud connectivity allows remote collaboration and image sharing.',
      shortDesc: 'Advanced digital microscope with 4K imaging, AI-powered analysis, and cloud connectivity.',
      price: 31200.00,
      image: 'https://www.ocwhite.com/wp-content/uploads/2010/07/TKSZ-LDL-Background-removed.jpg',
      categoryId: createdCategories[0].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 6,
      featured: true,
    },
    {
      name: 'Pro 5000 Reagent Starter Kit',
      slug: 'pro-5000-reagent-starter-kit',
      sku: 'TFS-REA-KIT',
      description: 'Comprehensive reagent starter kit for Clinical Chemistry Analyzer Pro 5000. Includes all essential reagents for common chemistry tests: glucose, cholesterol, triglycerides, ALT, AST, albumin, total protein, creatinine, urea. Each reagent is ready-to-use with on-board stability. Kit includes calibrators and controls. Sufficient for approximately 1000 tests.',
      shortDesc: 'Comprehensive reagent starter kit for Clinical Chemistry Analyzer Pro 5000.',
      price: 1850.00,
      image: 'https://www.carolina.com/images/product/large/840333.jpg',
      categoryId: createdCategories[1].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 45,
      featured: false,
    },
    {
      name: 'Multi-Calibrator Set (6 Levels)',
      slug: 'multi-calibrator-set-6-levels',
      sku: 'TFS-CAL-6L',
      description: 'Six-level multi-analyte calibrator set for clinical chemistry analyzers. Covers wide measuring ranges for multiple analytes. Lyophilized format ensures long shelf life. Matrix matched to human serum for accurate results. Includes comprehensive value assignment documentation. Compatible with all major clinical chemistry platforms. Each level contains 3x5mL vials.',
      shortDesc: 'Six-level multi-analyte calibrator set for clinical chemistry analyzers.',
      price: 725.00,
      image: 'https://www.palmerwahl.com/wp-content/uploads/2021/10/C100.jpg',
      categoryId: createdCategories[1].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 78,
      featured: false,
    },
    {
      name: 'Quality Control Material (3 Levels)',
      slug: 'quality-control-material-3-levels',
      sku: 'TFS-QC-3L',
      description: 'Three-level quality control material for routine chemistry testing. Normal, high, and low levels cover clinical decision points. Lyophilized format with excellent stability. Comprehensive value assignment with method-specific target values and ranges. Compatible with major clinical chemistry analyzers. Each level includes 10x5mL vials for daily QC.',
      shortDesc: 'Three-level quality control material for routine chemistry testing.',
      price: 485.00,
      image: 'https://resources.revvity.com/images/pico-glass-vial-7ml-foil-lined-urea-screw-cap-700x700-final.jpg?format=auto&width=520',
      categoryId: createdCategories[1].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 92,
      featured: false,
    },
    {
      name: 'Replacement Cuvette Set (120 pcs)',
      slug: 'replacement-cuvette-set-120-pcs',
      sku: 'TFS-CUV-120',
      description: 'Premium optical quality quartz cuvettes for Clinical Chemistry Analyzer Pro 5000. Set of 120 permanent cuvettes manufactured from high-grade quartz glass. Excellent optical characteristics ensure accurate photometric measurements. Each cuvette undergoes rigorous quality control. Easy installation and removal. Expected lifetime: 100,000+ measurements per cuvette.',
      shortDesc: 'Premium optical quality quartz cuvettes for Clinical Chemistry Analyzer Pro 5000.',
      price: 3200.00,
      image: 'https://globescientific.com/cdn/shop/files/112137-112157_54951ed3-fd3c-4b4e-ad45-951a937bdd85.jpg?v=1757508824&width=720',
      categoryId: createdCategories[3].id,
      manufacturerId: createdManufacturers[0].id,
      stockStatus: 'in_stock',
      stockQuantity: 24,
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }

  console.log('✅ Products created')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
