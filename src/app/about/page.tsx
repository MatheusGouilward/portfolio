import Link from 'next/link'
import { site } from '@/lib/site'
import { HandNote } from '@/components/hand-note'
import { HickGesture } from '@/components/hick-gesture'
import { SpecCTA } from '@/components/spec-cta'
import { PolaroidDraggable } from '@/components/polaroid-draggable'

export const metadata = {
  title: 'About',
  description:
    'Trajetória factual de Matt Goulart — Senior Product Designer em evolução para Design Engineer.',
}

type Milestone = {
  period: string
  role: string
  company: string
  note: string
  href?: string
}

const timeline: Milestone[] = [
  {
    period: '2026 —',
    role: 'Independente',
    company: 'Estudo + playground',
    note: 'Reescrevendo o portfolio em código (este site), refinando Design System próprio, estudando Design Engineering com workflow AI-augmented.',
  },
  {
    period: 'Jul 2022 — Fev 2026',
    role: 'Product Designer',
    company: 'Jovens Gênios',
    note: 'EdTech SaaS em escala nacional. Redesign que levou CSAT de 30% para 90%, AI Copilots pedagógicos com 78% engajamento, Design System do zero. Trabalho âncora dos últimos 4 anos.',
    href: '/work/jovens-genios',
  },
  {
    period: 'Jun 2024 — Mar 2025',
    role: 'Product Designer',
    company: 'Sellbie',
    note: 'Projeto paralelo ao Jovens Gênios. CRM B2B com IA de propensão para marcas como L’Occitane, Grand Cru, Ortobom. Design System, dashboards multicanal, AI Copilot.',
    href: '/work/sellbie',
  },
  {
    period: 'Out 2020 — Jul 2022',
    role: 'UX/UI Designer',
    company: 'Zephyr Studio',
    note: 'Agência. Cliente notável: Banco Original. Promovido de Júnior pra Pleno.',
  },
]

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32">
      {/* Polaroid arrastável — gesto humano, anti-cheiro-de-IA (§22.7).
          Posicionada no canto superior-direito do wrapper em xl+; oculta em <md. */}
      <PolaroidDraggable
        photoSrc="/personal/matt.jpg"
        maskSrc="/personal/mask.png"
        alt="foto de Matt Goulart"
        initialRotation={-4}
        maskTop="14%"
        maskWidth="55%"
        maskHeight="38%"
        className="absolute z-10"
        style={{ top: '7rem', right: '2.5rem' }}
      />

      <header className="mb-24 max-w-3xl">
        <p className="mono-upper text-[var(--pencil-mid)]">About</p>
        <h1 className="display-monumental mt-8 text-balance text-[clamp(3rem,8vw,7rem)]">
          Matt Goulart.
        </h1>
        <p className="mt-8 text-[clamp(1.25rem,2.5vw,1.625rem)] font-medium leading-[1.4] text-[var(--pencil-darkest)]">
          Senior Product Designer com 6+ anos em B2B SaaS. Foco em Design Systems,
          Data Visualization e produtos densos com IA — operando com Claude Code,
          Cursor e prototipação em código no dia a dia. Em evolução para Design
          Engineer.{' '}
          <a
            href="/cv-matheus-goulart.pdf"
            download
            className="mono-upper text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
          >
            ↓ baixar CV
          </a>
        </p>
        <p className="mt-6 text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[17px]">
          Stack do dia a dia: Figma, Cursor + Claude Code, React, Next.js, Tailwind,
          shadcn/ui, Motion, Storybook. Pra dado: Amplitude, PostHog, Clarity.
        </p>
      </header>

      <section aria-labelledby="timeline" className="relative mt-16">
        <h2 id="timeline" className="mono-upper text-[var(--pencil-mid)]">
          Timeline
        </h2>
        <ul className="mt-2">
          {timeline.map((m) => (
            <li
              key={`${m.period}-${m.company}`}
              className="grid grid-cols-1 gap-y-2 border-t border-[var(--line)] py-8 sm:grid-cols-[220px_1fr] sm:gap-x-10"
            >
              <span className="mono-upper text-[var(--pencil-mid)] sm:pt-2">
                {m.period}
              </span>
              <div>
                <h3 className="text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold leading-tight text-[var(--pencil-darkest)]">
                  {m.role} ·{' '}
                  {m.href ? (
                    <Link
                      href={m.href}
                      className="underline decoration-[var(--pencil)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--pencil-dark)]"
                    >
                      {m.company}
                    </Link>
                  ) : (
                    <span className="text-[var(--pencil-mid)]">{m.company}</span>
                  )}
                </h3>
                <p className="mt-2 max-w-[60ch] text-sm text-[var(--pencil-mid)] sm:text-[15px]">
                  {m.note}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* HandNote -10° → margem esquerda, 80px gap, alinhada ao primeiro milestone. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '64px',
            right: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'o título foi atrás\ndo trabalho.'}
            rotation={-10}
            origin="right top"
            align="right"
            fontSize="16px"
          />
        </div>
      </section>

      <section aria-labelledby="contact" className="mt-24 max-w-3xl">
        <h2 id="contact" className="mono-upper text-[var(--pencil-mid)]">
          Contact
        </h2>

        <p className="mt-8 mono-upper text-[var(--pencil-mid)]">
          Disponível pra Senior Product Designer · B2B SaaS · AI / Design Systems /
          Data Viz.
        </p>

        <div className="relative mt-6">
          <p className="text-[clamp(1.25rem,2.5vw,1.625rem)] font-medium leading-[1.4] text-[var(--pencil-darkest)]">
            Pra trabalho, conversa ou peer review:{' '}
            <a
              href={`mailto:${site.social.email}`}
              className="underline decoration-[var(--pencil)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--pencil-dark)]"
            >
              {site.social.email}
            </a>
            .
          </p>

          <HickGesture />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
          <SpecCTA href="/cv-matheus-goulart.pdf" download prefix="↓">
            CV em PDF
          </SpecCTA>
          <a
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mono-upper text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
          >
            Código deste site no GitHub →
          </a>
        </div>
      </section>
    </div>
  )
}

