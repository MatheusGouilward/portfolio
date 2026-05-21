'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  applyPaletteToRoot,
  DEFAULT_PALETTE,
  palettes,
  STORAGE_KEY,
  type PaletteEntry,
  type PaletteKey,
} from '@/lib/palettes'

type PaletteContextValue = {
  current: PaletteKey
  setPalette: (key: PaletteKey) => void
  palettes: Record<PaletteKey, PaletteEntry>
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PaletteKey>(DEFAULT_PALETTE)

  // Hidrata state com a paleta que o anti-flash script já aplicou no <head>.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PaletteKey | null
      if (saved && saved in palettes) setCurrent(saved)
    } catch {
      // localStorage indisponível — segue com default.
    }
  }, [])

  const setPalette = useCallback((next: PaletteKey) => {
    if (!(next in palettes)) return
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    setCurrent(next)

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (typeof doc.startViewTransition === 'function' && !reduced) {
      doc.startViewTransition(() => applyPaletteToRoot(next))
    } else {
      applyPaletteToRoot(next)
    }
  }, [])

  return (
    <PaletteContext.Provider value={{ current, setPalette, palettes }}>
      {children}
    </PaletteContext.Provider>
  )
}

export function usePalette() {
  const ctx = useContext(PaletteContext)
  if (!ctx) throw new Error('usePalette must be used within PaletteProvider')
  return ctx
}
