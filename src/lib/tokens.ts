/**
 * Tokens semânticos compartilhados entre componentes de anotação UX.
 * Single source of truth pros tons da escala pencil definida em globals.css.
 */
export type PencilTone =
  | 'pencil-darkest'
  | 'pencil-dark'
  | 'pencil'
  | 'pencil-mid'
  | 'pencil-light'
  | 'pencil-faint'

/** Resolve o token pra `var()` CSS. */
export function pencilVar(tone: PencilTone): string {
  return `var(--${tone})`
}
