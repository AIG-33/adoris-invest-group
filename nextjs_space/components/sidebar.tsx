'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

interface SidebarProps {
  categories: any[]
  manufacturers: any[]
  selectedCategory?: string
  selectedManufacturer?: string
}

export function Sidebar({
  categories,
  manufacturers,
  selectedCategory,
  selectedManufacturer,
}: SidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router?.push?.(`/?${params?.toString?.() || ''}`)
  }

  const clearAllFilters = () => {
    router?.push?.('/')
  }

  const hasFilters = selectedCategory || selectedManufacturer

  return (
    <aside className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl text-neutral-900">Filters</h2>
          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#06B6D4] hover:text-[#0891B2] font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {categories?.map?.((cat) => (
              <label
                key={cat?.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === cat?.slug}
                  onChange={(e) =>
                    updateFilter('category', e?.target?.checked ? cat?.slug : '')
                  }
                  className="w-4 h-4 text-[#06B6D4] border-neutral-300 rounded focus:ring-[#06B6D4]"
                />
                <span className="flex-1 text-sm text-neutral-700 group-hover:text-[#06B6D4]">
                  {cat?.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {cat?._count?.products || 0}
                </span>
              </label>
            )) || []}
          </div>
        </div>

        {/* Manufacturers */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
            Manufacturers
          </h3>
          <div className="space-y-2">
            {manufacturers?.map?.((man) => (
              <label
                key={man?.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedManufacturer === man?.slug}
                  onChange={(e) =>
                    updateFilter(
                      'manufacturer',
                      e?.target?.checked ? man?.slug : ''
                    )
                  }
                  className="w-4 h-4 text-[#06B6D4] border-neutral-300 rounded focus:ring-[#06B6D4]"
                />
                <span className="flex-1 text-sm text-neutral-700 group-hover:text-[#06B6D4]">
                  {man?.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {man?._count?.products || 0}
                </span>
              </label>
            )) || []}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#06B6D4] to-[#10B981] rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-2">🚚 Free Shipping</h3>
        <p className="text-sm opacity-90">
          On all orders over €5,000. Fast delivery across Europe.
        </p>
      </div>
    </aside>
  )
}
