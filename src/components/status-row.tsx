type StatusItem = { label: string; value: string }

/**
 * Status row em escala mono — 3 chunks (Agora / Em / Papel).
 * Labels em pt-BR pra casar com o resto do site (Nielsen #2).
 */
const items: StatusItem[] = [
  { label: 'Agora', value: 'Construindo este playground e o Design System próprio.' },
  { label: 'Em', value: 'Rio de Janeiro, BR.' },
  { label: 'Papel', value: 'Senior Product Designer — Design Engineer em evolução.' },
]

export function StatusRow() {
  return (
    <dl className="mt-12 grid gap-y-3 text-sm sm:max-w-3xl">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[88px_1fr] items-baseline gap-x-6 sm:grid-cols-[120px_1fr]"
        >
          <dt
            className="mono-upper text-[var(--pencil-mid)]"
            style={{ fontSize: '11px' }}
          >
            {item.label}
          </dt>
          <dd className="text-[var(--pencil-darkest)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
