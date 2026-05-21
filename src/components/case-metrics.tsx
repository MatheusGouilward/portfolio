import type { WorkMetric } from '@/lib/work'

export function CaseMetrics({ metrics }: { metrics: WorkMetric[] }) {
  return (
    <section className="grid gap-10 border-t border-[var(--line)] py-20 sm:grid-cols-[220px_1fr] sm:gap-16 sm:py-28">
      <p className="mono-upper text-[var(--pencil-mid)] sm:pt-2">What changed</p>
      <ul className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {metrics.map((m) => (
          <li key={m.label} className="border-l-2 border-[var(--pencil)] pl-6">
            <p className="display-case-hero text-[clamp(2.5rem,5vw,4rem)] text-[var(--pencil-darkest)]">
              {m.value}
            </p>
            <p className="mt-3 mono-upper text-[var(--pencil-mid)]">{m.label}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
