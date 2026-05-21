import { notFound } from 'next/navigation'
import { getPublishedCrafts } from '@/lib/crafts'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  return getPublishedCrafts().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const craft = getPublishedCrafts().find((c) => c.slug === slug)
  if (!craft) return {}
  return { title: craft.title, description: craft.description }
}

export default async function CraftDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const craft = getPublishedCrafts().find((c) => c.slug === slug)
  if (!craft) notFound()

  return (
    <article className="mx-auto max-w-5xl px-6 pt-16 pb-8 sm:px-10 sm:pt-24">
      <header className="mb-8 mono-upper text-[var(--pencil-mid)]">
        #{craft.id} · {formatDate(craft.publishedAt)} · {craft.tags.join(' · ')}
      </header>
      <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-semibold tracking-tight text-[var(--pencil-darkest)]">
        {craft.title}
      </h1>
      <p className="mt-3 max-w-[58ch] text-base text-[var(--pencil-mid)]">{craft.description}</p>
      {craft.status === 'wip' ? (
        <div className="mt-12 border border-dashed border-[var(--line)] bg-[var(--paper-2)]/40 p-12 text-center text-sm text-[var(--pencil-mid)]">
          Demonstração interativa em construção.
        </div>
      ) : null}
    </article>
  )
}
