import type { Work } from '@/lib/work'

export function CaseHero({ work }: { work: Work }) {
  return (
    <header className="relative isolate overflow-hidden pt-24 pb-28 sm:pt-32 sm:pb-40">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]"
        style={{
          background: `radial-gradient(55% 50% at 25% 15%, hsl(${work.hue} / 0.22), transparent 65%), radial-gradient(45% 50% at 85% 90%, hsl(${work.hue} / 0.14), transparent 60%)`,
        }}
      />

      <p className="mono-upper text-[var(--pencil-mid)]">Work — {work.company}</p>

      <h1 className="display-case-hero mt-8 text-balance text-[clamp(2.75rem,7vw,5.5rem)] text-[var(--pencil-darkest)]">
        {work.tagline}
      </h1>

      <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-4 text-sm text-[var(--pencil-mid)]">
        <div className="flex flex-col gap-1">
          <dt className="mono-upper">Role</dt>
          <dd className="text-[var(--pencil-darkest)]">{work.role}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="mono-upper">Period</dt>
          <dd className="text-[var(--pencil-darkest)]">{work.period}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="mono-upper">Domain</dt>
          <dd className="text-[var(--pencil-darkest)]">{work.domain}</dd>
        </div>
      </dl>
    </header>
  )
}
