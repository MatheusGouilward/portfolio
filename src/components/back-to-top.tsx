'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

/**
 * Botão "voltar ao topo" — sticky bottom-left, aparece após ~80% do viewport rolado.
 *
 * Demonstra três leis simultaneamente quando blueprint mode é ON:
 * - Nielsen #3 (User Control & Freedom) — saída clara, sem dead-end
 * - Goal-Gradient — mostra progresso de scroll (preenchimento do bracket)
 * - Lei de Fitts — alvo 44×44 fixo, distância previsível
 *
 * Comportamento:
 * - Esconde no topo (scrollY < window.innerHeight * 0.8)
 * - Tracking de progresso pra preencher visualmente
 * - Smooth scroll, respeita prefers-reduced-motion
 */
export function BackToTop() {
  const { on } = useBlueprint()
  const reduced = useReducedMotion() ?? false
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scroll = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const threshold = window.innerHeight * 0.8
      setVisible(scroll > threshold)
      setProgress(docHeight > 0 ? Math.min(scroll / docHeight, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function backToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="bttop"
          className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {on ? (
            <span
              className="mono-upper text-[var(--pencil-mid)]"
              aria-hidden
            >
              voltar ao topo
            </span>
          ) : null}
          <button
            type="button"
            onClick={backToTop}
            aria-label="Voltar ao topo da página"
            className={cn(
              'group inline-flex h-11 w-11 items-center justify-center',
              'border border-[var(--line-strong)]',
              'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
              'hover:bg-[var(--paper-2)]',
            )}
            style={{ background: 'var(--paper)', borderRadius: '2px' }}
          >
            <span className="relative inline-flex h-6 w-6 items-center justify-center">
              {/* Progress fill — sobe conforme scroll */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: 'var(--paper-2)',
                  clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`,
                }}
              />
              {/* Up-bracket SVG */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
                className="relative"
              >
                <path
                  d="M 4 11 L 9 5 L 14 11"
                  stroke="var(--pencil-darkest)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 9 5 L 9 14"
                  stroke="var(--pencil-darkest)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100"
                />
              </svg>
            </span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
