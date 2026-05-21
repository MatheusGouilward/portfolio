'use client'

import { cn } from '@/lib/utils'
import { pencilVar, type PencilTone } from '@/lib/tokens'
import { useBlueprint } from './blueprint-provider'

type DimensionLineProps = {
  /** Eixo da medida. */
  axis?: 'x' | 'y'
  /** Label no centro da linha (ex: "120px · hero margin"). */
  label: string
  /** Tamanho do bloco em px (length da linha). Default 120. */
  length?: number
  /** Classe wrapper (posicionamento via classes utilitárias). */
  className?: string
  /** Tom do lápis. */
  tone?: PencilTone
}

/**
 * Linha de medida com tick caps nas pontas + label mono central.
 * Não anima — já estática (estilo blueprint técnico).
 */
export function DimensionLine({
  axis = 'x',
  label,
  length = 120,
  className,
  tone = 'pencil-mid',
}: DimensionLineProps) {
  const { on } = useBlueprint()
  const stroke = pencilVar(tone)
  // Label sempre em pencil-mid (5.8:1) — passa AA pra texto pequeno.
  const labelColor = pencilVar('pencil-mid')

  if (axis === 'x') {
    return (
      <div
        aria-hidden={!on}
        className={cn(
          'pointer-events-none absolute z-10 flex flex-col items-center',
          'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
          on ? 'opacity-100' : 'opacity-0',
          className,
        )}
        style={{ width: length }}
      >
        <svg width={length} height={14} viewBox={`0 0 ${length} 14`} fill="none" aria-hidden>
          {/* tick caps */}
          <path d={`M 1 2 L 1 12`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d={`M ${length - 1} 2 L ${length - 1} 12`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          {/* dashed line */}
          <path
            d={`M 2 7 L ${length - 2} 7`}
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
        </svg>
        <span
          className="mono mt-1"
          style={{ fontSize: '12px', letterSpacing: '0.08em', color: labelColor }}
        >
          {label}
        </span>
      </div>
    )
  }

  // y axis
  return (
    <div
      aria-hidden={!on}
      className={cn(
        'pointer-events-none absolute z-10 flex flex-row items-center',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ height: length }}
    >
      <svg width={14} height={length} viewBox={`0 0 14 ${length}`} fill="none" aria-hidden>
        <path d={`M 2 1 L 12 1`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <path d={`M 2 ${length - 1} L 12 ${length - 1}`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <path
          d={`M 7 2 L 7 ${length - 2}`}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />
      </svg>
      <span
        className="mono ml-1 [writing-mode:vertical-rl]"
        style={{ fontSize: '12px', letterSpacing: '0.08em', color: labelColor }}
      >
        {label}
      </span>
    </div>
  )
}
