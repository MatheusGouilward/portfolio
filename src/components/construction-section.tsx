'use client'

import { createContext, useRef, type ReactNode } from 'react'
import { useScrollConstruction } from '@/lib/scroll-construction'

/**
 * Context que sinaliza pros descendants que eles estão sob controle
 * do scroll-construction hook. Componentes como <HandNote> consomem
 * esse flag pra evitar disparar animações próprias (Motion whileInView)
 * que conflitariam com as do hook GSAP.
 *
 * default false — fora de uma ConstructionSection, comportamento normal.
 */
export const ConstructionContext = createContext<boolean>(false)

/**
 * ConstructionSection — wrapper client genérico que aplica a construção
 * em camadas (CLAUDE.md §23) numa <section>. Cada instância tem seu
 * próprio useRef + ScrollTrigger master (regra "1 trigger por seção").
 *
 * Children marcam elementos com `data-construct="heading|body|handnote"`
 * pra serem capturados pelo hook. Refs: TASKS.md #39.
 */
type Layers = Partial<{
  heading: boolean
  body: boolean
  handnote: boolean
  grid: boolean
  frame: boolean
  arrows: boolean
}>

type ConstructionSectionProps = {
  children: ReactNode
  layers?: Layers
  start?: string
  end?: string
  scrub?: number
  enabled?: boolean
  className?: string
  id?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

export function ConstructionSection({
  children,
  layers,
  start,
  end,
  scrub,
  enabled,
  className,
  id,
  ...aria
}: ConstructionSectionProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollConstruction(ref, { layers, start, end, scrub, enabled })

  return (
    <ConstructionContext.Provider value={enabled !== false}>
      <section ref={ref} id={id} className={className} {...aria}>
        {children}
      </section>
    </ConstructionContext.Provider>
  )
}
