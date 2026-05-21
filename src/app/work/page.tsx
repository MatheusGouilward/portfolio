import { CasePreview } from '@/components/case-preview'
import { HandNote } from '@/components/hand-note'
import { getPublishedWorks } from '@/lib/work'

export const metadata = {
  title: 'Work',
  description: 'Cases narrativos — vivências em camadas, não problema-solução-resultado.',
}

export default function WorkIndex() {
  const works = getPublishedWorks()

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32">
      <header className="mb-20 max-w-4xl sm:mb-28">
        <p className="mono-upper text-[var(--pencil-mid)]">Work</p>
        <h1 className="display-monumental mt-8 text-balance text-[clamp(3rem,8vw,7rem)]">
          Vivências, não cases.
        </h1>
        <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[18px]">
          Cada uma em camadas, em primeira pessoa, com componentes interativos
          extraídos do produto real. Sem problema-solução-resultado.
        </p>
      </header>

      <div className="relative">
        {works.map((w) => (
          <CasePreview key={w.slug} work={w} />
        ))}

        {/* Rotação positiva → margem direita, 80px gap, alinhada ao primeiro case. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '64px',
            left: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'vivência é o que sobra\ndepois do projeto.'}
            rotation={9}
            origin="left top"
            align="left"
            fontSize="16px"
          />
        </div>
      </div>
    </div>
  )
}
