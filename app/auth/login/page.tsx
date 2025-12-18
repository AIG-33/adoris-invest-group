import { LoginForm } from '@/components/login-form'
import { getServerCompany } from '@/lib/server-company'
import { getDictionary } from '@/lib/translations'

export default async function LoginPage() {
  const company = await getServerCompany()
  const language = (company?.language || 'en') as 'en' | 'ru'
  const dict = getDictionary(language)

  return <LoginForm translations={dict.auth} />
}
