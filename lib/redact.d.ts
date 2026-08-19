import type { ErrorLensCategory } from './types.ts';
export declare function redactMessage(input: string, maxLength: number): string;
export declare function classifyFailure(failure: {
    code: string;
    message: string;
    status?: number;
}): ErrorLensCategory;
