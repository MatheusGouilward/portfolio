import Link from 'next/link'
import type { Thought } from '@/lib/thoughts'
import { cn } from '@/lib/utils'

/**
 * ThoughtsEditorial — dialeto "revista editorial assimétrica" da home.
 *
 * xl+ (≥1280px): grid 1.6fr_1fr — lead story à esquerda larga, 2 menores
 *                 empilhadas à direita.
 * <xl: stack vertical — lead em cima com excerpt, 2 menores sem excerpt.
 *
 * Em /thoughts index continua sendo <ThoughtListItem>. Este só vive na home.
 *
 * Ver §21 dialeto 3 do CLAUDE.md.
 */
export function ThoughtsEditorial({
  thoughts,
  className,
}: {
  thoughts: Thought[]
  className?: string
}) {
  const items = thoughts.slice(0, 3)
  if (items.length === 0) return null

  const [lead, ...rest] = items

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-y-12 xl:grid-cols-[1.6fr_1fr] xl:gap-x-12 xl:gap-y-0',
        className,
      )}
    >
      <LeadStory thought={lead} />
      {rest.length > 0 ? (
        <div>
          {rest.map((t, i) => (
            <SmallStory key={t.slug} thought={t} hasBorderTop={i > 0} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function LeadStory({ thought }: { thought: Thought }) {
  return (
    <Link href={`/thoughts/${thought.slug}`} className="group block">
      <p className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] text-[var(--pencil-darkest)]">
        {formatDatePtBr(thought.publishedAt)}
      </p>
      <div className="mt-2 h-px w-6 bg-[var(--pencil-darkest)]" />

      <h3 className="mt-5 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.1] text-[var(--pencil-darkest)]">
        <span className={UNDERLINE_GROW}>{thought.title}</span>
      </h3>

      <p className="mt-4 line-clamp-3 text-[17px] leading-[1.5] text-[var(--pencil-dark)]">
        {thought.excerpt}
      </p>

      <p className="mt-6 mono-upper text-[var(--pencil-mid)]">
        ler em {thought.readingMinutes} min{' '}
        <span
          aria-hidden
          className="inline-block transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
        >
          →
        </span>
      </p>
    </Link>
  )
}

function SmallStory({
  thought,
  hasBorderTop,
}: {
  thought: Thought
  hasBorderTop: boolean
}) {
  return (
    <Link
      href={`/thoughts/${thought.slug}`}
      className={cn(
        'group block pb-6',
        hasBorderTop ? 'border-t border-[var(--line)] pt-6' : 'pt-0',
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pencil-mid)]">
        {formatDatePtBr(thought.publishedAt)}
      </p>
      <div className="mt-2 h-px w-4 bg-[var(--pencil-mid)]" />

      <h3 className="mt-4 text-[18px] font-semibold leading-[1.2] text-[var(--pencil-darkest)]">
        <span className={UNDERLINE_GROW}>{thought.title}</span>
      </h3>

      <p className="mt-4 mono-upper text-[var(--pencil-mid)]">
        ler em {thought.readingMinutes} min{' '}
        <span
          aria-hidden
          className="inline-block transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
        >
          →
        </span>
      </p>
    </Link>
  )
}

/**
 * Underline que cresce esquerda → direita no hover. Implementado via
 * background-image + background-size animado (não usa border-bottom, pra
 * permitir animar `size` em vez de scale).
 */
const UNDERLINE_GROW =
  'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat [background-size:0%_1px] [background-position:0_100%] [transition:background-size_var(--duration-fast)_var(--ease-out-quart)] group-hover:[background-size:100%_1px]'

const MONTHS_PT = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
]

/**
 * Formata ISO date como "22 MAI 2026" (pt-BR uppercase).
 * Parse manual da string ISO pra evitar shift de timezone.
 */
function formatDatePtBr(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_PT[parseInt(month, 10) - 1]} ${year}`
}
