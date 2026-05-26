'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { site } from '@/lib/site'
import { useBlueprint } from './blueprint-provider'

const STRIKE_PATH = 'M 1 5 Q 25 3.4, 50 5 T 99 5'

/**
 * Manifesto — H1 monumental + riscada handwritten.
 *
 * Animação char-by-char com flip 3D no eixo X. Cada letra "cai de costas"
 * girando 180°, scaling de 0, com overshoot back. Inspirado em
 * gsap.com/demos/revert-after-animation. SplitText.revert() limpa o DOM
 * após complete (chars viram texto puro de novo).
 *
 * Trade-off LCP: h1 inicia com opacity 0 inline pra evitar pisca
 * (visível → invisível → animar). Texto fica oculto até GSAP carregar
 * via dynamic import (~300-500ms). Aceito por wow factor.
 *
 * Reduced motion: h1 renderiza visível imediato, sem split.
 */
export function Manifesto() {
  const reduced = useReducedMotion() ?? false
  const { on } = useBlueprint()
  const { previous } = site.manifestoMeta
  const heroRef = useRef<HTMLDivElement>(null)
  const riscadaRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  /**
   * Parallax assimétrico — a riscada se desloca y: -40px conforme scroll,
   * 30% mais devagar que o display monumental (scrub 0.5).
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

  /**
   * Manifesto com cursor terminal + typewriter:
   * 1. h1 abre invisível (CSS opacity 0)
   * 2. GSAP + SplitText carregam
   * 3. h1 vira visível → cursor aparece sozinho piscando (CSS keyframe)
   * 4. Após ~700ms, manifesto é "digitado" char-by-char
   * 5. Truque pra cursor andar: chars iniciam `display: none` (não ocupam
   *    espaço) e viram `inline-block` em sequência. Cursor sibling
   *    sempre fica logo após o último char visível.
   *
   * Cursor continua piscando após o manifesto inteiro digitado.
   * Sem split.revert() porque cursor precisa do textRef intacto pra
   * ficar grudado no fim.
   */
  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    const h1 = h1Ref.current
    const text = textRef.current
    if (!h1 || !text) return

    let cancelled = false
    let cleanup: (() => void) | null = null

    Promise.all([
      document.fonts.ready,
      import('gsap'),
      import('gsap/SplitText'),
    ]).then(([, { gsap }, { SplitText }]) => {
      if (cancelled || !text) return
      gsap.registerPlugin(SplitText)

      // h1 visível agora (cursor pisca sozinho antes do typewriter)
      gsap.set(h1, { opacity: 1 })

      const split = SplitText.create(text, {
        type: 'chars',
        charsClass: 'char',
      })

      // Chars iniciam fora do fluxo — cursor fica no início do h1.
      // Cada um vai pra inline-block no stagger, empurrando o cursor.
      gsap.set(split.chars, { display: 'none' })

      const tween = gsap.to(split.chars, {
        delay: 0.7, // cursor sozinho piscando antes da digitação
        display: 'inline-block',
        duration: 0.01,
        stagger: 0.045,
        ease: 'none',
      })

      cleanup = () => {
        tween.kill()
        try {
          split.revert()
        } catch {
          // ignorar
        }
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduced])

  return (
    <div ref={heroRef}>
      {/* Rascunho riscado — versão genérica da indústria, rejeitada. */}
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

      {/* H1 inicia com opacity 0 inline (evita flash visível → invisível
          quando GSAP monta). Quando reduced motion, opacity 1 direto. */}
      <h1
        ref={h1Ref}
        aria-label={site.manifesto}
        className="display-monumental"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <span ref={textRef}>{site.manifesto}</span>
        {/* Cursor terminal — pisca via .animate-blink (globals.css).
            Reduced motion: cursor escondido (sem CSS animation rodando). */}
        {!reduced ? (
          <span
            aria-hidden
            className="animate-blink"
            style={{
              display: 'inline-block',
              width: '0.08em',
              height: '0.82em',
              background: 'var(--pencil-darkest)',
              marginLeft: '0.06em',
              verticalAlign: 'baseline',
              transform: 'translateY(-0.05em)',
            }}
          />
        ) : null}
      </h1>
    </div>
  )
}
