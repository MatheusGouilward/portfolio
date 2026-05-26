'use client'

import { useEffect, type RefObject } from 'react'

/**
 * useScrollConstruction — hook que orquestra as 6 camadas da construção em
 * camadas (CLAUDE.md §23) numa única ScrollTrigger timeline por seção.
 *
 * Cada seção marca elementos com `data-construct="heading|body|handnote"`
 * (zero acoplamento — o hook lê do DOM). Pass 1+2 cobre camadas 3, 4, 6.
 * Pass 3 (grid/frame/arrows) é pós-launch.
 *
 * - prefers-reduced-motion → hook NÃO inicializa, conteúdo fica em estado
 *   final imediato (DOM puro, sem split).
 * - GSAP + SplitText via dynamic import → bundle inicial preservado.
 * - `split.revert()` no cleanup → DOM original restaurado sem `clearProps`
 *   (que clobbaria transforms externos como rotate da HandNote).
 *
 * Refs: TASKS.md #39, CLAUDE.md §23.
 */
type ConstructionOptions = {
  enabled?: boolean
  layers?: Partial<{
    heading: boolean
    body: boolean
    handnote: boolean
    grid: boolean
    frame: boolean
    arrows: boolean
  }>
  start?: string
  end?: string
  scrub?: number
}

export function useScrollConstruction(
  sectionRef: RefObject<HTMLElement | null>,
  opts: ConstructionOptions = {},
) {
  // Stringify opts pra evitar rerun do effect a cada render do consumer
  // (opts é objeto inline; identidade muda mesmo com mesmo conteúdo).
  const optsKey = JSON.stringify(opts)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (opts.enabled === false) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = sectionRef.current
    if (!section) return

    let cancelled = false
    let kill: (() => void) | null = null

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger, SplitText)

      const layers = {
        heading: true,
        body: true,
        handnote: true,
        grid: false,
        frame: false,
        arrows: false,
        ...opts.layers,
      }

      const splits: Array<{ revert: () => void }> = []
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: opts.start ?? 'top 85%',
          end: opts.end ?? 'top 20%',
          scrub: opts.scrub ?? 0.5,
        },
      })

      // CAMADA 3 — headings word-by-word ink-settle
      if (layers.heading) {
        const headings = section.querySelectorAll<HTMLElement>(
          '[data-construct="heading"]',
        )
        headings.forEach((h) => {
          const split = new SplitText(h, { type: 'words', wordsClass: 'sc-word' })
          splits.push(split)
          gsap.set(split.words, {
            opacity: 0,
            y: 12,
            filter: 'blur(4px)',
            scale: 0.94,
            rotation: () => gsap.utils.random(-1.5, 1.5),
            transformOrigin: 'center bottom',
            display: 'inline-block',
            willChange: 'transform, opacity, filter',
          })
          tl.to(
            split.words,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              rotation: 0,
              ease: 'power3.out',
              duration: 0.5,
              stagger: { each: 0.06, from: 'start' },
            },
            0.1,
          )
        })
      }

      // CAMADA 4 — body content line-by-line via clip-path
      if (layers.body) {
        const bodies = section.querySelectorAll<HTMLElement>(
          '[data-construct="body"]',
        )
        bodies.forEach((b) => {
          const split = new SplitText(b, { type: 'lines', linesClass: 'sc-line' })
          splits.push(split)
          gsap.set(split.lines, {
            clipPath: 'inset(0 0 100% 0)',
            willChange: 'clip-path',
          })
          tl.to(
            split.lines,
            {
              clipPath: 'inset(0 0 0% 0)',
              ease: 'power2.out',
              duration: 0.5,
              stagger: 0.08,
            },
            0.3,
          )
        })
      }

      // CAMADA 6 — HandNotes char-by-char ink-settle
      if (layers.handnote) {
        const notes = section.querySelectorAll<HTMLElement>(
          '[data-construct="handnote"]',
        )
        notes.forEach((n) => {
          const split = new SplitText(n, {
            type: 'chars,words',
            charsClass: 'sc-char',
          })
          splits.push(split)
          gsap.set(split.chars, {
            opacity: 0,
            y: 6,
            filter: 'blur(3px)',
            scale: 0.88,
            rotation: () => gsap.utils.random(-3, 3),
            transformOrigin: 'center bottom',
            display: 'inline-block',
            willChange: 'transform, opacity, filter',
          })
          tl.to(
            split.chars,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              rotation: 0,
              ease: 'power2.out',
              duration: 0.4,
              stagger: { each: 0.025, from: 'start' },
            },
            0.6,
          )
        })
      }

      // CAMADAS 1, 2, 5 (grid, frame, arrows) — Pass 3 pós-launch.
      // Data-attrs pra essas ficam ignorados até implementar.

      kill = () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        splits.forEach((s) => s.revert())
      }
    })

    return () => {
      cancelled = true
      kill?.()
    }
    // optsKey serializa opts; sectionRef.current é estável após mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef, optsKey])
}
