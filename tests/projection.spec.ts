import { describe, expect, expectTypeOf, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import type { LlmFailure } from '@deepseek-ai/dsh-llm'
import SessionStore, { SessionId } from '@deepseek-ai/dsh-session'
import type { Session } from '@deepseek-ai/dsh-session'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import type { ErrorLensProjection } from '../src/types.ts'
import { errorLensProjectionDefinition } from '../src/projection.ts'

async function harness(maxRecords = 10): Promise<{ ctx: Context; session: Session }> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  await ctx.plugin(SessionProjectionRegistry)
  ctx.sessionProjections.register(errorLensProjectionDefinition({ maxRecords, maxMessageLength: 2000 }))
  return { ctx, session: ctx.sessions.create(SessionId('error-lens-test')) }
}

function route(session: Session, provider = 'gateway', model = 'model-x'): void {
  session.append('request/header', { header: { config: { provider, model } }, reason: 'initial' })
}

function fail(session: Session, turn: number, failure: LlmFailure): void {
  session.append('turn/start', { turn })
  session.append('turn/end', { turn, reason: { kind: 'error', error: failure } })
}

function complete(session: Session, turn: number): void {
  session.append('turn/start', { turn })
  session.append('turn/end', { turn, reason: { kind: 'completed' } })
}

function projected(ctx: Context, session: Session): ErrorLensProjection {
  const value = ctx.sessionProjections.snapshot(session).values['error-lens']
  if (value === undefined) throw new Error('error-lens projection is not registered')
  return value
}

describe('error-lens projection', () => {
  it('starts empty and inactive', async () => {
    const { ctx, session } = await harness()
    expect(projected(ctx, session)).toEqual({ active: false, totalFailures: 0, recent: [] })
  })

  it('attributes, classifies, and redacts a terminal provider failure', async () => {
    const { ctx, session } = await harness()
    route(session, 'openai-compatible', 'reasoning-model')
    fail(session, 1, {
      code: 'FORBIDDEN',
      status: 403,
      message: 'User-Agent blocked; Authorization: Bearer should-not-leak',
      requestId: 'request-123' as never,
    })
    const value = projected(ctx, session)
    expect(value.active).toBe(true)
    expect(value.totalFailures).toBe(1)
    expect(value.latest).toMatchObject({
      turn: 1,
      provider: 'openai-compatible',
      model: 'reasoning-model',
      category: 'forbidden',
      code: 'FORBIDDEN',
      status: 403,
      requestId: 'request-123',
    })
    expect(value.latest?.message).toContain('Authorization: <redacted>')
    expect(value.latest?.message).not.toContain('should-not-leak')
  })

  it('keeps a bounded recent history while counting every failure', async () => {
    const { ctx, session } = await harness(2)
    route(session)
    fail(session, 1, { code: 'TIMEOUT', message: 'first timeout' })
    fail(session, 2, { code: 'RATE_LIMIT', message: 'second failure', status: 429 })
    fail(session, 3, { code: 'SERVER', message: 'third failure', status: 502 })
    const value = projected(ctx, session)
    expect(value.totalFailures).toBe(3)
    expect(value.recent.map(record => record.turn)).toEqual([2, 3])
    expect(value.latest?.turn).toBe(3)
  })

  it('hides the active banner after a later successful turn without deleting history', async () => {
    const { ctx, session } = await harness()
    fail(session, 1, { code: 'TRANSPORT', message: 'network error' })
    complete(session, 2)
    const value = projected(ctx, session)
    expect(value.active).toBe(false)
    expect(value.totalFailures).toBe(1)
    expect(value.latest?.turn).toBe(1)
  })

  it('uses an explicit unknown route before the first request header', async () => {
    const { ctx, session } = await harness()
    fail(session, 1, { code: 'UNKNOWN', message: 'failed before request setup' })
    expect(projected(ctx, session).latest).toMatchObject({ provider: '(unknown)', model: '(unknown)' })
  })

  it('types the projection key through SessionProjectionMap', async () => {
    const { ctx, session } = await harness()
    expectTypeOf(ctx.sessionProjections.snapshot(session).values['error-lens'])
      .toEqualTypeOf<ErrorLensProjection | undefined>()
  })
})
