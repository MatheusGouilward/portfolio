'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { pencilVar, type PencilTone } from '@/lib/tokens'
import { useBlueprint } from './blueprint-provider'

type Variant = 'shallow' | 'deep' | 's' | 'arc'

type GutterArrowProps = {
  /** Direção da ponta — pra onde a seta APONTA. */
  direction: 'left' | 'right'
  /** Comprimento da seta em px (largura do SVG). Default 220. */
  length?: number
  /** Altura do bloco da seta. Default 60. */
  height?: number
  /** Tipo de curva. */
  variant?: Variant
  /** Tom da seta. */
  tone?: PencilTone
  /** Posicionamento — Tailwind class string. Aplicada ao wrapper absolute. */
  className?: string
}

/**
 * Seta SVG bezier independente — conecta um ponto inicial (no gutter da anotação)
 * a um ponto final (no conteúdo principal).
 *
 * O SVG é desenhado pra `direction='right'` (start esquerda, end direita).
 * Quando `direction='left'`, aplica `-scale-x-100`.
 *
 * `pointer-events-none` — nunca bloqueia interação.
 * Anima `pathLength` na entrada (whileInView) salvo prefers-reduced-motion.
 */
export function GutterArrow({
  direction,
  length = 220,
  height = 60,
  variant = 'shallow',
  tone = 'pencil',
  className,
}: GutterArrowProps) {
  const { on } = useBlueprint()
  const reduced = useReducedMotion() ?? false

  // ViewBox length x height. Start ≈ (10, 14). End ≈ (length-14, height-12).
  const startX = 10
  const startY = 14
  const endX = length - 14
  const endY = height - 12

  const paths: Record<Variant, string> = {
    shallow: `M ${startX} ${startY} C ${length * 0.35} ${startY + 6}, ${length * 0.65} ${endY - 6}, ${endX} ${endY}`,
    deep:    `M ${startX} ${startY} C ${length * 0.2} ${endY + 12}, ${length * 0.55} ${endY + 4}, ${endX} ${endY}`,
    s:       `M ${startX} ${startY} C ${length * 0.5} ${startY - 8}, ${length * 0.35} ${endY + 8}, ${endX} ${endY}`,
    arc:     `M ${startX} ${startY} C ${length * 0.45} ${startY - 24}, ${length * 0.85} ${startY + 4}, ${endX} ${endY}`,
  }

  // Arrowhead — 2 traços abertos, look manual.
  const arrowhead = `M ${endX - 8} ${endY - 6} L ${endX + 2} ${endY + 2} L ${endX - 7} ${endY + 6}`

  const stroke = pencilVar(tone)
  const path = paths[variant]

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-10',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ width: length, height }}
    >
      <svg
        viewBox={`0 0 ${length} ${height}`}
        width={length}
        height={height}
        fill="none"
        className={cn('absolute inset-0', direction === 'left' && '-scale-x-100')}
        aria-hidden
      >
        {reduced ? (
          <>
            <path d={path} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path
              d={arrowhead}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <motion.path
              d={path}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-40px' }}
            />
            <motion.path
              d={arrowhead}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.55, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-40px' }}
            />
          </>
        )}
      </svg>
    </div>
  )
}
