# Personal assets — polaroid draggable

Coloque aqui os 3 arquivos que vão compor o `<PolaroidDraggable>` no `/about` (referência: Jackie Zhang).

## Arquivos esperados

### `matt.jpg` (ou `.webp`)
Sua foto retrato.

- **Formato:** `.jpg` ou `.webp` (preferir webp pra perf)
- **Proporção:** ~4:5 (vertical, estilo retrato)
- **Resolução:** mínimo **480 × 600px**, ideal **960 × 1200px** (retina-ready)
- **Enquadramento:** rosto centralizado no terço superior. O capacete vai pousar EM CIMA do rosto — deixar espaço suficiente acima da cabeça pra ele caber.
- **Cores:** usar como está (a foto que você tem já tem pouca saturação, sobrevive em todas as paletas).

### `mask.png`
Imagem do capacete/máscara que vai cobrir o rosto.

- **Formato:** `.png` com **fundo transparente** (essencial — sem transparência não dá pra sobrepor)
- **Resolução:** mínimo **480 × 480px**, ideal **960 × 960px**
- **Proporção:** quadrada (1:1) ou ~5:6
- **Enquadramento:** capacete/máscara ocupando o centro do arquivo, com ~10% de respiro nas bordas. Idealmente posicionado pra cobrir onde o rosto vai estar na foto.

### `signature.png`
Sua assinatura. Vai aparecer abaixo da foto, dentro da polaroid (área tradicional de assinatura/legenda de polaroid revelada).

- **Formato:** `.png` com **fundo transparente**
- **Resolução:** mínimo **240 × 80px**, ideal **480 × 160px** (~3:1 ratio típico de assinatura)
- **Cor:** qualquer cor que você usa pra assinar. Vermelho funciona (igual o Jackie) — vai destacar bem no fundo paper da polaroid.
- **Enquadramento:** assinatura ocupa a área útil, com pouco respiro nas bordas. Sem outros elementos.

## Comportamento da polaroid no site

(Pra você visualizar antes do CC implementar)

- **Polaroid arrastrável** no `/about` (xl+ apenas — mobile fica estática).
- **Foto fica** onde você soltar — sem snap.
- **Máscara é arrastrável** dentro da polaroid, mas com **snap magnético** — solta e ela volta pro centro (sobre o rosto).
- **Assinatura** aparece na faixa inferior branca da polaroid, em escala modesta (~60% da largura útil), com leve rotação.
- **Sombra suave**, leve rotação (-3°) da polaroid pra parecer foto solta.
- Drag funciona em touch também.
- `prefers-reduced-motion`: drag continua, mas máscara volta sem spring bounce.

## Quando estiver pronto

1. Coloque os 3 arquivos com os nomes exatos:
   - `matt.jpg` (ou `.webp`)
   - `mask.png`
   - `signature.png`
2. Avise no Cowork.
3. CC implementa o componente seguindo a tarefa **22.7** do `TASKS.md`.

## Privacidade

Esses arquivos vão pro repositório público (estão em `public/`). Garanta que está confortável com:
- A foto sendo indexável por mecanismos de busca.
- A assinatura sendo publicamente acessível (relevante se você usa a mesma em documentos legais — recomendo uma assinatura *artística*, não a oficial).
- A imagem da máscara estar disponível publicamente.

Se preferir privacidade adicional, podemos hospedar via Vercel Blob ou similar (P2 pós-launch).
