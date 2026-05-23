'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import type { Work } from '@/lib/work'

/**
 * CaseEditorial — dialeto "editorial cinematográfico" da home (§22.3 REFAZER).
 *
 * Anatomia:
 * - Header: empresa · período (mono esquerda) + #NN gigante (display monumental direita)
 * - Tagline em display, max-width 24ch
 * - Métricas em coluna separada por linha vertical pencil-light
 * - CTA "ler case →" no canto inferior-direito
 * - Mouse follow ink (radial gaussiano com work.hue, mix-blend multiply)
 *
 * Hover do article:
 * - #NN scale 1.05
 * - tagline shift -2px Y
 * - CTA shift +8px X
 *
 * prefers-reduced-motion: sem mouse follow, sem scale do #NN.
 * Fallback hover ink básico (radial-gradient saturado opacity-0 → 1).
 *
 * Client component pelo mouse follow (state + onMouseMove).
 *
 * Padrão documentado em CLAUDE.md §21.
 */
export function CaseEditorial({ work, number }: { work: Work; number: number }) {
  const reduced = useReducedMotion() ?? false
  const articleRef = useRef<HTMLElement>(null)
  const [hovering, setHovering] = useState(false)
  // Detecta capacidade de hover real (pointer fino, não touch). Touch devices
  // disparam `mousemove` sintético em drag — sem este guard, o mouse follow
  // ink aparecia no celular ao tocar e arrastar no card.
  const [hasHover, setHasHover] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setHasHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  // Mouse follow ink — usa motion values + spring pra movimento suave
  const inkX = useMotionValue(0)
  const inkY = useMotionValue(0)
  const inkXSpring = useSpring(inkX, { stiffness: 220, damping: 28, mass: 0.6 })
  const inkYSpring = useSpring(inkY, { stiffness: 220, damping: 28, mass: 0.6 })

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    inkX.set(e.clientX - rect.left)
    inkY.set(e.clientY - rect.top)
  }

  const inkEnabled = hasHover && !reduced
  const showFollowInk = inkEnabled && hovering
  const numberPadded = String(number).padStart(2, '0')
  const metrics = work.metrics?.slice(0, 3) ?? []

  return (
    <article
      ref={articleRef}
      onMouseMove={inkEnabled ? handleMouseMove : undefined}
      onMouseEnter={inkEnabled ? () => setHovering(true) : undefined}
      onMouseLeave={inkEnabled ? () => setHovering(false) : undefined}
      className="group relative overflow-hidden border-t border-[var(--pencil-darkest)] py-20 sm:py-28"
    >
      {/* Fallback hover ink (sem mouse follow) — funciona em reduced-motion E
          como base color ambient mesmo quando o mouse-follow está ativo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(70% 80% at 80% 20%, hsl(${work.hue} / 0.14), transparent 60%)`,
        }}
      />

      {/* Mouse follow ink — só quando hovering E não reduced. mix-blend multiply
          escurece em paletas claras, integra com pencil em paletas escuras. */}
      {showFollowInk ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -z-10"
          style={{
            x: inkXSpring,
            y: inkYSpring,
            translateX: '-50%',
            translateY: '-50%',
            width: 240,
            height: 240,
            background: `radial-gradient(circle, hsl(${work.hue} / 0.40), transparent 70%)`,
            mixBlendMode: 'multiply',
            opacity: 0.55,
          }}
        />
      ) : null}

      <Link
        href={`/work/${work.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`Abrir case: ${work.company}`}
      >
        {/* Linha 1: meta empresa · período (esq) + #NN gigante (dir) */}
        <div className="flex items-start justify-between gap-6">
          <p className="mono-upper pt-3 text-[var(--pencil-mid)]">
            {work.company} · {work.period}
          </p>
          <span
            aria-hidden
            className="font-extrabold leading-[0.9] tabular-nums text-[var(--pencil-darkest)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
            style={{
              fontSize: 'clamp(64px, 9vw, 120px)',
              transformOrigin: 'top right',
            }}
          >
            #{numberPadded}
          </span>
        </div>

        {/* Linha 2: tagline + métricas com divisor vertical */}
        <div className="mt-10 grid grid-cols-1 gap-y-10 xl:grid-cols-[1.5fr_1fr] xl:gap-x-16 xl:gap-y-0">
          <h2
            className="display-case-hero text-[var(--pencil-darkest)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0"
            style={{
              maxWidth: '24ch',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
            }}
          >
            {work.tagline}
          </h2>

          {metrics.length > 0 ? (
            <ul className="flex flex-col gap-6 xl:border-l xl:border-[var(--pencil-light)] xl:pl-12">
              {metrics.map((m) => (
                <li key={m.label}>
                  <p className="mono-upper text-[var(--pencil-mid)]">{m.label}</p>
                  <p
                    className="mt-1 font-bold leading-[1.05] tabular-nums text-[var(--pencil-darkest)]"
                    style={{ fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)' }}
                  >
                    {m.value}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* CTA — canto inferior-direito */}
        <div className="mt-12 flex justify-end">
          <span className="mono-upper text-[var(--pencil-mid)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-2 group-hover:text-[var(--pencil-darkest)]">
            ler case →
          </span>
        </div>
      </Link>
    </article>
  )
}
