'use client'

import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type TypographySpecProps = {
  /** Família, ex: "Inter Tight 900". */
  family: string
  /** Tamanho, ex: "clamp(2.75rem, 7.5vw, 5.75rem)" ou "16px / 1.6". */
  size: string
  /** Linha extra opcional (tracking, line-height, weight). */
  detail?: string
  /** Classe wrapper pra posicionamento. */
  className?: string
}

/**
 * Spec tipográfica — mostra fonte + tamanho como overlay técnico estilo blueprint.
 * Aparece quando blueprint mode ON. Mono pra parecer ficha técnica.
 */
export function TypographySpec({ family, size, detail, className }: TypographySpecProps) {
  const { on } = useBlueprint()

  return (
    <div
      aria-hidden={!on}
      className={cn(
        'pointer-events-none absolute z-10 flex flex-col gap-[2px]',
        'border-l-2 border-[var(--pencil-mid)] pl-2',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <span
        className="mono-upper text-[var(--pencil-mid)]"
        style={{ fontSize: '10px' }}
      >
        type
      </span>
      <span
        className="mono text-[var(--pencil-darkest)]"
        style={{ fontSize: '11px', letterSpacing: '0.04em' }}
      >
        {family}
      </span>
      <span
        className="mono text-[var(--pencil-mid)]"
        style={{ fontSize: '11px', letterSpacing: '0.04em' }}
      >
        {size}
      </span>
      {detail ? (
        <span
          className="mono text-[var(--pencil-light)]"
          style={{ fontSize: '11px', letterSpacing: '0.04em' }}
        >
          {detail}
        </span>
      ) : null}
    </div>
  )
}
