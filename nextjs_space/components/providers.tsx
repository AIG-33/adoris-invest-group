'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#171717',
            border: '1px solid #e5e5e5',
            borderRadius: '0.75rem',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#000000',
              secondary: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  )
}
