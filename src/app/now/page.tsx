import { HandNote } from '@/components/hand-note'

export const metadata = {
  title: 'Now',
  description: 'O que estou construindo agora.',
}

const updates = [
  {
    date: '2026-05-18',
    body: 'Construindo este playground. Cases de Jovens Gênios e Sellbie em primeiro lugar.',
  },
  {
    date: '2026-05-10',
    body: 'Refinando o Design System próprio — tokens semânticos, dark mode, motion.',
  },
  {
    date: '2026-04-28',
    body: 'Estudando workflows AI-augmented a fundo — Claude Code, agentes, prompt-to-component.',
  },
]

function formatDate(d: string) {
  return new Date(d)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}

export default function NowPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32">
      <header className="mb-20 max-w-3xl">
        <p className="mono-upper text-[var(--pencil-mid)]">Now</p>
        <h1 className="display-monumental mt-8 text-balance text-[clamp(2.5rem,6vw,5rem)]">
          O que está no centro do meu tempo agora.
        </h1>
      </header>

      <div className="relative max-w-2xl">
        <ul>
          {updates.map((u) => (
            <li
              key={u.date}
              className="grid grid-cols-[80px_1fr] gap-x-6 border-t border-[var(--line)] py-6 sm:grid-cols-[120px_1fr]"
            >
              <time
                dateTime={u.date}
                className="mono-upper text-[var(--pencil-mid)] sm:pt-1"
              >
                {formatDate(u.date)}
              </time>
              <p className="text-[clamp(1.125rem,2vw,1.375rem)] font-medium leading-[1.4] text-[var(--pencil-darkest)]">
                {u.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Rotação -7° → margem esquerda, 80px de gap. Alinhada à primeira data. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '24px',
            right: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'atualizo quando muda.\nraramente é semana sim, semana não.'}
            rotation={-7}
            origin="right top"
            align="right"
            fontSize="16px"
          />
        </div>
      </div>
    </div>
  )
}
