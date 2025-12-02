'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, ShoppingCart, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Header() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage?.getItem?.('cart') || '[]')
      setCartCount(cart?.length || 0)
    }
    updateCartCount()

    // Listen for cart updates
    window?.addEventListener?.('cartUpdated', updateCartCount)
    return () => window?.removeEventListener?.('cartUpdated', updateCartCount)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e?.preventDefault?.()
    if (searchQuery?.trim()) {
      router?.push?.(`/?search=${encodeURIComponent(searchQuery?.trim() || '')}`)
    }
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#0A2463] text-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span>📧 info@ivdgroup.eu</span>
              <span>📞 +48 123 456 789</span>
            </div>
            <div>B2B Medical Equipment Portal</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#10B981] rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
              IVD
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#0A2463]">IVD GROUP</span>
              <span className="text-xs text-neutral-600">Medical Equipment</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value || '')}
                placeholder="Search by product name, SKU, manufacturer..."
                className="w-full px-4 py-3 pl-12 border-2 border-neutral-200 rounded-lg focus:border-[#06B6D4] focus:outline-none focus:ring-4 focus:ring-[#06B6D4]/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#06B6D4] text-white px-6 py-2 rounded-md hover:bg-[#0891B2] transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {status === 'authenticated' && session?.user ? (
              <>
                {(session?.user as any)?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-neutral-700 hover:text-[#06B6D4] font-medium transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-neutral-700 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-neutral-700 hover:text-[#06B6D4] font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="flex items-center gap-2 text-neutral-700 hover:text-[#06B6D4] font-medium transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#06B6D4] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
