import type { ReactElement } from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'

export type HostIconProps = {
  size?: number
  className?: string
  'aria-hidden'?: boolean | 'true'
}

type IconComponent = (props: HostIconProps) => ReactElement | null

const icons = primitives as unknown as Record<string, IconComponent | undefined>

function lookup(name: string): IconComponent | undefined {
  try {
    return icons[name]
  } catch {
    return undefined
  }
}

/**
 * Pick the Harness 0.2 icon, then the 0.1 name.
 * The primitives package stays external, so one client bundle can load on both hosts.
 */
export function hostIcon(modern: string, legacy: string): IconComponent {
  const Icon = lookup(modern) ?? lookup(legacy)
  if (Icon !== undefined) return Icon
  return function HostIconFallback() {
    return null
  }
}
