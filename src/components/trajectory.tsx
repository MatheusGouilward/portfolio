import Link from 'next/link'
import { HandNote } from './hand-note'

type Milestone = {
  year: string
  role: string
  company: string
  note: string
  href?: string
  /** Marca o milestone âncora — recebe destaque visual + anotação handwritten. */
  anchor?: boolean
}

const milestones: Milestone[] = [
  {
    year: '2026',
    role: 'Independente',
    company: 'playground + DS próprio',
    note: 'Estudo Design Engineering, refinando o sistema, reescrevendo este site em código.',
  },
  {
    year: '2024',
    role: 'Product Designer',
    company: 'Sellbie',
    note: 'Projeto paralelo. CRM B2B com IA de propensão pra marcas como L’Occitane, Grand Cru, Ortobom.',
    href: '/work/sellbie',
  },
  {
    year: '2022',
    role: 'Product Designer',
    company: 'Jovens Gênios',
    note: 'EdTech SaaS em escala nacional. CSAT 30 → 90, Copilots com 78% engajamento, Design System do zero.',
    href: '/work/jovens-genios',
    anchor: true,
  },
  {
    year: '2020',
    role: 'UX/UI Designer',
    company: 'Zephyr Studio',
    note: 'Agência. Cliente notável: Banco Original. Promovido Júnior → Pleno.',
  },
]

/**
 * Trajetória — diagrama de eixo do tempo. Não é prosa.
 *
 * Layout:
 * - Coluna 1 (year): ano em escala grande, tabular-nums.
 * - Coluna 2 (node+line): nó circular + linha vertical conectando milestones.
 * - Coluna 3 (content): role · company + nota curta.
 *
 * Milestone âncora (JG, 2022) recebe nó preenchido + anotação handwritten
 * lateral na margem externa esquerda (xl+).
 */
export function Trajectory() {
  return (
    <div className="relative">
      <h2 id="trajetoria" className="mono-upper text-[var(--pencil-mid)]">
        Trajetória
      </h2>

      <ol className="relative mt-12">
        {milestones.map((m, i) => {
          const isLast = i === milestones.length - 1
          return (
            <li
              key={m.year}
              className="relative grid grid-cols-[64px_20px_1fr] items-start gap-x-5 pb-10 sm:grid-cols-[120px_28px_1fr] sm:gap-x-8 sm:pb-14"
            >
              <time
                dateTime={m.year}
                className="font-bold leading-none tabular-nums text-[var(--pencil-darkest)]"
                style={{
                  fontSize: 'clamp(1.625rem, 3.4vw, 2.5rem)',
                  letterSpacing: '-0.04em',
                  paddingTop: '0.125rem',
                }}
              >
                {m.year}
              </time>

              <div className="relative flex justify-center" aria-hidden>
                <span
                  className={`mt-2 block size-3 rounded-full ${
                    m.anchor
                      ? 'bg-[var(--pencil-darkest)]'
                      : 'border border-[var(--pencil-mid)] bg-[var(--paper)]'
                  }`}
                />
                {!isLast && (
                  <span
                    className="absolute left-1/2 w-px -translate-x-1/2 bg-[var(--pencil-light)]"
                    style={{
                      top: 'calc(0.5rem + 12px + 8px)',
                      height: 'calc(100% - 0.5rem - 12px - 8px)',
                    }}
                  />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold leading-snug text-[var(--pencil-darkest)]">
                  {m.role}
                  <span className="text-[var(--pencil-mid)]"> · </span>
                  {m.href ? (
                    <Link
                      href={m.href}
                      className="underline decoration-[var(--pencil-light)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--pencil-dark)] hover:decoration-[var(--pencil-darkest)]"
                    >
                      {m.company}
                    </Link>
                  ) : (
                    <span className="font-normal text-[var(--pencil-dark)]">
                      {m.company}
                    </span>
                  )}
                </h3>
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--pencil-mid)] sm:text-[15px]">
                  {m.note}
                </p>
              </div>

              {/* Anotação rabiscada na margem esquerda externa, ancorada ao
                  milestone âncora (Jovens Gênios, 2022). xl+ apenas. */}
              {m.anchor ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute hidden xl:block"
                  style={{
                    top: '4px',
                    right: 'calc(100% + 80px)',
                  }}
                >
                  <HandNote
                    note={'4 anos.\no eixo do trabalho.'}
                    rotation={-9}
                    origin="right top"
                    align="right"
                    fontSize="16px"
                  />
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
