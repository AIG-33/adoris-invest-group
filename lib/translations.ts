export type Language = 'en' | 'ru'

export interface Translations {
  // Homepage
  homepage: {
    hero: {
      reagentsTitle: string
      reagentsSubtitle: string
      reagentsDescription: string
      bulkOrderTitle: string
      bulkOrderSubtitle: string
      bulkOrderDescription: string
      supplierTitle: string
      supplierSubtitle: string
      supplierDescription: string
      shopNow: string
      tryBulkOrder: string
      becomeSupplier: string
      browseCatalog: string
      searchPlaceholder: string
      // Tri-pillar value props rendered below the search bar
      pathwaysEyebrow: string
      pathwaysHeading: string
      pathway1: {
        step: string
        title: string
        description: string
        cta: string
        microCopy: string
      }
      pathway2: {
        step: string
        title: string
        description: string
        cta: string
        microCopy: string
      }
      pathway3: {
        step: string
        title: string
        description: string
        cta: string
        microCopy: string
      }
    }
    featuredProducts: {
      title: string
      subtitle: string
      viewAll: string
    }
    manufacturers: {
      title: string
    }
    categories: {
      title: string
      subtitle: string
      products: string
      viewAll: string
    }
    stats: {
      whyChoose: string
      readyToOrder: string
      minimumOrder: string
      browseCatalog: string
      viewTerms: string
      stats: {
        medicalProducts: { value: string; label: string; description: string }
        manufacturers: { value: string; label: string; description: string }
        compliance: { value: string; label: string; description: string }
        delivery: { value: string; label: string; description: string }
      }
      features: {
        originalProducts: { title: string; description: string }
        volumeDiscounts: { title: string; description: string }
        coldChain: { title: string; description: string }
        exwVilnius: { title: string; description: string }
      }
    }
  }
  
  // Navigation
  nav: {
    home: string
    products: string
    catalog: string
    company: string
    about: string
    team: string
    exhibitions: string
    terms: string
    faq: string
    account: string
    cart: string
    checkout: string
    login: string
    logout: string
    admin: string
    bulkOrder: string
    supplier: string
    search: string
  }
  
  // Common
  common: {
    addToCart: string
    price: string
    total: string
    subtotal: string
    quantity: string
    remove: string
    save: string
    cancel: string
    search: string
    filter: string
    loading: string
    edit: string
    delete: string
    close: string
    back: string
    next: string
    previous: string
    continue: string
    confirm: string
  }
  
