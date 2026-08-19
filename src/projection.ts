import { z } from 'zod'
import type { LlmFailure } from '@deepseek-ai/dsh-llm'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import { classifyFailure, redactMessage } from './redact.ts'
import type { ErrorLensConfig, ErrorLensProjection, ErrorLensRecord } from './types.ts'

const UNKNOWN_ROUTE = '(unknown)'

interface ErrorLensState {
  route: { provider: string; model: string }
  active: boolean
  totalFailures: number
  recent: ErrorLensRecord[]
}

function recordFrom(
  event: SessionEvent & { type: 'turn/end' },
  route: ErrorLensState['route'],
  failure: LlmFailure,
  maxMessageLength: number,
): ErrorLensRecord {
  return {
    turn: event.data.turn,
    time: event.time,
    provider: route.provider,
    model: route.model,
    category: classifyFailure(failure),
    code: failure.code,
    message: redactMessage(failure.message, maxMessageLength),
    ...failure.status === undefined ? {} : { status: failure.status },
    ...failure.requestId === undefined ? {} : { requestId: String(failure.requestId) },
  }
}

export function errorLensProjectionDefinition(
  config: ErrorLensConfig,
): ProjectionDefinition<'error-lens', ErrorLensState> {
  const recordSchema = z.object({
    turn: z.number().int().positive(),
    time: z.number().nonnegative(),
    provider: z.string(),
    model: z.string(),
    category: z.enum([
      'authentication',
      'forbidden',
      'rate-limit',
      'context-limit',
      'compatibility',
      'invalid-request',
      'timeout',
      'transport',
      'server',
      'unknown',
    ]),
    code: z.string(),
    message: z.string(),
    status: z.number().int().optional(),
    requestId: z.string().optional(),
  }).strict()
  const schema = z.object({
    active: z.boolean(),
    totalFailures: z.number().int().nonnegative(),
    recent: z.array(recordSchema),
    latest: recordSchema.optional(),
  }).strict() as z.ZodType<ErrorLensProjection>

  return {
    key: 'error-lens',
    schema,
    init: () => ({
      route: { provider: UNKNOWN_ROUTE, model: UNKNOWN_ROUTE },
      active: false,
      totalFailures: 0,
      recent: [],
    }),
    apply: (state, event) => {
      if (event.type === 'request/header') {
        const route = {
          provider: event.data.header.config.provider,
          model: event.data.header.config.model,
        }
        if (route.provider === state.route.provider && route.model === state.route.model) return state
        return { ...state, route }
      }
      if (event.type !== 'turn/end') return state
      if (event.data.reason.kind !== 'error') {
        return state.active ? { ...state, active: false } : state
      }
      const record = recordFrom(event, state.route, event.data.reason.error, config.maxMessageLength)
      return {
        ...state,
        active: true,
        totalFailures: state.totalFailures + 1,
        recent: [...state.recent, record].slice(-config.maxRecords),
      }
    },
    view: state => ({
      active: state.active,
      totalFailures: state.totalFailures,
      recent: state.recent,
      ...state.recent.length === 0 ? {} : { latest: state.recent[state.recent.length - 1] },
    }),
    stateVersion: 1,
  }
}
