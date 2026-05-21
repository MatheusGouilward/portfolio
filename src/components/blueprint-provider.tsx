'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'blueprint-mode'

type BlueprintContextValue = {
  on: boolean
  toggle: () => void
  setOn: (next: boolean) => void
}

const BlueprintContext = createContext<BlueprintContextValue | null>(null)

/**
 * Inline script injected pre-hydration to set `data-blueprint` on <html>.
 * Avoids the ON→OFF flash when a user has previously disabled the mode.
 *
 * Safe wrt XSS: literal string with no user input.
 */
export const BLUEPRINT_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');document.documentElement.dataset.blueprint=(s==='off')?'off':'on';}catch(e){}})();`

/**
 * Blueprint Mode provider — controla a visibilidade das anotações UX.
 * Default ON (revela a tese). Persiste em localStorage. Atalho B.
 */
export function BlueprintProvider({ children }: { children: ReactNode }) {
  // Read from <html data-blueprint> set by the init script — no SSR/CSR mismatch.
  const [on, setOnState] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true
    return document.documentElement.dataset.blueprint !== 'off'
  })

  const setOn = useCallback((next: boolean) => {
    setOnState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      // localStorage indisponível (privacy mode) — ignora.
    }
  }, [])

  const toggle = useCallback(() => {
    setOnState((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  // Atalho B — ignora foco em input / textarea / contenteditable e modifier keys.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'b' && e.key !== 'B') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target
      if (target instanceof HTMLElement) {
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }
      }
      e.preventDefault()
      toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  // Reflete o estado no <html> pra hooks CSS opcionais.
  useEffect(() => {
    document.documentElement.dataset.blueprint = on ? 'on' : 'off'
  }, [on])

  return (
    <BlueprintContext.Provider value={{ on, toggle, setOn }}>
      {children}
    </BlueprintContext.Provider>
  )
}

export function useBlueprint(): BlueprintContextValue {
  const ctx = useContext(BlueprintContext)
  if (!ctx) {
    throw new Error('useBlueprint must be used inside <BlueprintProvider>')
  }
  return ctx
}
