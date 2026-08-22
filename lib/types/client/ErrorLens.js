import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { IconChevronDownOutline14, IconChevronUpOutline14, IconCopyOutline16, IconWarningOutline16, Tooltip, writeClipboard, } from '@deepseek-ai/dsh-client-ui-primitives';
import { buildDiagnosticReport } from "./report.js";
import css from './ErrorLens.module.css';
function categoryKey(category) {
    return `category.${category}`;
}
function hintKey(category) {
    return `hint.${category}`;
}
export function ErrorLens({ diagnostics, t }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const record = diagnostics?.latest;
    useEffect(() => { setCopied(false); }, [diagnostics?.totalFailures]);
    if (diagnostics === undefined || diagnostics === null || !diagnostics.active || record === undefined)
        return null;
    const previousRecords = diagnostics.recent.slice(0, -1).slice(-3).reverse();
    const copyReport = async () => {
        const success = await writeClipboard(buildDiagnosticReport(diagnostics, t));
        setCopied(success);
    };
    return (_jsx("div", { className: css.dock, "data-error-lens": true, children: _jsxs("div", { className: css.panel, "data-category": record.category, children: [_jsxs("div", { className: css.summary, role: "alert", children: [_jsx("span", { className: css.glyph, children: _jsx(IconWarningOutline16, { size: 16 }) }), _jsx("span", { className: css.label, children: t('label') }), _jsx("span", { className: css.category, children: t(categoryKey(record.category)) }), _jsxs("span", { className: css.route, title: `${record.provider}/${record.model}`, children: [record.provider, "/", record.model] }), _jsx("span", { className: css.code, children: record.status ?? record.code }), _jsxs("span", { className: css.actions, children: [_jsx(Tooltip, { label: copied ? t('copied') : t('copy'), side: "top", children: _jsx("button", { type: "button", className: css.iconButton, "aria-label": copied ? t('copied') : t('copy'), onClick: copyReport, children: _jsx(IconCopyOutline16, { size: 16 }) }) }), _jsx(Tooltip, { label: open ? t('collapse') : t('expand'), side: "top", children: _jsx("button", { type: "button", className: css.iconButton, "aria-expanded": open, "aria-label": open ? t('collapse') : t('expand'), onClick: () => setOpen(value => !value), children: open ? _jsx(IconChevronUpOutline14, { size: 14 }) : _jsx(IconChevronDownOutline14, { size: 14 }) }) })] })] }), open && (_jsxs("div", { className: css.details, children: [_jsx("p", { className: css.message, children: record.message }), _jsxs("dl", { className: css.meta, children: [_jsxs("div", { children: [_jsx("dt", { children: t('provider') }), _jsx("dd", { children: record.provider })] }), _jsxs("div", { children: [_jsx("dt", { children: t('model') }), _jsx("dd", { children: record.model })] }), _jsxs("div", { children: [_jsx("dt", { children: "Code" }), _jsx("dd", { children: record.code })] }), record.status !== undefined && _jsxs("div", { children: [_jsx("dt", { children: t('status') }), _jsx("dd", { children: record.status })] }), record.requestId !== undefined && _jsxs("div", { children: [_jsx("dt", { children: t('requestId') }), _jsx("dd", { children: record.requestId })] }), _jsxs("div", { children: [_jsx("dt", { children: t('failureCount') }), _jsx("dd", { children: diagnostics.totalFailures })] })] }), previousRecords.length > 0 && (_jsxs("section", { className: css.history, "aria-label": t('recentHistory'), children: [_jsx("h3", { children: t('recentHistory') }), _jsx("ul", { children: previousRecords.map(previous => (_jsxs("li", { children: [_jsxs("span", { children: [t('turn'), " ", previous.turn] }), _jsxs("span", { title: `${previous.provider}/${previous.model}`, children: [previous.provider, "/", previous.model] }), _jsx("code", { children: previous.status ?? previous.code })] }, `${String(previous.time)}-${String(previous.turn)}`))) })] })), _jsx("p", { className: css.hint, children: t(hintKey(record.category)) }), _jsx("p", { className: css.privacy, children: t('privacy') })] }))] }) }));
}
export function ErrorLensDock({ useProjection, t }) {
    return _jsx(ErrorLens, { diagnostics: useProjection('error-lens'), t: t });
}
