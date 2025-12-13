'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Search, ShoppingCart, User, LogOut, Package, Calendar, ChevronDown, Building2 } from 'lucide-react'
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
      {/* Top Bar - Hidden on Mobile */}
      <div className="bg-black text-white hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex justify-between items-center text-xs lg:text-sm">
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="truncate">📧 ceo@adorisgroup.com</span>
              <span className="hidden sm:inline">📞 +48 881 049 959</span>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <span>ADORIS INVEST GROUP OÜ | Tallinn, Estonia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Logo - Smaller on Mobile */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-32 h-8 sm:w-40 sm:h-10 lg:w-48 lg:h-12">
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
          <div ref={searchRef} className="flex-1 w-full sm:max-w-md lg:max-w-2xl relative order-3 sm:order-2">
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
                  placeholder="Search products..."
                  className="w-full px-3 py-2 sm:py-3 pl-10 sm:pl-12 pr-20 sm:pr-24 text-sm sm:text-base border-2 border-neutral-200 rounded-lg focus:border-[#333333] focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#333333]/10 transition-all"
                />
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 sm:w-5 sm:h-5" />
                {isSearching ? (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#333333] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-[#333333] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-md hover:bg-[#1a1a1a] transition-colors font-medium text-xs sm:text-sm"
                  >
                    Search
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-80 sm:max-h-96 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-left"
                  >
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#000000] truncate text-sm sm:text-base">{product.name}</div>
                      <div className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1 sm:gap-2 mt-1">
                        <span className="font-mono bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded text-xs">
                          {product.sku}
                        </span>
                        {product.manufacturer && (
                          <span className="text-xs truncate">{product.manufacturer.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-[#000000] text-sm sm:text-base">€{product.price.toFixed(2)}</div>
                      <div className="text-xs text-neutral-500 hidden sm:block">excl. VAT</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions - Compact on Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 order-2 sm:order-3">
            <Link
              href="/products"
              className="flex items-center gap-1 sm:gap-2 text-neutral-700 hover:text-[#666666] font-medium transition-colors text-xs sm:text-sm lg:text-base"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Catalog</span>
            </Link>

            {/* Company Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 sm:gap-2 text-neutral-700 hover:text-[#666666] font-medium transition-colors outline-none text-xs sm:text-sm lg:text-base">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Company</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuItem asChild>
                  <Link href="/company/about" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    <span>About Us</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/company/team" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Team</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/exhibitions" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    <span>Exhibitions</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/terms"
              className="hidden md:flex items-center gap-2 text-neutral-700 hover:text-[#333333] font-medium transition-colors"
            >
              <span>Terms</span>
            </Link>

            {/* My Account Dropdown Menu */}
            {status === 'authenticated' && session?.user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 sm:gap-2 text-neutral-700 hover:text-[#333333] font-medium transition-colors outline-none text-xs sm:text-sm lg:text-base">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">My Account</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 sm:w-56">
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
                          <span className="ml-auto bg-[#333333] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
                          <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-[#000000] font-semibold">
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
                className="flex items-center gap-1 sm:gap-2 text-neutral-700 hover:text-[#333333] font-medium transition-colors text-xs sm:text-sm lg:text-base"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
