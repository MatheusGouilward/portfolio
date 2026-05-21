import Link from 'next/link'
import { HandNote } from '@/components/hand-note'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-5xl flex-col items-center justify-center px-6 sm:px-10">
      <div className="relative w-full max-w-[40rem] text-center">
        <p className="mono-upper text-[var(--pencil-mid)]">404</p>
        <h1 className="display-monumental mt-6 text-balance text-[clamp(2.5rem,6vw,5rem)]">
          Página não encontrada.
        </h1>
        <p className="mx-auto mt-6 max-w-[44ch] text-base text-[var(--pencil-mid)]">
          Talvez esse craft ainda não exista — ou tenha sido movido.
        </p>
        <Link
          href="/"
          className="mono-upper mt-10 inline-block text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
        >
          Voltar pra home →
        </Link>

        {/* Rotação negativa → margem esquerda, 80px gap, alinhada ao h1. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '48px',
            right: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'talvez esse caminho\nnunca existiu.'}
            rotation={-5}
            origin="right top"
            align="right"
            fontSize="16px"
          />
        </div>
      </div>
    </div>
  )
}
