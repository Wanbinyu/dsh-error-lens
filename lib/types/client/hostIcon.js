import * as primitives from '@deepseek-ai/dsh-client-ui-primitives';
const icons = primitives;
function lookup(name) {
    try {
        return icons[name];
    }
    catch {
        return undefined;
    }
}
/**
 * Pick the Harness 0.2 icon, then the 0.1 name.
 * The primitives package stays external, so one client bundle can load on both hosts.
 */
export function hostIcon(modern, legacy) {
    const Icon = lookup(modern) ?? lookup(legacy);
    if (Icon !== undefined)
        return Icon;
    return function HostIconFallback() {
        return null;
    };
}
