'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to get company colors from CSS variables
 */
export function useCompanyColors() {
  const [colors, setColors] = useState({
    primary: '#333333',
    secondary: '#ffffff',
    accent: '#000000',
  })

  useEffect(() => {
    // Get colors from CSS variables
    const root = document.documentElement
    const primary = getComputedStyle(root).getPropertyValue('--company-primary').trim() || '#333333'
    const secondary = getComputedStyle(root).getPropertyValue('--company-secondary').trim() || '#ffffff'
    const accent = getComputedStyle(root).getPropertyValue('--company-accent').trim() || '#000000'

    setColors({
      primary,
      secondary,
      accent,
    })
  }, [])

  return colors
}

/**
 * Helper to darken a color
 */
export function darkenColor(color: string, amount: number = 20): string {
  const hex = color.replace('#', '')
  const rgb = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0]
  const darkened = `rgb(${Math.max(0, rgb[0] - amount)}, ${Math.max(0, rgb[1] - amount)}, ${Math.max(0, rgb[2] - amount)})`
  return darkened
}

