export interface ReplyLine {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  currency: string
  url?: string | null
}

export interface TemplateData {
  subject: string
  customerName: string
  intro: string
  companyName: string
  signatureHtml: string
  found: ReplyLine[]
  notFound: { sku: string; description?: string | null; quantity: number }[]
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function money(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const cell = 'border:1px solid #d0d7de;padding:6px 10px;'
const head = `${cell}background:#f6f8fa;text-align:left;`

export function renderFoundTable(lines: ReplyLine[]): string {
  if (lines.length === 0) return ''
  let total = 0
  const rows = lines
    .map((l) => {
      const sum = l.unitPrice * l.quantity
      total += sum
      const name = l.url
        ? `<a href="${escapeHtml(l.url)}">${escapeHtml(l.name)}</a>`
        : escapeHtml(l.name)
      return `<tr><td style="${cell}white-space:nowrap;">${escapeHtml(l.sku)}</td><td style="${cell}">${name}</td><td style="${cell}text-align:right;">${l.quantity}</td><td style="${cell}text-align:right;white-space:nowrap;">${money(l.unitPrice)} ${escapeHtml(l.currency)}</td><td style="${cell}text-align:right;white-space:nowrap;">${money(sum)} ${escapeHtml(l.currency)}</td></tr>`
    })
    .join('')
  const currency = lines[0]?.currency || 'EUR'
  return `<table style="border-collapse:collapse;font-size:14px;"><thead><tr><th style="${head}">Cat. No.</th><th style="${head}">Product</th><th style="${head}text-align:right;">Qty</th><th style="${head}text-align:right;">Unit price</th><th style="${head}text-align:right;">Total</th></tr></thead><tbody>${rows}<tr><td style="${cell}" colspan="4"><b>Total</b></td><td style="${cell}text-align:right;white-space:nowrap;"><b>${money(total)} ${escapeHtml(currency)}</b></td></tr></tbody></table>`
}

export function renderNotFoundList(items: TemplateData['notFound']): string {
  if (items.length === 0) return ''
  const li = items
    .map((i) => {
      const label = [i.sku, i.description].filter(Boolean).join(' — ')
      return `<li>${escapeHtml(label || '—')}${i.quantity > 1 ? ` × ${i.quantity}` : ''}</li>`
    })
    .join('')
  return `<ul>${li}</ul>`
}

function applyBlock(text: string, name: string, show: boolean): string {
  const re = new RegExp(`\\{\\{#${name}\\}\\}([\\s\\S]*?)\\{\\{\\/${name}\\}\\}`, 'g')
  return text.replace(re, (_, inner) => (show ? inner : ''))
}

export function renderTemplate(template: { subject: string; bodyHtml: string }, data: TemplateData) {
  const values: Record<string, string> = {
    subject: escapeHtml(data.subject),
    customerName: escapeHtml(data.customerName),
    intro: escapeHtml(data.intro).replace(/\n/g, '<br>'),
    companyName: escapeHtml(data.companyName),
    signature: data.signatureHtml,
    foundTable: renderFoundTable(data.found),
    notFoundList: renderNotFoundList(data.notFound),
  }

  let body = template.bodyHtml
  body = applyBlock(body, 'found', data.found.length > 0)
  body = applyBlock(body, 'notFound', data.notFound.length > 0)
  body = applyBlock(body, 'noneFound', data.found.length === 0)
  body = body.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in values ? values[key] : m))

  const rawSubject = data.subject.replace(/^\s*(re|aw|odp|fwd?)\s*:\s*/i, '')
  const subject = template.subject
    .replace(/\{\{subject\}\}/g, rawSubject)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{customerName\}\}/g, data.customerName)

  return { subject: subject.trim(), bodyHtml: body.trim() }
}
