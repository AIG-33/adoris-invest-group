import { LoginForm } from '@/components/login-form'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'
import { normalizeLogoUrl } from '@/lib/logo-url'

export default async function LoginPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  return (
    <LoginForm
      translations={dict.auth}
      companyName={company?.name || ''}
      companyLogo={company?.logo ? normalizeLogoUrl(company.logo) : '/logo.png'}
    />
  )
}
