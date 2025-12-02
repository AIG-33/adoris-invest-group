import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#1a8c7c] text-white mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <div className="relative w-28 h-9 sm:w-32 sm:h-10 mb-3 sm:mb-4">
              <Image
                src="/logo.png"
                alt="IVD GROUP"
                fill
                className="object-contain brightness-0 invert"
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
                  href="/"
                  className="text-neutral-300 hover:text-[#20a895] transition-colors text-xs sm:text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-order"
                  className="text-neutral-300 hover:text-[#20a895] transition-colors text-xs sm:text-sm"
                >
                  Bulk Order
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions"
                  className="text-neutral-300 hover:text-[#20a895] transition-colors text-xs sm:text-sm"
                >
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-300 hover:text-[#20a895] transition-colors text-xs sm:text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-300 hover:text-[#20a895] transition-colors text-xs sm:text-sm"
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
                <span className="font-semibold">Email:</span> info@ivdgroup.eu
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Phone:</span> +48 88 1049959
              </li>
              <li className="text-neutral-300 hidden sm:block">
                <span className="font-semibold">Website:</span> www.ivdgroup.eu
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Company Info</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-300">
              <li>IVD GROUP Sp. z o.o.</li>
              <li>Bartoszewicza 3-24</li>
              <li>00-337 Warsaw, Poland</li>
              <li className="pt-2">
                <span className="font-semibold">VAT:</span> PL5252799583
              </li>
              <li>
                <span className="font-semibold">KRS:</span> 0000800009
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-neutral-400">
          <p>
            © {new Date()?.getFullYear() || 2025} IVD Group Sp. z o.o. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
