'use client'

import { motion, useReducedMotion } from 'motion/react'
import { HandNote } from './hand-note'

/**
 * HickGesture — círculo rascunhado envolvendo a frase "Pra trabalho, conversa
 * ou peer review", seta saindo pra esquerda e HandNote -9° na margem externa.
 *
 * Anti-padrão evitado: nomear lei UX em texto público. A voz humana
 * "três. nem dois, nem dez." comunica o conceito sem nomear.
 *
 * Aparece só em xl+ porque precisa de margem externa pra HandNote.
 *
 * Renderiza dentro de um wrapper `<div className="relative">` que envolve
 * o `<p>` cuja frase queremos circular.
 */
export function HickGesture() {
  const reduced = useReducedMotion() ?? false

  // Elipse cobre x=8 a x=514 horizontal (~510px de largura útil) e y=8 a y=62 vertical.
  // Em xl (font-medium ~24-26px), a frase "Pra trabalho, conversa ou peer review:"
  // ocupa ~460-510px — a elipse envolve com folga.
  const ellipsePath =
    'M 12 30 C 90 10, 220 6, 380 8 C 480 10, 522 22, 514 36 C 504 54, 380 62, 220 62 C 100 60, 16 52, 8 40 C 0 34, 2 32, 12 30 Z'
  // Seta sai do canto inferior-esquerdo da elipse e desce pra esquerda
  // até ancorar na HandNote (que vive em right: calc(100% + 100px)).
  const arrowPath = 'M 10 50 C -16 62, -50 78, -84 90'
  const arrowhead = 'M -74 82 L -84 90 L -74 96'

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute hidden xl:block"
        style={{
          top: '-14px',
          left: '-18px',
          width: '540px',
          height: '110px',
          overflow: 'visible',
        }}
      >
        <svg
          width="540"
          height="110"
          viewBox="-120 -10 680 130"
          fill="none"
          aria-hidden
          style={{ overflow: 'visible' }}
        >
          {reduced ? (
            <>
              <path
                d={ellipsePath}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d={arrowPath}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={arrowhead}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <motion.path
                d={ellipsePath}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-80px' }}
              />
              <motion.path
                d={arrowPath}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-80px' }}
              />
              <motion.path
                d={arrowhead}
                stroke="var(--pencil)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 1.4, ease: 'easeOut' }}
                viewport={{ once: true, margin: '-80px' }}
              />
            </>
          )}
        </svg>
      </div>

      {/* HandNote ancorada na ponta da seta. Top 76px alinha com end-y da seta (~90-14 offset). */}
      <div
        aria-hidden
        className="pointer-events-none absolute hidden xl:block"
        style={{
          top: '76px',
          right: 'calc(100% + 100px)',
        }}
      >
        <HandNote
          note={'três.\nnem dois, nem dez.'}
          rotation={-9}
          origin="right top"
          align="right"
          fontSize="16px"
        />
      </div>
    </>
  )
}
