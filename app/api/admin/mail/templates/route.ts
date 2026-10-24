import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminApi } from '@/lib/rfq/auth'
import { logAutomation } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

/** Upsert: { id?, companyId|null, language, subject, bodyHtml } */
export async function PUT(request: Request) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response

  const body = await request.json()
  const language = String(body.language || '').trim().toLowerCase().slice(0, 5)
  const subject = String(body.subject || '').trim()
  const bodyHtml = String(body.bodyHtml || '').trim()
  const companyId = body.companyId || null
  if (!language || !subject || !bodyHtml) {
    return NextResponse.json({ error: 'Язык, тема и текст обязательны' }, { status: 400 })
  }

  const duplicate = await prisma.replyTemplate.findFirst({
    where: { companyId, language, ...(body.id ? { NOT: { id: body.id } } : {}) },
  })
  if (duplicate) {
    return NextResponse.json({ error: 'Шаблон для этой компании и языка уже есть' }, { status: 409 })
  }

  const template = body.id
    ? await prisma.replyTemplate.update({ where: { id: body.id }, data: { companyId, language, subject, bodyHtml } })
    : await prisma.replyTemplate.create({ data: { companyId, language, subject, bodyHtml } })

  await logAutomation('template_saved', auth.email, { id: template.id, companyId, language })
  return NextResponse.json({ ok: true, template })
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi()
  if ('response' in auth) return auth.response
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.replyTemplate.delete({ where: { id } })
  await logAutomation('template_deleted', auth.email, { id })
  return NextResponse.json({ ok: true })
}
