/**
 * Single source of truth for site-wide metadata.
 * Every value is a decision.
 */

export const site = {
  name: 'Matt Goulart',
  shortName: 'mg',
  url: 'https://mattgoulart.com',
  locale: 'pt_BR',

  // Manifesto atual — direção 1 (rascunho vivo). String pura usada em metadata/OG.
  manifesto: 'Pensando produtos. Fazendo sistemas.',

  // Camadas extras do hero: a versão riscada (rejeitada) + nota handwritten ao lado.
  // Vivem no componente <Manifesto> e respeitam o blueprint toggle.
  manifestoMeta: {
    previous: 'Construindo produtos em ambientes ágeis.',
    // \n controla quebra de linha explícita na anotação handwritten.
    note: 'e esse site é\no meu sistema.',
  },

  // Assinatura do site — colophon handwritten no footer. Inspirado em Jackie Zhang.
  colophon: 'Feito com café, código & curiosidade.',

  // Sub-claim que rotula sem virar headline. Usado em /about e OG.
  role: 'Senior Product Designer · Design Engineer em evolução',

  // Social handles — só declarar os que realmente usa.
  social: {
    github: 'https://github.com/MatheusGouilward/portfolio',
    linkedin: 'https://www.linkedin.com/in/matheusgouilward',
    email: 'hello@mattgoulart.com',
  },
} as const

export const nav = [
  { href: '/', label: 'Início' },
  { href: '/work', label: 'Cases' },
  { href: '/craft', label: 'Experimentos' },
  { href: '/thoughts', label: 'Notas' },
  { href: '/now', label: 'Agora' },
  { href: '/about', label: 'Sobre' },
] as const
