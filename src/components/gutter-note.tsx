'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type ArrowVariant = 'shallow' | 'deep' | 's' | 'arc'

const ARROW_PATHS: Record<ArrowVariant, string> = {
  shallow: 'M 5 25 C 30 18, 60 30, 95 25',
  deep:    'M 5 25 C 35 -8, 65 60, 95 25',
  s:       'M 5 25 C 30 5, 70 45, 95 25',
  arc:     'M 5 25 C 30 -22, 70 -8, 95 25',
}
const ARROWHEAD = 'M 88 19 L 96 25 L 88 31'

type GutterNoteProps = {
  /** Texto handwritten — confissão, opinião, dúvida. Nunca lei nomeada. */
  note: string
  /** De que lado a seta SAI da anotação e aponta o alvo. Default 'left' (anotação no gutter direito, seta sai pra esquerda em direção ao alvo). */
  arrowSide?: 'left' | 'right'
  /** Curva da seta. */
  arrow?: ArrowVariant
  /** Inclinação do texto (graus). */
  textRotation?: number
  /** Largura do SVG da seta. */
  arrowLength?: number
  /** Altura do SVG da seta. */
  arrowHeight?: number
  /** Posição vertical da seta no bloco. Default middle. */
  arrowAt?: 'top' | 'middle' | 'bottom'
  /** Delay da entrada (segundos). */
  delay?: number
  /** Max width do texto. */
  textWidth?: number
  className?: string
}

/**
 * Anotação handwritten do gutter — texto Architects Daughter + seta SVG
 * bezier apontando o alvo. O componente assume que vive dentro de um
 * `<aside>` posicionado em coluna paralela ao conteúdo (grid).
 *
 * Respeita blueprint toggle e prefers-reduced-motion.
 * Esconde abaixo de md (gutter não existe em mobile).
 */
export function GutterNote({
  note,
  arrowSide = 'left',
  arrow = 'shallow',
  textRotation = -3,
  arrowLength = 160,
  arrowHeight = 60,
  arrowAt = 'middle',
  delay = 0,
  textWidth = 200,
  className,
}: GutterNoteProps) {
  const { on } = useBlueprint()
  const reduced = useReducedMotion() ?? false

  // arrowSide='left' significa: seta sai pra esquerda. Path natural aponta direita;
  // pra apontar esquerda, flipamos com -scale-x-100.
  const flip = arrowSide === 'left'
  const path = ARROW_PATHS[arrow]

  const verticalClass =
    arrowAt === 'top'
      ? 'top-0'
      : arrowAt === 'bottom'
        ? 'bottom-0'
        : 'top-1/2 -translate-y-1/2'

  const arrowPositionClass =
    arrowSide === 'left'
      ? 'right-full mr-2'
      : 'left-full ml-2'

  return (
    <div
      aria-hidden={!on}
      className={cn(
        'pointer-events-none relative hidden md:block',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <svg
        aria-hidden
        className={cn('absolute', verticalClass, arrowPositionClass, flip && '-scale-x-100')}
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
              transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.3, delay: delay + 0.6, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-60px' }}
            />
          </>
        )}
      </svg>

      {reduced ? (
        <span
          className="hand block text-[var(--pencil)]"
          style={{
            fontSize: 'clamp(16px, 1.4vw, 19px)',
            lineHeight: 1.3,
            transform: `rotate(${textRotation}deg)`,
            transformOrigin: arrowSide === 'left' ? 'left top' : 'right top',
            maxWidth: textWidth,
          }}
        >
          {note}
        </span>
      ) : (
        <motion.span
          className="hand block text-[var(--pencil)]"
          style={{
            fontSize: 'clamp(16px, 1.4vw, 19px)',
            lineHeight: 1.3,
            transformOrigin: arrowSide === 'left' ? 'left top' : 'right top',
            maxWidth: textWidth,
          }}
          initial={{ opacity: 0, y: 6, rotate: textRotation }}
          whileInView={{ opacity: 1, y: 0, rotate: textRotation }}
          transition={{ duration: 0.5, delay: delay + 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          {note}
        </motion.span>
      )}
    </div>
  )
}
