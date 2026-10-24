import { prisma } from '@/lib/db'
import { TemplatesEditor } from '@/components/admin-mail/templates-editor'
import { requireAdminPage } from '@/lib/rfq/auth'
import { DEFAULT_TEMPLATE_BODY_EN, DEFAULT_TEMPLATE_SUBJECT } from '@/lib/rfq/defaults'

export const dynamic = 'force-dynamic'

export default async function MailTemplatesPage() {
  await requireAdminPage()
  const [templates, companies] = await Promise.all([
    prisma.replyTemplate.findMany({ orderBy: [{ companyId: 'asc' }, { language: 'asc' }] }),
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <TemplatesEditor
      companies={companies}
      templates={templates.map((t) => ({
        id: t.id,
        companyId: t.companyId || '',
        language: t.language,
        subject: t.subject,
        bodyHtml: t.bodyHtml,
        updatedAt: t.updatedAt.toISOString(),
      }))}
      defaults={{ subject: DEFAULT_TEMPLATE_SUBJECT, bodyHtml: DEFAULT_TEMPLATE_BODY_EN }}
    />
  )
}
