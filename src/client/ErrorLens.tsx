import { useEffect, useState } from 'react'
import type { ErrorLensCategory, ErrorLensProjection } from '../client.ts'
import {
  IconChevronDownOutline14,
  IconChevronUpOutline14,
  IconCopyOutline16,
  IconWarningOutline16,
  Tooltip,
  writeClipboard,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { ErrorLensKey } from './locales.ts'
import { buildDiagnosticReport } from './report.ts'
import css from './ErrorLens.module.css'

export interface ErrorLensProps {
  diagnostics: ErrorLensProjection | null | undefined
}

function categoryKey(category: ErrorLensCategory): ErrorLensKey {
  return `category.${category}` as ErrorLensKey
}

function hintKey(category: ErrorLensCategory): ErrorLensKey {
  return `hint.${category}` as ErrorLensKey
}

export function ErrorLens({ diagnostics, t }: ErrorLensProps & PropsLocale<'error-lens'>) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const record = diagnostics?.latest
  useEffect(() => { setCopied(false) }, [diagnostics?.totalFailures])
  if (diagnostics === undefined || diagnostics === null || !diagnostics.active || record === undefined) return null
  const previousRecords = diagnostics.recent.slice(0, -1).slice(-3).reverse()

  const copyReport = async () => {
    const success = await writeClipboard(buildDiagnosticReport(diagnostics, t))
    setCopied(success)
  }

  return (
    <div className={css.dock} data-error-lens>
      <div className={css.panel} data-category={record.category}>
        <div className={css.summary} role="alert">
          <span className={css.glyph}><IconWarningOutline16 size={16} /></span>
          <span className={css.label}>{t('label')}</span>
          <span className={css.category}>{t(categoryKey(record.category))}</span>
          <span className={css.route} title={`${record.provider}/${record.model}`}>
            {record.provider}/{record.model}
          </span>
          <span className={css.code}>{record.status ?? record.code}</span>
          <span className={css.actions}>
            <Tooltip label={copied ? t('copied') : t('copy')} side="top">
              <button type="button" className={css.iconButton} aria-label={copied ? t('copied') : t('copy')} onClick={copyReport}>
                <IconCopyOutline16 size={16} />
              </button>
            </Tooltip>
            <Tooltip label={open ? t('collapse') : t('expand')} side="top">
              <button type="button" className={css.iconButton} aria-expanded={open} aria-label={open ? t('collapse') : t('expand')} onClick={() => setOpen(value => !value)}>
                {open ? <IconChevronUpOutline14 size={14} /> : <IconChevronDownOutline14 size={14} />}
              </button>
            </Tooltip>
          </span>
        </div>
        {open && (
          <div className={css.details}>
            <p className={css.message}>{record.message}</p>
            <dl className={css.meta}>
              <div><dt>{t('provider')}</dt><dd>{record.provider}</dd></div>
              <div><dt>{t('model')}</dt><dd>{record.model}</dd></div>
              <div><dt>Code</dt><dd>{record.code}</dd></div>
              {record.status !== undefined && <div><dt>{t('status')}</dt><dd>{record.status}</dd></div>}
              {record.requestId !== undefined && <div><dt>{t('requestId')}</dt><dd>{record.requestId}</dd></div>}
              <div><dt>{t('failureCount')}</dt><dd>{diagnostics.totalFailures}</dd></div>
            </dl>
            {previousRecords.length > 0 && (
              <section className={css.history} aria-label={t('recentHistory')}>
                <h3>{t('recentHistory')}</h3>
                <ul>
                  {previousRecords.map(previous => (
                    <li key={`${String(previous.time)}-${String(previous.turn)}`}>
                      <span>{t('turn')} {previous.turn}</span>
                      <span title={`${previous.provider}/${previous.model}`}>{previous.provider}/{previous.model}</span>
                      <code>{previous.status ?? previous.code}</code>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className={css.hint}>{t(hintKey(record.category))}</p>
            <p className={css.privacy}>{t('privacy')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export type ErrorLensDockProps = import('@deepseek-ai/dsh-client-ui-slots').PropsRuntime<'conversation.input.dock'> & PropsLocale<'error-lens'>

export function ErrorLensDock({ useProjection, t }: ErrorLensDockProps) {
  return <ErrorLens diagnostics={useProjection('error-lens')} t={t} />
}
