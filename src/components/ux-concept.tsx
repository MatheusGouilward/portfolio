'use client'

import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

type Category =
  | 'laws'
  | 'gestalt'
  | 'nielsen'
  | 'a11y'
  | 'hierarchy'
  | 'cognition'
  | 'motion'
  | 'typography'

const CATEGORY_LABEL: Record<Category, string> = {
  laws: 'LAW',
  gestalt: 'GESTALT',
  nielsen: 'NIELSEN',
  a11y: 'WCAG',
  hierarchy: 'HIERARCHY',
  cognition: 'COGNITION',
  motion: 'MOTION',
  typography: 'TYPE',
}

type UXConceptProps = {
  /** Nome do conceito. Ex: "Lei de Fitts". */
  name: string
  /** Descrição curta da aplicação. Ex: "CTA >44px". */
  description?: string
  /** Categoria — define o prefixo. */
  category: Category
  /** Classe wrapper pra posicionamento. */
  className?: string
}

/**
 * Badge mono compacto nomeando uma lei/heurística + descrição da aplicação.
 * Não usa cor — só pencil-mid + line border.
 */
export function UXConcept({ name, description, category, className }: UXConceptProps) {
  const { on } = useBlueprint()

  return (
    <span
      aria-hidden={!on}
      className={cn(
        'inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5',
        'border border-[var(--line-strong)] px-2 py-1',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ background: 'var(--paper)' }}
    >
      <span
        className="mono-upper text-[var(--pencil-mid)]"
        style={{ fontSize: '11px' }}
      >
        {CATEGORY_LABEL[category]}
      </span>
      <span className="hand text-[var(--pencil-dark)]" style={{ fontSize: '14px' }}>
        {name}
      </span>
      {description ? (
        <span
          className="mono text-[var(--pencil-mid)]"
          style={{ fontSize: '11px' }}
        >
          · {description}
        </span>
      ) : null}
    </span>
  )
}
