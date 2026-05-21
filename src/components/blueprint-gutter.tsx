'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BlueprintGutterProps = {
  /** Lado do gutter — left ou right. */
  side: 'left' | 'right'
  /** Distância vertical do topo do parent (string Tailwind, ex: 'top-12'). */
  topClass?: string
  /** Alinhamento horizontal dentro do gutter (start | center | end). */
  align?: 'start' | 'center' | 'end'
  /** Largura do gutter em px. Default 200. */
  width?: number
  children: ReactNode
  className?: string
}

/**
 * Wrapper pra posicionar anotações no gutter lateral, FORA do conteúdo principal.
 *
 * Estratégia: o <main> tem max-w-5xl (~64rem = 1024px). Em viewports ≥xl (1280px),
 * sobra ~128px de cada lado. Esse wrapper ocupa esse espaço usando `right-full` ou
 * `left-full` com `margin` específica.
 *
 * O parent precisa ter `position: relative`.
 *
 * - **Visível em xl+** (1280px+). Em viewports menores, retorna null — anotação
 *   responsabilidade do componente UXConcept inline ou MobileAnnotations.
 */
export function BlueprintGutter({
  side,
  topClass = 'top-0',
  align = 'start',
  width = 200,
  children,
  className,
}: BlueprintGutterProps) {
  const sidePos =
    side === 'left'
      ? 'right-full mr-6'
      : 'left-full ml-6'

  const alignClass = {
    start: side === 'left' ? 'items-end' : 'items-start',
    center: 'items-center',
    end: side === 'left' ? 'items-start' : 'items-end',
  }[align]

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-10 hidden xl:flex flex-col gap-3',
        sidePos,
        topClass,
        alignClass,
        className,
      )}
      style={{ width }}
    >
      {children}
    </div>
  )
}
