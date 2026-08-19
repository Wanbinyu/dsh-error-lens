import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { ErrorLensConfig } from './types.ts';
export type * from './types.ts';
export { classifyFailure, redactMessage } from './redact.ts';
export declare const name = "error-lens";
export declare const inject: string[];
export declare const Config: z<ErrorLensConfig>;
export declare function apply(ctx: Context, config?: ErrorLensConfig): void;
