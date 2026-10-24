import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'

export async function getAdminEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const user = session?.user as { email?: string | null; role?: string } | undefined
  if (!user || user.role !== 'admin') return null
  return user.email || 'admin'
}

/** Must be called in every page, not only the layout: layouts and pages render in parallel. */
export async function requireAdminPage(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) redirect('/auth/login')
  return email
}

/** Returns the admin email, or a 401 response to return directly. */
export async function requireAdminApi(): Promise<{ email: string } | { response: NextResponse }> {
  const email = await getAdminEmail()
  if (!email) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  return { email }
}
