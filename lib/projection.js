import { z } from 'zod';
import { classifyFailure, redactMessage } from "./redact.js";
const UNKNOWN_ROUTE = '(unknown)';
function recordFrom(event, route, failure, maxMessageLength) {
    return {
        turn: event.data.turn,
        time: event.time,
        provider: route.provider,
        model: route.model,
        category: classifyFailure(failure),
        code: failure.code,
        message: redactMessage(failure.message, maxMessageLength),
        ...failure.status === undefined ? {} : { status: failure.status },
        ...failure.requestId === undefined ? {} : { requestId: String(failure.requestId) },
    };
}
export function errorLensProjectionDefinition(config) {
    const recordSchema = z.object({
        turn: z.number().int().positive(),
        time: z.number().nonnegative(),
        provider: z.string(),
        model: z.string(),
        category: z.enum([
            'authentication',
            'forbidden',
            'rate-limit',
            'context-limit',
            'compatibility',
            'invalid-request',
            'timeout',
            'transport',
            'server',
            'unknown',
        ]),
        code: z.string(),
        message: z.string(),
        status: z.number().int().optional(),
        requestId: z.string().optional(),
    }).strict();
    const stateSchema = z.object({
        route: z.object({
            provider: z.string(),
            model: z.string(),
        }).strict(),
        active: z.boolean(),
        totalFailures: z.number().int().nonnegative(),
        recent: z.array(recordSchema),
    }).strict();
    const viewSchema = z.object({
        active: z.boolean(),
        totalFailures: z.number().int().nonnegative(),
        recent: z.array(recordSchema),
        latest: recordSchema.optional(),
    }).strict();
    return {
        key: 'error-lens',
        stateSchema,
        init: () => ({
            route: { provider: UNKNOWN_ROUTE, model: UNKNOWN_ROUTE },
            active: false,
            totalFailures: 0,
            recent: [],
        }),
        apply: (state, event) => {
            if (event.type === 'request/header') {
                const route = {
                    provider: event.data.header.config.provider,
                    model: event.data.header.config.model,
                };
                if (route.provider === state.route.provider && route.model === state.route.model)
                    return state;
                return { ...state, route };
            }
            if (event.type !== 'turn/end')
                return state;
            if (event.data.reason.kind !== 'error') {
                return state.active ? { ...state, active: false } : state;
            }
            const record = recordFrom(event, state.route, event.data.reason.error, config.maxMessageLength);
            return {
                ...state,
                active: true,
                totalFailures: state.totalFailures + 1,
                recent: [...state.recent, record].slice(-config.maxRecords),
            };
        },
        wire: {
            viewSchema,
            view: state => ({
                active: state.active,
                totalFailures: state.totalFailures,
                recent: state.recent,
                ...state.recent.length === 0 ? {} : { latest: state.recent[state.recent.length - 1] },
            }),
        },
        stateVersion: 1,
    };
}
