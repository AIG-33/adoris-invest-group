import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'

function getKey(): Buffer {
  const secret = process.env.MAIL_TOKEN_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('MAIL_TOKEN_ENCRYPTION_KEY or NEXTAUTH_SECRET must be set')
  return createHash('sha256').update(`rfq-mail-token:${secret}`).digest()
}

/** AES-256-GCM, output: base64(iv | tag | ciphertext) */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}

export function decryptSecret(payload: string): string {
  const buf = Buffer.from(payload, 'base64')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const enc = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', getKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

/** Signed, expiring state for the OAuth round-trip. */
export function signState(data: Record<string, unknown>, ttlSeconds = 600): string {
  const body = Buffer.from(
    JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + ttlSeconds })
  ).toString('base64url')
  const sig = createHmac('sha256', getKey()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyState<T = Record<string, unknown>>(state: string): T | null {
  const [body, sig] = state.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', getKey()).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  if (typeof data.exp !== 'number' || data.exp < Date.now() / 1000) return null
  return data as T
}
