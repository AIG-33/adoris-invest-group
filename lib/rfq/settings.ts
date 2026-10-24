import { prisma } from '@/lib/db'
import {
  DEFAULT_CLASSIFY_PROMPT,
  DEFAULT_REPLY_PROMPT,
  DEFAULT_TEMPLATE_BODY_EN,
  DEFAULT_TEMPLATE_SUBJECT,
} from './defaults'

export type PromptKind = 'classify' | 'reply'

const DEFAULT_PROMPTS: Record<PromptKind, string> = {
  classify: DEFAULT_CLASSIFY_PROMPT,
  reply: DEFAULT_REPLY_PROMPT,
}

export async function getAutomationSettings() {
  return prisma.automationSettings.upsert({
    where: { id: 'global' },
    create: { id: 'global' },
    update: {},
  })
}

export async function logAutomation(action: string, userEmail: string | null, details?: unknown) {
  await prisma.automationLog.create({
    data: { action, userEmail, details: details === undefined ? undefined : (details as any) },
  })
}

export async function getActivePrompt(kind: PromptKind) {
  const active = await prisma.aiPromptVersion.findFirst({
    where: { kind, isActive: true },
    orderBy: { version: 'desc' },
  })
  if (active) return active
  const existing = await prisma.aiPromptVersion.findFirst({ where: { kind }, orderBy: { version: 'desc' } })
  if (existing) return existing
  return prisma.aiPromptVersion.create({
    data: { kind, version: 1, text: DEFAULT_PROMPTS[kind], comment: 'Default prompt', isActive: true },
  })
}

export async function savePromptVersion(params: {
  kind: PromptKind
  text: string
  comment?: string | null
  authorEmail?: string | null
  activate?: boolean
}) {
  return prisma.$transaction(async (tx) => {
    const last = await tx.aiPromptVersion.findFirst({ where: { kind: params.kind }, orderBy: { version: 'desc' } })
    if (params.activate !== false) {
      await tx.aiPromptVersion.updateMany({ where: { kind: params.kind }, data: { isActive: false } })
    }
    return tx.aiPromptVersion.create({
      data: {
        kind: params.kind,
        version: (last?.version || 0) + 1,
        text: params.text,
        comment: params.comment || null,
        authorEmail: params.authorEmail || null,
        isActive: params.activate !== false,
      },
    })
  })
}

export async function activatePromptVersion(id: string) {
  const target = await prisma.aiPromptVersion.findUniqueOrThrow({ where: { id } })
  await prisma.$transaction([
    prisma.aiPromptVersion.updateMany({ where: { kind: target.kind }, data: { isActive: false } }),
    prisma.aiPromptVersion.update({ where: { id }, data: { isActive: true } }),
  ])
  return target
}

/** Company+language → company+en → default(null)+language → default+en → built-in. */
export async function resolveTemplate(companyId: string | null, language: string) {
  const lang = (language || 'en').toLowerCase().slice(0, 2)
  const candidates: { companyId: string | null; language: string }[] = []
  if (companyId) candidates.push({ companyId, language: lang }, { companyId, language: 'en' })
  candidates.push({ companyId: null, language: lang }, { companyId: null, language: 'en' })

  for (const c of candidates) {
    const tpl = await prisma.replyTemplate.findFirst({ where: c })
    if (tpl) return tpl
  }
  return {
    id: null as string | null,
    companyId: null,
    language: 'en',
    subject: DEFAULT_TEMPLATE_SUBJECT,
    bodyHtml: DEFAULT_TEMPLATE_BODY_EN,
  }
}
