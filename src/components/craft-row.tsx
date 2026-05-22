import Link from 'next/link'
import type { Craft } from '@/lib/crafts'
import { formatDate } from '@/lib/utils'

/**
 * CraftRow — dialeto "diário técnico / terminal" da home.
 *
 * Lista densa monospace, sem cards. Row inteira é Link (Fitts implícito).
 * Hover: bg paper-2 + arrow desliza + cor escurece.
 *
 * Em listing /craft index continua sendo <CraftCard>. Este componente
 * só vive na home, dentro da seção "Experimentos recentes".
 *
 * Ver §21 dialeto 2 do CLAUDE.md.
 */
export function CraftRow({ craft }: { craft: Craft }) {
  const isWip = craft.status === 'wip'

  return (
    <Link
      href={`/craft/${craft.slug}`}
      className="group block border-b border-[var(--line)] py-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:bg-[var(--paper-2)] sm:py-5"
    >
      <div className="grid grid-cols-1 gap-y-3 md:grid-cols-[60px_1fr_auto] md:items-baseline md:gap-x-6 md:gap-y-0">
        {/* Col 1: ID — mono 14px pencil-mid */}
        <span className="mono text-[14px] text-[var(--pencil-mid)]">
          #{craft.id}
        </span>

        {/* Col 2: título sans bold + stack tags mono */}
        <div>
          <h3 className="text-[18px] font-semibold leading-snug text-[var(--pencil-darkest)]">
            {craft.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pencil-light)]">
            {craft.tags.join(' · ')}
          </p>
        </div>

        {/* Col 3: data mono + WIP badge inline + arrow (revelado no hover) */}
        <div className="flex items-center gap-3">
          {isWip ? (
            <span
              aria-label="Em construção"
              className="border border-[var(--line-strong)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--pencil-mid)]"
            >
              WIP
            </span>
          ) : null}
          <time
            dateTime={craft.publishedAt}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pencil-mid)]"
          >
            {formatDate(craft.publishedAt)}
          </time>
          <span
            aria-hidden
            className="font-mono text-[11px] text-[var(--pencil-mid)] opacity-0 transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-[var(--pencil-darkest)] group-hover:opacity-100"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
