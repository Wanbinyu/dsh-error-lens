import type { ErrorLensProjection } from '../client.ts';
import type { ErrorLensKey } from './locales.ts';
type Translate = (key: ErrorLensKey) => string;
export declare function buildDiagnosticReport(projection: ErrorLensProjection, t: Translate): string;
export {};
