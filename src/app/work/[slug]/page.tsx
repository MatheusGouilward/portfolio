import { notFound } from 'next/navigation'
import { CaseHero } from '@/components/case-hero'
import { CaseLayer } from '@/components/case-layer'
import { CaseMetrics } from '@/components/case-metrics'
import { CaseClosing } from '@/components/case-closing'
import { getPublishedWorks, getWorkBySlug } from '@/lib/work'

export function generateStaticParams() {
  return getPublishedWorks().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = getWorkBySlug(slug)
  if (!work) return {}
  return { title: `${work.company} — Work`, description: work.tagline }
}

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = getWorkBySlug(slug)
  if (!work) notFound()

  return (
    <article className="mx-auto max-w-5xl px-6 sm:px-10">
      <CaseHero work={work} />

      <section className="grid gap-10 border-t border-[var(--line)] py-16 sm:grid-cols-[220px_1fr] sm:gap-16 sm:py-20">
        <div className="mono-upper text-[var(--pencil-mid)] sm:pt-2">Opening</div>
        <div className="max-w-[60ch] space-y-6 text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-[1.45] text-[var(--pencil-darkest)]">
          {work.opening.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {work.layers.map((layer, i) => (
        <CaseLayer key={layer.title} layer={layer} index={i}>
          {work.status === 'wip' ? (
            <div className="mono-upper border border-dashed border-[var(--line)] bg-[var(--paper-2)]/40 p-12 text-center text-[var(--pencil-mid)]">
              Componente interativo em construção.
            </div>
          ) : null}
        </CaseLayer>
      ))}

      <CaseMetrics metrics={work.metrics} />
      <CaseClosing work={work} />
    </article>
  )
}
