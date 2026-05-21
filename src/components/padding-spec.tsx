'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type PaddingSpecProps = {
  /** Texto da medida, ex: "16px 24px" ou "padding: 12px". */
  label: string
  /** Lado onde o ticker aparece. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Filhos receberão um wrapper que mantém o spacing visual. */
  children: ReactNode
  /** Mostrar tick caps fininhos pra fechar a medida. */
  showTicks?: boolean
  className?: string
}

/**
 * Wrapper que sobrepõe label de spec ao elemento — padding / dimensões / gap.
 * Não muda o layout: só sobrepõe info técnica via absolute + tick mono.
 */
export function PaddingSpec({
  label,
  side = 'top',
  children,
  showTicks = true,
  className,
}: PaddingSpecProps) {
  const { on } = useBlueprint()

  const sidePos: Record<NonNullable<PaddingSpecProps['side']>, string> = {
    top: '-top-5 left-1/2 -translate-x-1/2',
    bottom: '-bottom-5 left-1/2 -translate-x-1/2',
    left: '-left-2 top-1/2 -translate-x-full -translate-y-1/2',
    right: '-right-2 top-1/2 translate-x-full -translate-y-1/2',
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      <span
        aria-hidden={!on}
        className={cn(
          'pointer-events-none absolute z-10 inline-flex items-center gap-1 whitespace-nowrap',
          'mono text-[var(--pencil-mid)]',
          'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
          on ? 'opacity-100' : 'opacity-0',
          sidePos[side],
        )}
        style={{ fontSize: '10px', letterSpacing: '0.06em' }}
      >
        {showTicks ? <Tick /> : null}
        {label}
        {showTicks ? <Tick /> : null}
      </span>
    </div>
  )
}

function Tick() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" aria-hidden>
      <path d="M 3 0 L 3 8" stroke="var(--pencil-light)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
