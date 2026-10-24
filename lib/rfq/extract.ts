import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions'
import { htmlToText } from './parse-message'

const MAX_TEXT_PER_FILE = 60_000
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_PDF_BYTES = 15 * 1024 * 1024
/** Below this size an image is almost certainly a signature logo/icon. */
const MIN_IMAGE_BYTES = 8 * 1024

export type AttachmentKind = 'sheet' | 'docx' | 'pdf' | 'image' | 'text' | 'unsupported'

export function detectKind(filename: string, mimeType: string): AttachmentKind {
  const ext = filename.toLowerCase().split('.').pop() || ''
  const mime = mimeType.toLowerCase()
  if (['xlsx', 'xls', 'xlsm', 'csv', 'ods'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') {
    return 'sheet'
  }
  if (ext === 'docx' || mime.includes('wordprocessingml')) return 'docx'
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || /^image\/(png|jpe?g|webp|gif)$/.test(mime)) return 'image'
  if (['txt', 'html', 'htm'].includes(ext) || mime === 'text/plain' || mime === 'text/html') return 'text'
  return 'unsupported'
}

export interface ExtractResult {
  status: 'text' | 'sent_to_ai' | 'skipped' | 'error'
  text?: string
  part?: ChatCompletionContentPart
  error?: string
}

function imageMime(filename: string, mimeType: string): string {
  if (/^image\//.test(mimeType)) return mimeType === 'image/jpg' ? 'image/jpeg' : mimeType
  const ext = filename.toLowerCase().split('.').pop()
  return ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
}

export async function extractAttachment(filename: string, mimeType: string, data: Buffer): Promise<ExtractResult> {
  const kind = detectKind(filename, mimeType)
  try {
    switch (kind) {
      case 'sheet': {
        const wb = XLSX.read(data, { type: 'buffer' })
        const text = wb.SheetNames.map((name) => {
          const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name], { blankrows: false })
          return `# Sheet: ${name}\n${csv}`
        }).join('\n\n')
        return { status: 'text', text: text.slice(0, MAX_TEXT_PER_FILE) }
      }
      case 'docx': {
        const { value } = await mammoth.extractRawText({ buffer: data })
        return { status: 'text', text: value.slice(0, MAX_TEXT_PER_FILE) }
      }
      case 'text': {
        const raw = data.toString('utf8')
        const text = /html/i.test(mimeType) || /\.html?$/i.test(filename) ? htmlToText(raw) : raw
        return { status: 'text', text: text.slice(0, MAX_TEXT_PER_FILE) }
      }
      case 'pdf': {
        if (data.length > MAX_PDF_BYTES) return { status: 'skipped', error: 'PDF too large (>15 MB)' }
        return {
          status: 'sent_to_ai',
          part: {
            type: 'file',
            file: { filename, file_data: `data:application/pdf;base64,${data.toString('base64')}` },
          },
        }
      }
      case 'image': {
        if (data.length < MIN_IMAGE_BYTES) return { status: 'skipped', error: 'Small image (signature/logo)' }
        if (data.length > MAX_IMAGE_BYTES) return { status: 'skipped', error: 'Image too large (>10 MB)' }
        return {
          status: 'sent_to_ai',
          part: {
            type: 'image_url',
            image_url: { url: `data:${imageMime(filename, mimeType)};base64,${data.toString('base64')}`, detail: 'high' },
          },
        }
      }
      default:
        return { status: 'skipped', error: `Unsupported file type (${filename})` }
    }
  } catch (error) {
    return { status: 'error', error: error instanceof Error ? error.message : String(error) }
  }
}
