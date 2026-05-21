import { HandNote } from '@/components/hand-note'
import { ThoughtListItem } from '@/components/thought-list-item'
import { getPublishedThoughts } from '@/lib/thoughts'

export const metadata = {
  title: 'Thoughts',
  description: 'Ensaios, notas e reflexões sobre design, código e produto.',
}

export default function ThoughtsIndex() {
  const thoughts = getPublishedThoughts()

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32">
      <header className="mb-20 max-w-4xl sm:mb-28">
        <p className="mono-upper text-[var(--pencil-mid)]">Thoughts</p>
        <h1 className="display-monumental mt-8 text-balance text-[clamp(3rem,8vw,7rem)]">
          Notas em voz alta.
        </h1>
        <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[18px]">
          Sobre design, código, IA, sistemas e o que aprendi tentando juntar essas
          quatro coisas em produto real.
        </p>
      </header>

      <div className="relative">
        <ul>
          {thoughts.map((t) => (
            <ThoughtListItem key={t.slug} thought={t} />
          ))}
        </ul>

        {/* Rotação positiva → margem direita, 80px gap, alinhada ao primeiro escrito. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '32px',
            left: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'alguns ainda\nem rascunho.'}
            rotation={10}
            origin="left top"
            align="left"
            fontSize="16px"
          />
        </div>
      </div>
    </div>
  )
}
