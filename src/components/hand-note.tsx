'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type HandNoteProps = {
  /** Texto handwritten. Voz humana, sem nomear lei. Use `\n` pra quebra explícita. */
  note: string
  /** Inclinação em graus. Default -3. */
  rotation?: number
  /** Delay da entrada (segundos). Aplicado apenas no modo Motion whileInView. */
  delay?: number
  /** Origem do transform — onde a rotação "ancora". */
  origin?: 'left top' | 'right top' | 'left bottom' | 'right bottom' | 'center'
  /** Tamanho da fonte. */
  fontSize?: string
  /** Largura máxima do bloco. Ignorado se noWrap=true ou se o note tem `\n`. */
  maxWidth?: number
  /** Alinhamento do texto dentro do bloco. */
  align?: 'left' | 'right' | 'center'
  /** Força 1 linha (white-space: nowrap + width: max-content). */
  noWrap?: boolean
  /**
   * @deprecated A partir do TASKS.md #39, a responsabilidade de animar HandNotes
   * no scroll vive no hook `useScrollConstruction` (CLAUDE.md §23). Marca o span
   * com `data-construct="handnote"` na section pai e o hook captura. A prop
   * `scrub` agora é ignorada — mantida por compat enquanto callers são
   * migrados.
   */
  scrub?: boolean
  className?: string
}

/**
 * Anotação handwritten solta, sem seta. Vive onde faz sentido em relação
 * ao conteúdo que comenta — geralmente próximo, com rotação orgânica.
 *
 * Quebra de linha: `\n` no note força quebra exata. Sem `\n` + sem noWrap,
 * usa maxWidth como limite e CSS auto-break.
 *
 * Sempre marca `data-construct="handnote"` no span — se a section pai
 * envolver com <ConstructionSection layers={{ handnote: true }}>, o hook
 * aplica ink-settle char-by-char no scroll. Caso contrário, o atributo
 * fica inerte (zero cost) e a entrada vem de Motion whileInView.
 */
export function HandNote({
  note,
  rotation = -3,
  delay = 0,
  origin = 'right top',
  fontSize = 'clamp(16px, 1.4vw, 19px)',
  maxWidth = 220,
  align = 'right',
  noWrap = false,
  className,
}: HandNoteProps) {
  const { on } = useBlueprint()
  const reduced = useReducedMotion() ?? false

  const hasExplicitBreaks = note.includes('\n')
  const lines = hasExplicitBreaks ? note.split('\n') : null

  const baseStyle: CSSProperties = noWrap
    ? {
        fontSize,
        lineHeight: 1.3,
        textAlign: align,
        transformOrigin: origin,
        whiteSpace: 'nowrap',
        width: 'max-content',
      }
    : hasExplicitBreaks
      ? {
          fontSize,
          lineHeight: 1.3,
          textAlign: align,
          transformOrigin: origin,
          width: 'max-content',
        }
      : {
          fontSize,
          lineHeight: 1.3,
          maxWidth,
          textAlign: align,
          transformOrigin: origin,
        }

  const isInlineBlock = noWrap || hasExplicitBreaks
  const inlineBlockClass = isInlineBlock ? 'inline-block' : 'block'

  const content: ReactNode = lines
    ? lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))
    : note

  const baseClassName = cn(
    'hand text-[var(--pencil)]',
    inlineBlockClass,
    'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
    on ? 'opacity-100' : 'opacity-0',
    className,
  )

  // BRANCH 1 — reduced motion (estado final imediato, sem animação)
  if (reduced) {
    return (
      <span
        data-construct="handnote"
        aria-hidden={!on}
        className={baseClassName}
        style={{ ...baseStyle, transform: `rotate(${rotation}deg)` }}
      >
        {content}
      </span>
    )
  }

  // BRANCH 2 — default (Motion whileInView once:true).
  // Quando a section pai tem <ConstructionSection layers.handnote>, o hook
  // toma controle via data-construct e o Motion whileInView fica dormente
  // (o hook aplica gsap.set no element imediatamente após mount).
  return (
    <motion.span
      data-construct="handnote"
      aria-hidden={!on}
      className={baseClassName}
      style={baseStyle}
      initial={{ y: 8, rotate: rotation }}
      whileInView={{ y: 0, rotate: rotation }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {content}
    </motion.span>
  )
}
