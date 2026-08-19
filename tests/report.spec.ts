import { describe, expect, it } from 'vitest'
import type { ErrorLensProjection } from '../src/types.ts'
import { buildDiagnosticReport } from '../src/client/report.ts'
import { en, type ErrorLensKey } from '../src/client/locales.ts'

const translate = (key: ErrorLensKey): string => en[key]

describe('buildDiagnosticReport', () => {
  it('creates a compact report from only the redacted projection', () => {
    const projection: ErrorLensProjection = {
      active: true,
      totalFailures: 2,
      recent: [],
      latest: {
        turn: 3,
        time: Date.UTC(2026, 7, 19),
        provider: 'gateway',
        model: 'model-x',
        category: 'compatibility',
        code: 'INVALID_REQUEST',
        status: 400,
        requestId: 'req-1',
        message: 'developer role is not supported',
      },
    }
    const report = buildDiagnosticReport(projection, translate)
    expect(report).toContain('DeepSeek Harness redacted error diagnostic')
    expect(report).toContain('Provider compatibility')
    expect(report).toContain('developer role is not supported')
    expect(report).toContain('req-1')
    expect(report).toContain('excludes full prompts')
  })

  it('returns an empty report without a failure', () => {
    expect(buildDiagnosticReport({ active: false, totalFailures: 0, recent: [] }, translate)).toBe('')
  })
})
