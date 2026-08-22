window.__ModuleLoader__.load({ id: "dsh-error-lens", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
let react_jsx_runtime = require("react/jsx-runtime");
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

//#region lib/types/client/report.js
function buildDiagnosticReport(projection, t) {
	const record = projection.latest;
	if (record === void 0) return "";
	const categoryKey = `category.${record.category}`;
	const hintKey = `hint.${record.category}`;
	return [
		`# ${t("reportTitle")}`,
		"",
		`- ${t("turn")}: ${record.turn}`,
		`- ${t("provider")}: ${record.provider}`,
		`- ${t("model")}: ${record.model}`,
		`- ${t("latest")}: ${t(categoryKey)}`,
		`- Code: ${record.code}`,
		...record.status === void 0 ? [] : [`- ${t("status")}: ${record.status}`],
		...record.requestId === void 0 ? [] : [`- ${t("requestId")}: ${record.requestId}`],
		`- Time: ${new Date(record.time).toISOString()}`,
		`- ${t("failureCount")}: ${projection.totalFailures}`,
		"",
		"## Message",
		"",
		"```text",
		record.message,
		"```",
		"",
		"## Suggested check",
		"",
		t(hintKey),
		"",
		`> ${t("privacy")}`
	].join("\n");
}

//#endregion
//#region \0dsh-css:G:\skill\dsh-error-lens\src\client\ErrorLens.module.css.mjs
const css = ".nBJjxa_dock{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));margin:0 auto}.nBJjxa_panel{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width) - 4 * var(--dsh-composer-dock-inset));border:1px solid var(--dsw-alias-state-warning-primary);background:var(--dsw-specific-tip);border-radius:8px;margin:0 auto;overflow:hidden}.nBJjxa_panel[data-category=authentication],.nBJjxa_panel[data-category=forbidden],.nBJjxa_panel[data-category=server]{border-color:var(--dsw-alias-state-error-primary,#cf222e)}.nBJjxa_summary{align-items:center;gap:8px;min-height:36px;padding:3px 4px 3px 10px;display:flex}.nBJjxa_glyph{color:var(--dsw-alias-state-warning-primary);flex:none;display:inline-flex}.nBJjxa_panel[data-category=authentication] .nBJjxa_glyph,.nBJjxa_panel[data-category=forbidden] .nBJjxa_glyph,.nBJjxa_panel[data-category=server] .nBJjxa_glyph{color:var(--dsw-alias-state-error-primary,#cf222e)}.nBJjxa_label,.nBJjxa_category,.nBJjxa_code{white-space:nowrap;flex:none;font-size:12px;line-height:20px}.nBJjxa_label{color:var(--dsw-alias-label-primary);font-weight:600}.nBJjxa_category{color:var(--dsw-alias-label-secondary)}.nBJjxa_route{min-width:0;color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:12px;line-height:20px;overflow:hidden}.nBJjxa_code{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);border-radius:4px;padding:0 6px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.nBJjxa_actions{flex:none;gap:2px;display:inline-flex}.nBJjxa_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;place-items:center;padding:0;display:inline-grid}.nBJjxa_iconButton:hover,.nBJjxa_iconButton:focus-visible{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);outline:none}.nBJjxa_details{border-top:1px solid var(--dsw-alias-border-l1);padding:0 12px 10px}.nBJjxa_message{max-height:128px;color:var(--dsw-alias-label-primary);white-space:pre-wrap;overflow-wrap:anywhere;margin:10px 0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:18px;overflow:auto}.nBJjxa_meta{grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 16px;margin:0;display:grid}.nBJjxa_meta>div{grid-template-columns:minmax(72px,auto) minmax(0,1fr);gap:8px;min-width:0;display:grid}.nBJjxa_meta dt,.nBJjxa_meta dd,.nBJjxa_hint,.nBJjxa_privacy{margin:0;font-size:12px;line-height:18px}.nBJjxa_meta dt,.nBJjxa_privacy{color:var(--dsw-alias-label-tertiary)}.nBJjxa_meta dd{color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.nBJjxa_history{margin-top:10px}.nBJjxa_history h3{color:var(--dsw-alias-label-secondary);margin:0 0 4px;font-size:12px;font-weight:600;line-height:18px}.nBJjxa_history ul{gap:2px;margin:0;padding:0;list-style:none;display:grid}.nBJjxa_history li{min-width:0;color:var(--dsw-alias-label-tertiary);grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;font-size:12px;line-height:18px;display:grid}.nBJjxa_history li>span:nth-child(2){text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.nBJjxa_history code{color:var(--dsw-alias-label-secondary)}.nBJjxa_hint{color:var(--dsw-alias-label-secondary);margin-top:10px}.nBJjxa_privacy{margin-top:6px}@media (width<=620px){.nBJjxa_summary{gap:4px;padding-left:8px}.nBJjxa_label,.nBJjxa_route{display:none}.nBJjxa_category{text-overflow:ellipsis;flex:1;overflow:hidden}.nBJjxa_meta{grid-template-columns:1fr}}";
const tagId = "dsh-error-lens/ErrorLens.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-error-lens";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var ErrorLens_module_css_default = {
	"actions": "nBJjxa_actions",
	"category": "nBJjxa_category",
	"code": "nBJjxa_code",
	"details": "nBJjxa_details",
	"dock": "nBJjxa_dock",
	"glyph": "nBJjxa_glyph",
	"hint": "nBJjxa_hint",
	"history": "nBJjxa_history",
	"iconButton": "nBJjxa_iconButton",
	"label": "nBJjxa_label",
	"message": "nBJjxa_message",
	"meta": "nBJjxa_meta",
	"panel": "nBJjxa_panel",
	"privacy": "nBJjxa_privacy",
	"route": "nBJjxa_route",
	"summary": "nBJjxa_summary"
};

//#endregion
//#region lib/types/client/ErrorLens.js
function categoryKey(category) {
	return `category.${category}`;
}
function hintKey(category) {
	return `hint.${category}`;
}
function ErrorLens({ diagnostics, t }) {
	const [open, setOpen] = (0, react.useState)(false);
	const [copied, setCopied] = (0, react.useState)(false);
	const record = diagnostics?.latest;
	(0, react.useEffect)(() => {
		setCopied(false);
	}, [diagnostics?.totalFailures]);
	if (diagnostics === void 0 || diagnostics === null || !diagnostics.active || record === void 0) return null;
	const previousRecords = diagnostics.recent.slice(0, -1).slice(-3).reverse();
	const copyReport = async () => {
		setCopied(await (0, _deepseek_ai_dsh_client_ui_primitives.writeClipboard)(buildDiagnosticReport(diagnostics, t)));
	};
	return (0, react_jsx_runtime.jsx)("div", {
		className: ErrorLens_module_css_default.dock,
		"data-error-lens": true,
		children: (0, react_jsx_runtime.jsxs)("div", {
			className: ErrorLens_module_css_default.panel,
			"data-category": record.category,
			children: [(0, react_jsx_runtime.jsxs)("div", {
				className: ErrorLens_module_css_default.summary,
				role: "alert",
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: ErrorLens_module_css_default.glyph,
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { size: 16 })
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: ErrorLens_module_css_default.label,
						children: t("label")
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: ErrorLens_module_css_default.category,
						children: t(categoryKey(record.category))
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: ErrorLens_module_css_default.route,
						title: `${record.provider}/${record.model}`,
						children: [
							record.provider,
							"/",
							record.model
						]
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: ErrorLens_module_css_default.code,
						children: record.status ?? record.code
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: ErrorLens_module_css_default.actions,
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
							label: copied ? t("copied") : t("copy"),
							side: "top",
							children: (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: ErrorLens_module_css_default.iconButton,
								"aria-label": copied ? t("copied") : t("copy"),
								onClick: copyReport,
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 16 })
							})
						}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
							label: open ? t("collapse") : t("expand"),
							side: "top",
							children: (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: ErrorLens_module_css_default.iconButton,
								"aria-expanded": open,
								"aria-label": open ? t("collapse") : t("expand"),
								onClick: () => setOpen((value) => !value),
								children: open ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronUpOutline14, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { size: 14 })
							})
						})]
					})
				]
			}), open && (0, react_jsx_runtime.jsxs)("div", {
				className: ErrorLens_module_css_default.details,
				children: [
					(0, react_jsx_runtime.jsx)("p", {
						className: ErrorLens_module_css_default.message,
						children: record.message
					}),
					(0, react_jsx_runtime.jsxs)("dl", {
						className: ErrorLens_module_css_default.meta,
						children: [
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("provider") }), (0, react_jsx_runtime.jsx)("dd", { children: record.provider })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("model") }), (0, react_jsx_runtime.jsx)("dd", { children: record.model })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: "Code" }), (0, react_jsx_runtime.jsx)("dd", { children: record.code })] }),
							record.status !== void 0 && (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("status") }), (0, react_jsx_runtime.jsx)("dd", { children: record.status })] }),
							record.requestId !== void 0 && (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("requestId") }), (0, react_jsx_runtime.jsx)("dd", { children: record.requestId })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("failureCount") }), (0, react_jsx_runtime.jsx)("dd", { children: diagnostics.totalFailures })] })
						]
					}),
					previousRecords.length > 0 && (0, react_jsx_runtime.jsxs)("section", {
						className: ErrorLens_module_css_default.history,
						"aria-label": t("recentHistory"),
						children: [(0, react_jsx_runtime.jsx)("h3", { children: t("recentHistory") }), (0, react_jsx_runtime.jsx)("ul", { children: previousRecords.map((previous) => (0, react_jsx_runtime.jsxs)("li", { children: [
							(0, react_jsx_runtime.jsxs)("span", { children: [
								t("turn"),
								" ",
								previous.turn
							] }),
							(0, react_jsx_runtime.jsxs)("span", {
								title: `${previous.provider}/${previous.model}`,
								children: [
									previous.provider,
									"/",
									previous.model
								]
							}),
							(0, react_jsx_runtime.jsx)("code", { children: previous.status ?? previous.code })
						] }, `${String(previous.time)}-${String(previous.turn)}`)) })]
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: ErrorLens_module_css_default.hint,
						children: t(hintKey(record.category))
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: ErrorLens_module_css_default.privacy,
						children: t("privacy")
					})
				]
			})]
		})
	});
}
function ErrorLensDock({ useProjection, t }) {
	return (0, react_jsx_runtime.jsx)(ErrorLens, {
		diagnostics: useProjection("error-lens"),
		t
	});
}

