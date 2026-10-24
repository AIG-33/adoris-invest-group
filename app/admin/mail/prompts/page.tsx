import { prisma } from '@/lib/db'
import { PromptEditor } from '@/components/admin-mail/prompt-editor'
import { requireAdminPage } from '@/lib/rfq/auth'
import { getActivePrompt } from '@/lib/rfq/settings'

export const dynamic = 'force-dynamic'

export default async function MailPromptsPage() {
  await requireAdminPage()
  await Promise.all([getActivePrompt('classify'), getActivePrompt('reply')])
  const [versions, emails] = await Promise.all([
    prisma.aiPromptVersion.findMany({ orderBy: [{ kind: 'asc' }, { version: 'desc' }] }),
    prisma.inboundEmail.findMany({
      where: { status: { notIn: ['ignored', 'new', 'processing'] } },
      orderBy: { receivedAt: 'desc' },
      take: 60,
      select: { id: true, subject: true, fromEmail: true, status: true, receivedAt: true },
    }),
  ])

  const toView = (kind: string) =>
    versions
      .filter((v) => v.kind === kind)
      .map((v) => ({
        id: v.id,
        version: v.version,
        text: v.text,
        comment: v.comment,
        authorEmail: v.authorEmail,
        isActive: v.isActive,
        createdAt: v.createdAt.toISOString(),
      }))

  const testEmails = emails.map((e) => ({
    id: e.id,
    label: `${e.receivedAt.toLocaleDateString('ru-RU')} · ${e.fromEmail} · ${e.subject || '(без темы)'}`.slice(0, 140),
  }))

  return (
    <div className="space-y-6">
      <PromptEditor
        kind="classify"
        title="Промт распознавания запроса"
        description="Как определять, что письмо — запрос цен, и как вычленять артикулы, количества, производителя и имя клиента. Сюда удобно добавлять примеры и исключения. Формат ответа (JSON) задаётся системой — его описывать не нужно."
        versions={toView('classify')}
        testEmails={testEmails}
      />
      <PromptEditor
        kind="reply"
        title="Промт текста ответа"
        description="Тон и формулировки вступительного абзаца письма ({{intro}} в шаблоне). Таблица с ценами всегда берётся из базы — AI её не меняет."
        versions={toView('reply')}
        testEmails={[]}
      />
    </div>
  )
}
