import { useEffect, useState } from 'react'
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { useExplorerStore, useScoredBusinesses, type Scored } from '@/store/useExplorerStore'
import { formatCurrency } from '@/lib/format'

type YKey = 'sell' | 'feas' | 'finalScore'
const yOptions: { id: YKey; label: string }[] = [
  { id: 'sell', label: 'Ease to Sell' },
  { id: 'feas', label: 'Feasibility' },
  { id: 'finalScore', label: 'Final Score' },
]

const filters = [
  { id: 'all', label: 'All 20' },
  { id: 'high-ceiling', label: 'High-Ceiling (1–10)' },
  { id: 'sellable-lowcost', label: 'Sellable / Low-Cost (11–20)' },
] as const

const satColor = (s: number) => `hsl(${((s - 1) / 9) * 140}, 75%, 62%)`

function Bubble(props: { cx?: number; cy?: number; payload?: Scored & { z: number }; size?: number }) {
  const { cx = 0, cy = 0, payload, size = 100 } = props
  if (!payload) return null
  const r = Math.sqrt(size) / 1.6
  const openDetail = useExplorerStore.getState().openDetail
  return (
    <g style={{ cursor: 'pointer' }} onClick={() => openDetail(payload.id)}>
      <circle cx={cx} cy={cy} r={r} fill={satColor(payload.scores.sat)} fillOpacity={0.55} stroke={satColor(payload.scores.sat)} strokeWidth={1.5} />
    </g>
  )
}

export function ScatterView() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const presetId = useExplorerStore((s) => s.activePresetId)
  const [yKey, setYKey] = useState<YKey>(presetId === 'builder' ? 'feas' : 'sell')
  useEffect(() => { if (presetId === 'builder') setYKey('feas') }, [presetId])
  const yLabel = yOptions.find((o) => o.id === yKey)!.label
  const scored = useScoredBusinesses()
  const data = scored
    .filter((b) => filter === 'all' || b.tier === filter)
    .map((b) => ({ ...b, x: b.scores.cost, y: yKey === 'finalScore' ? +b.finalScore.toFixed(2) : b.scores[yKey], z: b.profitCeiling.high }))

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold leading-[30px]">Cost vs. {yLabel.toLowerCase()}</h2>
          <p className="text-muted">Bubble size = profit ceiling · color = saturation (red saturated, green open). Top-right is cheap and high on the chosen axis.</p>
        </div>
 <div className="flex flex-wrap gap-3">
        <div role="group" aria-label="Y-axis" className="flex items-center gap-1 rounded-lg bg-panel p-1">
          <span className="caption px-2 text-muted">Y</span>
          {yOptions.map((o) => (
            <button key={o.id} onClick={() => setYKey(o.id)} aria-pressed={yKey === o.id}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${yKey === o.id ? 'bg-sky text-base' : 'text-muted hover:text-ink'}`}>{o.label}</button>
          ))}
        </div>
        <div role="group" aria-label="Tier filter" className="flex gap-1 rounded-lg bg-panel p-1">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${filter === f.id ? 'bg-sky text-base' : 'text-muted hover:text-ink'}`}>
              {f.label}
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className="h-[560px] rounded-lg border border-line bg-panel p-4">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 16, right: 24, bottom: 28, left: 8 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" domain={[2, 11]} ticks={[3, 4, 5, 6, 7, 8, 9, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Startup cost score  (cheap →)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} />
            <YAxis type="number" dataKey="y" domain={[0, 11]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
            <ZAxis type="number" dataKey="z" range={[300, 4200]} />
            <Tooltip
              cursor={{ stroke: '#38bdf8', strokeDasharray: '3 3' }}
              content={({ payload }) => {
                const p = payload?.[0]?.payload as (Scored & { z: number }) | undefined
                if (!p) return null
                return (
                  <div className="rounded-md border border-line bg-base px-3 py-2 shadow-xl">
                    <p className="font-semibold">{p.name}</p>
                    <p className="num text-sky">Score {p.finalScore.toFixed(2)}</p>
                    <p className="num text-[12px] text-muted">Ceiling up to {formatCurrency(p.profitCeiling.high)}</p>
                  </div>
                )
              }}
            />
            <Scatter data={data} shape={<Bubble />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[12px] text-muted">Click a bubble to open details. Cost, sell, and saturation are static scores; the tooltip score follows your weights.</p>
    </div>
  )
}
