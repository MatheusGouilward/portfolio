import { Architects_Daughter, Inter_Tight, JetBrains_Mono } from 'next/font/google'

/**
 * Display + body — Inter Tight.
 * Usada em H1 monumental (peso 900) e em body (400/500/600).
 * Optical sizing automático.
 */
export const fontSans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

/**
 * Hand — Architects Daughter.
 * Exclusiva pras anotações (callouts, badges UX, hierarchy marks).
 * Peso único (regular). Aceita upper + lower case.
 */
export const fontHand = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
  weight: '400',
})

/**
 * Mono — JetBrains Mono Variable.
 * Specs técnicos, dimension lines, timecodes, metadados.
 */
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
