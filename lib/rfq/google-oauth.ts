const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

export const GMAIL_SCOPES = [
  'openid',
  'email',
  // read messages/attachments, manage labels, send replies
  'https://www.googleapis.com/auth/gmail.modify',
]

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_MAIL_CLIENT_ID && process.env.GOOGLE_MAIL_CLIENT_SECRET)
}

function credentials() {
  const clientId = process.env.GOOGLE_MAIL_CLIENT_ID
  const clientSecret = process.env.GOOGLE_MAIL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_MAIL_CLIENT_ID / GOOGLE_MAIL_CLIENT_SECRET are not configured')
  }
  return { clientId, clientSecret }
}

export function oauthRedirectUri(baseUrl: string): string {
  return `${baseUrl}/api/admin/mail/oauth/callback`
}

export function buildAuthUrl(params: { redirectUri: string; state: string; loginHint?: string }): string {
  const { clientId } = credentials()
  const url = new URL(AUTH_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', params.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', GMAIL_SCOPES.join(' '))
  url.searchParams.set('access_type', 'offline')
  // force a refresh_token even if the mailbox was connected before
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('include_granted_scopes', 'true')
  url.searchParams.set('state', params.state)
  if (params.loginHint) url.searchParams.set('login_hint', params.loginHint)
  return url.toString()
}

export async function exchangeCode(code: string, redirectUri: string) {
  const { clientId, clientSecret } = credentials()
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Google token exchange failed: ${data.error_description || data.error || res.status}`)
  return data as { access_token: string; refresh_token?: string; expires_in: number; scope: string }
}

export async function fetchGoogleEmail(accessToken: string): Promise<string> {
  const res = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
  const data = await res.json()
  if (!res.ok || !data.email) throw new Error('Could not read the Google account email')
  return String(data.email).toLowerCase()
}

const accessTokenCache = new Map<string, { token: string; expiresAt: number }>()

export async function getAccessToken(refreshToken: string): Promise<string> {
  const cached = accessTokenCache.get(refreshToken)
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const { clientId, clientSecret } = credentials()
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${data.error_description || data.error || res.status}`)
  }
  accessTokenCache.set(refreshToken, {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000,
  })
  return data.access_token as string
}
