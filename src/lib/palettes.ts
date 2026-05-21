/**
 * Palettes — controlam todo o tema visual do site via CSS custom properties.
 *
 * Cada paleta define todos os tokens semânticos. Trocar de paleta = chamar
 * `applyPaletteToRoot(key)` que escreve as CSS vars no `:root` via
 * `style.setProperty`. View Transitions API faz cross-fade nativo
 * (em browsers que suportam). Fallback: troca direta.
 *
 * Todas as 4 paletas passam WCAG AA (4.5:1 texto principal, 3:1 UI).
 */

export type PaletteKey =
  | 'cream-graphite'
  | 'parchment-sepia'
  | 'blueprint-nankin'
  | 'carvao-giz'

export type PaletteTokens = {
  paper: string
  'paper-2': string
  'paper-deep': string
  'pencil-darkest': string
  'pencil-dark': string
  pencil: string
  'pencil-mid': string
  'pencil-light': string
  'pencil-faint': string
  line: string
  'line-strong': string
  grid: string
  selection: string
  backdrop: string
}

export type PaletteEntry = {
  name: string
  description: string
  swatch: { paper: string; pencil: string }
  tokens: PaletteTokens
}

export const palettes: Record<PaletteKey, PaletteEntry> = {
  'cream-graphite': {
    name: 'Cream + grafite',
    description: 'Caderno de sketch padrão.',
    swatch: { paper: '#fbf6e9', pencil: '#1a1612' },
    tokens: {
      paper: '#fbf6e9',
      'paper-2': '#f5efde',
      'paper-deep': '#ede4cd',
      'pencil-darkest': '#1a1612',
      'pencil-dark': '#2a2520',
      pencil: '#3a352e',
      'pencil-mid': '#5e5852',
      'pencil-light': '#8a847a',
      'pencil-faint': '#b8b2a6',
      line: 'rgba(58, 53, 46, 0.22)',
      'line-strong': 'rgba(58, 53, 46, 0.5)',
      grid: 'rgba(58, 53, 46, 0.08)',
      selection: 'rgba(58, 53, 46, 0.18)',
      backdrop: 'rgba(26, 22, 18, 0.35)',
    },
  },
  'parchment-sepia': {
    name: 'Pergaminho + sépia',
    description: 'Variante quente, leitura editorial.',
    swatch: { paper: '#f4e8d0', pencil: '#3a1f0a' },
    tokens: {
      paper: '#f4e8d0',
      'paper-2': '#ecdfc1',
      'paper-deep': '#e0d0a8',
      'pencil-darkest': '#3a1f0a',
      'pencil-dark': '#4a2e15',
      pencil: '#5e4222',
      'pencil-mid': '#806136',
      'pencil-light': '#a0824f',
      'pencil-faint': '#c5a87a',
      line: 'rgba(94, 66, 34, 0.22)',
      'line-strong': 'rgba(94, 66, 34, 0.5)',
      grid: 'rgba(94, 66, 34, 0.08)',
      selection: 'rgba(94, 66, 34, 0.18)',
      backdrop: 'rgba(58, 31, 10, 0.35)',
    },
  },
  'blueprint-nankin': {
    name: 'Azul-blueprint + nankin',
    description: 'Conversa com referência arquitetônica.',
    swatch: { paper: '#d8e4ee', pencil: '#0a1f2e' },
    tokens: {
      paper: '#d8e4ee',
      'paper-2': '#c5d6e4',
      'paper-deep': '#b2c8d8',
      'pencil-darkest': '#0a1f2e',
      'pencil-dark': '#16334a',
      pencil: '#234a66',
      'pencil-mid': '#4a6580',
      'pencil-light': '#708ca8',
      'pencil-faint': '#a0b4c8',
      line: 'rgba(35, 74, 102, 0.22)',
      'line-strong': 'rgba(35, 74, 102, 0.5)',
      grid: 'rgba(35, 74, 102, 0.08)',
      selection: 'rgba(35, 74, 102, 0.18)',
      backdrop: 'rgba(10, 31, 46, 0.35)',
    },
  },
  'carvao-giz': {
    name: 'Carvão + giz',
    description: 'Variante dark — substitui o modo escuro.',
    swatch: { paper: '#1a1612', pencil: '#fbf6e9' },
    tokens: {
      paper: '#1a1612',
      'paper-2': '#2a2520',
      'paper-deep': '#3a352e',
      'pencil-darkest': '#fbf6e9',
      'pencil-dark': '#f5efde',
      pencil: '#ede4cd',
      'pencil-mid': '#b8b2a6',
      'pencil-light': '#8a847a',
      'pencil-faint': '#5e5852',
      line: 'rgba(251, 246, 233, 0.22)',
      'line-strong': 'rgba(251, 246, 233, 0.5)',
      grid: 'rgba(251, 246, 233, 0.08)',
      selection: 'rgba(251, 246, 233, 0.18)',
      backdrop: 'rgba(0, 0, 0, 0.55)',
    },
  },
}

export const DEFAULT_PALETTE: PaletteKey = 'cream-graphite'
export const STORAGE_KEY = 'mg-palette'

export function applyPaletteToRoot(key: PaletteKey) {
  const entry = palettes[key]
  if (!entry) return
  const root = document.documentElement
  for (const [token, value] of Object.entries(entry.tokens)) {
    root.style.setProperty(`--${token}`, value)
  }
  root.setAttribute('data-palette', key)
}

/**
 * Pre-hydration script — aplica a paleta salva ANTES da React montar,
 * pra evitar flash de cor durante a hidratação. Injetado inline no `<head>`.
 *
 * Re-serializa as paletas como JSON pra o script ser self-contained no client
 * (não precisa importar nada do bundle).
 */
export const PALETTE_INIT_SCRIPT = `(function(){try{var k=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||${JSON.stringify(DEFAULT_PALETTE)};var p=${JSON.stringify(
  Object.fromEntries(Object.entries(palettes).map(([k, v]) => [k, v.tokens])),
)};var t=p[k];if(!t)return;var r=document.documentElement;for(var n in t){r.style.setProperty('--'+n,t[n]);}r.setAttribute('data-palette',k);}catch(e){}})();`
