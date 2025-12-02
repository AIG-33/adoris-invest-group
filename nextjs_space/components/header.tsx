'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Search, ShoppingCart, User, LogOut, Package, Calendar, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SearchResult {
  id: string
  name: string
  sku: string
  slug: string
  price: number
  imageUrl: string | null
  category: { name: string } | null
  manufacturer: { name: string } | null
}

export function Header() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          setShowDropdown(results.length > 0)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e?.preventDefault?.()
    if (searchQuery?.trim()) {
      setShowDropdown(false)
      router?.push?.(`/?search=${encodeURIComponent(searchQuery?.trim() || '')}`)
    }
  }

  const handleResultClick = (slug: string) => {
    setShowDropdown(false)
    setSearchQuery('')
    router.push(`/product/${slug}`)
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1a8c7c] text-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span>📧 info@ivdgroup.eu</span>
              <span>📞 +48 88 1049959</span>
            </div>
            <div className="flex items-center gap-4">
              <span>IVD GROUP Sp. z o.o. | Warsaw, Poland</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-48 h-12">
              <Image
                src="/logo.png"
                alt="IVD GROUP"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value || '')}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowDropdown(true)
                    }
                  }}
                  placeholder="Search by product name, SKU, manufacturer..."
                  className="w-full px-4 py-3 pl-12 border-2 border-neutral-200 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                {isSearching ? (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#20a895] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#20a895] text-white px-6 py-2 rounded-md hover:bg-[#0891B2] transition-colors font-medium"
                  >
                    Search
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-left"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1a8c7c] truncate">{product.name}</div>
                      <div className="text-sm text-neutral-600 flex items-center gap-2 mt-1">
                        <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-xs">
                          {product.sku}
                        </span>
                        {product.manufacturer && (
                          <span className="text-xs">{product.manufacturer.name}</span>
                        )}
                      </div>
                      {product.category && (
                        <div className="text-xs text-neutral-500 mt-1">{product.category.name}</div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-[#1a8c7c]">€{product.price.toFixed(2)}</div>
                      <div className="text-xs text-neutral-500">excl. VAT</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/exhibitions"
              className="flex items-center gap-2 text-neutral-700 hover:text-[#2ec4b6] font-medium transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Exhibitions</span>
            </Link>

            <Link
              href="/terms"
              className="flex items-center gap-2 text-neutral-700 hover:text-[#20a895] font-medium transition-colors"
            >
              <span>Terms</span>
            </Link>

            {/* My Account Dropdown Menu */}
            {status === 'authenticated' && session?.user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-neutral-700 hover:text-[#20a895] font-medium transition-colors outline-none">
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/bulk-order" className="flex items-center gap-2 cursor-pointer">
                        <Package className="w-4 h-4" />
                        <span>Bulk Order</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cart" className="flex items-center gap-2 cursor-pointer relative">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto bg-[#20a895] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    {(session?.user as any)?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-[#1a8c7c] font-semibold">
                            <User className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-neutral-700 hover:text-[#20a895] font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
