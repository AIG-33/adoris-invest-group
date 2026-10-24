import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminApi } from '@/lib/rfq/auth'
import { getAutomationSettings, logAutomation } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response

  const body = await request.json()
  const before = await getAutomationSettings()
  const data: Record<string, unknown> = { updatedByEmail: auth.email }

  if (typeof body.autoSendEnabled === 'boolean') data.autoSendEnabled = body.autoSendEnabled
  if (typeof body.model === 'string' && body.model.trim()) data.model = body.model.trim()
  if (body.confidenceThreshold !== undefined) {
    const t = Number(body.confidenceThreshold)
    if (!(t >= 0 && t <= 1)) return NextResponse.json({ error: 'Порог должен быть от 0 до 1' }, { status: 400 })
    data.confidenceThreshold = t
  }

  const settings = await prisma.automationSettings.update({ where: { id: 'global' }, data })

  if (typeof body.autoSendEnabled === 'boolean' && body.autoSendEnabled !== before.autoSendEnabled) {
    await logAutomation(body.autoSendEnabled ? 'auto_send_enabled' : 'auto_send_disabled', auth.email)
  }
  if (data.model && data.model !== before.model) {
    await logAutomation('model_changed', auth.email, { from: before.model, to: data.model })
  }
  if (data.confidenceThreshold !== undefined && data.confidenceThreshold !== before.confidenceThreshold) {
    await logAutomation('threshold_changed', auth.email, { from: before.confidenceThreshold, to: data.confidenceThreshold })
  }
  return NextResponse.json({ ok: true, settings })
}
