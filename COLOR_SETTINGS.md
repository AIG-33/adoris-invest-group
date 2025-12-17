# Настройки цветов всех элементов сайта

## CSS Переменные компании

Все цвета управляются через CSS переменные, которые устанавливаются в `app/layout.tsx` из базы данных:

- `--company-primary` - Основной цвет компании
- `--company-secondary` - Вторичный цвет компании  
- `--company-accent` - Акцентный цвет компании

## Распределение цветов по элементам

### 1. HEADER (components/header-client.tsx)

#### Top Bar (верхняя полоска с контактами)
- **Background**: `var(--company-primary)`
- **Text Color**: `var(--company-secondary)` (белый текст на primary фоне)

#### Main Header (логотип, поиск, меню)
- **Background**: `var(--company-secondary)`
- **Text Color**: `var(--company-primary)`
- **Search Button Background**: `var(--company-accent)`
- **Search Input Focus Border**: `var(--company-primary)`
- **Search Input Focus Ring**: `var(--company-primary)`
- **Cart Badge Background**: `var(--company-accent)`
- **Navigation Links Text**: `var(--company-primary)`
- **Dropdown Hover Text**: `var(--company-secondary)`
- **Admin Panel Link Text**: `var(--company-primary)`
- **Login Button Hover Text**: `var(--company-primary)`

### 2. FOOTER (components/footer-client.tsx)

- **Background**: `var(--company-primary)`
- **Text Color**: Белый (на primary фоне)
- **Links Hover**: `var(--company-secondary)`

### 3. GLOBAL STYLES (app/globals.css)

#### Body
- **Background**: `var(--company-secondary)`

#### Scrollbar
- **Track Background**: `var(--company-secondary)`
- **Thumb Background**: `var(--company-primary)`
- **Thumb Hover**: `var(--company-accent)`

### 4. HOMEPAGE (app/page.tsx)

#### Hero Section (components/hero-section.tsx)
- **Background Gradient**: `var(--company-primary)`
- **CTA Button Background**: `var(--company-accent)`
- **CTA Button Hover**: Затемненный accent
- **Slider Indicator Active**: `var(--company-accent)`

#### Featured Products (components/featured-products.tsx)
- **Navigation Buttons**: `bg-black/80` (хардкод)
- **Navigation Buttons Hover**: `bg-[#000000]` (хардкод)
- **Category Badge**: `bg-[#000000]/90` (хардкод)
- **Price Text**: `text-[#666666]` (хардкод)

#### Category Showcase (components/category-showcase.tsx)
- **Navigation Buttons**: `bg-black/80` (хардкод)
- **Navigation Buttons Hover**: `bg-[#000000]` (хардкод)
- **Price Text**: `text-[#666666]` (хардкод)
- **Link Hover**: `text-[#333333]` (хардкод)

### 5. PRODUCTS PAGE (app/products/page.tsx)

- **Page Background**: `var(--company-secondary)`
- **Action Buttons** (components/products-action-buttons.tsx):
  - **Background**: `var(--company-accent)`
  - **Hover**: Затемненный accent

### 6. PRODUCT DETAIL PAGE (app/product/[slug]/page.tsx)

#### Product Detail Component (components/product-detail.tsx)
- **Add to Cart Button Background**: `var(--company-accent)`
- **Add to Cart Button Hover**: Затемненный accent
- **Product Name Text**: `var(--company-primary)`
- **Price Text**: `var(--company-primary)`

### 7. BULK ORDER PAGE (app/bulk-order/page.tsx)

- **Page Background**: `var(--company-secondary)`
- **Hero Section Background**: `var(--company-primary)`

#### Bulk Order Form (components/bulk-order-form.tsx)
- **Icon Colors**: `var(--company-primary)`
- **Heading Colors**: `var(--company-primary)`
- **Textarea Focus Border**: `var(--company-primary)`
- **Process Button Background**: `var(--company-accent)`
- **Process Button Hover**: Затемненный accent
- **Add to Cart Button Background**: `var(--company-accent)`
- **Add to Cart Button Hover**: Затемненный accent
- **Product Name Text**: `var(--company-primary)`
- **Quantity Text**: `var(--company-primary)`

