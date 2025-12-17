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
    account: string
    cart: string
    checkout: string
    login: string
    logout: string
    admin: string
    bulkOrder: string
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
    }
  }
  
  // Exhibitions
  exhibitions: {
    title: string
    subtitle: string
    contactUs: string
  }
  
  // Team
  team: {
    title: string
    subtitle: string
    messageTitle: string
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
  }
  
  // Admin
  admin: {
    title: string
    orders: string
    products: string
    companies: string
    stats: {
      totalProducts: string
      totalOrders: string
      pendingOrders: string
    }
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
      account: 'My Account',
      cart: 'Cart',
      checkout: 'Checkout',
      login: 'Login',
      logout: 'Logout',
      admin: 'Admin',
      bulkOrder: 'Bulk Order',
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
      },
    },
    exhibitions: {
      title: 'Exhibitions',
      subtitle: 'Adoris Invest Group OU actively participates in leading medical and laboratory equipment exhibitions across Europe and worldwide',
      contactUs: 'Contact Us',
    },
    team: {
      title: 'Meet Our Team',
      subtitle: 'The professionals behind our success',
      messageTitle: 'A Message from the CEO',
    },
    bulkOrder: {
      title: 'Bulk Order',
      subtitle: 'Save time by pasting catalog numbers and quantities',
      enterProducts: 'Enter Products',
      instructions: 'Paste your product list here. Format: SKU [TAB/COMMA/SPACE] Quantity',
      process: 'Process Items',
      results: 'Results',
      addAllToCart: 'Add All to Cart',
    },
    admin: {
      title: 'Admin Panel',
      orders: 'Orders',
      products: 'Products',
      companies: 'Companies',
      stats: {
        totalProducts: 'Total Products',
        totalOrders: 'Total Orders',
        pendingOrders: 'Pending Orders',
      },
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
      account: 'Мой аккаунт',
      cart: 'Корзина',
      checkout: 'Оформление заказа',
      login: 'Войти',
      logout: 'Выйти',
      admin: 'Админ',
      bulkOrder: 'Массовый заказ',
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
      placeOrder: 'Оформить заказ',
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
      },
    },
    exhibitions: {
      title: 'Выставки',
      subtitle: 'Adoris Invest Group OU активно участвует в ведущих выставках медицинского и лабораторного оборудования в Европе и по всему миру',
      contactUs: 'Свяжитесь с нами',
    },
    team: {
      title: 'Наша команда',
      subtitle: 'Профессионалы, стоящие за нашим успехом',
      messageTitle: 'Послание от генерального директора',
    },
    bulkOrder: {
      title: 'Массовый заказ',
      subtitle: 'Экономьте время, вставляя каталожные номера и количества',
      enterProducts: 'Введите продукты',
      instructions: 'Вставьте список продуктов здесь. Формат: Артикул [TAB/ЗАПЯТАЯ/ПРОБЕЛ] Количество',
      process: 'Обработать элементы',
      results: 'Результаты',
      addAllToCart: 'Добавить все в корзину',
    },
    admin: {
      title: 'Панель администратора',
      orders: 'Заказы',
      products: 'Продукты',
      companies: 'Компании',
      stats: {
        totalProducts: 'Всего продуктов',
        totalOrders: 'Всего заказов',
        pendingOrders: 'Ожидающие заказы',
      },
    },
  },
}

export function getDictionary(language: Language = 'en'): Translations {
  return translations[language] || translations.en
}

export function getTranslations(language: Language) {
  return getDictionary(language)
}

