import { notFound } from 'next/navigation'
import { getPublishedThoughts } from '@/lib/thoughts'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  return getPublishedThoughts().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getPublishedThoughts().find((x) => x.slug === slug)
  if (!t) return {}
  return { title: t.title, description: t.excerpt }
}

export default async function ThoughtDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getPublishedThoughts().find((x) => x.slug === slug)
  if (!t) notFound()

  return (
    <article className="mx-auto max-w-5xl px-6 pt-16 pb-8 sm:px-10 sm:pt-24">
      <header className="mb-8 mono-upper text-[var(--pencil-mid)]">
        {formatDate(t.publishedAt)} · {t.readingMinutes} min
      </header>
      <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-semibold tracking-tight text-[var(--pencil-darkest)]">
        {t.title}
      </h1>
      <p className="mt-3 max-w-[58ch] text-base text-[var(--pencil-mid)]">{t.excerpt}</p>
      <div className="mt-12 border border-dashed border-[var(--line)] bg-[var(--paper-2)] p-12 text-center text-sm text-[var(--pencil-mid)]">
        Texto completo em construção. MDX pipeline na fase pós-launch.
      </div>
    </article>
  )
}
