import { decryptSecret } from './crypto'
import { getAccessToken } from './google-oauth'

const API = 'https://gmail.googleapis.com/gmail/v1/users/me'

export class GmailError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export interface GmailHeader {
  name: string
  value: string
}

export interface GmailPart {
  partId?: string
  mimeType: string
  filename?: string
  headers?: GmailHeader[]
  body?: { size: number; data?: string; attachmentId?: string }
  parts?: GmailPart[]
}

export interface GmailMessage {
  id: string
  threadId: string
  labelIds?: string[]
  snippet?: string
  internalDate?: string
  historyId?: string
  payload?: GmailPart
}

export class GmailClient {
  private refreshToken: string

  constructor(refreshTokenEnc: string) {
    this.refreshToken = decryptSecret(refreshTokenEnc)
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getAccessToken(this.refreshToken)
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
    if (!res.ok) {
      let message = `${res.status}`
      try {
        const data = await res.json()
        message = data?.error?.message || message
      } catch {}
      throw new GmailError(`Gmail API ${path.split('?')[0]}: ${message}`, res.status)
    }
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  getProfile() {
    return this.request<{ emailAddress: string; historyId: string; messagesTotal: number }>('/profile')
  }

  async listMessageIds(query: string, max = 200): Promise<string[]> {
    const ids: string[] = []
    let pageToken: string | undefined
    do {
      const params = new URLSearchParams({ q: query, maxResults: '100' })
      if (pageToken) params.set('pageToken', pageToken)
      const data = await this.request<{ messages?: { id: string }[]; nextPageToken?: string }>(
        `/messages?${params}`
      )
      for (const m of data.messages || []) ids.push(m.id)
      pageToken = data.nextPageToken
    } while (pageToken && ids.length < max)
    return ids.slice(0, max)
  }

  /** New INBOX message ids since `startHistoryId`. Throws GmailError(404) when history expired. */
  async listAddedSince(startHistoryId: string): Promise<{ ids: string[]; historyId: string }> {
    const ids = new Set<string>()
    let pageToken: string | undefined
    let historyId = startHistoryId
    do {
      const params = new URLSearchParams({
        startHistoryId,
        historyTypes: 'messageAdded',
        labelId: 'INBOX',
        maxResults: '500',
      })
      if (pageToken) params.set('pageToken', pageToken)
      const data = await this.request<{
        history?: { messagesAdded?: { message: { id: string } }[] }[]
        nextPageToken?: string
        historyId: string
      }>(`/history?${params}`)
      for (const h of data.history || []) {
        for (const added of h.messagesAdded || []) ids.add(added.message.id)
      }
      historyId = data.historyId || historyId
      pageToken = data.nextPageToken
    } while (pageToken)
    return { ids: [...ids], historyId }
  }

  getMessage(id: string) {
    return this.request<GmailMessage>(`/messages/${id}?format=full`)
  }

  async getAttachment(messageId: string, attachmentId: string): Promise<Buffer> {
    const data = await this.request<{ data: string; size: number }>(
      `/messages/${messageId}/attachments/${encodeURIComponent(attachmentId)}`
    )
    return Buffer.from(data.data, 'base64url')
  }

  sendRaw(raw: Buffer, threadId?: string) {
    return this.request<{ id: string; threadId: string }>('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ raw: raw.toString('base64url'), ...(threadId ? { threadId } : {}) }),
    })
  }

  private labelCache = new Map<string, string>()

  async ensureLabel(name: string): Promise<string> {
    const cached = this.labelCache.get(name)
    if (cached) return cached
    const data = await this.request<{ labels: { id: string; name: string }[] }>('/labels')
    const existing = data.labels.find((l) => l.name === name)
    if (existing) {
      this.labelCache.set(name, existing.id)
      return existing.id
    }
    const created = await this.request<{ id: string }>('/labels', {
      method: 'POST',
      body: JSON.stringify({ name, labelListVisibility: 'labelShow', messageListVisibility: 'show' }),
    })
    this.labelCache.set(name, created.id)
    return created.id
  }

  async addLabels(messageId: string, labelNames: string[], removeLabelNames: string[] = []) {
    const addLabelIds = await Promise.all(labelNames.map((n) => this.ensureLabel(n)))
    const removeLabelIds = await Promise.all(removeLabelNames.map((n) => this.ensureLabel(n)))
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({ addLabelIds, removeLabelIds }),
    })
  }
}

export const GMAIL_LABELS = {
  rfq: 'AI/Запрос цен',
  draft: 'AI/Черновик',
  sentAuto: 'AI/Отправлено авто',
  sentManual: 'AI/Отправлено вручную',
  notRfq: 'AI/Не запрос',
} as const

export function gmailThreadUrl(mailboxEmail: string, threadId: string): string {
  return `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(mailboxEmail)}#all/${threadId}`
}
