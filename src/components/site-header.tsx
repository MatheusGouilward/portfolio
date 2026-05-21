import Link from 'next/link'
import { nav, site } from '@/lib/site'
import { PalettePicker } from '@/components/palette-picker'
import { MobileNav } from '@/components/mobile-nav'

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur-md"
      style={{ background: 'color-mix(in oklab, var(--paper) 78%, transparent)' }}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="mono-upper text-[var(--pencil-darkest)] transition-opacity hover:opacity-70"
          style={{ fontSize: '12px', letterSpacing: '0.18em' }}
          aria-label={`${site.shortName} · Matt Goulart, home`}
        >
          {site.shortName}
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 sm:flex"
        >
          {nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mono-upper rounded-sm px-3 py-1.5 text-[var(--pencil-mid)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--pencil-darkest)]"
              style={{ fontSize: '11px', letterSpacing: '0.12em' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <PalettePicker />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
