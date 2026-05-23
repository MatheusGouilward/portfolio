import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * SpecCTA — botão CTA com specs do design system visíveis em dashed lines
 * (h-48 / p-20 / gap-12). Inspirado em zeroheight.com.
 *
 * Server component puro: zero JS, zero state. Hover via Tailwind group-*.
 *
 * Usado nos 2 CTAs principais do site:
 * - Home: "Ver cases" → /work (suffix arrow →)
 * - /about: "CV em PDF" → download (prefix arrow ↓)
 *
 * Mobile (<md): specs ocultas via `hidden md:*`. Botão continua funcional
 * com dashed border discreta.
 *
 * Acessibilidade:
 * - Specs são decoração visual com aria-hidden — screen reader lê só
 *   o label do botão e seu destino.
 * - Touch target 48px de altura (WCAG 2.5.8).
 * - `:focus-visible` global do globals.css aplica outline 2px offset 4px.
 *
 * Spec §22.8 do TASKS.md.
 */
type SpecCTAProps = {
  href: string
  children: ReactNode
  /** Elemento antes do label (ex: ↓ pra download). */
  prefix?: ReactNode
  /** Elemento depois do label (ex: → pra navegação). */
  suffix?: ReactNode
  /** Quando true, render <a download> em vez de <Link>. */
  download?: boolean
  className?: string
}

export function SpecCTA({
  href,
  children,
  prefix,
  suffix,
  download = false,
  className,
}: SpecCTAProps) {
  const inner = (
    <>
      {prefix ? (
        <span
          aria-hidden
          className="font-mono text-[var(--pencil-mid)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:text-[var(--pencil-darkest)]"
        >
          {prefix}
        </span>
      ) : null}
      <span>{children}</span>
      {suffix ? (
        <span
          aria-hidden
          className="font-mono text-[var(--pencil-mid)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-[var(--pencil-darkest)]"
        >
          {suffix}
        </span>
      ) : null}
    </>
  )

  // Border-style dashed → solid não é animatable em CSS;
  // a troca acontece instantânea no hover. Cor e bg transicionam.
  const buttonClasses =
    'inline-flex h-12 items-center gap-3 rounded-[2px] border border-dashed border-[var(--pencil-faint)] bg-[var(--paper)] px-5 font-medium text-[var(--pencil-darkest)] transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:border-solid group-hover:border-[var(--pencil-mid)] group-hover:bg-[var(--paper-2)] focus-visible:outline-none'

  const button = download ? (
    <a href={href} download className={buttonClasses}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={buttonClasses}>
      {inner}
    </Link>
  )

  return (
    <div className={cn('group relative inline-block', className)}>
      {/* Label h-48 acima do botão — line vertical dashed pequena + texto mono */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 left-0 hidden items-center gap-1 font-mono text-[11px] text-[var(--pencil-faint)] opacity-40 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:text-[var(--pencil-mid)] group-hover:opacity-100 md:flex"
      >
        <span
          aria-hidden
          className="inline-block h-3 border-l border-dashed border-[var(--pencil-faint)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:border-[var(--pencil-mid)]"
        />
        h-48
      </span>

      {/* Botão central */}
      {button}

      {/* Label p-20 abaixo do botão */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-0 hidden font-mono text-[11px] text-[var(--pencil-faint)] opacity-40 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:text-[var(--pencil-mid)] group-hover:opacity-100 md:block"
      >
        p-20
      </span>

      {/* Label gap-12 à direita do botão — só aparece com suffix */}
      {suffix ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-full ml-3 hidden -translate-y-1/2 items-center gap-1 font-mono text-[11px] text-[var(--pencil-faint)] opacity-40 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:text-[var(--pencil-mid)] group-hover:opacity-100 md:flex"
        >
          <span
            aria-hidden
            className="inline-block h-px w-3 border-t border-dashed border-[var(--pencil-faint)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:border-[var(--pencil-mid)]"
          />
          gap-12
        </span>
      ) : null}
    </div>
  )
}
