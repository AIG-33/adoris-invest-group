import OpenAI from 'openai'
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions'

let client: OpenAI | null = null
function openai(): OpenAI {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured')
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

export interface ClassifiedItem {
  sku: string
  quantity: number
  description: string | null
  manufacturer: string | null
}

export interface ClassifyResult {
  is_price_request: boolean
  confidence: number
  language: string
  customer_name: string | null
  customer_company: string | null
  summary: string
  items: ClassifiedItem[]
}

const CLASSIFY_SCHEMA = {
  name: 'price_request_extraction',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['is_price_request', 'confidence', 'language', 'customer_name', 'customer_company', 'summary', 'items'],
    properties: {
      is_price_request: { type: 'boolean' },
      confidence: { type: 'number' },
      language: { type: 'string' },
      customer_name: { type: ['string', 'null'] },
      customer_company: { type: ['string', 'null'] },
      summary: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['sku', 'quantity', 'description', 'manufacturer'],
          properties: {
            sku: { type: 'string' },
            quantity: { type: 'integer' },
            description: { type: ['string', 'null'] },
            manufacturer: { type: ['string', 'null'] },
          },
        },
      },
    },
  },
} as const

export interface ClassifyInput {
  prompt: string
  model: string
  from: string
  subject: string
  body: string
  attachmentTexts: { filename: string; text: string }[]
  attachmentParts: ChatCompletionContentPart[]
}

export async function classifyEmail(input: ClassifyInput): Promise<ClassifyResult> {
  const textBlocks = [
    `From: ${input.from}`,
    `Subject: ${input.subject}`,
    '',
    'Email body:',
    input.body || '(empty)',
    ...input.attachmentTexts.map((a) => `\n--- Attachment: ${a.filename} ---\n${a.text}`),
  ].join('\n')

  const content: ChatCompletionContentPart[] = [
    { type: 'text', text: textBlocks.slice(0, 200_000) },
    ...input.attachmentParts,
  ]

  const res = await openai().chat.completions.create({
    model: input.model,
    temperature: 0,
    response_format: { type: 'json_schema', json_schema: CLASSIFY_SCHEMA as any },
    messages: [
      { role: 'system', content: input.prompt },
      { role: 'user', content },
    ],
  })

  const raw = res.choices[0]?.message?.content
  if (!raw) throw new Error('Empty AI response')
  const parsed = JSON.parse(raw) as ClassifyResult
  parsed.confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0))
  parsed.items = (parsed.items || []).map((i) => ({
    ...i,
    sku: (i.sku || '').trim(),
    quantity: Number.isFinite(i.quantity) && i.quantity > 0 ? Math.round(i.quantity) : 1,
  }))
  return parsed
}

export async function generateIntro(params: {
  prompt: string
  language: string
  customerName: string | null
  summary: string
  foundCount: number
  notFoundCount: number
}): Promise<string> {
  const res = await openai().chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    messages: [
      { role: 'system', content: params.prompt },
      {
        role: 'user',
        content: JSON.stringify({
          language: params.language,
          customer_name: params.customerName,
          request_summary: params.summary,
          products_found_with_price: params.foundCount,
          products_to_check_with_suppliers: params.notFoundCount,
        }),
      },
    ],
  })
  return (res.choices[0]?.message?.content || '').trim()
}
