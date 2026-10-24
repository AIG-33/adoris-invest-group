import { NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/get-base-url'
import { getAdminEmail } from '@/lib/rfq/auth'
import { signState } from '@/lib/rfq/crypto'
import { buildAuthUrl, isGoogleOAuthConfigured, oauthRedirectUri } from '@/lib/rfq/google-oauth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const admin = await getAdminEmail()
  if (!admin) return NextResponse.redirect(new URL('/auth/login', request.url))

  const baseUrl = await getBaseUrl()
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(`${baseUrl}/admin/mail/settings?error=${encodeURIComponent('Google OAuth не настроен (GOOGLE_MAIL_CLIENT_ID / SECRET)')}`)
  }

  const url = new URL(request.url)
  const loginHint = url.searchParams.get('email') || undefined
  const state = signState({ admin, baseUrl })
  return NextResponse.redirect(buildAuthUrl({ redirectUri: oauthRedirectUri(baseUrl), state, loginHint }))
}
