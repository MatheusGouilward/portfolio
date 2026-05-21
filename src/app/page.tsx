import Link from 'next/link'
import { site } from '@/lib/site'
import { Manifesto } from '@/components/manifesto'
import { StatusRow } from '@/components/status-row'
import { CraftCard } from '@/components/craft-card'
import { CasePreview } from '@/components/case-preview'
import { ThoughtListItem } from '@/components/thought-list-item'
import { HandNote } from '@/components/hand-note'
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

        <div className="relative mt-4">
          {works.map((w) => (
            <CasePreview key={w.slug} work={w} />
          ))}

          {/* Regra: rotação negativa → lado esquerdo do conteúdo, 80px de gap.
              Manifesto usa 40px (exceção); listas (cases/crafts) usam 80px
              porque a coluna de conteúdo é mais densa e precisa de respiro. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: '64px',
              right: 'calc(100% + 80px)',
            }}
          >
            <HandNote
              note={'quatro anos aqui\nmudaram tudo.'}
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

        <div className="relative mt-4">
          {crafts.map((c) => (
            <CraftCard key={c.id} craft={c} />
          ))}

          {/* Regra: rotação positiva → lado direito do conteúdo, 80px de gap.
              Manifesto é exceção com 40px. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden xl:block"
            style={{
              top: '1rem',
              left: 'calc(100% + 80px)',
            }}
          >
            <HandNote
              note={'esse aqui \nnão é screenshot.'}
              rotation={6}
              origin="left top"
              align="left"
              fontSize="16px"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="thoughts" className="relative mt-32 sm:mt-40">
        <SectionHeading id="thoughts" label="Notas recentes" link="/thoughts" linkLabel="ver todos" />

        <ul className="mt-4">
          {thoughts.map((t) => (
            <ThoughtListItem key={t.slug} thought={t} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="trajetoria" className="relative mt-32 sm:mt-40">
        <SectionHeading id="trajetoria" label="Trajetória" />

        <p className="mt-8 max-w-3xl text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.4] text-[var(--pencil-darkest)]">
          Senior Product Designer com 6+ anos em B2B SaaS. Passei quatro anos na{' '}
          <Link
            href="/work/jovens-genios"
            className="underline decoration-[var(--pencil)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--pencil-dark)]"
          >
            Jovens Gênios
          </Link>{' '}
          construindo uma EdTech que escalou nacionalmente — Design System do zero, AI Copilots
          pedagógicos, dashboards de aprendizagem. Em paralelo redesenhei o{' '}
          <Link
            href="/work/sellbie"
            className="underline decoration-[var(--pencil)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--pencil-dark)]"
          >
            Sellbie
          </Link>
          , CRM B2B com IA de propensão que atende marcas como L’Occitane, Grand Cru e Ortobom.
        </p>
        <p className="mt-6 max-w-3xl text-base text-[var(--pencil-mid)] sm:text-[17px]">
          Trabalho na interseção entre design, sistemas e código, usando IA como ferramenta diária.{' '}
          <Link
            href="/about"
            className="text-[var(--pencil-darkest)] underline underline-offset-4 hover:text-[var(--pencil-dark)]"
          >
            Mais em /sobre
          </Link>
          .
        </p>
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
