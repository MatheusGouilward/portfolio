'use client'

import { useBlueprint } from './blueprint-provider'
import { UXConcept } from './ux-concept'
import { cn } from '@/lib/utils'

/**
 * Versão mobile da tese blueprint — exibida só em <md (640-767px e abaixo).
 *
 * Em desktop, anotações usam setas SVG bezier + dimension lines + handwritten
 * espalhados ao redor do hero. Em mobile, esse vocabulário não cabe — então
 * empilhamos badges UXConcept abaixo do CTA, com 1 linha handwritten curta
 * explicando a tese e o atalho. Mantém a tese operando sem virar ornamento.
 *
 * Aparece quando blueprint mode é ON.
 */
export function MobileAnnotations() {
  const { on } = useBlueprint()

  return (
    <div
      aria-hidden={!on}
      className={cn(
        'mt-10 flex flex-col gap-3 md:hidden',
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quart)]',
        on ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <p
        className="hand text-[var(--pencil)]"
        style={{ fontSize: '15px', lineHeight: 1.4 }}
      >
        este site mostra os bastidores.
        <br />
        toque{' '}
        <span className="mono-upper inline-block border border-[var(--line-strong)] px-1.5 py-0.5 text-[var(--pencil-darkest)]">
          blueprint
        </span>{' '}
        pra desligar.
      </p>

      <div className="flex flex-wrap gap-2">
        <UXConcept category="hierarchy" name="Focus" />
        <UXConcept category="laws" name="Fitts" />
        <UXConcept category="gestalt" name="Proximidade" />
        <UXConcept category="laws" name="Hick" />
      </div>
    </div>
  )
}
