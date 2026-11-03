'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Page content must be server-rendered: crawlers need the HTML, and HTTP 301/404
  // from redirect()/notFound() only work when the shell waits for the page.
  return (
    <SessionProvider>
      {children}
      {mounted && <Toaster
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
      />}
    </SessionProvider>
  )
}
