import { ErrorLensDock } from "./ErrorLens.js";
import { NS, en, zh } from "./locales.js";
export const inject = ['slots', 'locale'];
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'error-lens: dictionaries');
    ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
        name: 'conversation.input.dock',
        id: 'error-lens',
        order: 4,
        locale: NS,
    }, ErrorLensDock));
}
