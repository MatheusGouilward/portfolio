'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { pencilVar, type PencilTone } from '@/lib/tokens'
import { useBlueprint } from './blueprint-provider'

type ArrowVariant = 'curve-shallow' | 'curve-deep' | 'curve-s' | 'curve-arc' | 'wobble'

const ARROW_PATHS: Record<ArrowVariant, string> = {
  // ViewBox 220x140; start ≈ (10,20), end ≈ (200,110). End aponta pro alvo.
  'curve-shallow': 'M 12 26 C 70 30, 130 55, 196 104',
  'curve-deep':    'M 12 26 C 30 90, 80 120, 196 104',
  'curve-s':       'M 12 26 C 110 22, 60 110, 196 104',
  'curve-arc':     'M 12 26 C 110 -10, 240 40, 196 104',
  'wobble':        'M 12 26 C 50 38, 90 18, 120 50 S 170 90, 196 104',
}

// Two short open strokes — manual feel. Same shape for most variants.
const DEFAULT_ARROWHEAD = 'M 190 95 L 198 106 L 187 110'
const ARROWHEAD_OVERRIDES: Partial<Record<ArrowVariant, string>> = {
  'curve-arc': 'M 188 96 L 198 106 L 188 112',
}
function getArrowhead(v: ArrowVariant): string {
  return ARROWHEAD_OVERRIDES[v] ?? DEFAULT_ARROWHEAD
}

type AnnotationProps = {
  text: string
  arrow?: ArrowVariant
  /** Leve inclinação orgânica. Default -3deg. */
  rotation?: number
  /** Lado da seta em relação ao texto. */
  side?: 'left' | 'right'
  /** Tom da escala pencil. Default 'pencil'. */
  tone?: PencilTone
  width?: number
  height?: number
  className?: string
  children?: ReactNode
}

/**
 * Callout — SVG bezier + texto handwritten apontando um elemento.
 * Aparece com blueprint ON. Faz draw-in via pathLength (reduced-motion → estático).
 */
export function Annotation({
  text,
  arrow = 'curve-shallow',
  rotation = -3,
  side = 'left',
  tone = 'pencil',
  width = 220,
  height = 140,
  className,
  children,
}: AnnotationProps) {
  const { on } = useBlueprint()
  // SSR-safe: null on first paint → false (animate). Re-renders to static
  // after hydration if user has prefers-reduced-motion.
  const reduced = useReducedMotion() ?? false

  const stroke = pencilVar(tone)
  const path = ARROW_PATHS[arrow]
  const head = getArrowhead(arrow)

  return (
    <div
      aria-hidden={!on}
      data-side={side}
      className={cn(
        'pointer-events-none absolute z-10 select-none',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative" style={{ width, height }}>
        <svg
          viewBox="0 0 220 140"
          width={width}
          height={height}
          fill="none"
          className={cn(
            'absolute inset-0',
            side === 'right' && '-scale-x-100',
          )}
          aria-hidden
        >
          {reduced ? (
            <>
              <path d={path} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
              <path d={head} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <motion.path
                d={path}
                stroke={stroke}
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-40px' }}
                aria-hidden
                fill="none"
              />
              <motion.path
                d={head}
                stroke={stroke}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55, ease: 'easeOut' }}
                viewport={{ once: true, margin: '-40px' }}
                aria-hidden
                fill="none"
              />
            </>
          )}
        </svg>

        <span
          className={cn(
            'hand absolute',
            side === 'left' ? 'left-0 top-0 -translate-y-2' : 'right-0 top-0 -translate-y-2',
          )}
          style={{ color: stroke, maxWidth: width - 30, fontSize: '18px' }}
        >
          {text}
          {children ? <span className="mt-1 block">{children}</span> : null}
        </span>
      </div>
    </div>
  )
}
