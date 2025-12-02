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
                <span className="font-semibold">Phone:</span> +48 123 456 789
              </li>
              <li className="text-neutral-300">
                <span className="font-semibold">Hours:</span> Mon-Fri 8:00-18:00
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Business Info</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>🚚 Free Shipping over €5,000</li>
              <li>✅ 2-Year Warranty</li>
              <li>📞 24/7 Support</li>
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
