import Link from 'next/link'
import { site } from '@/lib/site'
import { Manifesto } from '@/components/manifesto'
import { StatusRow } from '@/components/status-row'
import { CraftRow } from '@/components/craft-row'
import { CaseEditorial } from '@/components/case-editorial'
import { ThoughtsEditorial } from '@/components/thoughts-editorial'
import { HandNote } from '@/components/hand-note'
import { SpecCTA } from '@/components/spec-cta'
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
          <SpecCTA href="/work" suffix="→" className="shrink-0">
            Ver cases
          </SpecCTA>
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
              scrub
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="craft" className="relative mt-32 sm:mt-40">
        <h2 id="craft" className="sr-only">
          Experimentos recentes
        </h2>

        {/* Header da seção É um prompt — terminal real, não label decorativa */}
        <header className="flex items-baseline justify-between font-mono text-[13px] text-[var(--pencil-mid)]">
          <span>
            <span aria-hidden>$ </span>
            git log --oneline mattgoulart/portfolio
          </span>
          <Link
            href="/craft"
            className="text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
          >
            --all →
          </Link>
        </header>

        <div className="relative">
          <ol className="mt-6 font-mono" role="list">
            {crafts.map((c, i) => (
              <CraftRow key={c.id} craft={c} index={i} />
            ))}
          </ol>

          {/* Cursor piscando após a última row — fim do prompt */}
          <span
            aria-hidden
            className="animate-blink mt-2 inline-block font-mono text-[16px] leading-none text-[var(--pencil-darkest)]"
          >
            █
          </span>

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
              note={'esse log\né meu rascunho ao vivo.'}
              rotation={10}
              origin="left top"
              align="left"
              fontSize="16px"
              scrub
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="thoughts" className="relative mt-32 sm:mt-40">
        <SectionHeading id="thoughts" label="Notas recentes" link="/thoughts" linkLabel="ver todos" />

        <div className="relative">
          <ThoughtsEditorial thoughts={thoughts} className="mt-12" />

          {/* Rotação positiva → lado direito, 80px gap, alinhada ao lead. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: '1rem',
              left: 'calc(100% + 80px)',
            }}
          >
            <HandNote
              note={'alguns ainda\nem rascunho.'}
              rotation={12}
              origin="left top"
              align="left"
              fontSize="16px"
              scrub
            />
          </div>
        </div>
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
