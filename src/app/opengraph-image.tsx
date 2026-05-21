import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt =
  'Matt Goulart — Senior Product Designer em evolução para Design Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Carrega font do Google Fonts em TTF pra usar dentro do ImageResponse.
 * UA Safari 5 macOS força Google Fonts a servir TTF (testado 2026-05-21).
 * UAs mais novos recebem woff2 (Satori não suporta). UAs muito antigos
 * (IE 8) recebem EOT (também não suportado).
 */
async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+',
  )}:wght@${weight}`
  const css = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3',
    },
  }).then((r) => r.text())
  const match = css.match(/src:\s*url\((.+?)\)/)
  if (!match) throw new Error(`Font URL not found in CSS for: ${family} ${weight}`)
  return fetch(match[1]).then((r) => r.arrayBuffer())
}

export default async function OpenGraphImage() {
  let interTight: ArrayBuffer | undefined
  let architects: ArrayBuffer | undefined
  let mono: ArrayBuffer | undefined
  try {
    ;[interTight, architects, mono] = await Promise.all([
      loadGoogleFont('Inter Tight', 900),
      loadGoogleFont('Architects Daughter', 400),
      loadGoogleFont('JetBrains Mono', 500),
    ])
  } catch {
    // Falha graceful — Satori usa fonts default. Visual menos rico, mas funciona.
  }

  const fonts: Array<{
    name: string
    data: ArrayBuffer
    weight: 400 | 500 | 900
    style: 'normal'
  }> = []
  if (interTight)
    fonts.push({ name: 'Inter Tight', data: interTight, weight: 900, style: 'normal' })
  if (architects)
    fonts.push({
      name: 'Architects Daughter',
      data: architects,
      weight: 400,
      style: 'normal',
    })
  if (mono)
    fonts.push({ name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fbf6e9',
          padding: '72px 80px',
          fontFamily: 'Inter Tight, sans-serif',
        }}
      >
        {/* Riscada handwritten (versão rejeitada) */}
        <div
          style={{
            fontFamily: 'Architects Daughter, cursive',
            fontSize: 26,
            color: '#5e5852',
            textDecoration: 'line-through',
            textDecorationColor: '#3a352e',
            textDecorationThickness: 2,
            opacity: 0.75,
            display: 'flex',
          }}
        >
          Construindo produtos em ambientes ágeis.
        </div>

        {/* Manifesto + anotação lateral */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flex: 1,
            marginTop: 24,
            gap: 56,
          }}
        >
          <h1
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 0.96,
              letterSpacing: '-0.04em',
              color: '#1a1612',
              margin: 0,
              maxWidth: 760,
            }}
          >
            Pensando produtos. Fazendo sistemas.
          </h1>

          {/* HandNote +15° (mesmo gesto do site) */}
          <div
            style={{
              fontFamily: 'Architects Daughter, cursive',
              fontSize: 24,
              color: '#3a352e',
              transform: 'rotate(15deg)',
              transformOrigin: 'left top',
              maxWidth: 200,
              lineHeight: 1.3,
              marginTop: 32,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>e esse site é</span>
            <span>o meu sistema.</span>
          </div>
        </div>

        {/* Footer: mg + mattgoulart.com */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            color: '#5e5852',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: 'auto',
          }}
        >
          <span>mg</span>
          <span>mattgoulart.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  )
}
