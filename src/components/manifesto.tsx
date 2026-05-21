'use client'

import { motion, useReducedMotion } from 'motion/react'
import { site } from '@/lib/site'
import { useBlueprint } from './blueprint-provider'

const STRIKE_PATH = 'M 1 5 Q 25 3.4, 50 5 T 99 5'

export function Manifesto() {
  const reduced = useReducedMotion() ?? false
  const { on } = useBlueprint()
  const words = site.manifesto.split(' ')
  const { previous } = site.manifestoMeta

  return (
    <div>
      {/* Rascunho riscado — versão genérica da indústria, rejeitada.
          Respeita o blueprint toggle. */}
      <div
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

      {/* Manifesto monumental. Anotação vive FORA do componente — no gutter
          direito do hero (ver app/page.tsx). Esse componente entrega só o texto. */}
      {reduced ? (
        <h1 className="display-monumental">{site.manifesto}</h1>
      ) : (
        <h1 aria-label={site.manifesto} className="display-monumental">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              aria-hidden
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.95 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block whitespace-pre"
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </h1>
      )}
    </div>
  )
}
