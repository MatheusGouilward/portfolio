'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { site } from '@/lib/site'
import { useBlueprint } from './blueprint-provider'

const STRIKE_PATH = 'M 1 5 Q 25 3.4, 50 5 T 99 5'

/**
 * Manifesto — H1 monumental + riscada handwritten.
 *
 * Animação word-by-word do h1 agora vem do hook `useScrollConstruction`
 * (via `data-construct="heading"`) — não mais via Motion local. Mantém
 * apenas a riscada (Motion pathLength) + parallax assimétrico da riscada.
 *
 * Ref §23 CLAUDE.md, TASKS.md #39.
 */
export function Manifesto() {
  const reduced = useReducedMotion() ?? false
  const { on } = useBlueprint()
  const { previous } = site.manifestoMeta
  const heroRef = useRef<HTMLDivElement>(null)
  const riscadaRef = useRef<HTMLDivElement>(null)

  /**
   * Parallax assimétrico — a riscada se desloca y: -40px conforme scroll,
   * 30% mais devagar que o display monumental (scrub 0.5).
   * Trigger: closest('section') do heroRef pra pegar a altura total do hero.
   * Spec §22.4 Experimento B.
   */
  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    const riscada = riscadaRef.current
    const hero = heroRef.current?.closest('section') ?? heroRef.current
    if (!riscada || !hero) return

    let cancelled = false
    let killAll: (() => void) | null = null

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !riscada) return
        gsap.registerPlugin(ScrollTrigger)

        const tween = gsap.to(riscada, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })

        killAll = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(riscada, { clearProps: 'y' })
        }
      },
    )

    return () => {
      cancelled = true
      killAll?.()
    }
  }, [reduced])

  return (
    <div ref={heroRef}>
      {/* Rascunho riscado — versão genérica da indústria, rejeitada.
          Respeita o blueprint toggle. Faz parallax sutil no scroll. */}
      <div
        ref={riscadaRef}
        aria-hidden={!on}
        className="mb-4 transition-opacity sm:mb-6"
        style={{
          opacity: on ? 1 : 0,
          transitionDuration: 'var(--duration-base)',
          transitionTimingFunction: 'var(--ease-out-quart)',
        }}
      >
        <span className="relative inline-block max-w-full">
          <span
            className="hand text-[var(--pencil-mid)]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', opacity: 0.78 }}
          >
            {previous}
          </span>
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-0"
            style={{ top: '52%', transform: 'translateY(-50%)' }}
            width="100%"
            height="10"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            {reduced ? (
              <path
                d={STRIKE_PATH}
                stroke="var(--pencil)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <motion.path
                d={STRIKE_PATH}
                stroke="var(--pencil)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-40px' }}
              />
            )}
          </svg>
        </span>
      </div>

      {/* Manifesto monumental.
          Animação word-by-word vem do <ConstructionSection> via data-construct.
          O h1 fica como DOM puro pra preservar LCP — quando o hook inicializa,
          ele aplica SplitText e estado inicial. */}
      <h1
        data-construct="heading"
        aria-label={site.manifesto}
        className="display-monumental"
      >
        {site.manifesto}
      </h1>
    </div>
  )
}
