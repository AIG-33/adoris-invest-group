'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2, Mail, Key } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        setError('Неверный email или пароль')
      } else {
        router?.push?.('/')
        router?.refresh?.()
      }
    } catch (err) {
      setError('Что-то пошло не так')
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
        setError('Не удалось отправить письмо')
      } else {
        setSuccess('Проверьте вашу почту! Мы отправили вам ссылку для входа.')
      }
    } catch (err) {
      setError('Что-то пошло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a8c7c] via-[#1E3A8A] to-[#20a895] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#20a895] to-[#2ec4b6] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Добро пожаловать</h1>
          <p className="text-neutral-600 mb-6">Войдите в свой аккаунт</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setLoginMethod('magic')}
              className={`flex-1 py-2 px-4 rounded-md transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                loginMethod === 'magic'
                  ? 'bg-white text-[#1a8c7c] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              Magic Link
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 px-4 rounded-md transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                loginMethod === 'password'
                  ? 'bg-white text-[#1a8c7c] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Key className="w-4 h-4" />
              Пароль
            </button>
          </div>

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

          {/* Magic Link Form */}
          {loginMethod === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email адрес
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
                    Отправка...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Отправить ссылку
                  </>
                )}
              </button>

              <p className="text-xs text-neutral-600 text-center">
                Мы отправим вам письмо со ссылкой для входа без пароля
              </p>
            </form>
          )}

          {/* Password Form */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email адрес
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
                  Пароль
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
                className="w-full bg-[#20a895] text-white py-4 rounded-lg hover:bg-[#1a8c7c] transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Войти
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-700 mb-2">Демо данные:</p>
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
              ← Вернуться в магазин
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
