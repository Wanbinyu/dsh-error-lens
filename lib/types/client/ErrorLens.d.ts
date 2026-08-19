import type { ErrorLensProjection } from '../client.ts';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
export interface ErrorLensProps {
    diagnostics: ErrorLensProjection | null | undefined;
}
export declare function ErrorLens({ diagnostics, t }: ErrorLensProps & PropsLocale<'error-lens'>): import("react").JSX.Element | null;
export type ErrorLensDockProps = import('@deepseek-ai/dsh-client-ui-slots').PropsRuntime<'conversation.input.dock'> & PropsLocale<'error-lens'>;
export declare function ErrorLensDock({ useProjection, t }: ErrorLensDockProps): import("react").JSX.Element;
