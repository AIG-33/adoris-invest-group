'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { X, Package, ChevronDown, ChevronUp, Download } from 'lucide-react'

interface SidebarProps {
  manufacturers: any[]
  selectedManufacturer?: string
}

const INITIAL_SHOW_COUNT = 20

export function Sidebar({
  manufacturers,
  selectedManufacturer,
}: SidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAllManufacturers, setShowAllManufacturers] = useState(false)
  const [manufacturerQuery, setManufacturerQuery] = useState('')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 when filters change
    params.delete('page')
    router?.push?.(`/products?${params?.toString?.() || ''}`)
  }

  const clearAllFilters = () => {
    router?.push?.('/products')
  }

  const hasFilters = selectedManufacturer

  const filteredManufacturers = useMemo(() => {
    const q = manufacturerQuery.trim().toLowerCase()
    if (!q) return manufacturers || []
    return (manufacturers || []).filter(
      (man) =>
        man?.name?.toLowerCase?.().includes(q) ||
        man?.slug?.toLowerCase?.().includes(q)
    )
  }, [manufacturers, manufacturerQuery])

  const displayedManufacturers = useMemo(() => {
    if (manufacturerQuery.trim() || showAllManufacturers) {
      return filteredManufacturers
    }
    const initial = filteredManufacturers.slice(0, INITIAL_SHOW_COUNT)
    // Keep the active selection visible even if it falls outside the first N
    if (
      selectedManufacturer &&
      !initial.some((man) => man?.slug === selectedManufacturer)
    ) {
      const selected = filteredManufacturers.find(
        (man) => man?.slug === selectedManufacturer
      )
      if (selected) return [selected, ...initial]
    }
    return initial
  }, [
    filteredManufacturers,
    manufacturerQuery,
    showAllManufacturers,
    selectedManufacturer,
  ])

  return (
    <aside className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl text-neutral-900">Filters</h2>
          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#333333] hover:text-[#1a1a1a] font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Manufacturers */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
            Manufacturers
          </h3>
          <input
            type="search"
            value={manufacturerQuery}
            onChange={(e) => {
              setManufacturerQuery(e.target.value)
              setShowAllManufacturers(false)
            }}
            placeholder="Search manufacturers…"
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
            aria-label="Search manufacturers"
          />
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {displayedManufacturers?.map?.((man) => (
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
                  className="w-4 h-4 text-[#333333] border-neutral-300 rounded focus:ring-[#333333]"
                />
                <span className="flex-1 text-sm text-neutral-700 group-hover:text-[#333333]">
                  {man?.name}
                </span>
              </label>
            )) || []}
            {displayedManufacturers.length === 0 && (
              <p className="text-sm text-neutral-400 py-1">No manufacturers match</p>
            )}
          </div>
          
          {!manufacturerQuery.trim() &&
            filteredManufacturers.length > INITIAL_SHOW_COUNT && (
            <button
              onClick={() => setShowAllManufacturers(!showAllManufacturers)}
              className="mt-3 text-sm text-[#333333] hover:text-[#1a1a1a] font-medium flex items-center gap-1 w-full justify-center"
            >
              {showAllManufacturers ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show all ({filteredManufacturers.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bulk Order Card */}
      <div className="bg-gradient-to-br from-[#333333] to-[#666666] rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5" />
          <h3 className="font-bold text-lg">Bulk Order</h3>
        </div>
        <p className="text-sm opacity-90 mb-4">
          Need to order multiple items at once? Use our bulk order tool to quickly add products by SKU.
        </p>
        <Link
          href="/bulk-order"
          className="inline-block w-full text-center bg-white text-[#333333] font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Bulk Order
        </Link>
      </div>

      {/* Download Pricelist Card */}
      <div className="bg-gradient-to-br from-[#333333] to-[#666666] rounded-xl p-6 text-white mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Download className="w-5 h-5" />
          <h3 className="font-bold text-lg">Download Pricelist</h3>
        </div>
        <p className="text-sm opacity-90 mb-4">
          Download our complete product catalog as a CSV spreadsheet (opens in Excel). Get all products with prices, SKUs, and descriptions.
        </p>
        <a
          href="/api/products/export-pricelist"
          download
          className="inline-block w-full text-center bg-white text-[#333333] font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Download CSV
        </a>
      </div>
    </aside>
  )
}
