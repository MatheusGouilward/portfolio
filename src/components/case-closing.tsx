import Link from 'next/link'
import type { Work } from '@/lib/work'

export function CaseClosing({ work }: { work: Work }) {
  return (
    <section className="grid gap-10 border-t border-[var(--line)] py-20 sm:grid-cols-[220px_1fr] sm:gap-16 sm:py-28">
      <p className="mono-upper text-[var(--pencil-mid)] sm:pt-2">Closing</p>
      <div>
        <p className="display-case-hero max-w-[20ch] text-balance text-[clamp(1.875rem,4.5vw,3rem)] text-[var(--pencil-darkest)]">
          {work.closing.body}
        </p>
        <Link
          href={work.closing.nextHref}
          className="mono-upper mt-10 inline-flex items-center gap-2 text-[var(--pencil-mid)] transition-all duration-300 hover:translate-x-1 hover:text-[var(--pencil-darkest)]"
        >
          {work.closing.nextLabel}
        </Link>
      </div>
    </section>
  )
}
