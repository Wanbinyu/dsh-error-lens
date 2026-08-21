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
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionStateMap {
        'error-lens': ErrorLensState;
    }
}
type ErrorLensProjectionDefinition = Omit<ProjectionDefinition<'error-lens', ErrorLensState>, 'wire'> & {
    wire: NonNullable<ProjectionDefinition<'error-lens', ErrorLensState>['wire']>;
};
export declare function errorLensProjectionDefinition(config: ErrorLensConfig): ErrorLensProjectionDefinition;
export {};
