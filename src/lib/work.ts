/**
 * Work = cases narrativos.
 * Não case study tradicional. Vivência em camadas.
 *
 * Cada case tem:
 * - hero abstrato (sem screenshot)
 * - opening em 1ª pessoa
 * - 3-4 layers temáticas (cada uma com 1 componente interativo extraído)
 * - métricas como momentos tipográficos (peak)
 * - fechamento que abre, não fecha (Zeigarnik)
 */

export type WorkLayer = {
  title: string
  /** 1-2 paragraphs */
  body: string
}

export type WorkMetric = {
  label: string
  value: string
  /** qualitativo quando não tem percentual válido */
  qualitative?: boolean
}

export type Work = {
  slug: string
  company: string
  /** ex: 'EdTech SaaS', 'CRM B2B + Martech' */
  domain: string
  role: string
  period: string
  /** color seed for the abstract hero — accent token modulated */
  hue: string
  /** short tagline used in listings + meta */
  tagline: string
  /** 1-line proof shown on the home (CaseEditorial dialect) */
  homeHighlight?: string
  opening: string[]
  layers: WorkLayer[]
  metrics: WorkMetric[]
  /** transição final — link pra próximo case ou craft */
  closing: {
    body: string
    nextLabel: string
    nextHref: string
  }
  status?: 'live' | 'wip' | 'draft'
}

export const works: Work[] = [
  {
    slug: 'jovens-genios',
    company: 'Jovens Gênios',
    domain: 'EdTech SaaS',
    role: 'Product Designer',
    period: 'Jul 2022 — Fev 2026',
    hue: '32 100% 58%', // âmbar-laranja, ligado ao tema educacional + accent
    tagline:
      'Quatro anos no produto pedagógico que mudou a sala de aula.',
    homeHighlight:
      'CSAT 30 → 90 · 78% engajamento nos Copilots · Design System do zero.',
    opening: [
      // Será reescrito ao implementar — placeholder mantém estrutura
      'Cheguei na Jovens Gênios em julho de 2022. A empresa fazia EdTech B2B pra escolas e tinha um produto que crescia mais rápido do que o time conseguia desenhar.',
      'Saí em fevereiro de 2026 com o produto rodando em escala nacional, um Design System construído do zero, AI Copilots pedagógicos em produção e dashboards que viraram parte da rotina de educadores e gestores.',
    ],
    layers: [
      {
        title: 'Construindo o Design System',
        body: 'Tokens semânticos, componentes acessíveis, governança visual. O DS reduziu retrabalho e virou a peça que sustentou tudo que veio depois.',
      },
      {
        title: 'Os AI Copilots pedagógicos',
        body: 'IA aplicada a apoio pedagógico — não como gadget, como ferramenta de decisão pra educadores. Cuidado com confiança, ambiguidade e responsabilidade.',
      },
      {
        title: 'Dashboards que mudaram a sala de aula',
        body: 'Visualização de aprendizagem, engajamento, progresso e risco de evasão. Dados acionáveis pra educadores e gestores — não relatório bonito.',
      },
      {
        title: 'O que aprendi sobre escala',
        body: 'Produto educacional em escala nacional é outra besta. Sobre métricas, governança, decisões que duram, e o limite entre design opinativo e design pragmático.',
      },
    ],
    metrics: [
      { label: 'CSAT', value: '30% → 90%' },
      { label: 'Velocidade de entregas', value: '+40%' },
      { label: 'Engajamento dos AI Copilots', value: '78%' },
      { label: 'Aumento no aprendizado comprovado', value: '4,2x' },
    ],
    closing: {
      body: 'A vivência seguinte foi em outro setor — CRM com IA. Outras dores, mesma curiosidade.',
      nextLabel: 'Sellbie →',
      nextHref: '/work/sellbie',
    },
    status: 'wip',
  },

  {
    slug: 'sellbie',
    company: 'Sellbie',
    domain: 'CRM B2B · Marketing automation com IA',
    role: 'Product Designer',
    period: 'Jun 2024 — Mar 2025',
    hue: '210 100% 60%', // azul frio, contraste com JG
    tagline:
      'Redesenhei o CRM B2B que marcas como L’Occitane, Grand Cru e Ortobom usam pra rodar marketing de propensão por IA.',
    homeHighlight:
      'CRM B2B com IA de propensão pra L’Occitane, Grand Cru e Ortobom. Design System do zero + dashboards multicanal.',
    opening: [
      'Sellbie é CRM B2B com marketing automation multicanal — Email, WhatsApp, SMS — e IA de propensão de compra. Entrei pra liderar o redesign do produto e construir o Design System.',
      'Em nove meses redesenhei fluxos core, montei dashboards multicanal com drill-down por canal, e desenhei o copiloto que ajuda usuários a entender segmentação de propensão alta/média/baixa.',
    ],
    layers: [
      {
        title: 'Redesign do produto',
        body: 'Mapeei fluxos core, redesenhei do começo, validei com testes de usabilidade. Foco em reduzir inconsistências e acelerar ciclos operacionais.',
      },
      {
        title: 'Dashboard de propensão por IA',
        body: 'Classificação alta/média/baixa, histórico de evolução, drill-down por canal cobrindo receita, entregabilidade (DNS, ISPs, bounces, opt-outs) e engajamento.',
      },
      {
        title: 'Multicanal sem virar caos',
        body: 'Email + WhatsApp + SMS no mesmo painel. Como dar contexto sem perder densidade. Como deixar power user mover rápido sem perder novato.',
      },
      {
        title: 'Decisões que ficaram',
        body: 'O que veio do DS, o que veio do copiloto, e o que a gente aprendeu sobre desenhar produto que atende marca grande sem virar plataforma genérica.',
      },
    ],
    // Sellbie SEM percentuais cravados — perfil avisa
    metrics: [
      { label: 'Redução de inconsistências visuais', value: 'após DS do zero', qualitative: true },
      { label: 'Aceleração de ciclos operacionais', value: 'validada qualitativamente', qualitative: true },
      { label: 'Validação por testes de usabilidade', value: 'em fluxos core', qualitative: true },
    ],
    closing: {
      body: 'Depois disso voltei a focar em playground próprio — produto pessoal, exploração técnica, e os experimentos que viraram este site.',
      nextLabel: 'Craft →',
      nextHref: '/craft',
    },
    status: 'wip',
  },
]

export function getPublishedWorks() {
  return works.filter((w) => w.status !== 'draft')
}

export function getWorkBySlug(slug: string) {
  return works.find((w) => w.slug === slug)
}
