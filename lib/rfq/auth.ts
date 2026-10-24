import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'

export async function getAdminEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const user = session?.user as { email?: string | null; role?: string } | undefined
  if (!user || user.role !== 'admin') return null
  return user.email || 'admin'
}

/** Returns the admin email, or a 401 response to return directly. */
export async function requireAdminApi(): Promise<{ email: string } | { response: NextResponse }> {
  const email = await getAdminEmail()
  if (!email) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  return { email }
}
