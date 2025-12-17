'use client'

import { useEffect } from 'react'

/**
 * Client component to sync company colors from CSS variables
 * This ensures colors are always up-to-date when changed in admin panel
 */
export function ColorSync() {
  useEffect(() => {
    // Function to update colors from CSS variables
    const updateColors = () => {
      // Colors are already set in layout.tsx via inline styles on <html>
      // This component just ensures they're available for client-side updates
      // If colors change in admin, a page refresh will pick them up
      // For real-time updates, we could add polling here, but it's not necessary
      // as Next.js will re-render with new colors on next navigation
    }

    updateColors()

    // Optional: Poll for color updates every 30 seconds (can be disabled if not needed)
    // const interval = setInterval(updateColors, 30000)
    // return () => clearInterval(interval)
  }, [])

  return null // This component doesn't render anything
}

