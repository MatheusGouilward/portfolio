export type Thought = {
  slug: string
  title: string
  excerpt: string
  /** Frase do excerpt destacada como pull quote no lead story da home. Opcional. */
  pullQuote?: string
  /** Palavra do título que ganha textura irregular (italic + slnt -8). Opcional. */
  wonkyWord?: string
  publishedAt: string
  readingMinutes: number
  status?: 'live' | 'wip' | 'draft'
}

export const thoughts: Thought[] = [
  {
    slug: 'show-feel-dont-tell',
    title: 'Show, feel, don’t tell',
    excerpt:
      'Como design engineers deixaram de explicar e começaram a deixar o usuário sentir.',
    pullQuote: 'Deixar o usuário sentir antes de explicar.',
    wonkyWord: 'feel',
    publishedAt: '2026-05-22',
    readingMinutes: 4,
    status: 'wip',
  },
  {
    slug: 'ia-como-ferramenta-de-trabalho',
    title: 'IA como ferramenta de trabalho, não como feature',
    excerpt:
      'Por que o eixo que importa em 2026 é fluência operacional, não AI Copilot no produto.',
    pullQuote: 'Fluência operacional > AI Copilot empacotado.',
    wonkyWord: 'ferramenta',
    publishedAt: '2026-05-10',
    readingMinutes: 6,
    status: 'wip',
  },
]

export function getPublishedThoughts() {
  return thoughts.filter((t) => t.status !== 'draft')
}

export function getRecentThoughts(limit = 3) {
  return getPublishedThoughts().slice(0, limit)
}
