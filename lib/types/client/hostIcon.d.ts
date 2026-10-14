import type { ReactElement } from 'react';
export type HostIconProps = {
    size?: number;
    className?: string;
    'aria-hidden'?: boolean | 'true';
};
type IconComponent = (props: HostIconProps) => ReactElement | null;
/**
 * Pick the Harness 0.2 icon, then the 0.1 name.
 * The primitives package stays external, so one client bundle can load on both hosts.
 */
export declare function hostIcon(modern: string, legacy: string): IconComponent;
export {};
