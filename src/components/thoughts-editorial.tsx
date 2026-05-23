import Link from 'next/link'
import type { Thought } from '@/lib/thoughts'
import { cn } from '@/lib/utils'

/**
 * ThoughtsEditorial — dialeto "revista editorial assimétrica" da home (§22.2 REFAZER).
 *
 * Lead story tem peso de capa de revista:
 * - Data como GRAFISMO (dia em ~80px display + mês/ano mono)
 * - Pull quote em <blockquote> italic grande
 * - Palavra do título com textura irregular (italic + slnt -8) via `wonkyWord`
 *
 * Notas menores são headlines puras, sem excerpt, separadas por linha
 * pencil-darkest 3px width 60% (marca editorial forte).
 *
 * xl+ (≥1280px): grid 1.5fr_1fr · <xl: stack vertical.
 *
 * Underline anima esquerda → direita no hover (220ms).
 *
 * Em /thoughts index continua sendo <ThoughtListItem>. Este vive só na home.
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
        'grid grid-cols-1 gap-y-12 xl:grid-cols-[1.5fr_1fr] xl:gap-x-16 xl:gap-y-0',
        className,
      )}
    >
      <LeadStory thought={lead} />

      {rest.length > 0 ? (
        <div className="flex flex-col">
          {rest.map((t, i) => (
            <div key={t.slug}>
              {i > 0 ? <div className="my-10 h-[3px] w-3/5 bg-[var(--pencil-darkest)]" /> : null}
              <SmallStory thought={t} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function LeadStory({ thought }: { thought: Thought }) {
  const { day, monthYear } = leadDateParts(thought.publishedAt)
  const pullQuote = thought.pullQuote ?? thought.excerpt
  // Body = resto do excerpt SE pullQuote foi escrito separadamente
  const body =
    thought.pullQuote && thought.pullQuote !== thought.excerpt ? thought.excerpt : null

  return (
    <Link href={`/thoughts/${thought.slug}`} className="group block">
      {/* Data como grafismo */}
      <div>
        <div
          className="font-extrabold leading-[0.9] tabular-nums text-[var(--pencil-darkest)]"
          style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}
        >
          {day}
        </div>
        <div className="mt-2 font-mono text-[14px] uppercase tracking-[0.12em] text-[var(--pencil-mid)]">
          {monthYear}
        </div>
      </div>

      <div className="mt-6 h-px w-10 bg-[var(--pencil-darkest)]" />

      <h3
        className="mt-6 font-bold leading-[1.05] text-[var(--pencil-darkest)]"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
      >
        <span className={UNDERLINE_GROW}>
          {renderTitleWithWonk(thought.title, thought.wonkyWord)}
        </span>
      </h3>

      <blockquote
        className="mt-6 italic text-[var(--pencil-darkest)]"
        style={{
          fontSize: 'clamp(1.125rem, 1.6vw, 1.375rem)',
          maxWidth: '28ch',
          lineHeight: 1.35,
        }}
      >
        <p>“{pullQuote}”</p>
      </blockquote>

      {body ? (
        <p className="mt-5 max-w-[36ch] text-[16px] leading-[1.5] text-[var(--pencil-dark)]">
          {body}
        </p>
      ) : null}

      <p className="mt-8 mono-upper text-[var(--pencil-mid)]">
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

function SmallStory({ thought }: { thought: Thought }) {
  return (
    <Link href={`/thoughts/${thought.slug}`} className="group block">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--pencil-mid)]">
        {formatDateFullPtBr(thought.publishedAt)}
      </p>
      <div className="mt-2 h-px w-6 bg-[var(--pencil-faint)]" />

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
 * Underline que cresce esquerda → direita no hover (220ms — spec §22.2).
 * background-image trick pra animar size em vez de scale.
 */
const UNDERLINE_GROW =
  'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat [background-size:0%_1px] [background-position:0_100%] [transition:background-size_220ms_var(--ease-out-quart)] group-hover:[background-size:100%_1px]'

/**
 * Renderiza o título com 1 palavra em estilo "wonky" (italic + slnt -8) —
 * textura editorial. Inter Tight Variable suporta `slnt`. Se a palavra não
 * for encontrada no título (case-sensitive), retorna o título intacto.
 *
 * Spec original pediu WONK/SOFT (axes Fraunces). Trocado por slnt + italic
 * porque Inter Tight não tem WONK/SOFT (Fraunces foi cortada do projeto).
 */
function renderTitleWithWonk(title: string, wonkyWord?: string) {
  if (!wonkyWord) return title
  const idx = title.indexOf(wonkyWord)
  if (idx < 0) return title
  const before = title.slice(0, idx)
  const after = title.slice(idx + wonkyWord.length)
  return (
    <>
      {before}
      <span
        className="italic"
        style={{ fontVariationSettings: '"slnt" -8' }}
      >
        {wonkyWord}
      </span>
      {after}
    </>
  )
}

const MONTHS_PT_LOWER = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

function leadDateParts(iso: string) {
  const [year, month, day] = iso.split('-')
  return {
    day,
    monthYear: `${MONTHS_PT_LOWER[parseInt(month, 10) - 1]} ${year}`,
  }
}

/** Formato pt-BR uppercase "18 MAI 2026". */
function formatDateFullPtBr(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_PT_LOWER[parseInt(month, 10) - 1].toUpperCase()} ${year}`
}
