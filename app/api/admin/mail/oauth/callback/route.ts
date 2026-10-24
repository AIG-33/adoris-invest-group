import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminEmail } from '@/lib/rfq/auth'
import { encryptSecret, verifyState } from '@/lib/rfq/crypto'
import { exchangeCode, fetchGoogleEmail, oauthRedirectUri } from '@/lib/rfq/google-oauth'
import { logAutomation } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const state = verifyState<{ admin: string; baseUrl: string }>(url.searchParams.get('state') || '')
  const fallbackBase = `${url.protocol}//${url.host}`
  const settingsUrl = (base: string, params: Record<string, string>) =>
    `${base}/admin/mail/settings?${new URLSearchParams(params)}`

  if (!state) return NextResponse.redirect(settingsUrl(fallbackBase, { error: 'Ссылка подключения устарела, попробуйте ещё раз' }))
  if (url.searchParams.get('error')) {
    return NextResponse.redirect(settingsUrl(state.baseUrl, { error: `Google: ${url.searchParams.get('error')}` }))
  }

  const admin = await getAdminEmail()
  if (!admin) return NextResponse.redirect(new URL('/auth/login', request.url))

  try {
    const tokens = await exchangeCode(url.searchParams.get('code') || '', oauthRedirectUri(state.baseUrl))
    if (!tokens.refresh_token) throw new Error('Google не вернул refresh token — отзовите доступ приложения и подключите снова')
    if (!tokens.scope.includes('gmail.modify')) throw new Error('Не выдано разрешение на работу с почтой — отметьте все галочки при подключении')

    const email = await fetchGoogleEmail(tokens.access_token)
    const domain = email.split('@')[1]
    const company = await prisma.company.findFirst({
      where: { OR: [{ domain }, { domain: `www.${domain}` }, { email }] },
      select: { id: true },
    })

    await prisma.mailbox.upsert({
      where: { email },
      create: {
        email,
        companyId: company?.id || null,
        mode: 'drafts',
        refreshTokenEnc: encryptSecret(tokens.refresh_token),
      },
      update: {
        refreshTokenEnc: encryptSecret(tokens.refresh_token),
        lastError: null,
        lastErrorAt: null,
      },
    })
    await logAutomation('mailbox_connected', admin, { email })
    return NextResponse.redirect(settingsUrl(state.baseUrl, { connected: email }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.redirect(settingsUrl(state.baseUrl, { error: message }))
  }
}
