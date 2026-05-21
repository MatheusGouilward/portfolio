'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type ArrowVariant = 'shallow' | 'deep' | 's' | 'arc'
type Side = 'right' | 'left'
type Anchor = 'top' | 'middle' | 'bottom'

const ARROW_PATHS: Record<ArrowVariant, string> = {
  shallow: 'M 5 25 C 30 18, 60 30, 95 25',
  deep:    'M 5 25 C 35 -8, 65 60, 95 25',
  s:       'M 5 25 C 30 5, 70 45, 95 25',
  arc:     'M 5 25 C 30 -22, 70 -8, 95 25',
}

const ARROWHEAD = 'M 88 19 L 96 25 L 88 31'

type AnnotatedProps = {
  /** Texto handwritten — confissão, dúvida, opinião. Nunca lei nomeada. */
  note: string
  /** Lado da anotação relativo ao alvo. Default right. */
  side?: Side
  /** Ponto vertical do alvo onde a seta toca. Default top. */
  anchor?: Anchor
  /** Variante de curva bezier. Default shallow. */
  arrow?: ArrowVariant
  /** Inclinação do texto em graus. Default -3. */
  textRotation?: number
  /** Largura do SVG da seta em px. Default 140. */
  arrowLength?: number
  /** Altura do SVG da seta em px. Default 50. */
  arrowHeight?: number
  /** Ajuste fino vertical da anotação relativo ao anchor. */
  offsetY?: number
  /** Distância horizontal entre o alvo e a anotação. Default 16. */
  offsetX?: number
  /** Atraso da animação de desenho, em segundos. Default 0. */
  delay?: number
  /** max-width do texto em px. Default 180. */
  textWidth?: number
  className?: string
  children: ReactNode
}

/**
 * Annotated — wrappa um elemento e posiciona uma anotação handwritten
 * com seta SVG que APONTA EXATO o alvo. Mira é determinística
 * porque a anotação é absolute-positioned no mesmo sistema de coords do alvo.
 *
 * Em mobile (<md) a anotação some — o alvo continua intacto.
 */
export function Annotated({
  note,
  side = 'right',
  anchor = 'top',
  arrow = 'shallow',
  textRotation = -3,
  arrowLength = 140,
  arrowHeight = 50,
  offsetY = 0,
  offsetX = 16,
  delay = 0,
  textWidth = 180,
  className,
  children,
}: AnnotatedProps) {
  const { on } = useBlueprint()
  const reduced = useReducedMotion() ?? false

  const anchorPercent = anchor === 'top' ? 0 : anchor === 'middle' ? 50 : 100

  // Path "natural" (start esquerda, end direita) aponta pra direita.
  // Quando side=right, a anotação está à direita do alvo e a seta deve apontar
  // PRO ALVO (esquerda) — flipamos.
  const flip = side === 'right'
  const path = ARROW_PATHS[arrow]
  const totalWidth = arrowLength + 8 + textWidth

  const positionStyle: CSSProperties =
    side === 'right'
      ? { left: `calc(100% + ${offsetX}px)`, top: `calc(${anchorPercent}% + ${offsetY}px)` }
      : { right: `calc(100% + ${offsetX}px)`, top: `calc(${anchorPercent}% + ${offsetY}px)` }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div
        aria-hidden={!on}
        className="pointer-events-none absolute hidden md:block"
        style={{
          opacity: on ? 1 : 0,
          transition: 'opacity var(--duration-base) var(--ease-out-quart)',
          ...positionStyle,
          width: totalWidth,
          height: arrowHeight + 30,
        }}
      >
        <svg
          aria-hidden
          className={cn('absolute top-0', flip && '-scale-x-100')}
          style={{ left: side === 'right' ? 0 : textWidth + 8 }}
          width={arrowLength}
          height={arrowHeight}
          viewBox="0 0 100 50"
          fill="none"
          preserveAspectRatio="none"
        >
          {reduced ? (
            <>
              <path
                d={path}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={ARROWHEAD}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : (
            <>
              <motion.path
                d={path}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-60px' }}
              />
              <motion.path
                d={ARROWHEAD}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.55, ease: 'easeOut' }}
                viewport={{ once: true, margin: '-60px' }}
              />
            </>
          )}
        </svg>

        {reduced ? (
          <span
            className="hand absolute block text-[var(--pencil)]"
            style={{
              left: side === 'right' ? arrowLength + 8 : 0,
              top: 0,
              width: textWidth,
              fontSize: 'clamp(16px, 1.5vw, 19px)',
              lineHeight: 1.3,
              transform: `rotate(${textRotation}deg)`,
              transformOrigin: side === 'right' ? 'left top' : 'right top',
            }}
          >
            {note}
          </span>
        ) : (
          <motion.span
            className="hand absolute block text-[var(--pencil)]"
            style={{
              left: side === 'right' ? arrowLength + 8 : 0,
              top: 0,
              width: textWidth,
              fontSize: 'clamp(16px, 1.5vw, 19px)',
              lineHeight: 1.3,
              transformOrigin: side === 'right' ? 'left top' : 'right top',
            }}
            initial={{ opacity: 0, y: 6, rotate: textRotation }}
            whileInView={{ opacity: 1, y: 0, rotate: textRotation }}
            transition={{ duration: 0.5, delay: delay + 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-60px' }}
          >
            {note}
          </motion.span>
        )}
      </div>
    </div>
  )
}
