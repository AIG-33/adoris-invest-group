'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

export function SortDropdown({ currentSort }: { currentSort?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (sortValue) {
      params.set('sort', sortValue)
    } else {
      params.delete('sort')
    }
    // Reset to page 1 when sort changes
    params.delete('page')
    router?.push?.(`/products?${params?.toString?.() || ''}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-neutral-400" />
      <select
        value={currentSort || ''}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 hover:bg-neutral-700 transition-colors cursor-pointer"
      >
        <option value="">Default</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="price-asc">Price: Low to High</option>
      </select>
    </div>
  )
}

