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
      shopNow: string
      tryBulkOrder: string
      browseCatalog: string
    }
    featuredProducts: {
      title: string
      subtitle: string
      viewAll: string
    }
    stats: {
      whyChoose: string
      readyToOrder: string
      minimumOrder: string
      browseCatalog: string
      viewTerms: string
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
        shopNow: 'Shop Now',
        tryBulkOrder: 'Try Bulk Order',
        browseCatalog: 'Browse Catalog',
      },
      featuredProducts: {
        title: 'Featured Products',
        subtitle: 'Premium medical equipment from top manufacturers',
        viewAll: 'View All',
      },
      stats: {
        whyChoose: 'Why Choose',
        readyToOrder: 'Ready to order?',
        minimumOrder: 'Minimum order €10,000 · 100% prepayment · 4-7 weeks delivery',
        browseCatalog: 'Browse Catalog',
        viewTerms: 'View Terms',
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
        description: 'The minimum order value is €10,000.',
        note: 'Please note: Orders below €10,000 will incur additional delivery charges from suppliers\' warehouses to our warehouse in Vilnius, approximately €300-€500.',
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
      subtitle: 'Adoris Invest Group OU actively participates in leading medical and laboratory equipment exhibitions across Europe and worldwide',
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
          answer: 'The minimum order value is €1,000. Orders below this amount may be subject to additional handling fees. For bulk orders, we offer volume discounts starting from €50,000.',
          category: 'ordering',
        },
        {
          question: 'How do I place an order?',
          answer: 'You can place an order through our website by adding products to your cart and proceeding to checkout. For bulk orders, you can use our bulk order form to upload a list of products. After placing an order, you will receive a confirmation email with order details.',
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
          question: 'What is your return policy?',
          answer: 'We accept returns within 30 days of delivery for unopened and unused products in original packaging. Custom orders and special items may have different return policies. Please contact us for specific return instructions.',
          category: 'ordering',
        },
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking "Login" in the header and selecting "Create Account". You can also sign in using a magic link sent to your email address for passwordless authentication.',
          category: 'account',
        },
        {
          question: 'Do you offer technical support?',
          answer: 'Yes, we provide technical support for all products. Our team can assist with installation, troubleshooting, and maintenance. Contact us via email or phone for technical assistance.',
          category: 'general',
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
        shopNow: 'Купить сейчас',
        tryBulkOrder: 'Попробовать массовый заказ',
        browseCatalog: 'Просмотреть каталог',
      },
      featuredProducts: {
        title: 'Рекомендуемые товары',
        subtitle: 'Премиальное медицинское оборудование от ведущих производителей',
        viewAll: 'Посмотреть все',
      },
      stats: {
        whyChoose: 'Почему выбирают',
        readyToOrder: 'Готовы сделать заказ?',
        minimumOrder: 'Минимальный заказ €10,000 · 100% предоплата · Доставка 4-7 недель',
        browseCatalog: 'Просмотреть каталог',
        viewTerms: 'Посмотреть условия',
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
        description: 'Минимальная сумма заказа составляет €10,000.',
        note: 'Обратите внимание: Заказы ниже €10,000 будут нести дополнительные расходы на доставку со складов поставщиков на наш склад в Вильнюсе, примерно €300-€500.',
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
      subtitle: 'Adoris Invest Group OU активно участвует в ведущих выставках медицинского и лабораторного оборудования в Европе и по всему миру',
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
          answer: 'Минимальная сумма заказа составляет €1,000. Заказы ниже этой суммы могут облагаться дополнительными сборами за обработку. Для крупных заказов мы предлагаем скидки за объем, начиная с €50,000.',
          category: 'ordering',
        },
        {
          question: 'Как оформить заказ?',
          answer: 'Вы можете оформить заказ через наш веб-сайт, добавив товары в корзину и перейдя к оформлению заказа. Для массовых заказов вы можете использовать нашу форму массового заказа для загрузки списка продуктов. После размещения заказа вы получите подтверждающее письмо с деталями заказа.',
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
          question: 'Какова ваша политика возврата?',
          answer: 'Мы принимаем возвраты в течение 30 дней с момента доставки для нераспечатанных и неиспользованных продуктов в оригинальной упаковке. Индивидуальные заказы и специальные товары могут иметь другую политику возврата. Пожалуйста, свяжитесь с нами для получения конкретных инструкций по возврату.',
          category: 'ordering',
        },
        {
          question: 'Как создать аккаунт?',
          answer: 'Вы можете создать аккаунт, нажав "Войти" в заголовке и выбрав "Создать аккаунт". Вы также можете войти, используя магическую ссылку, отправленную на ваш адрес электронной почты для входа без пароля.',
          category: 'account',
        },
        {
          question: 'Предоставляете ли вы техническую поддержку?',
          answer: 'Да, мы предоставляем техническую поддержку для всех продуктов. Наша команда может помочь с установкой, устранением неполадок и обслуживанием. Свяжитесь с нами по электронной почте или телефону для технической помощи.',
          category: 'general',
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

