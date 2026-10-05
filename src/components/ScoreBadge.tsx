import { scoreTier } from '@/lib/scoring'

const tone = {
  high: 'text-ok bg-ok/10 border-ok/30',
  mid: 'text-warn bg-warn/10 border-warn/30',
  low: 'text-bad bg-bad/10 border-bad/30',
}

export function ScoreBadge({ score, all, digits = 2 }: { score: number; all: number[]; digits?: number }) {
  const t = scoreTier(score, all)
  return (
    <span className={`num inline-flex min-w-12 justify-center rounded border px-1.5 py-0.5 text-[13px] font-semibold ${tone[t]}`}>
      {score.toFixed(digits)}
    </span>
  )
}

export function scoreColor(v: number) {
  return v >= 7 ? 'text-ok' : v >= 4 ? 'text-ink' : 'text-bad'
}
