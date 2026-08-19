export {};
export type ErrorLensCategory = 'authentication' | 'forbidden' | 'rate-limit' | 'context-limit' | 'compatibility' | 'invalid-request' | 'timeout' | 'transport' | 'server' | 'unknown';
export interface ErrorLensConfig {
    maxRecords: number;
    maxMessageLength: number;
}
export interface ErrorLensRecord {
    turn: number;
    time: number;
    provider: string;
    model: string;
    category: ErrorLensCategory;
    code: string;
    message: string;
    status?: number;
    requestId?: string;
}
export interface ErrorLensProjection {
    active: boolean;
    totalFailures: number;
    recent: ErrorLensRecord[];
    latest?: ErrorLensRecord;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionMap {
        'error-lens': ErrorLensProjection;
    }
}
