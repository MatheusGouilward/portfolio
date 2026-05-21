import { CraftCard } from '@/components/craft-card'
import { HandNote } from '@/components/hand-note'
import { getPublishedCrafts } from '@/lib/crafts'

export const metadata = {
  title: 'Craft',
  description: 'Microexperimentos. Cada um é um teste pequeno, focado, executado em código.',
}

export default function CraftIndex() {
  const crafts = getPublishedCrafts()

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32">
      <header className="mb-20 max-w-4xl sm:mb-28">
        <p className="mono-upper text-[var(--pencil-mid)]">Craft</p>
        <h1 className="display-monumental mt-8 text-balance text-[clamp(3rem,8vw,7rem)]">
          Microexperimentos.
        </h1>
        <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[18px]">
          Pequeno, focado, executado em código. Cada um responde uma pergunta que
          eu não consegui responder lendo.
        </p>
      </header>

      <div className="relative">
        {crafts.map((c) => (
          <CraftCard key={c.id} craft={c} />
        ))}

        {/* Rotação negativa → margem esquerda, 80px gap, alinhada ao primeiro craft. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '64px',
            right: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'cada um veio\nde uma dúvida minha.'}
            rotation={-12}
            origin="right top"
            align="right"
            fontSize="16px"
          />
        </div>
      </div>
    </div>
  )
}
