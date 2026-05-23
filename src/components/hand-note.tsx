'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type HandNoteProps = {
  /** Texto handwritten. Voz humana, sem nomear lei. Use `\n` pra quebra explícita. */
  note: string
  /** Inclinação em graus. Default -3. */
  rotation?: number
  /** Delay da entrada (segundos) — ignorado quando scrub=true. */
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
   * Modo scroll-scrub: opacity + y atrelados ao progress da seção pai.
   * Reverte se rolar pra cima. Quando false (default), usa Motion whileInView
   * once:true. prefers-reduced-motion ignora scrub e renderiza estado final.
   * Spec §22.4 do TASKS.md.
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
  scrub = false,
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

  // BRANCH 1 — scrub mode (GSAP ScrollTrigger)
  if (scrub && !reduced) {
    return (
      <HandNoteScrub
        rotation={rotation}
        baseStyle={baseStyle}
        baseClassName={cn(
          'hand text-[var(--pencil)]',
          inlineBlockClass,
          className,
        )}
        on={on}
      >
        {content}
      </HandNoteScrub>
    )
  }

  // BRANCH 2 — reduced motion (estado final imediato, sem animação)
  const baseClassName = cn(
    'hand text-[var(--pencil)]',
    inlineBlockClass,
    'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
    on ? 'opacity-100' : 'opacity-0',
    className,
  )

  if (reduced) {
    return (
      <span
        aria-hidden={!on}
        className={baseClassName}
        style={{ ...baseStyle, transform: `rotate(${rotation}deg)` }}
      >
        {content}
      </span>
    )
  }

  // BRANCH 3 — default (Motion whileInView once:true)
  return (
    <motion.span
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

/**
 * Scrub variant — GSAP ScrollTrigger atrela opacity + y ao progress da
 * section pai (closest('section') ou parentElement). Reverte se rolar pra cima.
 *
 * Blueprint toggle aqui controla `visibility` (snap) em vez de opacity, pra
 * não brigar com o GSAP que está animando opacity.
 */
function HandNoteScrub({
  rotation,
  baseStyle,
  baseClassName,
  on,
  children,
}: {
  rotation: number
  baseStyle: CSSProperties
  baseClassName: string
  on: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return
    const trigger = el.closest('section') ?? el.parentElement
    if (!trigger) return

    let cancelled = false
    let killAll: (() => void) | null = null

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !el) return
        gsap.registerPlugin(ScrollTrigger)

        gsap.set(el, { opacity: 0, y: 12 })

        const tween = gsap.to(el, {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
          },
        })

        killAll = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(el, { clearProps: 'opacity,y' })
        }
      },
    )

    return () => {
      cancelled = true
      killAll?.()
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden={!on}
      className={baseClassName}
      style={{
        ...baseStyle,
        transform: `rotate(${rotation}deg)`,
        visibility: on ? 'visible' : 'hidden',
      }}
    >
      {children}
    </span>
  )
}
