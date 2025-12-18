'use client'

import { useSession, signOut, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RefreshSessionPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Force update session
      await update()
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Reload page
      window.location.reload()
    } catch (error) {
      console.error('Error refreshing session:', error)
      setRefreshing(false)
    }
  }

  const handleReLogin = async () => {
    await signOut({ redirect: false })
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/auth/login')
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Refresh Session</h1>
        
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <h2 className="font-semibold mb-2">Current Session:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ session, status }, null, 2)}
          </pre>
        </div>

        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <h2 className="font-semibold mb-2">User Role:</h2>
          <p className="text-lg">
            Role: <strong>{(session?.user as any)?.role || 'undefined'}</strong>
          </p>
          <p className="text-lg">
            Is Admin: <strong>{(session?.user as any)?.role === 'admin' ? 'YES ✅' : 'NO ❌'}</strong>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Session'}
          </button>
          <button
            onClick={handleReLogin}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Re-login
          </button>
        </div>
      </div>
    </div>
  )
}


