'use client'

import { HandNote } from '@/components/hand-note'
import { usePalette } from '@/components/palette-provider'
import type { PaletteKey, PaletteTokens } from '@/lib/palettes'
import { cn } from '@/lib/utils'

export default function TokensDinamicosCraft() {
  const { current, setPalette, palettes } = usePalette()
  const entries = Object.entries(palettes) as [PaletteKey, (typeof palettes)[PaletteKey]][]

  return (
    <article className="mx-auto max-w-5xl px-6 pt-16 pb-16 sm:px-10 sm:pt-24">
      <header className="mb-12 mono-upper text-[var(--pencil-mid)]">
        #003 · 18 mai 2026 · design system · view transitions
      </header>

      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--pencil-darkest)]">
        Tokens dinâmicos com View Transitions.
      </h1>
      <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[18px]">
        Trocar a paleta inteira do site em runtime, sem flicker, com sensação
        física. O picker aqui opera o site real — clica numa paleta e o
        cream-grafite vira pergaminho-sépia, azul-blueprint ou carvão-giz. O
        próprio botão lá em cima no header faz a mesma coisa.
      </p>

      <section aria-labelledby="paletas" className="relative mt-20">
        <h2 id="paletas" className="mono-upper text-[var(--pencil-mid)]">
          Paletas
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(([key, p]) => {
            const selected = current === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPalette(key)}
                aria-pressed={selected}
                className={cn(
                  'group flex flex-col gap-4 border p-5 text-left transition-colors',
                  selected
                    ? 'border-[var(--pencil-darkest)]'
                    : 'border-[var(--line)] hover:border-[var(--pencil-mid)]',
                )}
              >
                <BigSwatch tokens={p.tokens} />
                <div>
                  <p className="text-sm font-bold text-[var(--pencil-darkest)]">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--pencil-mid)]">
                    {p.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* HandNote -8° → margem esquerda externa. */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: '40px',
            right: 'calc(100% + 80px)',
          }}
        >
          <HandNote
            note={'a tinta troca,\no sistema continua.'}
            rotation={-8}
            origin="right top"
            align="right"
            fontSize="16px"
          />
        </div>
      </section>

      <section aria-labelledby="anatomia" className="mt-24 max-w-[62ch]">
        <h2 id="anatomia" className="mono-upper text-[var(--pencil-mid)]">
          Anatomia
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[17px]">
          Tokens semânticos vivem como CSS custom properties no <code>:root</code>.
          O picker chama <code>document.startViewTransition()</code> e dentro do
          callback substitui todos os tokens via <code>style.setProperty</code>.
          O browser captura snapshot antes/depois e cross-fade nativo — zero JS
          de animação por elemento.
        </p>
        <pre
          className="mt-6 overflow-x-auto border border-[var(--line)] bg-[var(--paper-2)] p-5 text-[13px] leading-relaxed"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <code>{`document.startViewTransition(() => {
  for (const [token, value] of Object.entries(palette)) {
    document.documentElement.style.setProperty(\`--\${token}\`, value)
  }
})`}</code>
        </pre>
        <p className="mt-6 text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[17px]">
          Em browsers sem suporte (Safari &lt;18, Firefox sem flag), a troca
          acontece direto. <code>prefers-reduced-motion</code> também pula a
          transição. Cada paleta passa contraste WCAG AA: texto principal acima
          de 4.5:1, UI acima de 3:1.
        </p>
        <p className="mt-6 text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[17px]">
          A escolha persiste em <code>localStorage</code> sob a chave
          <code> mg-palette</code>. Um script inline no <code>&lt;head&gt;</code>
          aplica a paleta salva antes da React hidratar, evitando flash.
        </p>
      </section>
    </article>
  )
}

function BigSwatch({ tokens }: { tokens: PaletteTokens }) {
  return (
    <div
      className="relative flex aspect-[4/3] w-full flex-col justify-end gap-1.5 border p-3"
      style={{ backgroundColor: tokens.paper, borderColor: tokens.line }}
    >
      <div className="h-[3px] w-full" style={{ background: tokens['pencil-darkest'] }} />
      <div className="h-[3px] w-[78%]" style={{ background: tokens.pencil }} />
      <div className="h-[3px] w-[54%]" style={{ background: tokens['pencil-mid'] }} />
      <div className="h-[3px] w-[32%]" style={{ background: tokens['pencil-light'] }} />
    </div>
  )
}
