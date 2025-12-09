import Link from 'next/link'
import Image from 'next/image'

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a8c7c] via-[#1E3A8A] to-[#20a895] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <Image
                src="/logo-adoris.png"
                alt="ADORIS INVEST GROUP OÜ"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl sm:text-2xl text-white">ADORIS INVEST GROUP</span>
              <span className="text-xs sm:text-sm text-white/80">Medical Equipment</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#20a895] to-[#2ec4b6] rounded-full flex items-center justify-center mx-auto text-white">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a8c7c] mb-4">
              Проверьте вашу почту
            </h1>

            <p className="text-neutral-600 mb-6">
              Мы отправили вам ссылку для входа на ваш email адрес.
            </p>

            <div className="bg-[#20a895]/10 border border-[#20a895]/20 rounded-lg p-4 text-left">
              <p className="text-sm text-neutral-700 mb-2">
                <strong>Важно:</strong>
              </p>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
                <li>Проверьте папку "Спам", если письмо не пришло</li>
                <li>Ссылка действительна в течение 24 часов</li>
                <li>Нажмите на ссылку, чтобы завершить вход</li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                Возникли проблемы? Свяжитесь с нами:{' '}
                <a
                  href="mailto:info@adorisgroup.com"
                  className="text-[#20a895] hover:underline"
                >
                  info@adorisgroup.com
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-[#20a895] hover:text-[#1a8c7c] font-medium"
              >
                ← Вернуться к входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
