'use client'

import { cn } from '@/lib/utils'
import { useBlueprint } from './blueprint-provider'

/**
 * Toggle sticky no canto inferior-direito.
 * Liga/desliga as anotações UX do site. Atalho B no teclado.
 * Touch target ≥44px (WCAG 2.5.8). aria-pressed indica estado.
 */
export function BlueprintToggle() {
  const { on, toggle } = useBlueprint()

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex items-center gap-3">
      <span
        className="hand hidden items-baseline gap-1.5 text-[var(--pencil)] sm:inline-flex"
        style={{ fontSize: '18px', transform: 'rotate(-2deg)' }}
      >
        aperte
        <kbd
          className="hand border border-[var(--line-strong)] px-1.5 py-px text-[var(--pencil-darkest)]"
          style={{
            background: 'var(--paper-2)',
            borderRadius: '2px',
            fontSize: '15px',
            lineHeight: 1,
          }}
        >
          B
        </kbd>
      </span>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? 'Desligar anotações UX (blueprint mode)' : 'Ligar anotações UX (blueprint mode)'}
        className={cn(
          'pointer-events-auto inline-flex h-11 items-center',
          // Mobile: ícone-only quadrado (44x44 — touch target), sem label visível.
          // sm+: width auto + label "blueprint: on/off".
          'w-11 justify-center px-0',
          'sm:w-auto sm:min-w-[140px] sm:justify-start sm:gap-2 sm:px-3',
          'border border-[var(--line-strong)]',
          'text-[var(--pencil-darkest)]',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
          'hover:bg-[var(--paper-2)]',
        )}
        style={{
          background: on ? 'var(--paper)' : 'var(--paper-2)',
          borderRadius: '2px',
        }}
      >
        <BracketGlyph active={on} />
        <span
          className="mono-upper hidden sm:inline"
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          blueprint:&nbsp;{on ? 'on' : 'off'}
        </span>
      </button>
    </div>
  )
}

function BracketGlyph({ active }: { active: boolean }) {
  // Cantoneira L com tick — alusão ao hierarchy-mark.
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M 2 14 L 2 2 L 14 2"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {active ? (
        <path
          d="M 6 10 L 8 12 L 13 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
    </svg>
  )
}
