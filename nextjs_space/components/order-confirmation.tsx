'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Download, Mail, Package, Truck } from 'lucide-react'

interface OrderConfirmationProps {
  order: any
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2ec4b6] rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-neutral-600 mb-2">
            Thank you for your order. We've received it and are processing it now.
          </p>
          <p className="text-lg font-semibold text-[#1a8c7c]">
            Order Number: {order?.orderNumber}
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-[#2ec4b6] text-white flex items-center justify-center font-bold mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-[#2ec4b6]">Order Placed</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-4"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold mb-2">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-neutral-600">Processing</span>
            </div>
            <div className="flex-1 h-1 bg-neutral-200 mx-4"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-neutral-600">Shipped</span>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-[#20a895]/10 border-l-4 border-[#20a895] p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-[#20a895] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Order Confirmation Email Sent
              </h3>
              <p className="text-neutral-700 text-sm">
                We've sent a confirmation email with your order details and PDF invoice to{' '}
                <strong>{order?.email}</strong>. If you don't receive it within a few minutes,
                please check your spam folder or contact us at info@ivdgroup.eu
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-neutral-700 mb-3">Billing Information</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-900">{order?.company}</p>
                <p>VAT ID: {order?.vatId}</p>
                <p>{order?.customerName}</p>
                <p>{order?.email}</p>
                <p>{order?.phone}</p>
                <p>{order?.address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 mb-3">Payment Information</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>
                  <span className="font-semibold text-neutral-900">Payment Method:</span> Bank
                  Transfer
                </p>
                <p>
                  <span className="font-semibold text-neutral-900">Payment Terms:</span> Net 30
                </p>
                <p className="mt-3 text-xs">
                  Bank transfer details will be sent to your email separately.
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="font-semibold text-neutral-700 mb-4">Order Items</h3>
          <div className="space-y-4 mb-6">
            {order?.items?.map?.((item: any) => (
              <div
                key={item?.id}
                className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item?.product?.image || '/placeholder.png'}
                    alt={item?.product?.name || 'Product'}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    {item?.product?.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-2">SKU: {item?.product?.sku}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-neutral-600">Qty: {item?.quantity}</span>
                    <span className="text-neutral-600">
                      €{item?.price?.toFixed?.(2)} each
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#1a8c7c]">
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
                <span className="text-neutral-700">Subtotal</span>
                <span className="font-semibold">€{order?.subtotal?.toFixed?.(2)}</span>
              </div>
              <div className="flex justify-between text-[#2ec4b6]">
                <span>Discount (15% B2B)</span>
                <span className="font-semibold">-€{order?.discount?.toFixed?.(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">VAT (23%)</span>
                <span className="font-semibold">€{order?.vat?.toFixed?.(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t-2 border-neutral-900 pt-4">
              <span>Total</span>
              <span className="text-[#1a8c7c]">€{order?.total?.toFixed?.(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#20a895] text-white px-8 py-4 rounded-lg hover:bg-[#0891B2] transition-all font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-neutral-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-neutral-900 mb-2">Need Help?</h3>
          <p className="text-neutral-600 text-sm mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:info@ivdgroup.eu" className="text-[#20a895] hover:underline">
              📧 info@ivdgroup.eu
            </a>
            <a href="tel:+48123456789" className="text-[#20a895] hover:underline">
              📞 +48 123 456 789
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
