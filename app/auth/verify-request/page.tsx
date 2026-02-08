import Link from 'next/link'
import Image from 'next/image'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import { normalizeLogoUrl } from '@/lib/logo-url'

export default async function VerifyRequest() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)
  const companyName = company?.name || ''
  const companyLogo = company?.logo ? normalizeLogoUrl(company.logo) : '/logo.png'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a8c7c] via-[#1E3A8A] to-[#20a895] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Logo — dynamic per company */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <Image
                src={companyLogo}
                alt={companyName || 'Verify'}
                fill
                className="object-contain"
              />
            </div>
            {companyName && (
              <div className="flex flex-col items-start">
                <span className="font-bold text-xl sm:text-2xl text-white">{companyName}</span>
                <span className="text-xs sm:text-sm text-white/80">Medical Equipment</span>
              </div>
            )}
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
              {dict.verifyRequest.checkEmail}
            </h1>

            <p className="text-neutral-600 mb-6">
              {dict.verifyRequest.emailSent}
            </p>

            <div className="bg-black/10 border border-black/20 rounded-lg p-4 text-left">
              <p className="text-sm text-neutral-700 mb-2">
                <strong>{dict.verifyRequest.important}:</strong>
              </p>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
                <li>{dict.verifyRequest.checkSpam}</li>
                <li>{dict.verifyRequest.linkValid}</li>
                <li>{dict.verifyRequest.clickLink}</li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                {dict.verifyRequest.problems}{' '}
                <a
                  href={`mailto:${company?.email || ''}`}
                  className="text-black hover:underline"
                >
                  {company?.email || ''}
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-black hover:text-[#1a8c7c] font-medium"
              >
                {dict.verifyRequest.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
