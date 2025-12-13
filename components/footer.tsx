import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-white mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <div className="relative w-28 h-9 sm:w-32 sm:h-10 mb-3 sm:mb-4">
              <Image
                src="/logo.png"
                alt="ADORIS INVEST GROUP"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-neutral-300 text-xs sm:text-sm">
              Professional B2B medical laboratory equipment and supplies from
              leading manufacturers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-order"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Bulk Order
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-300 hover:text-[#cccccc] transition-colors text-xs sm:text-sm"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li className="text-neutral-300">
                <span className="font-semibold">Email:</span> ceo@adorisgroup.com
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Phone:</span> +48 881 049 959
              </li>
              <li className="text-neutral-300 hidden sm:block">
                <span className="font-semibold">Website:</span> www.adorisgroup.com
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Company Info</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-300">
              <li>ADORIS INVEST GROUP OÜ</li>
              <li>Ruunaoja tn 3-36</li>
              <li>11415 Tallinn, Estonia</li>
              <li className="pt-2">
                <span className="font-semibold">Reg. Code:</span> 12825289
              </li>
              <li>
                <span className="font-semibold">VAT EE:</span> EE102079353
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-neutral-400">
          <p>
            © {new Date()?.getFullYear() || 2025} ADORIS INVEST GROUP OÜ. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
