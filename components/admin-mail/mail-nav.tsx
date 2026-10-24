'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin/mail', label: 'Входящие' },
  { href: '/admin/mail/settings', label: 'Настройки и ящики' },
  { href: '/admin/mail/prompts', label: 'AI-промты' },
  { href: '/admin/mail/templates', label: 'Шаблоны' },
]

export function MailNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-wrap gap-1 bg-white border border-neutral-200 rounded-lg p-1">
      {LINKS.map((link) => {
        const active =
          link.href === '/admin/mail'
            ? pathname === '/admin/mail' || /^\/admin\/mail\/(?!settings|prompts|templates)/.test(pathname || '')
            : pathname?.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              active ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
