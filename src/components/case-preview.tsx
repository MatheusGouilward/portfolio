import Link from 'next/link'
import type { Work } from '@/lib/work'

export function CasePreview({ work }: { work: Work }) {
  return (
    <Link
      href={`/work/${work.slug}`}
      aria-label={`Abrir case: ${work.company}, ${work.period}`}
      className="group relative isolate block overflow-hidden border-t border-[var(--line)] py-10 outline-none transition-colors sm:py-14"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(70% 80% at 80% 20%, hsl(${work.hue} / 0.10), transparent 60%)`,
        }}
      />

      <div className="grid items-baseline gap-6 sm:grid-cols-[200px_1fr_auto] sm:gap-10">
        <p className="mono-upper text-[var(--pencil-mid)]">{work.period}</p>

        <div>
          <p className="mono-upper text-[var(--pencil-mid)] transition-colors group-hover:text-[var(--pencil-darkest)]">
            {work.company} · {work.domain}
          </p>
          <h3 className="display-case-hero mt-3 text-balance text-[clamp(1.625rem,3.5vw,2.5rem)] text-[var(--pencil-darkest)]">
            {work.tagline}
          </h3>
        </div>

        <span
          aria-hidden
          className="mono-upper text-[var(--pencil-mid)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--pencil-darkest)]"
        >
          Read →
        </span>
      </div>
    </Link>
  )
}
