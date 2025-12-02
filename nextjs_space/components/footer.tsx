import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0A2463] text-white mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#10B981] rounded-lg flex items-center justify-center text-white font-bold">
                IVD
              </div>
              <span className="font-bold text-lg">IVD GROUP</span>
            </div>
            <p className="text-neutral-300 text-sm">
              Professional B2B medical laboratory equipment and supplies from
              leading manufacturers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-300 hover:text-[#06B6D4] transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-order"
                  className="text-neutral-300 hover:text-[#06B6D4] transition-colors"
                >
                  Bulk Order
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-300 hover:text-[#06B6D4] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-300 hover:text-[#06B6D4] transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-neutral-300">
                <span className="font-semibold">Email:</span> info@ivdgroup.eu
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Phone:</span> +48 88 1049959
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Website:</span> www.ivdgroup.eu
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company Info</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
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

        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>
            © {new Date()?.getFullYear() || 2025} IVD Group Sp. z o.o. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
