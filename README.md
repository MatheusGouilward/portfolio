# mattgoulart.com

Portfolio de Matt Goulart — Senior Product Designer em evolução para Design Engineer.

Não é vitrine de PDFs. É um caderno de sketch que comenta a si mesmo: cada decisão de UI tem uma anotação handwritten ao lado apontando o porquê. Toggle desliga as anotações se preferir só o site.

**Live em:** [mattgoulart.com](https://mattgoulart.com)

---

## Stack

- **Next.js 15** (App Router) + TypeScript estrito
- **Tailwind CSS v4** com tokens semânticos em CSS custom properties
- **Motion** (motion/react) — animações declarativas, respeita `prefers-reduced-motion`
- **View Transitions API** — cross-fade nativo na troca de paleta
- **SVG inline** pra todas anotações (setas, dimensões, elipses)
- **Fontes:** Inter Tight (display + body), Architects Daughter (anotações handwritten), JetBrains Mono (specs + dimensões)
- Sem framework de UI. Primitives próprios, Radix puro só onde precisa.

## Características técnicas que valem ler o código

- **Tokens dinâmicos com View Transitions** ([`/craft/tokens-dinamicos-view-transitions`](https://mattgoulart.com/craft/tokens-dinamicos-view-transitions)) — picker no header troca toda a paleta em runtime via `style.setProperty` no `:root`. Cross-fade nativo, fallback graceful, anti-flash via script inline no `<head>`. 4 paletas, todas WCAG AA.
- **Blueprint Toggle** — atalho `B` liga/desliga as anotações UX. State em `localStorage`. SVGs animam via `pathLength` 0→1 quando entram na viewport.
- **Anotações handwritten** com componentes próprios (`HandNote`, `Annotated`, `HickGesture`). Rotação assinada determina lado (positiva = direita, negativa = esquerda) e gap de 80px do conteúdo.
- **A11y** — semântica HTML primeiro, ARIA só onde precisa. Skip link, focus visível 2px offset 4px, `prefers-reduced-motion` honrado em todas animações.

## Rodando local

```bash
pnpm install
pnpm dev
```

Abre em http://localhost:3000.

```bash
pnpm build              # build de produção
pnpm tsc --noEmit       # typecheck
pnpm dev:clean          # mata processos Next órfãos + limpa .next + reinicia (Windows / PowerShell)
```

## Estrutura

```
src/
├── app/                    # App Router — uma pasta por rota
│   ├── page.tsx            # home
│   ├── work/               # cases
│   ├── craft/              # microexperimentos
│   ├── thoughts/           # ensaios
│   ├── about/              # bio + timeline
│   └── now/                # updates
├── components/             # componentes compartilhados
│   ├── hand-note.tsx       # anotação handwritten sem seta
│   ├── annotated.tsx       # anotação com seta apontando alvo
│   ├── hick-gesture.tsx    # elipse + seta + nota (gesto único)
│   ├── palette-picker.tsx  # dropdown de paletas no header
│   ├── palette-provider.tsx
│   └── ...
└── lib/
    ├── palettes.ts         # 4 paletas + applyPaletteToRoot()
    ├── work.ts             # cases
    ├── thoughts.ts         # ensaios
    └── ...
```

## Sobre o autor

[Matt Goulart](https://mattgoulart.com/about). Senior Product Designer com 6+ anos em B2B SaaS. Foco em Design Systems, Data Visualization e produtos densos com IA — operando com Claude Code, Cursor e prototipação em código no dia a dia.

Contato: [hello@mattgoulart.com](mailto:hello@mattgoulart.com)
LinkedIn: [in/matheusgouilward](https://www.linkedin.com/in/matheusgouilward)

## License

[MIT](./LICENSE)
