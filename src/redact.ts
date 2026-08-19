import type { ErrorLensCategory } from './types.ts'

const SECRET_KEYS = '(?:api[-_]?key|access[-_]?token|auth[-_]?token|secret|token)'
const HOME_PATHS = [
  /\b[A-Za-z]:\\Users\\[^\\\s]+/gi,
  /\/(?:Users|home)\/[^/\s]+/g,
]

export function redactMessage(input: string, maxLength: number): string {
  let value = input.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
  value = value.replace(/\bAuthorization\s*[:=]\s*(?:Bearer\s+)?[^\s,;]+/gi, 'Authorization: <redacted>')
  value = value.replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer <redacted>')
  value = value.replace(new RegExp(`(${SECRET_KEYS}\\s*[:=]\\s*[\"']?)[^\"'\\s,;&]+`, 'gi'), '$1<redacted>')
  value = value.replace(new RegExp(`([?&]${SECRET_KEYS}=)[^&#\\s]+`, 'gi'), '$1<redacted>')
  value = value.replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, '<redacted-api-key>')
  for (const pattern of HOME_PATHS) value = value.replace(pattern, '<home>')
  value = value.trim()
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 15)).trimEnd()}... [truncated]`
}

export function classifyFailure(failure: { code: string; message: string; status?: number }): ErrorLensCategory {
  const code = failure.code.toUpperCase()
  const message = failure.message.toLowerCase()
  const status = failure.status

  if (status === 401 || code === 'AUTH' || code === 'UNAUTHORIZED') return 'authentication'
  if (status === 403 || code === 'FORBIDDEN') return 'forbidden'
  if (status === 429 || code.includes('RATE_LIMIT')) return 'rate-limit'
  if (code.includes('CONTEXT') || /context (?:length|window)|maximum context|too many tokens/.test(message)) return 'context-limit'
  if (
    /developer role|unsupported role|messages?\.role|unknown tool\s*["']{0,2}|tool[_ -]?call|function[_ -]?call/.test(message)
    || code === 'UNKNOWN_TOOL'
  ) return 'compatibility'
  if (code.includes('TIMEOUT') || /timed? out|timeout/.test(message)) return 'timeout'
  if (code === 'TRANSPORT' || /econnreset|econnrefused|fetch failed|network error|socket hang up/.test(message)) return 'transport'
  if ((status !== undefined && status >= 500) || code === 'SERVER') return 'server'
  if (status === 400 || code === 'INVALID_REQUEST' || code === 'BAD_REQUEST') return 'invalid-request'
  return 'unknown'
}
