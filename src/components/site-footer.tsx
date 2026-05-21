import Link from 'next/link'
import { site } from '@/lib/site'
import { BlueprintGutter } from '@/components/blueprint-gutter'
import { GutterArrow } from '@/components/gutter-arrow'
import { UXConcept } from '@/components/ux-concept'

const socials = [
  { label: 'Email', href: `mailto:${site.social.email}` },
  { label: 'LinkedIn', href: site.social.linkedin },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'X', href: 'https://x.com' },
]

export function SiteFooter() {
  return (
    <footer className="mt-40 border-t border-[var(--line)]">
      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:px-10">
        {/* Postel — gutter direito ancorado no max-w-5xl */}
        <BlueprintGutter side="right" topClass="top-14" align="start" width={180}>
          <UXConcept category="laws" name="Postel" description="entrada / saída clara" />
        </BlueprintGutter>
        {/* Seta apontando os socials */}
        <GutterArrow
          direction="left"
          variant="deep"
          length={200}
          height={80}
          className="right-0 top-20 hidden translate-x-[45%] xl:block"
        />


        <div className="grid gap-10 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-2xl font-black tracking-tight text-[var(--pencil-darkest)]">
              Matt Goulart.
            </p>
            <p className="mt-3 max-w-md text-sm text-[var(--pencil-mid)]">
              Senior Product Designer na interseção entre design, sistemas e código.
              Disponível pra conversas sérias e jams de design.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-2 gap-y-2 self-end">
            {socials.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="mono-upper inline-flex h-11 items-center px-3 text-[var(--pencil-mid)] transition-colors hover:text-[var(--pencil-darkest)]"
                  rel="noopener noreferrer"
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                >
                  {s.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-10 sm:px-10">
        <p
          className="hand text-[var(--pencil)]"
          style={{ fontSize: 'clamp(17px, 1.8vw, 22px)', lineHeight: 1.3 }}
        >
          {site.colophon}
        </p>
        <div className="mono-upper mt-4 text-[var(--pencil-light)]">
          © {new Date().getFullYear()} · Next 15 · Inter Tight + Architects Daughter + JetBrains Mono
        </div>
      </div>
    </footer>
  )
}