//#endregion
//#region lib/types/client/locales.js
const NS = "error-lens";
const zh = {
	"label": "请求诊断",
	"latest": "最近失败",
	"provider": "供应商",
	"model": "模型",
	"status": "HTTP 状态",
	"requestId": "请求 ID",
	"turn": "轮次",
	"failureCount": "本会话失败次数",
	"recentHistory": "此前失败",
	"copy": "复制脱敏诊断报告",
	"copied": "诊断报告已复制",
	"expand": "展开错误详情",
	"collapse": "收起错误详情",
	"privacy": "报告不包含完整提示词，并已尝试移除密钥、令牌和用户目录。",
	"category.authentication": "身份验证",
	"category.forbidden": "访问被拒绝",
	"category.rate-limit": "请求限流",
	"category.context-limit": "上下文超限",
	"category.compatibility": "供应商兼容性",
	"category.invalid-request": "请求参数",
	"category.timeout": "请求超时",
	"category.transport": "网络连接",
	"category.server": "供应商服务",
	"category.unknown": "未知错误",
	"hint.authentication": "检查 API Key 是否配置到当前 profile，以及密钥是否仍然有效。",
	"hint.forbidden": "密钥可能有效，但网关策略、User-Agent、模型权限或来源限制拒绝了请求。",
	"hint.rate-limit": "等待限流窗口恢复，或降低并发请求数量。",
	"hint.context-limit": "新建会话、压缩上下文，或减少一次发送的文件和历史内容。",
	"hint.compatibility": "检查 developer role、tool calls、流式字段和模型能力是否被网关完整支持。",
	"hint.invalid-request": "检查模型名称、推理参数、消息角色以及供应商支持的请求字段。",
	"hint.timeout": "检查网关响应时间，并适当提高超时或减少单次任务规模。",
	"hint.transport": "检查 baseURL、代理、DNS、证书和本地网络连接。",
	"hint.server": "供应商服务端返回异常；保留请求 ID 后重试或联系供应商。",
	"hint.unknown": "复制脱敏报告，并结合 DSH 会话日志继续排查。",
	"reportTitle": "DeepSeek Harness 脱敏错误诊断"
};
const en = {
	"label": "Request diagnostics",
	"latest": "Latest failure",
	"provider": "Provider",
	"model": "Model",
	"status": "HTTP status",
	"requestId": "Request ID",
	"turn": "Turn",
	"failureCount": "Session failures",
	"recentHistory": "Previous failures",
	"copy": "Copy redacted diagnostic report",
	"copied": "Diagnostic report copied",
	"expand": "Expand error details",
	"collapse": "Collapse error details",
	"privacy": "The report excludes full prompts and attempts to remove keys, tokens, and user home paths.",
	"category.authentication": "Authentication",
	"category.forbidden": "Access forbidden",
	"category.rate-limit": "Rate limited",
	"category.context-limit": "Context limit",
	"category.compatibility": "Provider compatibility",
	"category.invalid-request": "Invalid request",
	"category.timeout": "Request timeout",
	"category.transport": "Network transport",
	"category.server": "Provider service",
	"category.unknown": "Unknown error",
	"hint.authentication": "Check that the current profile has a valid API key.",
	"hint.forbidden": "The key may be valid, but a gateway policy, User-Agent rule, model permission, or source restriction rejected the request.",
	"hint.rate-limit": "Wait for the rate-limit window or reduce concurrent requests.",
	"hint.context-limit": "Start a new session, compact context, or send fewer files and history at once.",
	"hint.compatibility": "Check whether the gateway fully supports developer roles, tool calls, streaming fields, and model capabilities.",
	"hint.invalid-request": "Check the model id, reasoning options, message roles, and provider-supported request fields.",
	"hint.timeout": "Check gateway latency and raise the timeout or reduce the task size.",
	"hint.transport": "Check the base URL, proxy, DNS, certificates, and local network.",
	"hint.server": "The provider returned a server failure; keep the request ID and retry or contact the provider.",
	"hint.unknown": "Copy the redacted report and continue with the DSH session log.",
	"reportTitle": "DeepSeek Harness redacted error diagnostic"
};

//#endregion
//#region lib/types/client/index.js
const inject = ["slots", "locale"];
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "error-lens: dictionaries");
	ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
		name: "conversation.input.dock",
		id: "error-lens",
		order: 4,
		locale: NS
	}, ErrorLensDock));
}

//#endregion
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map