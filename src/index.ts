import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { errorLensProjectionDefinition } from './projection.ts'
import type { ErrorLensConfig } from './types.ts'

export type * from './types.ts'
export { classifyFailure, redactMessage } from './redact.ts'

export const name = 'error-lens'
export const inject = ['sessionProjections']

export const Config: z<ErrorLensConfig> = z.object({
  maxRecords: z.number().min(1).max(50).default(10),
  maxMessageLength: z.number().min(256).max(8000).default(2000),
})

export function apply(
  ctx: Context,
  config: ErrorLensConfig = { maxRecords: 10, maxMessageLength: 2000 },
): void {
  if (!Number.isInteger(config.maxRecords)) throw new Error('ErrorLensConfig: maxRecords must be an integer')
  if (!Number.isInteger(config.maxMessageLength)) throw new Error('ErrorLensConfig: maxMessageLength must be an integer')
  ctx.sessionProjections.register(errorLensProjectionDefinition(config))
}
