'use client'

import { createContext, useContext, ReactNode } from 'react'

interface CompanyColors {
  primary: string
  secondary: string
  accent: string
  logo: string | null
}

const CompanyContext = createContext<CompanyColors | null>(null)

export function CompanyProvider({ children }: { children: ReactNode }) {
  // Get company colors from headers (set by middleware)
  const primaryColor = typeof window !== 'undefined' 
    ? document.documentElement.style.getPropertyValue('--company-primary') || '#333333'
    : '#333333'
  const secondaryColor = typeof window !== 'undefined'
    ? document.documentElement.style.getPropertyValue('--company-secondary') || '#666666'
    : '#666666'
  const accentColor = typeof window !== 'undefined'
    ? document.documentElement.style.getPropertyValue('--company-accent') || '#000000'
    : '#000000'
  // Normalize logo URL to ensure it starts with a slash
  const normalizeLogoUrl = (logo: string | null | undefined): string => {
    if (!logo) {
      return '/logo.png'
    }
    
    // If logo is already a full URL, return as is
    if (logo.startsWith('http://') || logo.startsWith('https://')) {
      return logo
    }
    
    // Ensure logo starts with a slash
    return logo.startsWith('/') ? logo : `/${logo}`
  }

  const rawLogo = typeof window !== 'undefined'
    ? document.documentElement.getAttribute('data-company-logo')
    : null
  const logo = rawLogo ? normalizeLogoUrl(rawLogo) : null

  const colors: CompanyColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    logo,
  }

  return (
    <CompanyContext.Provider value={colors}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompanyColors() {
  const context = useContext(CompanyContext)
  return context || {
    primary: '#333333',
    secondary: '#666666',
    accent: '#000000',
    logo: null,
  }
}

