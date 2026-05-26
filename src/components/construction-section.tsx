'use client'

import { useRef, type ReactNode } from 'react'
import {
  useScrollConstruction,
} from '@/lib/scroll-construction'

/**
 * ConstructionSection — wrapper client genérico que aplica a construção em
 * camadas (CLAUDE.md §23) numa <section>. Cada instância tem seu próprio
 * useRef + ScrollTrigger master (regra "1 trigger por seção").
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
  /** Quais camadas ativar nesta section. Default: heading + body + handnote (pass 1+2). */
  layers?: Layers
  /** Override do ScrollTrigger start. Default 'top 85%'. */
  start?: string
  /** Override do ScrollTrigger end. Default 'top 20%'. */
  end?: string
  /** Override do scrub. Default 0.5. */
  scrub?: number
  /** Quando false, hook não inicializa (mantém estado final imediato). */
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
    <section ref={ref} id={id} className={className} {...aria}>
      {children}
    </section>
  )
}
