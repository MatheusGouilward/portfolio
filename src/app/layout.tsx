import type { Metadata, Viewport } from 'next'
import { fontHand, fontMono, fontSans } from '@/lib/fonts'
import { site } from '@/lib/site'
import { PaletteProvider } from '@/components/palette-provider'
import { PALETTE_INIT_SCRIPT } from '@/lib/palettes'
import {
  BlueprintProvider,
  BLUEPRINT_INIT_SCRIPT,
} from '@/components/blueprint-provider'
import { BlueprintToggle } from '@/components/blueprint-toggle'
import { BackToTop } from '@/components/back-to-top'
import { ScrollProvider } from '@/components/scroll-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { cn } from '@/lib/utils'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.manifesto,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    title: site.name,
    description: site.manifesto,
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.manifesto },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf6e9' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1612' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Anti-flash: aplica paleta + blueprint antes da hidratação React. */}
        <script dangerouslySetInnerHTML={{ __html: PALETTE_INIT_SCRIPT }} />
        <script
          dangerouslySetInnerHTML={{ __html: BLUEPRINT_INIT_SCRIPT }}
        />
      </head>
      <body
        className={cn(
          fontSans.variable,
          fontHand.variable,
          fontMono.variable,
          'min-h-dvh font-sans antialiased',
        )}
      >
        <PaletteProvider>
          <BlueprintProvider>
            <a
              href="#main"
              className={cn(
                'sr-only fixed left-4 top-4 z-50 px-3 py-1.5 text-sm',
                'bg-[var(--pencil-darkest)] text-[var(--paper)]',
                'focus:not-sr-only focus:outline-none',
              )}
            >
              Pular para o conteúdo principal
            </a>

            {/* Smooth scroll global (Lenis) + bridge pro GSAP ScrollTrigger.
                Lazy load via dynamic import; respeita prefers-reduced-motion. */}
            <ScrollProvider />

            {/* BlueprintToggle no início do DOM pra Tab order priorizar a tese. */}
            <BlueprintToggle />
            <BackToTop />

            <SiteHeader />
            {/* Main ocupa viewport inteiro. Cada page controla seu próprio
                container max-w-5xl. Margens externas ficam disponíveis pra
                anotações handwritten — desenho técnico, anotação ao redor. */}
            <main id="main" className="w-full">
              {children}
            </main>
            <SiteFooter />
          </BlueprintProvider>
        </PaletteProvider>
      </body>
    </html>
  )
}
