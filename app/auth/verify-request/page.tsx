export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a8c7c] via-[#156b5f] to-[#20a895] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
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

          <h1 className="text-3xl font-bold text-[#1a8c7c] mb-4">
            Check your email
          </h1>

          <p className="text-neutral-600 mb-6">
            A sign in link has been sent to your email address.
          </p>

          <div className="bg-[#20a895]/10 border border-[#20a895]/20 rounded-lg p-4 text-left">
            <p className="text-sm text-neutral-700 mb-2">
              <strong>Important:</strong>
            </p>
            <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
              <li>Check your spam folder if you don't see it</li>
              <li>The link will expire in 24 hours</li>
              <li>Click the link to complete your sign in</li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Having trouble? Contact us at{' '}
              <a
                href="mailto:info@ivdgroup.eu"
                className="text-[#20a895] hover:underline"
              >
                info@ivdgroup.eu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
