import Link from 'next/link'
import type { Thought } from '@/lib/thoughts'
import { formatDate } from '@/lib/utils'

export function ThoughtListItem({ thought }: { thought: Thought }) {
  return (
    <li>
      <Link
        href={`/thoughts/${thought.slug}`}
        className="group block border-t border-[var(--line)] py-6 outline-none transition-colors"
      >
        <div className="grid items-baseline gap-y-2 sm:grid-cols-[120px_1fr_auto] sm:gap-x-8">
          <time
            dateTime={thought.publishedAt}
            className="mono-upper text-[var(--pencil-mid)]"
          >
            {formatDate(thought.publishedAt)}
          </time>
          <div>
            <h3 className="text-[clamp(1.125rem,1.75vw,1.375rem)] font-bold leading-tight tracking-tight text-[var(--pencil-darkest)] transition-colors">
              {thought.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--pencil-mid)]">{thought.excerpt}</p>
          </div>
          <span className="mono-upper text-[var(--pencil-mid)] sm:text-right">
            {thought.readingMinutes} min
          </span>
        </div>
      </Link>
    </li>
  )
}
