'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Contextual cursor — sutil, não invasivo.
 *
 * Comportamento:
 * - Default: ponto pequeno + outline maior que segue cursor real (lag físico).
 * - Sobre interativo (link/button): ring expande, aumenta presença.
 * - Sobre texto editável (input/textarea): some.
 * - Hidden em touch devices e prefers-reduced-motion.
 *
 * Não substitui o cursor padrão — coexiste. Cursor padrão fica sutil
 * (usado pra acessibilidade); nosso aparece como camada visual extra.
 */
export function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<'default' | 'interactive' | 'hidden'>('default')

  useEffect(() => {
    // Só ativa em pointer:fine + sem reduced motion
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!supportsFinePointer || reducedMotion) return
    setEnabled(true)

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    // Posição alvo (mouse real) e posição interpolada (com lag)
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let rafId = 0

    function loop() {
      // Easing simples — lag físico
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      if (outer) {
        outer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }
      if (inner) {
        inner.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      }
      rafId = requestAnimationFrame(loop)
    }

    function handleMove(e: PointerEvent) {
      targetX = e.clientX
      targetY = e.clientY
    }

    function handleOver(e: PointerEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      // Hidden sobre input
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setVariant('hidden')
        return
      }
      // Interactive sobre link/button/role-button
      if (target.closest('a, button, [role="button"], [role="tab"], summary')) {
        setVariant('interactive')
        return
      }
      setVariant('default')
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={outerRef}
        aria-hidden
        className={[
          'pointer-events-none fixed left-0 top-0 z-[60]',
          '-translate-x-1/2 -translate-y-1/2',
          'rounded-full border transition-[width,height,border-color,opacity] duration-200 ease-[var(--ease-out-quart)]',
          variant === 'hidden' ? 'h-0 w-0 opacity-0' : '',
          variant === 'interactive'
            ? 'h-12 w-12 border-accent opacity-100'
            : variant === 'default'
              ? 'h-8 w-8 border-foreground/40 opacity-100'
              : '',
        ].join(' ')}
        style={{ willChange: 'transform' }}
      />
      <div
        ref={innerRef}
        aria-hidden
        className={[
          'pointer-events-none fixed left-0 top-0 z-[60]',
          '-translate-x-1/2 -translate-y-1/2',
          'h-1 w-1 rounded-full transition-[background-color,opacity] duration-150',
          variant === 'hidden'
            ? 'opacity-0'
            : variant === 'interactive'
              ? 'bg-accent opacity-100'
              : 'bg-foreground opacity-100',
        ].join(' ')}
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
