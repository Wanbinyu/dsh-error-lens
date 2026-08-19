import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection';
import type { ErrorLensConfig, ErrorLensRecord } from './types.ts';
interface ErrorLensState {
    route: {
        provider: string;
        model: string;
    };
    active: boolean;
    totalFailures: number;
    recent: ErrorLensRecord[];
}
export declare function errorLensProjectionDefinition(config: ErrorLensConfig): ProjectionDefinition<'error-lens', ErrorLensState>;
export {};
