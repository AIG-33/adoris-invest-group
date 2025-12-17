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
  const logo = typeof window !== 'undefined'
    ? document.documentElement.getAttribute('data-company-logo')
    : null

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

