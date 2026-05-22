import Link from 'next/link'
import { site } from '@/lib/site'
import { Manifesto } from '@/components/manifesto'
import { StatusRow } from '@/components/status-row'
import { CraftRow } from '@/components/craft-row'
import { CaseEditorial } from '@/components/case-editorial'
import { ThoughtsEditorial } from '@/components/thoughts-editorial'
import { HandNote } from '@/components/hand-note'
import { Trajectory } from '@/components/trajectory'
import { getLatestCrafts } from '@/lib/crafts'
import { getRecentThoughts } from '@/lib/thoughts'
import { getPublishedWorks } from '@/lib/work'

export default function HomePage() {
  const crafts = getLatestCrafts(3)
  const thoughts = getRecentThoughts(3)
  const works = getPublishedWorks()

  return (
    <div className="mx-auto max-w-5xl px-6 pb-12 sm:px-10">
      <section aria-labelledby="manifesto" className="relative mt-24 sm:mt-32">
        <h2 id="manifesto" className="sr-only">Manifesto</h2>

        <div className="relative">
          <Manifesto />

          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: 'clamp(3rem, 5vw, 4.5rem)',
              left: 'calc(100% + 40px)',
            }}
          >
            <HandNote
              note={site.manifestoMeta.note}
              rotation={15}
              delay={1.7}
              origin="left top"
              align="left"
              maxWidth={220}
              fontSize="16px"
            />
          </div>
        </div>

        <div className="mt-12">
          <StatusRow />
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/work" className="btn-primary shrink-0">
            <span>Ver cases</span>
            <span aria-hidden className="btn-arrow">→</span>
          </Link>
          <Link
            href="/about"
            className="mono-upper text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
            style={{ fontSize: '11px' }}
          >
            Como cheguei aqui →
          </Link>
        </div>
      </section>

      <section aria-labelledby="cases" className="relative mt-40 sm:mt-56">
        <SectionHeading id="cases" label="Cases selecionados" link="/work" linkLabel="ver todos" />

        <div className="relative mt-12">
          {works.map((w, i) => (
            <CaseEditorial key={w.slug} work={w} number={i + 1} />
          ))}

          {/* Regra: rotação negativa → lado esquerdo do conteúdo, 80px de gap.
              Anotação não repete a tagline — comenta a relação entre os dois cases. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: '80px',
              right: 'calc(100% + 80px)',
            }}
          >
            <HandNote
              note={'esse define\no resto.'}
              rotation={-8}
              origin="right top"
              align="right"
              fontSize="16px"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="craft" className="relative mt-32 sm:mt-40">
        <SectionHeading id="craft" label="Experimentos recentes" link="/craft" linkLabel="ver todos" />

        <div className="relative">
          <ol className="mt-8 border-t border-[var(--line)]" role="list">
            {crafts.map((c) => (
              <li key={c.id} role="listitem">
                <CraftRow craft={c} />
              </li>
            ))}
          </ol>

          {/* Rotação positiva → lado direito do conteúdo, 80px de gap. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: '1rem',
              left: 'calc(100% + 80px)',
            }}
          >
            <HandNote
              note={'cada um veio\nde uma dúvida minha.'}
              rotation={9}
              origin="left top"
              align="left"
              fontSize="16px"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="thoughts" className="relative mt-32 sm:mt-40">
        <SectionHeading id="thoughts" label="Notas recentes" link="/thoughts" linkLabel="ver todos" />

        <ThoughtsEditorial thoughts={thoughts} className="mt-10" />
      </section>

      <section aria-labelledby="trajetoria" className="relative mt-32 sm:mt-40">
        <Trajectory />

        {/* Link pro /about — leitura mais profunda da trajetória. */}
        <div className="mt-10">
          <Link
            href="/about"
            className="mono-upper text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
            style={{ fontSize: '11px' }}
          >
            História completa em /sobre →
          </Link>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({
  id,
  label,
  link,
  linkLabel,
}: {
  id: string
  label: string
  link?: string
  linkLabel?: string
}) {
  return (
    <header className="flex items-baseline justify-between">
      <h2 id={id} className="mono-upper text-[var(--pencil-mid)]">
        {label}
      </h2>
      {link && linkLabel ? (
        <Link
          href={link}
          className="mono-upper text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </header>
  )
}
