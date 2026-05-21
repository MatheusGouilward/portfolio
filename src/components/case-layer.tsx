import type { ReactNode } from 'react'
import type { WorkLayer } from '@/lib/work'

export function CaseLayer({
  layer,
  index,
  children,
}: {
  layer: WorkLayer
  index: number
  children?: ReactNode
}) {
  return (
    <section className="grid gap-10 border-t border-[var(--line)] py-16 sm:grid-cols-[220px_1fr] sm:gap-16 sm:py-20">
      <div className="mono-upper text-[var(--pencil-mid)] sm:pt-2">
        Layer · 0{index + 1}
      </div>
      <div>
        <h2 className="display-case-hero text-balance text-[clamp(1.75rem,4vw,3rem)] text-[var(--pencil-darkest)]">
          {layer.title}
        </h2>
        <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-[var(--pencil-mid)] sm:text-[18px]">
          {layer.body}
        </p>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  )
}
