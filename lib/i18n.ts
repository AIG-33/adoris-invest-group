export type Language = 'en' | 'ru'

// Re-export from translations.ts for backward compatibility
export { getDictionary, getTranslations } from './translations'
export type { Translations } from './translations'

// Legacy function for simple key-value translations (kept for backward compatibility)
export function t(key: string, language: Language = 'en'): string {
  // This is a simplified version - use getDictionary for full translations
  const dict = getDictionary(language)
  
  // Try to resolve nested keys like 'nav.home' -> dict.nav.home
  const keys = key.split('.')
  let value: any = dict
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  console.warn(`Translation missing for key: ${key}`)
  return key
}

