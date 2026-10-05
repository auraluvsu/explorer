import type { ReactNode } from 'react'

const tones = {
  category: 'text-sky border-sky/30 bg-sky/10',
  ceiling: 'text-ok border-ok/30 bg-ok/10',
  exit: 'text-warn border-warn/30 bg-warn/10',
  neutral: 'text-muted border-line bg-base/40',
}

export function TagPill({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={`caption inline-flex items-center rounded-full border px-2 py-0.5 ${tones[tone]}`}>{children}</span>
}
