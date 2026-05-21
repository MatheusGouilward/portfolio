'use client'

import { useEffect, useRef, useState } from 'react'
import { usePalette } from './palette-provider'
import { type PaletteKey } from '@/lib/palettes'
import { cn } from '@/lib/utils'

/**
 * PalettePicker — dropdown sticky no header. Troca a paleta inteira em runtime
 * com View Transitions. Anti-padrão: nomear lei UX em texto público (aqui
 * usamos só "paleta" como label, sem teoria).
 */
export function PalettePicker({ className }: { className?: string }) {
  const { current, setPalette, palettes } = usePalette()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Click fora fecha
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Esc fecha
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const list = Object.entries(palettes) as [PaletteKey, (typeof palettes)[PaletteKey]][]
  const currentEntry = palettes[current]

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={`Paleta atual: ${currentEntry.name}. Trocar paleta.`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-sm',
          'text-[var(--pencil-mid)] hover:text-[var(--pencil-darkest)]',
          'transition-colors duration-[var(--duration-fast)]',
        )}
      >
        <Swatch paper={currentEntry.swatch.paper} pencil={currentEntry.swatch.pencil} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Paletas"
          className={cn(
            'absolute right-0 top-full z-40 mt-2 min-w-[220px] py-1',
            'border border-[var(--line-strong)] bg-[var(--paper)]',
            'shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
          )}
        >
          {list.map(([key, p]) => {
            const selected = current === key
            return (
              <li key={key} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setPalette(key)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left',
                    'transition-colors duration-[var(--duration-fast)]',
                    'hover:bg-[var(--paper-2)]',
                    selected && 'bg-[var(--paper-2)]',
                  )}
                >
                  <Swatch paper={p.swatch.paper} pencil={p.swatch.pencil} />
                  <span className="text-sm text-[var(--pencil-darkest)]">{p.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function Swatch({ paper, pencil }: { paper: string; pencil: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        fill={paper}
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle cx="12.5" cy="5.5" r="3" fill={pencil} />
    </svg>
  )
}
