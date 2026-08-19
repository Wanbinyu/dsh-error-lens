import { describe, expect, it } from 'vitest'
import { classifyFailure, redactMessage } from '../src/redact.ts'

describe('redactMessage', () => {
  it('removes common credentials and user home paths', () => {
    const source = [
      'Authorization: Bearer secret-token-value',
      'api_key=sk-abcdefghijklmnopqrstuvwxyz',
      'https://gateway.test/v1?access_token=visible-secret&model=x',
      'C:\\Users\\alice\\.dsh\\settings.yaml',
      '/home/bob/.dsh/settings.yaml',
    ].join('\n')
    const value = redactMessage(source, 2000)
    expect(value).not.toContain('secret-token-value')
    expect(value).not.toContain('abcdefghijklmnopqrstuvwxyz')
    expect(value).not.toContain('visible-secret')
    expect(value).not.toContain('alice')
    expect(value).not.toContain('bob')
    expect(value).toContain('<redacted>')
    expect(value).toContain('<home>')
  })

  it('bounds the diagnostic message', () => {
    const value = redactMessage('x'.repeat(1000), 256)
    expect(value.length).toBeLessThanOrEqual(256)
    expect(value.endsWith('... [truncated]')).toBe(true)
  })
})

describe('classifyFailure', () => {
  it.each([
    [{ code: 'AUTH', message: 'bad key', status: 401 }, 'authentication'],
    [{ code: 'FORBIDDEN', message: 'user-agent blocked', status: 403 }, 'forbidden'],
    [{ code: 'RATE_LIMIT', message: 'slow down', status: 429 }, 'rate-limit'],
    [{ code: 'INVALID_REQUEST', message: 'maximum context length exceeded', status: 400 }, 'context-limit'],
    [{ code: 'INVALID_REQUEST', message: 'developer role is not supported', status: 400 }, 'compatibility'],
    [{ code: 'TIMEOUT', message: 'request timed out' }, 'timeout'],
    [{ code: 'TRANSPORT', message: 'fetch failed' }, 'transport'],
    [{ code: 'SERVER', message: 'upstream failed', status: 502 }, 'server'],
    [{ code: 'INVALID_REQUEST', message: 'bad parameter', status: 400 }, 'invalid-request'],
    [{ code: 'OTHER', message: 'something happened' }, 'unknown'],
  ] as const)('classifies %j as %s', (failure, expected) => {
    expect(classifyFailure(failure)).toBe(expected)
  })
})
