export type Language = 'en' | 'ru'

export interface Translations {
  [key: string]: {
    en: string
    ru: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ru: 'Главная' },
  'nav.products': { en: 'Products', ru: 'Продукты' },
  'nav.catalog': { en: 'Catalog', ru: 'Каталог' },
  'nav.company': { en: 'Company', ru: 'Компания' },
  'nav.about': { en: 'About Us', ru: 'О нас' },
  'nav.team': { en: 'Team', ru: 'Команда' },
  'nav.exhibitions': { en: 'Exhibitions', ru: 'Выставки' },
  'nav.terms': { en: 'Terms', ru: 'Условия' },
  'nav.account': { en: 'My Account', ru: 'Мой аккаунт' },
  'nav.cart': { en: 'Cart', ru: 'Корзина' },
  'nav.checkout': { en: 'Checkout', ru: 'Оформление заказа' },
  'nav.login': { en: 'Login', ru: 'Войти' },
  'nav.logout': { en: 'Logout', ru: 'Выйти' },
  'nav.admin': { en: 'Admin', ru: 'Админ' },
  
  // Common
  'common.addToCart': { en: 'Add to Cart', ru: 'Добавить в корзину' },
  'common.price': { en: 'Price', ru: 'Цена' },
  'common.total': { en: 'Total', ru: 'Итого' },
  'common.subtotal': { en: 'Subtotal', ru: 'Промежуточный итог' },
  'common.quantity': { en: 'Quantity', ru: 'Количество' },
  'common.remove': { en: 'Remove', ru: 'Удалить' },
  'common.save': { en: 'Save', ru: 'Сохранить' },
  'common.cancel': { en: 'Cancel', ru: 'Отмена' },
  'common.search': { en: 'Search', ru: 'Поиск' },
  'common.filter': { en: 'Filter', ru: 'Фильтр' },
  'common.loading': { en: 'Loading...', ru: 'Загрузка...' },
  
  // Cart
  'cart.empty': { en: 'Your cart is empty', ru: 'Ваша корзина пуста' },
  'cart.items': { en: 'items', ru: 'товаров' },
  'cart.proceedToCheckout': { en: 'Proceed to Checkout', ru: 'Перейти к оформлению' },
  
  // Product
  'product.sku': { en: 'SKU', ru: 'Артикул' },
  'product.description': { en: 'Description', ru: 'Описание' },
  'product.manufacturer': { en: 'Manufacturer', ru: 'Производитель' },
  'product.category': { en: 'Category', ru: 'Категория' },
  
  // Order
  'order.confirmation': { en: 'Order Confirmation', ru: 'Подтверждение заказа' },
  'order.number': { en: 'Order Number', ru: 'Номер заказа' },
  'order.date': { en: 'Order Date', ru: 'Дата заказа' },
  'order.status': { en: 'Status', ru: 'Статус' },
  
  // Account
  'account.profile': { en: 'Profile', ru: 'Профиль' },
  'account.orders': { en: 'Orders', ru: 'Заказы' },
  'account.totalOrders': { en: 'Total Orders', ru: 'Всего заказов' },
  'account.totalSpent': { en: 'Total Spent', ru: 'Всего потрачено' },
}

export function t(key: string, language: Language = 'en'): string {
  const translation = translations[key]
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`)
    return key
  }
  return translation[language] || translation.en
}

export function getTranslations(language: Language) {
  return (key: string) => t(key, language)
}

