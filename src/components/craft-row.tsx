'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Craft } from '@/lib/crafts'

/**
 * CraftRow — dialeto "diário técnico / terminal" da home (§22.1 REFAZER).
 *
 * Renderiza cada experimento como uma linha de saída do `git log --oneline`:
 *   <hash7>  feat: <título>                       <data>
 *            [tag1] [tag2]                        [wip]
 *   ─────────────────────────────────────────────────────
 *
 * Em /craft index continua sendo <CraftCard>. Este vive na home.
 *
 * Animação: entra no viewport com typing reveal (clipPath inset 100% → 0%)
 * via GSAP ScrollTrigger, com stagger baseado em `index` pra dar o feel de
 * linhas sendo digitadas em sequência.
 *
 * prefers-reduced-motion: aparece instantâneo, sem clipPath.
 */
export function CraftRow({ craft, index }: { craft: Craft; index: number }) {
  const liRef = useRef<HTMLLIElement>(null)
  const hash = fakeHash(craft.slug)
  const isWip = craft.status === 'wip'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = liRef.current
    if (!el) return

    let stKill: (() => void) | null = null
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !el) return
        gsap.registerPlugin(ScrollTrigger)

        gsap.set(el, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.35,
              delay: index * 0.08,
              ease: 'power2.out',
            })
          },
        })

        stKill = () => st.kill()
      },
    )

    return () => {
      cancelled = true
      stKill?.()
    }
  }, [index])

  return (
    <li ref={liRef} className="block">
      <Link
        href={`/craft/${craft.slug}`}
        className="block py-2 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:bg-[var(--paper-2)]"
      >
        {/* Linha 1: hash · feat: título · data */}
        <div className="grid grid-cols-[80px_1fr_auto] gap-x-4 text-[13px]">
          <span className="font-mono text-[var(--pencil-mid)]">{hash}</span>
          <span className="truncate">
            <span className="font-mono text-[var(--pencil-mid)]">feat: </span>
            <span className="text-[18px] font-medium leading-none text-[var(--pencil-darkest)]">
              {craft.title}
            </span>
          </span>
          <time
            dateTime={craft.publishedAt}
            className="font-mono text-[var(--pencil-mid)] tabular-nums"
          >
            {formatDateShort(craft.publishedAt)}
          </time>
        </div>

        {/* Linha 2: tags em [brackets] + (opcional) [wip] alinhado à direita */}
        <div className="grid grid-cols-[80px_1fr_auto] gap-x-4 pt-1">
          <span aria-hidden />
          <span className="font-mono text-[12px] text-[var(--pencil-light)]">
            {craft.tags.map((t) => `[${t}]`).join(' ')}
          </span>
          {isWip ? (
            <span className="font-mono text-[12px] uppercase text-[var(--pencil-darkest)]">
              [wip]
            </span>
          ) : (
            <span aria-hidden />
          )}
        </div>
      </Link>

      {/* Divisor ASCII puro — não border CSS (spec §22.1). Último item esconde. */}
      <div
        aria-hidden
        className="overflow-hidden whitespace-nowrap font-mono text-[13px] leading-none text-[var(--pencil-faint)] last:hidden"
        style={{ height: '13px' }}
      >
        {'─'.repeat(200)}
      </div>
    </li>
  )
}

/**
 * Hash hex determinístico de 7 chars a partir do slug — parece SHA mas é fake.
 * Mesmo slug sempre gera mesmo hash entre builds.
 */
function fakeHash(slug: string): string {
  let h = 5381
  for (let i = 0; i < slug.length; i++) {
    h = (h * 33) ^ slug.charCodeAt(i)
  }
  return (h >>> 0).toString(16).slice(0, 7).padStart(7, '0')
}

const MONTHS_PT_LOWER = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

/** Formato curto pt-BR: "18 mai 26". */
function formatDateShort(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_PT_LOWER[parseInt(month, 10) - 1]} ${year.slice(2)}`
}