  // About page
  about: {
    hero: {
      title: string
      subtitle: string
    }
    whoWeAre: {
      title: string
      paragraph1: string
      paragraph2: string
      paragraph3: string
    }
    stats: {
      yearsExperience: string
      countriesServed: string
      globalPartners: string
      annualRevenue: string
    }
    values: {
      title: string
      quality: {
        title: string
        description: string
      }
      customer: {
        title: string
        description: string
      }
      integrity: {
        title: string
        description: string
      }
      innovation: {
        title: string
        description: string
      }
    }
    services: {
      title: string
      distribution: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
      }
      consulting: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
      }
      partnerships: {
        title: string
        description: string
      }
    }
    growth: {
      title: string
      revenueGrowth: string
      profitGrowth: string
      marketReach: string
    }
    cta: {
      title: string
      subtitle: string
      contactUs: string
    }
  }
  
  // Products page
  products: {
    title: string
    filters: {
      category: string
      manufacturer: string
      priceRange: string
      showAll: string
    }
    sort: {
      default: string
      priceAsc: string
      priceDesc: string
      nameAsc: string
      nameDesc: string
    }
    noResults: string
    showing: string
    of: string
    results: string
  }
  
  // Product detail
  product: {
    sku: string
    description: string
    manufacturer: string
    category: string
    b2bPrice: string
    availableByOrder: string
    deliveryInfo: string
    addToCart: string
    edit: string
    relatedProducts: string
    home: string
    products: string
  }
  
  // Cart
  cart: {
    title: string
    empty: string
    emptyDescription: string
    browseProducts: string
    items: string
    subtotal: string
    shipping: string
    free: string
    discount: string
    total: string
    proceedToCheckout: string
    continueShopping: string
  }
  
  // Checkout
  checkout: {
    title: string
    billingInfo: string
    orderSummary: string
    placeOrder: string
    processing: string
    secure: string
    gdpr: string
    logisticFeeNotice: string
    logisticServices: string
    logisticFeeConfirmTitle: string
    logisticFeeConfirmAccept: string
    logisticFeeConfirmCancel: string
  }
  
  // Account
  account: {
    title: string
    orders: string
    profile: string
    totalOrders: string
    totalSpent: string
    orderNumber: string
    orderDate: string
    status: string
    details: string
    reorder: string
  }
  
  // Terms
  terms: {
    title: string
    intro: string
    originalProducts: {
      title: string
      description: string
    }
    minimumOrder: {
      title: string
      description: string
      note: string
    }
    payment: {
      title: string
      description: string
      bankDetails: string
      bank: string
      swift: string
      iban: string
      bankAddress: string
    }
    fulfillment: {
      title: string
      description1: string
      description2: string
    }
    coldChain: {
      title: string
      description: string
    }
    discounts: {
      title: string
      description: string
      order50k: string
      order100k: string
    }
    contact: {
      title: string
      description: string
    }
    companyInfoRegCode: string
    companyInfoVat: string
  }
  
  // Exhibitions
  exhibitions: {
    title: string
    subtitle: string
    contactUs: string
    highlights: string
    exhibition: string
    of: string
    meetUsTitle: string
    meetUsSubtitle: string
  }
  
  // Team
  team: {
    title: string
    subtitle: string
    messageTitle: string
    messageWelcome: string
    messageParagraph1: string
    messageParagraph2: string
    messageParagraph3: string
    messageParagraph4: string
    messageParagraph5: string
    messageThankYou: string
    leadershipTeam: string
    leadershipDescription: string
    workWithTeam: string
    workWithTeamDescription: string
    viewProducts: string
    learnMore: string
    email: string
    connectLinkedIn: string
    memberBio: {
      maksim: string
      alexei: string
      anastasiyaV: string
      anastasiyaM: string
      kseniya: string
    }
  }
  
  // Bulk Order
  bulkOrder: {
    title: string
    subtitle: string
    enterProducts: string
    instructions: string
    process: string
    results: string
    addAllToCart: string
    items?: string
    // Paste editor UI
    pasteTitle?: string
    pasteSubtitle?: string
    pastePlaceholder?: string
    pasteFromClipboard?: string
    tryExample?: string
    clear?: string
    processing?: string
    linesDetected?: string
    anyFormat?: string
    found?: string
    notFound?: string
    foundProducts?: string
    notFoundSkus?: string
    errorEmpty?: string
    errorNoItems?: string
    errorGeneric?: string
    // Marketing hero copy
    heroEyebrow?: string
    heroHeadline?: string
    heroTagline?: string
    heroBadge?: string
    steps?: {
      step1Title: string
      step1Desc: string
      step2Title: string
      step2Desc: string
      step3Title: string
      step3Desc: string
    }
    benefits?: {
      time: { title: string; value: string; description: string }
      accuracy: { title: string; value: string; description: string }
      formats: { title: string; value: string; description: string }
    }
    seo?: {
      whyTitle: string
      whyParagraph: string
      idealForTitle: string
      idealFor: string[]
    }
  }
  
  // Supplier
  supplier: {
    title: string
    subtitle: string
    description: string
    fileFormat: string
    fileFormatDescription: string
    requiredFields: string
    fields: {
      manufacturer: string
      sku: string
      productName: string
      productDescription: string
      price: string
    }
    uploadFile: string
    selectFile: string
    fileName: string
    submit: string
    submitting: string
    success: string
    successMessage: string
    error: string
    errorMessage: string
    companyName: string
    companyNamePlaceholder: string
    contactName: string
    contactNamePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    notes: string
    notesPlaceholder: string
    // Marketing-rich hero & sales copy
    heroBadge?: string
    heroEyebrow?: string
    heroHeadline?: string
    heroHeadlineAccent?: string
    heroTagline?: string
    heroCtaPrimary?: string
    heroCtaSecondary?: string
    benefits?: {
      title: string
      subtitle: string
      items: Array<{ title: string; description: string; icon: string }>
    }
    whoTitle?: string
    whoSubtitle?: string
    whoItems?: Array<{ title: string; description: string }>
    processTitle?: string
    processSubtitle?: string
    processSteps?: Array<{ title: string; description: string }>
    statsTitle?: string
    statsItems?: Array<{ value: string; label: string }>
    formTitle?: string
    formSubtitle?: string
    faqTitle?: string
    faqItems?: Array<{ question: string; answer: string }>
  }
  
  // Admin
  admin: {
    title: string
    dashboard: string
    orders: string
    products: string
    companies: string
    totalProducts: string
    totalOrders: string
    pendingOrders: string
    allOrders?: string
    importProducts?: string
  }
  
  // Order Confirmation
  orderConfirmation: {
    title: string
    subtitle: string
    thankYou: string
    orderNumber: string
    orderPlaced: string
    processing: string
    shipped: string
    emailSent: string
    emailSentDescription: string
    checkSpam: string
    orderDetails: string
    billingInformation: string
    paymentInformation: string
    paymentMethod: string
    paymentTerms: string
    bankTransferDetails: string
    orderItems: string
    quantity: string
    each: string
    subtotal: string
    volumeDiscount: string
    logisticServices: string
    total: string
    continueShopping: string
    needHelp: string
    needHelpDescription: string
  }
  
  // Auth/Login
  auth: {
    welcomeBack: string
    signUp: string
    signIn: string
    signInToAccount: string
    createAccount: string
    password: string
    magicLink: string
    fullName: string
    emailAddress: string
    confirmPassword: string
    passwordPlaceholder: string
    signingUp: string
    signingIn: string
    sending: string
    sendLink: string
    magicLinkDescription: string
    backToShop: string
    invalidEmailPassword: string
    somethingWentWrong: string
    failedToSendEmail: string
    checkEmail: string
    passwordsDontMatch: string
    passwordTooShort: string
    userExists: string
    registrationError: string
    registrationSuccess: string
  }
  
  // Verify Request
  verifyRequest: {
    checkEmail: string
    emailSent: string
    important: string
    checkSpam: string
    linkValid: string
    clickLink: string
    problems: string
    contactUs: string
    backToLogin: string
  }
  
  // Footer
  footer: {
    description: string
    quickLinks: string
    contactUs: string
    companyInfo: string
    website: string
    email: string
    phone: string
    allRightsReserved: string
  }

  // FAQ
  faq: {
    title: string
    subtitle: string
    searchPlaceholder: string
    categories: {
      general: string
      ordering: string
      shipping: string
      payment: string
      products: string
      account: string
    }
    items: Array<{
      question: string
      answer: string
      category: string
    }>
    contactTitle: string
    contactDescription: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    homepage: {
      hero: {
        reagentsTitle: 'Reagents & Disposables',
        reagentsSubtitle: 'Premium Quality Medical Supplies',
        reagentsDescription: 'Original products from top European manufacturers with full compliance',
        bulkOrderTitle: 'Bulk Order',
        bulkOrderSubtitle: 'Save Time with Automated Ordering',
        bulkOrderDescription: 'Simply paste catalog numbers and quantities - your order is automatically created. This feature saves time by streamlining the ordering process.',
        supplierTitle: 'Become Our Supplier',
        supplierSubtitle: 'Partner with Us',
        supplierDescription: 'Have access to quality products at competitive prices? Join our supplier network and help us expand our product catalog.',
        shopNow: 'Shop Now',
        tryBulkOrder: 'Try Bulk Order',
        becomeSupplier: 'Become Supplier',
        browseCatalog: 'Browse Catalog',
        searchPlaceholder: 'Search by SKU / Article Number / Product Name',
        pathwaysEyebrow: 'Three ways to work with us',
        pathwaysHeading: 'Pick your path — be sourcing in under a minute',
        pathway1: {
          step: '01',
          title: 'Search by SKU or name',
          description: 'Type a catalog number or a product name — we match across 100,000+ SKUs from 50+ manufacturers instantly.',
          cta: 'Start a search',
          microCopy: 'e.g. 07P3203, 10446232, Cobas Glucose',
        },
        pathway2: {
          step: '02',
          title: 'Paste a list — get a cart',
          description: 'Drop in catalog numbers and quantities. Our parser builds a cart automatically — no spreadsheets, no copy-paste loops.',
          cta: 'Try bulk paste',
          microCopy: '10446232  2\n07P3203   5\nSKU002, 3',
        },
        pathway3: {
          step: '03',
          title: 'Supply us — direct from manufacturer',
          description: 'Have direct prices from a manufacturer? We are actively looking for new suppliers. Long-term contracts, fast SWIFT/SEPA payments.',
          cta: 'Become a supplier',
          microCopy: 'New partners onboarding every month',
        },
      },
      featuredProducts: {
        title: 'Featured Products',
        subtitle: 'Premium medical equipment from top manufacturers',
        viewAll: 'View All Products',
      },
      manufacturers: {
        title: 'Trusted Manufacturers',
      },
      categories: {
        title: 'Product Categories',
        subtitle: 'Browse our comprehensive catalog',
        products: 'products',
        viewAll: 'View All',
      },
      stats: {
        whyChoose: 'Why Choose',
        readyToOrder: 'Ready to order?',
        minimumOrder: 'Minimum order €5,000 · 100% prepayment · 4-7 weeks delivery',
        browseCatalog: 'Browse Catalog',
        viewTerms: 'View Terms',
        stats: {
          medicalProducts: {
            value: '100,000+',
            label: 'Medical Products',
            description: 'Comprehensive catalog',
          },
          manufacturers: {
            value: '50+',
            label: 'European Manufacturers',
            description: 'Original products only',
          },
          compliance: {
            value: '100%',
            label: 'Compliance',
            description: 'Full regulatory approval',
          },
          delivery: {
            value: '4-7',
            label: 'Weeks Delivery',
            description: 'To Vilnius warehouse',
          },
        },
        features: {
          originalProducts: {
            title: 'Original Products',
            description: 'Only authentic products from verified European manufacturers',
          },
          volumeDiscounts: {
            title: 'Volume Discounts',
            description: '5% discount for €50k+ orders, 10% for €100k+ orders',
          },
          coldChain: {
            title: 'Cold Chain Compliance',
            description: 'Full temperature control for sensitive medical products',
          },
          exwVilnius: {
            title: 'EXW Vilnius',
            description: 'Flexible delivery terms with warehouse in Vilnius',
          },
        },
      },
    },
    nav: {
      home: 'Home',
      products: 'Products',
      catalog: 'Catalog',
      company: 'Company',
      about: 'About Us',
      team: 'Team',
      exhibitions: 'Exhibitions',
      terms: 'Terms',
      faq: 'FAQ',
      account: 'My Account',
      cart: 'Cart',
      checkout: 'Checkout',
      login: 'Login',
      logout: 'Logout',
      admin: 'Admin',
      bulkOrder: 'Bulk Order',
      supplier: 'Become Supplier',
      search: 'Search',
    },
    common: {
      addToCart: 'Add to Cart',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      quantity: 'Quantity',
      remove: 'Remove',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      continue: 'Continue',
      confirm: 'Confirm',
    },
    about: {
      hero: {
        title: 'About US',
        subtitle: 'Your Trusted Partner in Medical Equipment and Laboratory Supplies Since 2014',
      },
      whoWeAre: {
        title: 'Who We Are',
        paragraph1: 'We are an experienced and trusted representative of the world\'s largest manufacturers of medical devices, medical equipment, and consumables for clinical and sports laboratories.',
        paragraph2: 'Founded in 2014 we have grown to become a leading distributor holding serving clients across EU, EAEU, US, Asia and Middle East.',
        paragraph3: 'Our direct contacts with manufacturers and streamlined logistics routes enable us to promptly organize the delivery of goods under the conditions required by our customers.',
      },
      stats: {
        yearsExperience: 'Years Experience',
        countriesServed: 'Countries Served',
        globalPartners: 'Global Partners',
        annualRevenue: 'Annual Revenue (2025)',
      },
      values: {
        title: 'Our Core Values',
        quality: {
          title: 'Quality Assurance',
          description: 'We partner only with top-tier manufacturers to ensure the highest quality standards for all products.',
        },
        customer: {
          title: 'Customer Focus',
          description: 'Our clients\' success is our success. We tailor our services to meet specific needs and deadlines.',
        },
        integrity: {
          title: 'Integrity',
          description: 'We build lasting relationships based on trust, transparency, and honest communication.',
        },
        innovation: {
          title: 'Innovation',
          description: 'We continuously optimize our processes to deliver cutting-edge solutions and services.',
        },
      },
      services: {
        title: 'What We Offer',
        distribution: {
          title: 'Global Distribution',
          description: 'We serve clients across EUEГ, EU, USA, Asia and Austria with efficient logistics.',
          feature1: 'Direct manufacturer contacts',
          feature2: 'Streamlined delivery routes',
          feature3: 'Flexible payment terms',
        },
        consulting: {
          title: 'Consulting Services',
          description: 'We offer comprehensive healthcare consulting services.',
          feature1: 'Marketing strategy',
          feature2: 'National registration',
          feature3: 'Procurement support',
        },
        partnerships: {
          title: 'Trusted Partnerships',
          description: 'We collaborate with global healthcare leaders and regional distributors.',
        },
      },
      growth: {
        title: 'Our Growth Story',
        revenueGrowth: 'Revenue Growth (2025)',
        profitGrowth: 'Profit Growth (2025)',
        marketReach: 'Global Market Reach',
      },
      cta: {
        title: 'Ready to Partner With Us?',
        subtitle: 'Let\'s discuss how we can support your medical equipment and laboratory supply needs.',
        contactUs: 'Contact Us:',
      },
    },
    products: {
      title: 'Products',
      filters: {
        category: 'Category',
        manufacturer: 'Manufacturer',
        priceRange: 'Price Range',
        showAll: 'Show All',
      },
      sort: {
        default: 'Default',
        priceAsc: 'Price: Low to High',
        priceDesc: 'Price: High to Low',
        nameAsc: 'Name: A-Z',
        nameDesc: 'Name: Z-A',
      },
      noResults: 'No products found',
      showing: 'Showing',
      of: 'of',
      results: 'results',
    },
    product: {
      sku: 'SKU',
      description: 'Description',
      manufacturer: 'Manufacturer',
      category: 'Category',
      b2bPrice: 'B2B Price',
      availableByOrder: 'Available by Order Only',
      deliveryInfo: 'Delivery to our warehouse in Vilnius takes 4-7 weeks. Products sourced directly from European manufacturers.',
      addToCart: 'Add to Cart',
      edit: 'Edit',
      relatedProducts: 'Related Products',
      home: 'Home',
      products: 'Products',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptyDescription: 'Browse our products and add items to your cart to get started.',
      browseProducts: 'Browse Products',
      items: 'items',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'FREE',
      discount: 'Discount',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping',
    },
    checkout: {
      title: 'Checkout',
      billingInfo: 'Billing Information',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      secure: 'Secure SSL encrypted transactions',
      gdpr: 'GDPR compliant data protection',
      logisticFeeNotice: 'Please note: Orders below €5,000 will incur additional delivery charges from suppliers\' warehouses to our warehouse in Vilnius, approximately €250.',
      logisticServices: 'Logistic services',
      logisticFeeConfirmTitle: 'Confirm additional delivery charge',
      logisticFeeConfirmAccept: 'I accept the €250 fee',
      logisticFeeConfirmCancel: 'Cancel',
    },
    account: {
      title: 'My Account',
      orders: 'Orders',
      profile: 'Profile',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      status: 'Status',
      details: 'Details',
      reorder: 'Reorder',
    },
    terms: {
      title: 'Terms & Conditions',
      intro: 'Please review our trading conditions before placing an order',
      originalProducts: {
        title: 'Original Products Guarantee',
        description: 'We supply only original products sourced directly from European manufacturers\' warehouses. All products come with manufacturer warranties and certificates of authenticity.',
      },
      minimumOrder: {
        title: 'Minimum Order Value',
        description: 'The minimum order value is €5,000.',
        note: 'Please note: Orders below €5,000 will incur additional delivery charges from suppliers\' warehouses to our warehouse in Vilnius, approximately €250.',
      },
      payment: {
        title: 'Payment Terms',
        description: 'We require 100% prepayment for all orders. We work on EXW Vilnius (Ex Works) terms. This means that goods are available for pickup at our warehouse in Vilnius, Lithuania. Buyers are responsible for all transportation costs and risks from that point forward.',
        bankDetails: 'Bank Details:',
        bank: 'Bank',
        swift: 'SWIFT',
        iban: 'IBAN',
        bankAddress: 'Bank Address',
      },
      fulfillment: {
        title: 'Order Fulfillment & Delivery Time',
        description1: 'Products are available by order only. We do not maintain permanent stock.',
        description2: 'Delivery to our warehouse in Vilnius takes 4-7 weeks, depending on the product type and quantity ordered.',
      },
      coldChain: {
        title: 'Cold Chain Compliance',
        description: 'All temperature-sensitive deliveries are made with strict adherence to the cold chain. We ensure proper handling including replacement of chill elements or dry ice at every transhipment point to maintain product integrity throughout transportation.',
      },
      discounts: {
        title: 'Volume Discounts',
        description: 'We offer attractive volume discounts for larger orders:',
        order50k: 'Orders €50,000+',
        order100k: 'Orders €100,000+',
      },
      contact: {
        title: 'Have Questions?',
        description: 'Our team is ready to help you with any inquiries about our terms and conditions',
      },
      companyInfoRegCode: 'Reg. Code',
      companyInfoVat: 'VAT',
    },
    exhibitions: {
      title: 'Exhibitions',
      subtitle: 'We actively participate in leading medical and laboratory equipment exhibitions across Europe and worldwide',
      contactUs: 'Contact Us',
      highlights: 'Highlights',
      exhibition: 'Exhibition',
      of: 'of',
      meetUsTitle: 'Meet Us at Our Next Event',
      meetUsSubtitle: 'Discover our latest products and innovations in medical technology',
    },
    team: {
      title: 'Meet Our Team',
      subtitle: 'The professionals behind our success',
      messageTitle: 'A Message from the CEO',
      messageWelcome: 'Welcome.',
      messageParagraph1: 'For over a decade, we have been navigating the complex world of medical and laboratory wholesale with a singular, unwavering principle: business is about people, not just products.',
      messageParagraph2: 'When we founded this company more than 10 years ago, we set out to do more than simply move boxes from a warehouse to a clinic. We wanted to build a bridge between the world\'s leading manufacturers and the professionals who rely on their tools every day. Today, I am proud to say that we have curated one of the most comprehensive catalogs in the industry, featuring top-tier equipment and supplies from the most respected global brands.',
      messageParagraph3: 'However, our extensive inventory is not our greatest asset—our reputation is.',
      messageParagraph4: 'In an industry often defined by cold transactions and rigid contracts, we have chosen a different path. We believe in the power of honest, human relationships. We understand that behind every order is a person, a patient, or a researcher depending on us. That is why transparency and integrity are not just buzzwords for us; they are the foundation of every interaction we have.',
      messageParagraph5: 'We do not just want to be your supplier; we want to be a partner you can trust implicitly. Whether you are a long-standing client or visiting us for the first time, I want you to know that we value your trust above all else. We are committed to maintaining that trust through fair practices, open communication, and a genuine dedication to your success.',
      messageThankYou: 'Thank you for choosing us. We look forward to building a lasting, honest partnership with you.',
      leadershipTeam: 'Leadership Team',
      leadershipDescription: 'Our experienced team brings together decades of expertise in medical equipment distribution, logistics, and healthcare consulting.',
      workWithTeam: 'Work With a Team You Can Trust',
      workWithTeamDescription: 'Our team is dedicated to providing exceptional service and building lasting partnerships. Let\'s discuss how we can support your needs.',
      viewProducts: 'View Our Products',
      learnMore: 'Learn More About Us',
      email: 'Email',
      connectLinkedIn: 'Connect on LinkedIn',
      memberBio: {
        maksim: 'Founder, board member, and shareholder. Passionate entrepreneur with extensive expertise in international sales, IT, and laboratory diagnostics. Strong leadership, communication, and teaching abilities.',
        alexei: 'Lead software architect driving digital transformation and innovation. Expert in full-stack development, system architecture, and enterprise software solutions. Spearheads development of cutting-edge platforms and internal tools.',
        anastasiyaV: 'Chairman of the Board. Over a decade of experience in laboratory diagnostics, marketing, and research. Specializes in strategic planning and business development.',
        anastasiyaM: 'Creative marketing professional driving brand awareness and customer engagement. Expertise in digital marketing, content strategy, and market analysis for the medical equipment industry.',
        kseniya: 'Results-oriented project manager with a track record of delivering complex logistics and supply chain projects on time. Ensures seamless coordination between manufacturers, distributors, and clients.',
      },
    },
    bulkOrder: {
      title: 'Bulk Order',
      subtitle: 'Save time by pasting catalog numbers and quantities',
      enterProducts: 'Enter Products',
      instructions: 'Paste your product list here. Format: SKU [TAB/COMMA/SPACE] Quantity',
      process: 'Process Items',
      results: 'Results',
      addAllToCart: 'Add All to Cart',
      items: 'items',
      pasteTitle: 'Paste your catalog numbers here',
      pasteSubtitle: 'One product per line: catalog number and quantity. Copy straight from Excel, a PDF or an email.',
      pastePlaceholder: 'Paste here, for example:\n\n10446232\t2\n07P3203, 5\n05031738; 12\nVeronal Buffer 10445724 2',
      pasteFromClipboard: 'Paste from clipboard',
      tryExample: 'Fill in an example',
      clear: 'Clear',
      processing: 'Matching…',
      linesDetected: 'items recognised',
      anyFormat: 'Any format works',
      found: 'Found',
      notFound: 'Not found',
      foundProducts: 'Found products',
      notFoundSkus: 'Catalog numbers not found',
      errorEmpty: 'Paste catalog numbers with quantities first.',
      errorNoItems: 'No valid lines found. Put a catalog number and a quantity on each line.',
      errorGeneric: 'Something went wrong while processing your list. Please try again.',
      heroBadge: 'Paste · Match · Checkout',
      heroEyebrow: 'For procurement teams and resellers',
      heroHeadline: 'Paste your shopping list — we build the cart',
      heroTagline: 'Drop in 5 or 500 catalog numbers with quantities. Our parser matches them against 100,000+ SKUs and fills your cart automatically. No spreadsheets to email back and forth.',
      steps: {
        step1Title: 'Paste your list',
        step1Desc: 'Any format works — tabs, commas, semicolons, or just spaces. SKUs and quantities, one per line.',
        step2Title: 'We match it instantly',
        step2Desc: 'Our engine finds every product by catalog number or article and shows you what is in stock.',
        step3Title: 'Cart ready in seconds',
        step3Desc: 'One click adds everything to your cart. Review, adjust quantities, and request a quote.',
      },
      benefits: {
        time: { title: 'Save hours per order', value: '30s', description: 'Average time to import 100 SKUs vs. ~45 min manually.' },
        accuracy: { title: 'Zero copy-paste errors', value: '100%', description: 'Every SKU is validated against our catalog before it lands in your cart.' },
        formats: { title: 'Any format you have', value: '5+', description: 'Tabs, commas, semicolons, spaces — even free-form lines with product names.' },
      },
      seo: {
        whyTitle: 'Why procurement teams use bulk order',
        whyParagraph: 'If you order from a recurring list — a lab inventory, a clinic protocol, or a distributor restock — typing items one by one wastes hours. Paste your full list once, get a cart you can edit, and send it to checkout. The Adoris bulk-order tool understands the messy real-world formats your supplier emails, distributor sheets, and ERP exports already produce.',
        idealForTitle: 'Ideal for',
        idealFor: [
          'Hospital and clinic procurement managers',
          'Independent laboratory inventory restocks',
          'Distributors rebuilding a customer order from a quote',
          'Reorders from a previous Adoris invoice or PDF',
        ],
      },
    },
    supplier: {
      title: 'Become Our Supplier',
      subtitle: 'Join Our Supplier Network',
      description: 'If you have access to quality products at competitive prices from manufacturers, we would love to partner with you. Simply upload your product catalog in Excel format and we will review your application.',
      heroBadge: 'New partners onboarding every month',
      heroEyebrow: 'Wanted: suppliers with direct manufacturer pricing',
      heroHeadline: 'Got direct prices from a manufacturer?',
      heroHeadlineAccent: 'Let’s do business.',
      heroTagline: 'Adoris is actively expanding its supplier network across Europe, the CIS, and Asia. If you can ship original products at competitive prices — especially direct from the manufacturer — we want to talk this week.',
      heroCtaPrimary: 'Submit your catalog',
      heroCtaSecondary: 'See what we are buying',
      benefits: {
        title: 'Why suppliers partner with Adoris',
        subtitle: 'We are not a marketplace. We are a buyer with real volume, fast payments, and a long-term horizon.',
        items: [
          { title: 'Recurring volume', description: '€20M+ annual procurement across 50+ manufacturers. Predictable monthly orders, not one-off spot buys.', icon: 'trending' },
          { title: 'Fast, transparent payments', description: 'SWIFT and SEPA across the EU and EAEU. 100% prepayment available for new partners — no waiting on terms.', icon: 'wallet' },
          { title: 'Direct-to-manufacturer focus', description: 'We prioritize partners with direct factory pricing. No four-layer middlemen between you and the line.', icon: 'factory' },
          { title: 'EU-based, regulated counterparty', description: 'EU VAT registered, AML/KYC compliant, GDPR-grade data handling. Your contracts and IP are safe.', icon: 'shield' },
          { title: 'Logistics handled', description: 'EXW Vilnius works for us. You hand off at your warehouse — we run the cold chain, customs, and last mile.', icon: 'truck' },
          { title: 'Long-term contracts', description: 'Multi-year framework agreements available once the first 2–3 deliveries land cleanly. Predictable revenue.', icon: 'handshake' },
        ],
      },
      whoTitle: 'Who we are looking for',
      whoSubtitle: 'If any of these sound like you, send us your catalog today.',
      whoItems: [
        { title: 'Manufacturers', description: 'Direct producers of reagents, consumables, lab equipment, IVD kits, or medical devices looking for an EU distribution arm.' },
        { title: 'Authorized distributors', description: 'Regional distributors with exclusive contracts and competitive pricing on a specific brand or product line.' },
        { title: 'Importers with surplus', description: 'Holders of in-stock inventory at attractive prices — overstock, parallel imports, end-of-line — provided they are original and certified.' },
        { title: 'OEM partners', description: 'Producers willing to white-label or co-brand specific SKUs for the EU and CIS markets.' },
      ],
      processTitle: 'From catalog to first PO in 3 steps',
      processSubtitle: 'Most new suppliers get a first purchase order within 14 days of submitting their catalog.',
      processSteps: [
        { title: 'Submit your catalog', description: 'Upload an Excel or CSV with SKU, manufacturer, name, description, and price. Use the form below — it takes 2 minutes.' },
        { title: 'We review and match', description: 'Our procurement team checks pricing, demand, and compliance. You get a written response within 5 business days.' },
        { title: 'First trial order', description: 'We place a small trial order. Once it lands cleanly, we move to recurring volume and discuss framework terms.' },
      ],
      statsTitle: 'The Adoris partner profile in numbers',
      statsItems: [
        { value: '€20M+', label: 'Annual procurement budget' },
        { value: '50+', label: 'Active manufacturer partners' },
        { value: '5 days', label: 'Average response time' },
        { value: '14 days', label: 'Median time to first PO' },
      ],
      formTitle: 'Send us your catalog',
      formSubtitle: 'Upload your product list in Excel or CSV. We will respond within 5 business days.',
      faqTitle: 'Common questions from new suppliers',
      faqItems: [
        { question: 'Do you work with non-EU suppliers?', answer: 'Yes. We import from manufacturers in Asia, the US, and the CIS regularly. Our customs broker in Vilnius handles the EU import side.' },
        { question: 'What product categories are you most interested in?', answer: 'Reagents, IVD kits, lab consumables, analyzers, and clinical-chemistry instruments. We also evaluate dental, ophthalmology, and veterinary lines case-by-case.' },
        { question: 'What is your typical first-order size?', answer: 'Trial orders range from €5,000 to €30,000 depending on the product. Once trust is established, recurring orders typically scale to €50,000–€250,000 per quarter.' },
        { question: 'Do you sign NDAs and exclusivity agreements?', answer: 'Yes. We sign mutual NDAs before catalog review when requested, and we can discuss regional exclusivity for product lines we commit to volume on.' },
      ],
      fileFormat: 'File Format Requirements',
      fileFormatDescription: 'Please upload your product catalog as an Excel file (.xlsx, .xls) or CSV file with the following columns:',
      requiredFields: 'Required Fields',
      fields: {
        manufacturer: 'Manufacturer',
        sku: 'SKU',
        productName: 'Product Name',
        productDescription: 'Product Description',
        price: 'Price',
      },
      uploadFile: 'Upload Product Catalog',
      selectFile: 'Click to select file or drag and drop',
      fileName: 'Selected file',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      success: 'Application Submitted Successfully!',
      successMessage: 'Thank you for your interest in becoming our supplier. We have received your application and product catalog. Our team will review it and get back to you shortly.',
      error: 'Error',
      errorMessage: 'Please upload a valid Excel or CSV file and fill in all required fields.',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Enter your company name',
      contactName: 'Contact Name',
      contactNamePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      phone: 'Phone Number',
      phonePlaceholder: '+1 (555) 123-4567',
      notes: 'Additional Notes',
      notesPlaceholder: 'Any additional information you would like to share...',
    },
    admin: {
      title: 'Admin Panel',
      dashboard: 'Admin Dashboard',
      orders: 'Orders',
      products: 'Products',
      companies: 'Companies',
      totalProducts: 'Total Products',
      totalOrders: 'Total Orders',
      pendingOrders: 'Pending Orders',
      allOrders: 'All Orders',
      importProducts: 'Import Products from Excel/CSV',
    },
    orderConfirmation: {
      title: 'Order Confirmed!',
      subtitle: 'Thank you for your order. We\'ve received it and are processing it now.',
      thankYou: 'Thank you for your order',
      orderNumber: 'Order Number',
      orderPlaced: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      emailSent: 'Order Confirmation Email Sent',
      emailSentDescription: 'We\'ve sent a confirmation email with your order details and PDF invoice to',
      checkSpam: 'If you don\'t receive it within a few minutes, please check your spam folder or contact us at',
      orderDetails: 'Order Details',
      billingInformation: 'Billing Information',
      paymentInformation: 'Payment Information',
      paymentMethod: 'Payment Method',
      paymentTerms: 'Payment Terms',
      bankTransferDetails: 'Bank transfer details will be sent to your email separately.',
      orderItems: 'Order Items',
      quantity: 'Qty',
      each: 'each',
      subtotal: 'Subtotal',
      volumeDiscount: 'Volume Discount',
      logisticServices: 'Logistic services',
      total: 'Total',
      continueShopping: 'Continue Shopping',
      needHelp: 'Need Help?',
      needHelpDescription: 'If you have any questions about your order, please don\'t hesitate to contact us.',
    },
    auth: {
      welcomeBack: 'Welcome Back',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      signInToAccount: 'Sign in to your account',
      createAccount: 'Create a new account',
      password: 'Password',
      magicLink: 'Magic Link',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'minimum 6 characters',
      signingUp: 'Signing up...',
      signingIn: 'Signing in...',
      sending: 'Sending...',
      sendLink: 'Send Link',
      magicLinkDescription: 'We\'ll send you an email with a passwordless sign-in link',
      backToShop: '← Back to Shop',
      invalidEmailPassword: 'Invalid email or password',
      somethingWentWrong: 'Something went wrong',
      failedToSendEmail: 'Failed to send email',
      checkEmail: 'Check your email! We sent you a sign-in link.',
      passwordsDontMatch: 'Passwords don\'t match',
      passwordTooShort: 'Password must be at least 6 characters',
      userExists: 'User with this email already exists',
      registrationError: 'Registration error',
      registrationSuccess: 'Registration successful! Please sign in.',
    },
    verifyRequest: {
      checkEmail: 'Check your email',
      emailSent: 'We\'ve sent you a sign-in link to your email address.',
      important: 'Important:',
      checkSpam: 'Check the "Spam" folder if the email doesn\'t arrive',
      linkValid: 'The link is valid for 24 hours',
      clickLink: 'Click on the link to complete sign-in',
      problems: 'Having problems? Contact us:',
      contactUs: 'Contact us',
      backToLogin: '← Back to sign in',
    },
    footer: {
      description: 'Professional B2B medical laboratory equipment and supplies from leading manufacturers worldwide.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      companyInfo: 'Company Info',
      website: 'Website',
      email: 'Email',
      phone: 'Phone',
      allRightsReserved: 'All rights reserved.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our products, ordering process, and services',
      searchPlaceholder: 'Search frequently asked questions...',
      categories: {
        general: 'General',
        ordering: 'Ordering',
        shipping: 'Shipping & Delivery',
        payment: 'Payment',
        products: 'Products',
        account: 'Account',
      },
      items: [
        {
          question: 'What types of medical laboratory equipment do you offer?',
          answer: 'We offer a comprehensive range of medical laboratory equipment including analyzers, reagents, consumables, and diagnostic instruments from leading manufacturers worldwide. Our catalog includes equipment for clinical chemistry, hematology, immunology, and microbiology laboratories.',
          category: 'general',
        },
        {
          question: 'What is the minimum order value?',
          answer: 'The minimum order value is €5,000. Orders below this amount may be subject to additional handling fees. For bulk orders, we offer volume discounts starting from €50,000.',
          category: 'ordering',
        },
        {
          question: 'How do I place an order?',
          answer: 'You can place an Order Request through our website by adding products to your cart and proceeding to checkout. For bulk orders, you can use our bulk order form to upload a list of products. Our managers will process your request and send you a proforma invoice via email for payment. After payment confirmation, your order will be processed.',
          category: 'ordering',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept bank transfers. Payment details will be sent to you via email after order confirmation. All transactions are secure and processed according to international standards.',
          category: 'payment',
        },
        {
          question: 'How long does shipping take?',
          answer: 'Shipping times vary depending on the product and destination. Standard delivery typically takes 2-4 weeks. Express shipping options are available for urgent orders. You will receive tracking information once your order ships.',
          category: 'shipping',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to multiple countries worldwide. Shipping costs and delivery times depend on the destination. Please contact us for specific shipping information to your location.',
          category: 'shipping',
        },
        {
          question: 'Are your products original and certified?',
          answer: 'Yes, all our products are 100% original and come with full manufacturer warranties and certifications. We work directly with authorized distributors and manufacturers to ensure authenticity.',
          category: 'products',
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, once your order ships, you will receive a tracking number via email. You can use this number to track your shipment on the carrier\'s website.',
          category: 'ordering',
        },
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking "Login" in the header and selecting "Create Account". You can also sign in using a magic link sent to your email address for passwordless authentication.',
          category: 'account',
        },
        {
          question: 'Can prices change?',
          answer: 'Yes, prices may change slightly due to price changes from manufacturers. The final price will be confirmed in the proforma invoice sent by our managers after processing your Order Request.',
          category: 'products',
        },
        {
          question: 'Who is responsible for product selection?',
          answer: 'We are not responsible for product selection. Customers are responsible for determining which products they need. A catalog number (SKU) is required for all orders. Please ensure you have the correct catalog numbers before placing an Order Request.',
          category: 'ordering',
        },
        {
          question: 'Can I request a quote for bulk orders?',
          answer: 'Absolutely! Use our bulk order form to submit your requirements, or contact us directly. We offer competitive pricing for volume orders and can provide custom quotes based on your specific needs.',
          category: 'ordering',
        },
      ],
      contactTitle: 'Still have questions?',
      contactDescription: 'Our team is here to help. Contact us and we\'ll respond as soon as possible.',
    },
  },
  ru: {
    homepage: {
      hero: {
        reagentsTitle: 'Реагенты и расходные материалы',
        reagentsSubtitle: 'Медицинские товары премиум-класса',
        reagentsDescription: 'Оригинальная продукция от ведущих европейских производителей с полным соответствием',
        bulkOrderTitle: 'Массовый заказ',
        bulkOrderSubtitle: 'Экономьте время с автоматизированным заказом',
        bulkOrderDescription: 'Просто вставьте каталожные номера и количества - ваш заказ создается автоматически. Эта функция экономит время, упрощая процесс заказа.',
        supplierTitle: 'Станьте нашим поставщиком',
        supplierSubtitle: 'Партнерство с нами',
        supplierDescription: 'Есть доступ к качественным продуктам по конкурентоспособным ценам? Присоединяйтесь к нашей сети поставщиков и помогите нам расширить наш каталог продукции.',
        shopNow: 'Купить сейчас',
        tryBulkOrder: 'Попробовать массовый заказ',
        becomeSupplier: 'Стать поставщиком',
        browseCatalog: 'Просмотреть каталог',
        searchPlaceholder: 'Поиск по артикулу / каталожному номеру / названию',
        pathwaysEyebrow: 'Три способа работать с нами',
        pathwaysHeading: 'Выберите свой путь — начнёте закупку меньше чем за минуту',
        pathway1: {
          step: '01',
          title: 'Найдите по артикулу или названию',
          description: 'Введите каталожный номер или название — мы мгновенно найдём товар среди 100 000+ SKU от 50+ производителей.',
          cta: 'Начать поиск',
          microCopy: 'Напр.: 07P3203, 10446232, Cobas Глюкоза',
        },
        pathway2: {
          step: '02',
          title: 'Вставьте список — получите корзину',
          description: 'Скопируйте каталожные номера с количеством. Наш парсер автоматически соберёт корзину — никаких таблиц и ручного копирования.',
          cta: 'Попробовать вставку',
          microCopy: '10446232  2\n07P3203   5\nSKU002, 3',
        },
        pathway3: {
          step: '03',
          title: 'Станьте поставщиком — напрямую от производителя',
          description: 'Есть прямые цены от производителя? Мы активно ищем новых поставщиков. Долгосрочные контракты, быстрые платежи SWIFT/SEPA.',
          cta: 'Стать поставщиком',
          microCopy: 'Подключаем новых партнёров каждый месяц',
        },
      },
      featuredProducts: {
        title: 'Рекомендуемые товары',
        subtitle: 'Премиальное медицинское оборудование от ведущих производителей',
        viewAll: 'Все продукты',
      },
      manufacturers: {
        title: 'Проверенные производители',
      },
      categories: {
        title: 'Категории продукции',
        subtitle: 'Просмотрите наш каталог',
        products: 'товаров',
        viewAll: 'Все',
      },
      stats: {
        whyChoose: 'Почему выбирают',
        readyToOrder: 'Готовы сделать заказ?',
        minimumOrder: 'Минимальный заказ €5,000 · 100% предоплата · Доставка 4-7 недель',
        browseCatalog: 'Просмотреть каталог',
        viewTerms: 'Посмотреть условия',
        stats: {
          medicalProducts: {
            value: '100,000+',
            label: 'Медицинских товаров',
            description: 'Полный каталог',
          },
          manufacturers: {
            value: '50+',
            label: 'Европейских производителей',
            description: 'Только оригинальная продукция',
          },
          compliance: {
            value: '100%',
            label: 'Соответствие',
            description: 'Полное нормативное одобрение',
          },
          delivery: {
            value: '4-7',
            label: 'Недель доставка',
            description: 'На склад в Вильнюсе',
          },
        },
        features: {
          originalProducts: {
            title: 'Оригинальная продукция',
            description: 'Только подлинные товары от проверенных европейских производителей',
          },
          volumeDiscounts: {
            title: 'Скидки за объем',
            description: '5% скидка при заказе от €50k, 10% при заказе от €100k',
          },
          coldChain: {
            title: 'Соблюдение холодовой цепи',
            description: 'Полный контроль температуры для чувствительных медицинских товаров',
          },
          exwVilnius: {
            title: 'EXW Вильнюс',
            description: 'Гибкие условия доставки со складом в Вильнюсе',
          },
        },
      },
    },
    nav: {
      home: 'Главная',
      products: 'Продукты',
      catalog: 'Каталог',
      company: 'Компания',
      about: 'О нас',
      team: 'Команда',
      exhibitions: 'Выставки',
      terms: 'Условия',
      faq: 'Вопросы и ответы',
      account: 'Мой аккаунт',
      cart: 'Корзина',
      checkout: 'Оформление заказа',
      login: 'Войти',
      logout: 'Выйти',
      admin: 'Админ',
      bulkOrder: 'Массовый заказ',
      supplier: 'Стать поставщиком',
      search: 'Поиск',
    },
    common: {
      addToCart: 'Добавить в корзину',
      price: 'Цена',
      total: 'Итого',
      subtotal: 'Промежуточный итог',
      quantity: 'Количество',
      remove: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      search: 'Поиск',
      filter: 'Фильтр',
      loading: 'Загрузка...',
      edit: 'Редактировать',
      delete: 'Удалить',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      previous: 'Предыдущий',
      continue: 'Продолжить',
      confirm: 'Подтвердить',
    },
    about: {
      hero: {
        title: 'О нас',
        subtitle: 'Ваш надежный партнер в области медицинского оборудования и лабораторных расходных материалов с 2014 года',
      },
      whoWeAre: {
        title: 'Кто мы',
        paragraph1: 'Мы являемся опытным и надежным представителем крупнейших мировых производителей медицинских устройств, медицинского оборудования и расходных материалов для клинических и спортивных лабораторий.',
        paragraph2: 'Основанная в 2014 году, мы выросли и стали ведущим дистрибьютором, обслуживающим клиентов в ЕС, ЕАЭС, США, Азии и на Ближнем Востоке.',
        paragraph3: 'Наши прямые контакты с производителями и оптимизированные логистические маршруты позволяют нам оперативно организовать доставку товаров в условиях, требуемых нашими клиентами.',
      },
      stats: {
        yearsExperience: 'Лет опыта',
        countriesServed: 'Обслуживаемых стран',
        globalPartners: 'Глобальных партнеров',
        annualRevenue: 'Годовой доход (2025)',
      },
      values: {
        title: 'Наши основные ценности',
        quality: {
          title: 'Гарантия качества',
          description: 'Мы сотрудничаем только с ведущими производителями, чтобы обеспечить высочайшие стандарты качества для всех продуктов.',
        },
        customer: {
          title: 'Ориентация на клиента',
          description: 'Успех наших клиентов - это наш успех. Мы адаптируем наши услуги для удовлетворения конкретных потребностей и сроков.',
        },
        integrity: {
          title: 'Честность',
          description: 'Мы строим долгосрочные отношения на основе доверия, прозрачности и честного общения.',
        },
        innovation: {
          title: 'Инновации',
          description: 'Мы постоянно оптимизируем наши процессы для предоставления передовых решений и услуг.',
        },
      },
      services: {
        title: 'Что мы предлагаем',
        distribution: {
          title: 'Глобальная дистрибуция',
          description: 'Мы обслуживаем клиентов в ЕАЭС, ЕС, США, Азии и Австрии с эффективной логистикой.',
          feature1: 'Прямые контакты с производителями',
          feature2: 'Оптимизированные маршруты доставки',
          feature3: 'Гибкие условия оплаты',
        },
        consulting: {
          title: 'Консультационные услуги',
          description: 'Мы предлагаем комплексные консультационные услуги в сфере здравоохранения.',
          feature1: 'Маркетинговая стратегия',
          feature2: 'Национальная регистрация',
          feature3: 'Поддержка закупок',
        },
        partnerships: {
          title: 'Надежные партнерства',
          description: 'Мы сотрудничаем с мировыми лидерами здравоохранения и региональными дистрибьюторами.',
        },
      },
      growth: {
        title: 'История нашего роста',
        revenueGrowth: 'Рост выручки (2025)',
        profitGrowth: 'Рост прибыли (2025)',
        marketReach: 'Глобальный охват рынка',
      },
      cta: {
        title: 'Готовы стать нашими партнерами?',
        subtitle: 'Давайте обсудим, как мы можем поддержать ваши потребности в медицинском оборудовании и лабораторных расходных материалах.',
        contactUs: 'Свяжитесь с нами:',
      },
    },
    products: {
      title: 'Продукты',
      filters: {
        category: 'Категория',
        manufacturer: 'Производитель',
        priceRange: 'Диапазон цен',
        showAll: 'Показать все',
      },
      sort: {
        default: 'По умолчанию',
        priceAsc: 'Цена: от низкой к высокой',
        priceDesc: 'Цена: от высокой к низкой',
        nameAsc: 'Название: А-Я',
        nameDesc: 'Название: Я-А',
      },
      noResults: 'Продукты не найдены',
      showing: 'Показано',
      of: 'из',
      results: 'результатов',
    },
    product: {
      sku: 'Артикул',
      description: 'Описание',
      manufacturer: 'Производитель',
      category: 'Категория',
      b2bPrice: 'B2B Цена',
      availableByOrder: 'Доступно только по заказу',
      deliveryInfo: 'Доставка на наш склад в Вильнюсе занимает 4-7 недель. Продукция поставляется напрямую от европейских производителей.',
      addToCart: 'Добавить в корзину',
      edit: 'Редактировать',
      relatedProducts: 'Похожие продукты',
      home: 'Главная',
      products: 'Продукты',
    },
    cart: {
      title: 'Корзина покупок',
      empty: 'Ваша корзина пуста',
      emptyDescription: 'Просмотрите наши продукты и добавьте товары в корзину, чтобы начать.',
      browseProducts: 'Просмотреть продукты',
      items: 'товаров',
      subtotal: 'Промежуточный итог',
      shipping: 'Доставка',
      free: 'БЕСПЛАТНО',
      discount: 'Скидка',
      total: 'Итого',
      proceedToCheckout: 'Перейти к оформлению',
      continueShopping: 'Продолжить покупки',
    },
    checkout: {
      title: 'Оформление заказа',
      billingInfo: 'Платежная информация',
      orderSummary: 'Сводка заказа',
      placeOrder: 'Отправить Запрос',
      processing: 'Обработка...',
      secure: 'Безопасные SSL-шифрованные транзакции',
      gdpr: 'Соответствие GDPR защите данных',
      logisticFeeNotice: 'Обратите внимание: Заказы ниже €5,000 будут нести дополнительные расходы на доставку со складов поставщиков на наш склад в Вильнюсе, примерно €250.',
      logisticServices: 'Логистические услуги',
      logisticFeeConfirmTitle: 'Подтвердите дополнительную плату за доставку',
      logisticFeeConfirmAccept: 'Я принимаю плату €250',
      logisticFeeConfirmCancel: 'Отмена',
    },
    account: {
      title: 'Мой аккаунт',
      orders: 'Заказы',
      profile: 'Профиль',
      totalOrders: 'Всего заказов',
      totalSpent: 'Всего потрачено',
      orderNumber: 'Номер заказа',
      orderDate: 'Дата заказа',
      status: 'Статус',
      details: 'Детали',
      reorder: 'Повторить заказ',
    },
    terms: {
      title: 'Условия и положения',
      intro: 'Пожалуйста, ознакомьтесь с нашими торговыми условиями перед размещением заказа',
      originalProducts: {
        title: 'Гарантия оригинальных продуктов',
        description: 'Мы поставляем только оригинальную продукцию, полученную напрямую со складов европейских производителей. Все продукты поставляются с гарантиями производителя и сертификатами подлинности.',
      },
      minimumOrder: {
        title: 'Минимальная сумма заказа',
        description: 'Минимальная сумма заказа составляет €5,000.',
        note: 'Обратите внимание: Заказы ниже €5,000 будут нести дополнительные расходы на доставку со складов поставщиков на наш склад в Вильнюсе, примерно €250.',
      },
      payment: {
        title: 'Условия оплаты',
        description: 'Мы требуем 100% предоплату для всех заказов. Мы работаем на условиях EXW Вильнюс (Ex Works). Это означает, что товары доступны для получения на нашем складе в Вильнюсе, Литва. Покупатели несут ответственность за все транспортные расходы и риски с этого момента.',
        bankDetails: 'Банковские реквизиты:',
        bank: 'Банк',
        swift: 'SWIFT',
        iban: 'IBAN',
        bankAddress: 'Адрес банка',
      },
      fulfillment: {
        title: 'Выполнение заказа и время доставки',
        description1: 'Продукты доступны только по заказу. Мы не поддерживаем постоянный складской запас.',
        description2: 'Доставка на наш склад в Вильнюсе занимает 4-7 недель, в зависимости от типа продукта и количества заказа.',
      },
      coldChain: {
        title: 'Соблюдение холодовой цепи',
        description: 'Все доставки чувствительных к температуре продуктов осуществляются с строгим соблюдением холодовой цепи. Мы обеспечиваем надлежащую обработку, включая замену охлаждающих элементов или сухого льда на каждой точке перегрузки для поддержания целостности продукта на протяжении всей транспортировки.',
      },
      discounts: {
        title: 'Скидки за объем',
        description: 'Мы предлагаем привлекательные скидки за объем для крупных заказов:',
        order50k: 'Заказы от €50,000',
        order100k: 'Заказы от €100,000',
      },
      contact: {
        title: 'Есть вопросы?',
        description: 'Наша команда готова помочь вам с любыми вопросами о наших условиях и положениях',
      },
      companyInfoRegCode: 'Рег. код',
      companyInfoVat: 'НДС',
    },
    exhibitions: {
      title: 'Выставки',
      subtitle: 'Мы активно участвуем в ведущих выставках медицинского и лабораторного оборудования в Европе и по всему миру',
      contactUs: 'Свяжитесь с нами',
      highlights: 'Основные моменты',
      exhibition: 'Выставка',
      of: 'из',
      meetUsTitle: 'Встретьтесь с нами на нашем следующем мероприятии',
      meetUsSubtitle: 'Откройте для себя наши последние продукты и инновации в медицинских технологиях',
    },
    team: {
      title: 'Наша команда',
      subtitle: 'Профессионалы, стоящие за нашим успехом',
      messageTitle: 'Послание от генерального директора',
      messageWelcome: 'Добро пожаловать.',
      messageParagraph1: 'Более десяти лет мы работаем в сложном мире оптовой торговли медицинским и лабораторным оборудованием, следуя одному непоколебимому принципу: бизнес — это о людях, а не только о продуктах.',
      messageParagraph2: 'Когда мы основали эту компанию более 10 лет назад, мы хотели сделать больше, чем просто перемещать коробки со склада в клинику. Мы хотели построить мост между ведущими производителями мира и профессионалами, которые полагаются на их инструменты каждый день. Сегодня я с гордостью могу сказать, что мы создали один из самых полных каталогов в отрасли, включающий оборудование и расходные материалы высочайшего качества от самых уважаемых мировых брендов.',
      messageParagraph3: 'Однако наш обширный ассортимент — не наш главный актив; наша репутация — это то, что действительно важно.',
      messageParagraph4: 'В отрасли, часто определяемой холодными сделками и жесткими контрактами, мы выбрали другой путь. Мы верим в силу честных, человеческих отношений. Мы понимаем, что за каждым заказом стоит человек, пациент или исследователь, который зависит от нас. Вот почему прозрачность и честность для нас — не просто модные слова; они являются основой каждого нашего взаимодействия.',
      messageParagraph5: 'Мы не просто хотим быть вашим поставщиком; мы хотим быть партнером, которому вы можете полностью доверять. Независимо от того, являетесь ли вы давним клиентом или посещаете нас впервые, я хочу, чтобы вы знали, что мы ценим ваше доверие превыше всего. Мы стремимся поддерживать это доверие через справедливые практики, открытое общение и искреннюю преданность вашему успеху.',
      messageThankYou: 'Спасибо, что выбрали нас. Мы с нетерпением ждем возможности построить долгосрочное, честное партнерство с вами.',
      leadershipTeam: 'Команда руководителей',
      leadershipDescription: 'Наша опытная команда объединяет десятилетия опыта в области распределения медицинского оборудования, логистики и консультирования в сфере здравоохранения.',
      workWithTeam: 'Работайте с командой, которой можно доверять',
      workWithTeamDescription: 'Наша команда стремится предоставлять исключительный сервис и строить долгосрочные партнерства. Давайте обсудим, как мы можем поддержать ваши потребности.',
      viewProducts: 'Посмотреть наши продукты',
      learnMore: 'Узнать больше о нас',
      email: 'Email',
      connectLinkedIn: 'Связаться в LinkedIn',
      memberBio: {
        maksim: 'Основатель, член совета директоров и акционер. Страстный предприниматель с обширным опытом в международных продажах, IT и лабораторной диагностике. Сильные лидерские качества, коммуникативные способности и навыки преподавания.',
        alexei: 'Ведущий архитектор программного обеспечения, движущий цифровую трансформацию и инновации. Эксперт в области full-stack разработки, системной архитектуры и корпоративных программных решений. Возглавляет разработку передовых платформ и внутренних инструментов.',
        anastasiyaV: 'Председатель совета директоров. Более десяти лет опыта в лабораторной диагностике, маркетинге и исследованиях. Специализируется на стратегическом планировании и развитии бизнеса.',
        anastasiyaM: 'Креативный маркетинговый специалист, повышающий узнаваемость бренда и вовлеченность клиентов. Эксперт в области цифрового маркетинга, контент-стратегии и анализа рынка для индустрии медицинского оборудования.',
        kseniya: 'Ориентированный на результат менеджер проектов с опытом успешной реализации сложных логистических проектов и проектов цепочки поставок в срок. Обеспечивает бесшовную координацию между производителями, дистрибьюторами и клиентами.',
      },
    },
    bulkOrder: {
      title: 'Массовый заказ',
      subtitle: 'Экономьте время, вставляя каталожные номера и количества',
      enterProducts: 'Введите продукты',
      instructions: 'Вставьте список продуктов здесь. Формат: Артикул [TAB/ЗАПЯТАЯ/ПРОБЕЛ] Количество',
      process: 'Обработать элементы',
      results: 'Результаты',
      addAllToCart: 'Добавить все в корзину',
      items: 'товаров',
      pasteTitle: 'Вставьте сюда каталожные номера',
      pasteSubtitle: 'По одному товару в строке: каталожный номер и количество. Можно копировать прямо из Excel, PDF или письма.',
      pastePlaceholder: 'Вставьте сюда, например:\n\n10446232\t2\n07P3203, 5\n05031738; 12\nВероналовый буфер 10445724 2',
      pasteFromClipboard: 'Вставить из буфера',
      tryExample: 'Заполнить примером',
      clear: 'Очистить',
      processing: 'Сопоставляем…',
      linesDetected: 'позиций распознано',
      anyFormat: 'Подойдёт любой формат',
      found: 'Найдено',
      notFound: 'Не найдено',
      foundProducts: 'Найденные товары',
      notFoundSkus: 'Каталожные номера не найдены',
      errorEmpty: 'Сначала вставьте каталожные номера с количеством.',
      errorNoItems: 'Не удалось распознать ни одной строки. Укажите каталожный номер и количество в каждой строке.',
      errorGeneric: 'При обработке списка произошла ошибка. Попробуйте ещё раз.',
      heroBadge: 'Вставка · Сопоставление · Заказ',
      heroEyebrow: 'Для отделов закупок и дистрибьюторов',
      heroHeadline: 'Вставьте свой список — мы соберём корзину',
      heroTagline: 'Скопируйте 5 или 500 каталожных номеров с количеством. Парсер сопоставит их со 100 000+ SKU и автоматически заполнит корзину. Больше никаких таблиц по почте туда-сюда.',
      steps: {
        step1Title: 'Вставьте список',
        step1Desc: 'Подходит любой формат — табы, запятые, точки с запятой, пробелы. Артикул и количество, по одному на строку.',
        step2Title: 'Мы мгновенно сопоставим',
        step2Desc: 'Наш движок находит каждый товар по артикулу или каталожному номеру и показывает, что есть в наличии.',
        step3Title: 'Корзина готова за секунды',
        step3Desc: 'Один клик — и всё в корзине. Проверьте, скорректируйте количество и запросите счёт.',
      },
      benefits: {
        time: { title: 'Экономия часов на заказе', value: '30с', description: 'Среднее время на загрузку 100 SKU — против ~45 минут вручную.' },
        accuracy: { title: 'Ноль ошибок при копировании', value: '100%', description: 'Каждый артикул сверяется с нашим каталогом перед добавлением в корзину.' },
        formats: { title: 'Любой ваш формат', value: '5+', description: 'Табы, запятые, точки с запятой, пробелы — и даже строки с произвольным названием товара.' },
      },
      seo: {
        whyTitle: 'Почему отделы закупок выбирают массовый заказ',
        whyParagraph: 'Если вы заказываете по повторяющемуся списку — инвентарь лаборатории, протокол клиники, дозаказ дистрибьютора — ввод позиций вручную съедает часы. Вставьте полный список один раз, получите редактируемую корзину и отправьте её на оформление. Инструмент массового заказа Adoris понимает реальные «грязные» форматы из писем поставщиков, прайс-листов дистрибьюторов и выгрузок ERP.',
        idealForTitle: 'Идеально подходит',
        idealFor: [
          'Менеджерам закупок больниц и клиник',
          'Независимым лабораториям для дозаказа инвентаря',
          'Дистрибьюторам для сборки заказа из коммерческого предложения',
          'Повторным заказам по прошлому счёту или PDF от Adoris',
        ],
      },
    },
    supplier: {
      title: 'Станьте нашим поставщиком',
      subtitle: 'Присоединяйтесь к нашей сети поставщиков',
      description: 'Если у вас есть доступ к качественным продуктам по конкурентоспособным ценам от производителей, мы будем рады сотрудничать с вами. Просто загрузите ваш каталог продукции в формате Excel, и мы рассмотрим вашу заявку.',
      heroBadge: 'Подключаем новых партнёров каждый месяц',
      heroEyebrow: 'Ищем поставщиков с прямыми ценами от производителя',
      heroHeadline: 'Есть прямые цены от производителя?',
      heroHeadlineAccent: 'Давайте сотрудничать.',
      heroTagline: 'Adoris активно расширяет сеть поставщиков по Европе, СНГ и Азии. Если вы можете поставлять оригинальную продукцию по конкурентоспособным ценам — особенно напрямую от производителя — мы готовы говорить уже на этой неделе.',
      heroCtaPrimary: 'Отправить каталог',
      heroCtaSecondary: 'Что мы закупаем',
      benefits: {
        title: 'Почему поставщики выбирают Adoris',
        subtitle: 'Мы не маркетплейс. Мы покупатель с реальным объёмом, быстрыми платежами и долгосрочным горизонтом.',
        items: [
          { title: 'Регулярный объём', description: 'Закупка €20M+ в год по 50+ производителям. Предсказуемые ежемесячные заказы, а не разовые сделки.', icon: 'trending' },
          { title: 'Быстрые и прозрачные платежи', description: 'SWIFT и SEPA по ЕС и ЕАЭС. Для новых партнёров доступна 100% предоплата — без ожидания условий.', icon: 'wallet' },
          { title: 'Фокус на прямых производителях', description: 'Приоритет — партнёрам с прямыми заводскими ценами. Никаких четырёх посредников между вами и линией.', icon: 'factory' },
          { title: 'Контрагент в ЕС, регулируемый', description: 'Регистрация EU VAT, соблюдение AML/KYC, обработка данных по GDPR. Ваши контракты и IP защищены.', icon: 'shield' },
          { title: 'Логистику берём на себя', description: 'Работаем на EXW Вильнюс. Вы передаёте груз на своём складе — мы ведём холодовую цепь, таможню и последнюю милю.', icon: 'truck' },
          { title: 'Долгосрочные контракты', description: 'Рамочные соглашения на несколько лет — после успешных первых 2–3 поставок. Предсказуемая выручка.', icon: 'handshake' },
        ],
      },
      whoTitle: 'Кого мы ищем',
      whoSubtitle: 'Если что-то из этого про вас — отправьте каталог сегодня.',
      whoItems: [
        { title: 'Производители', description: 'Прямые производители реагентов, расходных материалов, лабораторного оборудования, IVD-наборов или медицинских изделий, ищущие дистрибуционное плечо в ЕС.' },
        { title: 'Авторизованные дистрибьюторы', description: 'Региональные дистрибьюторы с эксклюзивными контрактами и конкурентоспособными ценами на конкретный бренд или продуктовую линейку.' },
        { title: 'Импортёры с остатками', description: 'Держатели складского запаса по привлекательным ценам — оверсток, параллельный импорт, end-of-line — при условии, что товар оригинальный и сертифицированный.' },
        { title: 'OEM-партнёры', description: 'Производители, готовые выпускать конкретные SKU под white-label или co-brand для рынков ЕС и СНГ.' },
      ],
      processTitle: 'От каталога до первого заказа за 3 шага',
      processSubtitle: 'Большинство новых поставщиков получают первый заказ в течение 14 дней после отправки каталога.',
      processSteps: [
        { title: 'Отправьте каталог', description: 'Загрузите Excel или CSV с артикулом, производителем, названием, описанием и ценой. Форма ниже — занимает 2 минуты.' },
        { title: 'Мы проверяем и сопоставляем', description: 'Команда закупок проверяет цены, спрос и комплаенс. Письменный ответ — в течение 5 рабочих дней.' },
        { title: 'Первый пробный заказ', description: 'Размещаем небольшой пробный заказ. Когда он проходит чисто — переходим к регулярному объёму и обсуждаем рамочные условия.' },
      ],
      statsTitle: 'Профиль партнёра Adoris в цифрах',
      statsItems: [
        { value: '€20M+', label: 'Годовой бюджет закупок' },
        { value: '50+', label: 'Активных партнёров-производителей' },
        { value: '5 дней', label: 'Среднее время ответа' },
        { value: '14 дней', label: 'Медианное время до первого заказа' },
      ],
      formTitle: 'Отправьте ваш каталог',
      formSubtitle: 'Загрузите список товаров в Excel или CSV. Мы ответим в течение 5 рабочих дней.',
      faqTitle: 'Частые вопросы новых поставщиков',
      faqItems: [
        { question: 'Работаете ли вы с поставщиками из-за пределов ЕС?', answer: 'Да. Мы регулярно импортируем от производителей из Азии, США и СНГ. Наш таможенный брокер в Вильнюсе закрывает сторону импорта в ЕС.' },
        { question: 'Какие категории товаров для вас в приоритете?', answer: 'Реагенты, IVD-наборы, лабораторные расходники, анализаторы и приборы клинической химии. Также рассматриваем стоматологию, офтальмологию и ветеринарию в индивидуальном порядке.' },
        { question: 'Какой типичный объём первого заказа?', answer: 'Пробные заказы — от €5 000 до €30 000 в зависимости от продукта. После установления доверия регулярные заказы обычно растут до €50 000–€250 000 в квартал.' },
        { question: 'Подписываете ли вы NDA и эксклюзивные соглашения?', answer: 'Да. По запросу подписываем взаимный NDA до анализа каталога и можем обсудить региональную эксклюзивность по продуктовым линиям, по которым готовы взять объём.' },
      ],
      fileFormat: 'Требования к формату файла',
      fileFormatDescription: 'Пожалуйста, загрузите ваш каталог продукции в виде файла Excel (.xlsx, .xls) или CSV со следующими колонками:',
      requiredFields: 'Обязательные поля',
      fields: {
        manufacturer: 'Производитель',
        sku: 'Артикул',
        productName: 'Название продукта',
        productDescription: 'Описание продукта',
        price: 'Цена',
      },
      uploadFile: 'Загрузить каталог продукции',
      selectFile: 'Нажмите, чтобы выбрать файл или перетащите его',
      fileName: 'Выбранный файл',
      submit: 'Отправить заявку',
      submitting: 'Отправка...',
      success: 'Заявка успешно отправлена!',
      successMessage: 'Спасибо за ваш интерес стать нашим поставщиком. Мы получили вашу заявку и каталог продукции. Наша команда рассмотрит их и свяжется с вами в ближайшее время.',
      error: 'Ошибка',
      errorMessage: 'Пожалуйста, загрузите действительный файл Excel или CSV и заполните все обязательные поля.',
      companyName: 'Название компании',
      companyNamePlaceholder: 'Введите название вашей компании',
      contactName: 'Контактное лицо',
      contactNamePlaceholder: 'Введите ваше полное имя',
      email: 'Адрес электронной почты',
      emailPlaceholder: 'ваш.email@example.com',
      phone: 'Номер телефона',
      phonePlaceholder: '+7 (999) 123-45-67',
      notes: 'Дополнительные примечания',
      notesPlaceholder: 'Любая дополнительная информация, которой вы хотели бы поделиться...',
    },
    admin: {
      title: 'Панель администратора',
      dashboard: 'Панель администратора',
      orders: 'Заказы',
      products: 'Продукты',
      companies: 'Компании',
      totalProducts: 'Всего продуктов',
      totalOrders: 'Всего заказов',
      pendingOrders: 'Ожидающие заказы',
      allOrders: 'Все заказы',
      importProducts: 'Импорт продуктов из Excel/CSV',
    },
    orderConfirmation: {
      title: 'Ваш запрос отправлен',
      subtitle: 'Спасибо за ваш заказ. Мы получили его и обрабатываем сейчас.',
      thankYou: 'Спасибо за ваш заказ',
      orderNumber: 'Номер заказа',
      orderPlaced: 'Заказ размещен',
      processing: 'Обработка',
      shipped: 'Отправлен',
      emailSent: 'Письмо с подтверждением заказа отправлено',
      emailSentDescription: 'Мы отправили письмо с подтверждением, деталями заказа и PDF-счетом на',
      checkSpam: 'Если вы не получили его в течение нескольких минут, пожалуйста, проверьте папку "Спам" или свяжитесь с нами по адресу',
      orderDetails: 'Детали заказа',
      billingInformation: 'Платежная информация',
      paymentInformation: 'Информация об оплате',
      paymentMethod: 'Способ оплаты',
      paymentTerms: 'Условия оплаты',
      bankTransferDetails: 'Детали банковского перевода будут отправлены вам на email отдельно.',
      orderItems: 'Товары в заказе',
      quantity: 'Кол-во',
      each: 'за шт.',
      subtotal: 'Промежуточный итог',
      volumeDiscount: 'Скидка за объем',
      logisticServices: 'Логистические услуги',
      total: 'Итого',
      continueShopping: 'Продолжить покупки',
      needHelp: 'Нужна помощь?',
      needHelpDescription: 'Если у вас есть вопросы по заказу, пожалуйста, свяжитесь с нами.',
    },
    auth: {
      welcomeBack: 'Добро пожаловать',
      signUp: 'Регистрация',
      signIn: 'Войти',
      signInToAccount: 'Войдите в свой аккаунт',
      createAccount: 'Создать новый аккаунт',
      password: 'Пароль',
      magicLink: 'Магическая ссылка',
      fullName: 'Полное имя',
      emailAddress: 'Адрес электронной почты',
      confirmPassword: 'Подтвердите пароль',
      passwordPlaceholder: 'минимум 6 символов',
      signingUp: 'Регистрация...',
      signingIn: 'Вход...',
      sending: 'Отправка...',
      sendLink: 'Отправить ссылку',
      magicLinkDescription: 'Мы отправим вам письмо со ссылкой для входа без пароля',
      backToShop: '← Вернуться в магазин',
      invalidEmailPassword: 'Неверный email или пароль',
      somethingWentWrong: 'Что-то пошло не так',
      failedToSendEmail: 'Не удалось отправить письмо',
      checkEmail: 'Проверьте почту! Мы отправили вам ссылку для входа.',
      passwordsDontMatch: 'Пароли не совпадают',
      passwordTooShort: 'Пароль должен содержать минимум 6 символов',
      userExists: 'Пользователь с таким email уже существует',
      registrationError: 'Ошибка регистрации',
      registrationSuccess: 'Регистрация успешна! Пожалуйста, войдите.',
    },
    verifyRequest: {
      checkEmail: 'Проверьте вашу почту',
      emailSent: 'Мы отправили вам ссылку для входа на ваш email адрес.',
      important: 'Важно:',
      checkSpam: 'Проверьте папку "Спам", если письмо не пришло',
      linkValid: 'Ссылка действительна в течение 24 часов',
      clickLink: 'Нажмите на ссылку, чтобы завершить вход',
      problems: 'Возникли проблемы? Свяжитесь с нами:',
      contactUs: 'Свяжитесь с нами',
      backToLogin: '← Вернуться к входу',
    },
    footer: {
      description: 'Профессиональное B2B медицинское и лабораторное оборудование от ведущих мировых производителей.',
      quickLinks: 'Быстрые ссылки',
      contactUs: 'Контакты',
      companyInfo: 'Информация о компании',
      website: 'Сайт',
      email: 'Email',
      phone: 'Телефон',
      allRightsReserved: 'Все права защищены.',
    },
    faq: {
      title: 'Часто задаваемые вопросы',
      subtitle: 'Найдите ответы на распространенные вопросы о наших продуктах, процессе заказа и услугах',
      searchPlaceholder: 'Поиск по часто задаваемым вопросам...',
      categories: {
        general: 'Общие',
        ordering: 'Заказ',
        shipping: 'Доставка',
        payment: 'Оплата',
        products: 'Продукты',
        account: 'Аккаунт',
      },
      items: [
        {
          question: 'Какие типы медицинского лабораторного оборудования вы предлагаете?',
          answer: 'Мы предлагаем широкий ассортимент медицинского лабораторного оборудования, включая анализаторы, реагенты, расходные материалы и диагностические приборы от ведущих производителей по всему миру. Наш каталог включает оборудование для клинической химии, гематологии, иммунологии и микробиологических лабораторий.',
          category: 'general',
        },
        {
          question: 'Какова минимальная сумма заказа?',
          answer: 'Минимальная сумма заказа составляет €5,000. Заказы ниже этой суммы могут облагаться дополнительными сборами за обработку. Для крупных заказов мы предлагаем скидки за объем, начиная с €50,000.',
          category: 'ordering',
        },
        {
          question: 'Как оформить заказ?',
          answer: 'Вы можете разместить Запрос на заказ через наш веб-сайт, добавив товары в корзину и перейдя к оформлению заказа. Для массовых заказов вы можете использовать нашу форму массового заказа для загрузки списка продуктов. Наши менеджеры обработают ваш запрос и отправят вам проформу-счет на электронную почту для оплаты. После подтверждения оплаты ваш заказ будет обработан.',
          category: 'ordering',
        },
        {
          question: 'Какие способы оплаты вы принимаете?',
          answer: 'Мы принимаем банковские переводы. Детали оплаты будут отправлены вам по электронной почте после подтверждения заказа. Все транзакции безопасны и обрабатываются в соответствии с международными стандартами.',
          category: 'payment',
        },
        {
          question: 'Сколько времени занимает доставка?',
          answer: 'Время доставки зависит от продукта и места назначения. Стандартная доставка обычно занимает 2-4 недели. Для срочных заказов доступны варианты экспресс-доставки. Вы получите информацию для отслеживания, как только ваш заказ будет отправлен.',
          category: 'shipping',
        },
        {
          question: 'Вы осуществляете международную доставку?',
          answer: 'Да, мы доставляем во многие страны по всему миру. Стоимость доставки и сроки зависят от места назначения. Пожалуйста, свяжитесь с нами для получения конкретной информации о доставке в ваше местоположение.',
          category: 'shipping',
        },
        {
          question: 'Ваши продукты оригинальные и сертифицированные?',
          answer: 'Да, все наши продукты на 100% оригинальные и поставляются с полными гарантиями и сертификатами производителя. Мы работаем напрямую с авторизованными дистрибьюторами и производителями, чтобы гарантировать подлинность.',
          category: 'products',
        },
        {
          question: 'Могу ли я отследить мой заказ?',
          answer: 'Да, как только ваш заказ будет отправлен, вы получите номер для отслеживания по электронной почте. Вы можете использовать этот номер для отслеживания вашей посылки на веб-сайте перевозчика.',
          category: 'ordering',
        },
        {
          question: 'Как создать аккаунт?',
          answer: 'Вы можете создать аккаунт, нажав "Войти" в заголовке и выбрав "Создать аккаунт". Вы также можете войти, используя магическую ссылку, отправленную на ваш адрес электронной почты для входа без пароля.',
          category: 'account',
        },
        {
          question: 'Могут ли цены изменяться?',
          answer: 'Да, цены могут незначительно изменяться в связи с изменением цен у производителей. Окончательная цена будет подтверждена в проформе-счете, отправленном нашими менеджерами после обработки вашего Запроса на заказ.',
          category: 'products',
        },
        {
          question: 'Кто несет ответственность за подборку товаров?',
          answer: 'Мы не несем ответственность за подборку товаров. Клиенты самостоятельно определяют, какие товары им необходимы. Для всех заказов обязателен каталожный номер (SKU). Пожалуйста, убедитесь, что у вас есть правильные каталожные номера перед размещением Запроса на заказ.',
          category: 'ordering',
        },
        {
          question: 'Могу ли я запросить расценку на массовые заказы?',
          answer: 'Абсолютно! Используйте нашу форму массового заказа для отправки ваших требований или свяжитесь с нами напрямую. Мы предлагаем конкурентоспособные цены для объемных заказов и можем предоставить индивидуальные расценки в зависимости от ваших конкретных потребностей.',
          category: 'ordering',
        },
      ],
      contactTitle: 'Все еще есть вопросы?',
      contactDescription: 'Наша команда готова помочь. Свяжитесь с нами, и мы ответим как можно скорее.',
    },
  },
}

export function getDictionary(language: Language = 'en'): Translations {
  return translations[language] || translations.en
}

export function getTranslations(language: Language) {
  return getDictionary(language)
}

