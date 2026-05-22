'use client'

import { useEffect } from 'react'

/**
 * ScrollProvider — integra Lenis (smooth scroll) com GSAP ScrollTrigger.
 *
 * - Lazy load via `import()` dinâmico: 0 bytes no bundle inicial; carrega
 *   só após hidratação. Mantém Lighthouse intacto.
 * - `prefers-reduced-motion` desliga TUDO (smooth scroll + ScrollTrigger).
 * - Integra Lenis ↔ ScrollTrigger: Lenis dirige o scroll, ScrollTrigger
 *   consulta a posição via ticker do GSAP.
 *
 * Coexiste com Motion (motion/react). Convenção:
 * - Motion: entrada de componente, hover, micro-interações
 * - GSAP + ScrollTrigger: scroll-locked, scrub, pin, timeline complexa
 */
export function ScrollProvider() {
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void; on: (e: string, cb: () => void) => void } | null = null
    let tickerFn: ((time: number) => void) | null = null
    let cancelled = false

    async function init() {
      if (typeof window === 'undefined') return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.15,
        // ease-out-expo — casa com `--ease-out-expo` do CSS pra coerência
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }) as typeof lenis

      lenis?.on('scroll', ScrollTrigger.update)

      tickerFn = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      cancelled = true
      lenis?.destroy()
      if (tickerFn) {
        // Import dinâmico do gsap pra remover o ticker sem manter referência hard
        import('gsap').then(({ gsap }) => {
          if (tickerFn) gsap.ticker.remove(tickerFn)
        })
      }
    }
  }, [])

  return null
}
