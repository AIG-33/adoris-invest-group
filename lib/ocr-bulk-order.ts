/**
 * Client-side OCR for bulk-order image paste / upload.
 * Uses Tesseract.js in the browser — no server secrets required.
 */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/bmp',
])

export type OcrProgress = {
  status: string
  progress: number // 0–1
}

export class OcrImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OcrImageError'
  }
}

export function isAcceptedImageFile(file: File | Blob): boolean {
  const type = (file.type || '').toLowerCase()
  if (type && ACCEPTED_MIME.has(type)) return true
  // Some mobile browsers omit type for camera shots — allow empty type if size is ok
  if (!type && file.size > 0) return true
  return false
}

export function assertImageWithinLimits(file: File | Blob): void {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new OcrImageError('FILE_TOO_LARGE')
  }
  if (!isAcceptedImageFile(file)) {
    throw new OcrImageError('UNSUPPORTED_TYPE')
  }
}

/**
 * Light cleanup of OCR noise so the existing parseBulkOrderText can work.
 * Does not invent a second parser — only normalizes whitespace / obvious junk.
 */
export function cleanupOcrText(raw: string): string {
  return raw
    .replace(/\u00a0/g, ' ')
    .replace(/[|¦]/g, ' ')
    .split(/\r?\n/)
    .map((line) =>
      line
        // Collapse runs of spaces / tabs within a line
        .replace(/[ \t\f\v]+/g, ' ')
        .trim()
    )
    // Drop empty lines and lines that are only punctuation / symbols
    .filter((line) => line.length > 0 && /[A-Za-z0-9]/.test(line))
    .join('\n')
}

/**
 * Run Tesseract OCR on one or more image blobs.
 * Languages: English + Russian (catalogs / invoices often mix both).
 */
export async function recognizeBulkOrderImages(
  images: Array<File | Blob>,
  onProgress?: (info: OcrProgress) => void
): Promise<string> {
  if (images.length === 0) {
    throw new OcrImageError('NO_IMAGE')
  }

  for (const img of images) {
    assertImageWithinLimits(img)
  }

  // Dynamic import keeps tesseract out of the initial bundle / SSR path.
  const { createWorker } = await import('tesseract.js')

  // v7 expects an array for multiple languages (not "eng+rus").
  const worker = await createWorker(['eng', 'rus'], 1, {
    logger: (m) => {
      if (typeof m.progress === 'number') {
        onProgress?.({
          status: String(m.status || 'recognizing'),
          progress: m.progress,
        })
      }
    },
  })

  try {
    const chunks: string[] = []
    for (let i = 0; i < images.length; i++) {
      onProgress?.({
        status: 'recognizing',
        progress: i / images.length,
      })
      const { data } = await worker.recognize(images[i])
      const cleaned = cleanupOcrText(data.text || '')
      if (cleaned) chunks.push(cleaned)
    }
    return chunks.join('\n')
  } finally {
    await worker.terminate()
  }
}

export { MAX_IMAGE_BYTES }
