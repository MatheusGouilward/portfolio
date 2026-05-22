/**
 * CaseEditorial — dialeto "editorial cinematográfico" pro card de case na home.
 *
 * Server component puro: nenhum state, nenhum effect — hover via CSS group-*.
 * Tagline vira display monumental (cena central, não link em lista).
 * Hue do work aparece como tinta no hover (radial-gradient), nunca como
 * único portador de informação — texto carrega tudo.
 *
 * Padrão documentado em CLAUDE.md §21 (Dialeto por seção).
 */

import Link from 'next/link'
import type { Work } from '@/lib/work'

type Props = {
  work: Work
  /** posição 1-based no índice de cases mostrados na home */
  number: number
}

export function CaseEditorial({ work, number }: Props) {
  return (
    <article className="group relative border-t border-[var(--line)] py-16 sm:py-24">
      <Link
        href={`/work/${work.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`Abrir case: ${work.company}`}
      >
        {/* Tinta hue — decoração, aparece só no hover. aria-hidden + cor
            nunca é único portador de info. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(70% 80% at 80% 20%, hsl(${work.hue} / 0.18), transparent 60%)`,
          }}
        />

        {/* Meta — empresa · período · #N */}
        <div className="flex items-baseline justify-between gap-4">
          <p className="mono-upper text-[var(--pencil-mid)]">
            {work.company} · {work.period}
          </p>
          <span aria-hidden className="mono-upper text-[var(--pencil-mid)]">
            #{String(number).padStart(2, '0')}
          </span>
        </div>

        {/* Tagline = display do case (cena central) */}
        <h2
          className="display-case-hero mt-8 max-w-[20ch] text-[var(--pencil-darkest)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5"
        >
          {work.tagline}
        </h2>

        {/* Highlight — 1 linha de prova (fallback pro próprio tagline se faltar) */}
        <p className="mt-8 max-w-[58ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-[var(--pencil-dark)]">
          {work.homeHighlight ?? work.tagline}
        </p>

        {/* CTA */}
        <p className="mono-upper mt-10 text-[var(--pencil-mid)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-2 group-hover:text-[var(--pencil-darkest)]">
          ler case →
        </p>
      </Link>
    </article>
  )
}
