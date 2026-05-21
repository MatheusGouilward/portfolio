/**
 * Craft = microexperimentos vivos.
 * Eixo central: IA como ferramenta operacional + craft fino.
 *
 * Conventions
 * - id ordering: most-recent first
 * - tags: lowercase, kebab-allowed
 * - publishedAt: ISO date
 * - draft: true = exists locally but doesn't show in published listings
 */

export type Craft = {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  publishedAt: string
  /** 'wip' = appears in listings but detail page shows "in progress" notice */
  /** 'live' = fully implemented */
  /** 'draft' = hidden from listings */
  status?: 'live' | 'wip' | 'draft'
}

export const crafts: Craft[] = [
  {
    id: '001',
    slug: 'pair-com-claude-code',
    title: 'Pair com Claude Code',
    description:
      'Anatomia de um workflow real onde um agente vira par técnico — não atalho, não brinquedo.',
    tags: ['ai', 'workflow'],
    publishedAt: '2026-05-22',
    status: 'wip',
  },
  {
    id: '002',
    slug: 'toast-com-physics',
    title: 'Toast com physics',
    description: 'Spring-based toast que reage à pressão de stack. Por que motion faz sentido aqui.',
    tags: ['motion', 'components'],
    publishedAt: '2026-05-20',
    status: 'wip',
  },
  {
    id: '003',
    slug: 'tokens-dinamicos-view-transitions',
    title: 'Tokens dinâmicos com View Transitions',
    description:
      'Trocar a paleta inteira em runtime, sem flicker. O picker no header opera o site real — clica e o cream-grafite vira pergaminho-sépia, azul-blueprint ou carvão-giz.',
    tags: ['design system', 'view transitions'],
    publishedAt: '2026-05-18',
    status: 'live',
  },
]

export function getPublishedCrafts() {
  return crafts.filter((c) => c.status !== 'draft')
}

export function getLatestCrafts(limit = 3) {
  return getPublishedCrafts().slice(0, limit)
}

/** Used during build/staging to preview drafts. */
export function getAllCraftsForBuild() {
  return crafts
}