### 8. CART PAGE (app/cart/page.tsx)

#### Cart Content (components/cart-content.tsx)
- **Hero Section Background**: `var(--company-primary)`
- **Checkout Button Background**: `var(--company-accent)`
- **Checkout Button Hover**: Затемненный accent
- **Remove Button Border**: `var(--company-accent)`
- **Remove Button Text**: `var(--company-accent)`

### 9. CHECKOUT PAGE (app/checkout/page.tsx)

#### Checkout Form (components/checkout-form.tsx)
- **Progress Bar Active**: `var(--company-accent)`
- **Radio Button Selected**: `var(--company-accent)`
- **Place Order Button Background**: `var(--company-accent)`
- **Place Order Button Hover**: Затемненный accent

### 10. ACCOUNT PAGE (app/account/page.tsx)

- **Hero Section Background**: `var(--company-primary)`

#### Account Content (components/account-content.tsx)
- **Details Button Border**: `var(--company-accent)`
- **Details Button Text**: `var(--company-accent)`
- **Reorder Button Background**: `var(--company-accent)`
- **Reorder Button Hover**: Затемненный accent
- **Order Status Badge Background**: `var(--company-accent)`
- **Save Profile Button Background**: `var(--company-accent)`
- **Save Profile Button Hover**: Затемненный accent

### 11. ADMIN PAGE (app/admin/page.tsx)

- **Page Background**: `var(--company-secondary)`
- **Hero Section Background**: `var(--company-primary)`

#### Admin Panel (components/admin-panel.tsx)
- **Stats Icons Background**: `var(--company-accent)`
- **Import Products Button Background**: `var(--company-accent)`
- **Import Products Button Hover**: Затемненный accent
- **Companies Admin** (components/companies-admin.tsx):
  - **Save Button Background**: `var(--company-accent)`
  - **Save Button Hover**: Затемненный accent
  - **Delete Button**: Красный (хардкод)

### 12. ABOUT PAGE (app/company/about/page.tsx)

- **Hero Section Background**: `var(--company-primary)`
- **Growth Stats Section Background**: `var(--company-primary)`
- **CTA Buttons** (components/about-cta-buttons.tsx):
  - **Primary Button Background**: `var(--company-accent)`
  - **Primary Button Hover**: Затемненный accent
  - **Secondary Button Border**: `var(--company-accent)`
  - **Secondary Button Text**: `var(--company-accent)`
  - **Secondary Button Hover Background**: `var(--company-accent)`
  - **Secondary Button Hover Text**: Белый

### 13. TERMS PAGE (app/terms/page.tsx)

- **Hero Section Background**: `var(--company-primary)`
- **Icon Backgrounds**: `bg-[#666666]/10`, `bg-[#333333]/10`, `bg-[#000000]/10` (хардкод)
- **CTA Section Background**: `var(--company-primary)`

### 14. EXHIBITIONS PAGE (app/exhibitions/page.tsx)

- **Hero Section Background**: `var(--company-primary)`
- **Meet Us Section Background**: `var(--company-primary)`

### 15. TEAM PAGE (app/company/team/page.tsx)

- **Hero Section Background**: `var(--company-primary)`
- **LinkedIn Button**: `bg-[#0077b5]` (хардкод)
- **LinkedIn Button Hover**: `bg-[#005582]` (хардкод)

## Элементы с хардкод цветами (требуют обновления)

### Featured Products & Category Showcase
- Navigation buttons: `bg-black/80`, `hover:bg-[#000000]`
- Category badge: `bg-[#000000]/90`
- Price text: `text-[#666666]`
- Link hover: `text-[#333333]`

### Terms Page
- Icon backgrounds: `bg-[#666666]/10`, `bg-[#333333]/10`, `bg-[#000000]/10`

### Team Page
- LinkedIn button: `bg-[#0077b5]`, `hover:bg-[#005582]`

### Admin Panel
- Delete button: Красный (хардкод)

## Рекомендации

1. Заменить все хардкод цвета на CSS переменные для полной кастомизации
2. Использовать `var(--company-primary)` для всех основных элементов
3. Использовать `var(--company-secondary)` для фонов
4. Использовать `var(--company-accent)` для всех кнопок и акцентов

