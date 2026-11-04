/**
 * Turns an Excel / CSV / plain-text file into tab-separated lines that
 * parseBulkOrderText understands. `xlsx` is loaded only when a workbook arrives.
 */

const TEXT_EXT = /\.(csv|tsv|txt)$/i
const WORKBOOK_EXT = /\.(xlsx|xls|ods)$/i
const SHEET_MIME = new Set([
  'text/csv',
  'text/plain',
  'text/tab-separated-values',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
])

export const SHEET_ACCEPT = '.csv,.tsv,.txt,.xlsx,.xls,.ods'

export function isSheetFile(file: File): boolean {
  return TEXT_EXT.test(file.name) || WORKBOOK_EXT.test(file.name) || SHEET_MIME.has(file.type)
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)
}

export async function sheetFileToText(file: File): Promise<string> {
  if (TEXT_EXT.test(file.name) || file.type.startsWith('text/')) {
    return file.text()
  }
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  return workbook.SheetNames.map((name) =>
    XLSX.utils.sheet_to_csv(workbook.Sheets[name], { FS: '\t', blankrows: false })
  )
    .join('\n')
    .trim()
}
