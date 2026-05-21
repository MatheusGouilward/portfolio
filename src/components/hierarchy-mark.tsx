'use client'

import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type Level = 'primary' | 'secondary' | 'tertiary'

const LEVEL_LABEL: Record<Level, string> = {
  primary: 'PRIMARY FOCUS',
  secondary: 'SECONDARY',
  tertiary: 'TERTIARY',
}

const LEVEL_THICKNESS: Record<Level, number> = {
  primary: 2.4,
  secondary: 1.6,
  tertiary: 1.2,
}

type HierarchyMarkProps = {
  level: Level
  /** Texto opcional substituindo o label padrão. */
  label?: string
  /** Comprimento do bracket em px. Default 56. */
  size?: number
  /** Classe wrapper pra posicionamento. */
  className?: string
}

/**
 * Marcador de hierarquia — bracket SVG L-shaped + label mono.
 * "PRIMARY FOCUS" reservado pra 1 destaque por viewport (regra §3 do CLAUDE.md).
 */
export function HierarchyMark({
  level,
  label,
  size = 56,
  className,
}: HierarchyMarkProps) {
  const { on } = useBlueprint()
  const stroke = level === 'primary' ? 'var(--pencil-darkest)' : 'var(--pencil-mid)'
  const thickness = LEVEL_THICKNESS[level]

  return (
    <div
      aria-hidden={!on}
      className={cn(
        'pointer-events-none absolute z-10 flex items-start gap-2',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
        {/* L-bracket invertido — canto superior-esquerdo do alvo */}
        <path
          d={`M 2 ${size - 2} L 2 2 L ${size - 2} 2`}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          'mono-upper translate-y-1',
          level === 'primary' ? 'text-[var(--pencil-darkest)]' : 'text-[var(--pencil-mid)]',
        )}
        style={{ fontWeight: 600 }}
      >
        {label ?? LEVEL_LABEL[level]}
      </span>
    </div>
  )
}
