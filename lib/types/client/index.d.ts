import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type ErrorLensKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'error-lens': ErrorLensKey;
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
