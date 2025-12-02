'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router?.push?.('/')
        router?.refresh?.()
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#1E3A8A] to-[#06B6D4] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#06B6D4] to-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              IVD
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-2xl text-white">IVD GROUP</span>
              <span className="text-sm text-white/80">Medical Equipment</span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-600 mb-8">Sign in to your admin account</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value || '')}
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#06B6D4] focus:outline-none focus:ring-4 focus:ring-[#06B6D4]/10"
                placeholder="admin@ivdgroup.eu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e?.target?.value || '')}
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#06B6D4] focus:outline-none focus:ring-4 focus:ring-[#06B6D4]/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#06B6D4] text-white py-4 rounded-lg hover:bg-[#0891B2] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#06B6D4] hover:text-[#0891B2] font-medium"
            >
              ← Back to Shop
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs font-semibold text-neutral-700 mb-2">Demo Credentials:</p>
            <p className="text-xs text-neutral-600">
              Email: <code className="bg-white px-2 py-1 rounded">admin@ivdgroup.eu</code>
            </p>
            <p className="text-xs text-neutral-600">
              Password: <code className="bg-white px-2 py-1 rounded">Admin123!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
