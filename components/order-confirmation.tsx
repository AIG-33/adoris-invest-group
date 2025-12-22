'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Download, Mail, Package, Truck } from 'lucide-react'
import type { CompanyConfig } from '@/lib/company-types'
import type { Translations } from '@/lib/translations'
import { getProductUrl } from '@/lib/product-url'

interface OrderConfirmationProps {
  order: any
  company: CompanyConfig | null
  translations: Translations['orderConfirmation']
}

export function OrderConfirmation({ order, company, translations }: OrderConfirmationProps) {
  const companyEmail = company?.email || 'info@adorisgroup.com'
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#666666] rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {translations.title}
          </h1>
          <p className="text-xl text-neutral-600 mb-2">
            {translations.subtitle}
          </p>
          <p className="text-lg font-semibold text-[#000000]">
            {translations.orderNumber}: {order?.orderNumber}
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-[#666666] text-white flex items-center justify-center font-bold mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-[#666666]">{translations.orderPlaced}</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-4"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold mb-2">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-neutral-600">{translations.processing}</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-4"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-neutral-600">{translations.shipped}</span>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-[#333333]/10 border-l-4 border-[#333333] p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-[#333333] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {translations.emailSent}
              </h3>
              <p className="text-neutral-700 text-sm">
                {translations.emailSentDescription}{' '}
                <strong>{order?.customerEmail || order?.email}</strong>. {translations.checkSpam}{' '}
                <a href={`mailto:${companyEmail}`} className="text-[#333333] hover:underline font-semibold">
                  {companyEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">{translations.orderDetails}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-neutral-700 mb-3">{translations.billingInformation}</h3>
              <address className="text-sm text-neutral-600 space-y-1 not-italic">
                <p className="font-semibold text-neutral-900">{order?.company}</p>
                <p>VAT ID: {order?.vatId}</p>
                <p>{order?.customerName}</p>
                <p><a href={`mailto:${order?.email}`} className="hover:underline">{order?.email}</a></p>
                <p><a href={`tel:${order?.phone}`} className="hover:underline">{order?.phone}</a></p>
                <p>{order?.address}</p>
              </address>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 mb-3">{translations.paymentInformation}</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>
                  <span className="font-semibold text-neutral-900">{translations.paymentMethod}:</span> Bank Transfer
                </p>
                <p>
                  <span className="font-semibold text-neutral-900">{translations.paymentTerms}:</span> Net 30
                </p>
                <p className="mt-3 text-xs">
                  {translations.bankTransferDetails}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="font-semibold text-neutral-700 mb-4">{translations.orderItems}</h3>
          <div className="space-y-4 mb-6">
            {order?.items?.map?.((item: any) => (
              <div
                key={item?.id}
                className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item?.product?.image && item.product.image.length > 0 ? item.product.image : '/placeholder.svg'}
                    alt={item?.product?.name || 'Product'}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <Link href={getProductUrl(item?.product)}>
                    <h4 className="font-semibold text-neutral-900 mb-1 hover:text-[#333333] transition-colors">
                      {item?.product?.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-neutral-600 mb-2">SKU: {item?.product?.sku}</p>
                  <div className="flex gap-2 text-xs text-neutral-500 mb-2">
                    <Link 
                      href={`/products?category=${item?.product?.category?.slug}`}
                      className="hover:text-neutral-700 transition-colors"
                    >
                      {item?.product?.category?.name}
                    </Link>
                    {' • '}
                    <Link 
                      href={`/products?manufacturer=${item?.product?.manufacturer?.slug}`}
                      className="hover:text-neutral-700 transition-colors"
                    >
                      {item?.product?.manufacturer?.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-neutral-600">{translations.quantity}: {item?.quantity}</span>
                    <span className="text-neutral-600">
                      €{item?.price?.toFixed?.(2)} {translations.each}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#000000]">
                    €{((item?.price || 0) * (item?.quantity || 0))?.toFixed?.(2)}
                  </div>
                </div>
              </div>
            )) || []}
          </div>

          {/* Totals */}
          <div className="border-t border-neutral-200 pt-4">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-700">{translations.subtotal}</span>
                <span className="font-semibold">€{Number(order?.subtotal || 0)?.toFixed?.(2)}</span>
              </div>
              {(() => {
                const subtotal = Number(order?.subtotal || 0)
                const total = Number(order?.total || 0)
                const discount = subtotal - total
                const discountRate = subtotal > 0 ? (discount / subtotal) * 100 : 0
                
                if (discount > 0) {
                  return (
                    <div className="flex justify-between text-[#666666]">
                      <span>{translations.volumeDiscount} ({discountRate.toFixed(0)}%)</span>
                      <span className="font-semibold">-€{discount?.toFixed?.(2)}</span>
                    </div>
                  )
                }
                return null
              })()}
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t-2 border-neutral-900 pt-4">
              <span>{translations.total}</span>
              <span className="text-[#000000]">€{Number(order?.total || 0)?.toFixed?.(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#333333] text-white px-8 py-4 rounded-lg hover:bg-[#1a1a1a] transition-all font-semibold"
          >
            {translations.continueShopping}
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-neutral-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-neutral-900 mb-2">{translations.needHelp}</h3>
          <p className="text-neutral-600 text-sm mb-4">
            {translations.needHelpDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href={`mailto:${companyEmail}`} className="text-[#333333] hover:underline">
              📧 {companyEmail}
            </a>
            <a href="tel:+48793081310" className="text-[#333333] hover:underline">
              📞 +48793081310
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
