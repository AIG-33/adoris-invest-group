'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogIn, Loader2, Mail, Key, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setError('')
    setSuccess('')
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

  const handleMagicLink = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('Failed to send email')
      } else {
        setSuccess('Check your email! We sent you a sign-in link.')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setError('')
    setSuccess('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords don\'t match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Register user
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error === 'User already exists' 
          ? 'User with this email already exists' 
          : 'Registration error')
        return
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setSuccess('Registration successful! Please sign in.')
        setMode('login')
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

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Sign Up'}
          </h1>
          <p className="text-neutral-600 mb-6">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>

          {/* Mode Switch */}
          <div className="flex gap-2 mb-6 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setMode('login')
                setError('')
                setSuccess('')
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-white text-[#1a8c7c] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register')
                setError('')
                setSuccess('')
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-white text-[#1a8c7c] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Login Method Tabs (only show for login mode) */}
          {mode === 'login' && (
            <div className="flex gap-2 mb-6 bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  loginMethod === 'password'
                    ? 'bg-white text-[#1a8c7c] shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Key className="w-4 h-4" />
                Password
              </button>
              <button
                onClick={() => setLoginMethod('magic')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  loginMethod === 'magic'
                    ? 'bg-white text-[#1a8c7c] shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                Magic Link
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e?.target?.value || '')}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value || '')}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="john@example.com"
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
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e?.target?.value || '')}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#20a895] to-[#2ec4b6] text-white py-4 rounded-lg hover:from-[#1a8c7c] hover:to-[#20a895] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </>
                )}
              </button>
            </form>
          )}

          {/* Magic Link Form */}
          {mode === 'login' && loginMethod === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value || '')}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#20a895] to-[#2ec4b6] text-white py-4 rounded-lg hover:from-[#1a8c7c] hover:to-[#20a895] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Link
                  </>
                )}
              </button>

              <p className="text-xs text-neutral-600 text-center">
                We'll send you an email with a passwordless sign-in link
              </p>
            </form>
          )}

          {/* Password Login Form */}
          {mode === 'login' && loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value || '')}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
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
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-[#20a895] focus:outline-none focus:ring-4 focus:ring-[#20a895]/10"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#20a895] to-[#2ec4b6] text-white py-4 rounded-lg hover:from-[#1a8c7c] hover:to-[#20a895] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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

              {/* Demo Credentials */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-700 mb-2">Demo Credentials:</p>
                <p className="text-xs text-neutral-600">
                  Email: <code className="bg-white px-2 py-1 rounded">admin@ivdgroup.eu</code>
                </p>
                <p className="text-xs text-neutral-600">
                  Password: <code className="bg-white px-2 py-1 rounded">Admin123!</code>
                </p>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#20a895] hover:text-[#1a8c7c] font-medium"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
