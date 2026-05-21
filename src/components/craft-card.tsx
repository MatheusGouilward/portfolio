import Link from 'next/link'
import type { Craft } from '@/lib/crafts'
import { formatDate } from '@/lib/utils'

export function CraftCard({ craft }: { craft: Craft }) {
  return (
    <Link
      href={`/craft/${craft.slug}`}
      className="group block border-t border-[var(--line)] py-6 outline-none transition-colors sm:py-8"
    >
      <div className="grid items-baseline gap-y-2 sm:grid-cols-[80px_120px_1fr_auto] sm:gap-x-8">
        <span className="mono-upper text-[var(--pencil-mid)] transition-colors group-hover:text-[var(--pencil-darkest)]">
          #{craft.id}
        </span>

        <time
          dateTime={craft.publishedAt}
          className="mono-upper text-[var(--pencil-mid)]"
        >
          {formatDate(craft.publishedAt)}
        </time>

        <div>
          <h3 className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-tight tracking-tight text-[var(--pencil-darkest)] transition-colors">
            {craft.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--pencil-mid)] sm:text-[15px]">
            {craft.tags.map((t) => t).join(' · ')}
          </p>
        </div>

        <span
          aria-hidden
          className="mono-upper text-[var(--pencil-mid)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--pencil-darkest)]"
        >
          →
        </span>
      </div>
    </Link>
  )
}
