import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend } from 'recharts'
import { Trophy } from 'lucide-react'
import { useExplorerStore, useScoredBusinesses } from '@/store/useExplorerStore'
import { CRITERIA, HIDES_FEASIBILITY } from '@/lib/presets'
import { formatMultiple, formatRange } from '@/lib/format'
import { ScoreBadge } from '@/components/ScoreBadge'

const palette = ['#38bdf8', '#34d399', '#fbbf24', '#f87171']

export function CompareView() {
  const { selectedBusinessIds, toggleBusiness, clearSelection, activePresetId } = useExplorerStore()
  const scored = useScoredBusinesses()
  const all = scored.map((b) => b.finalScore)
  const picked = selectedBusinessIds.map((id) => scored.find((b) => b.id === id)!).filter(Boolean)
  const winner = picked.length > 1 ? [...picked].sort((a, b) => b.finalScore - a.finalScore)[0] : null
  const radar = CRITERIA.filter((c) => !(c.key === 'feas' && HIDES_FEASIBILITY(activePresetId))).map((c) => ({ axis: c.short, ...Object.fromEntries(picked.map((b) => [b.id, b.scores[c.key]])) }))

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[300px_1fr]">
      <section aria-label="Pick businesses">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="caption text-muted">Select 2–4 <span className="num">({picked.length}/4)</span></h2>
          {picked.length > 0 && <button onClick={clearSelection} className="text-[12px] text-sky hover:underline">Clear</button>}
        </div>
        <ul className="max-h-[calc(100vh-190px)] space-y-1 overflow-y-auto pr-1">
          {scored.map((b) => {
            const on = selectedBusinessIds.includes(b.id)
            const full = !on && picked.length >= 4
            return (
              <li key={b.id}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition-colors ${on ? 'border-sky bg-sky/10' : 'border-transparent hover:bg-panel'} ${full ? 'cursor-not-allowed opacity-40' : ''}`}>
                  <input type="checkbox" checked={on} disabled={full} onChange={() => toggleBusiness(b.id)} className="accent-sky" />
                  <span className="flex-1 truncate">{b.name}</span>
                  <span className="num text-[12px] text-muted">{b.finalScore.toFixed(2)}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="min-w-0">
        {picked.length < 2 ? (
          <div className="flex h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-line text-center">
            <p className="text-[18px] font-semibold">{picked.length === 0 ? 'No businesses selected' : 'Pick at least one more'}</p>
            <p className="mt-1 max-w-sm text-muted">Choose two to four ideas on the left to compare them across all six criteria.</p>
          </div>
        ) : (
          <>
            {winner && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-ok/30 bg-ok/10 px-4 py-3">
                <Trophy size={18} className="text-ok" />
                <p><span className="font-semibold">{winner.name}</span> wins under the current weights with <span className="num text-ok">{winner.finalScore.toFixed(2)}</span>.</p>
              </div>
            )}
            <div className="h-[380px] rounded-lg border border-line bg-panel p-4">
              <ResponsiveContainer>
                <RadarChart data={radar} outerRadius="75%">
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                  {picked.map((b, i) => <Radar key={b.id} name={b.name} dataKey={b.id} stroke={palette[i]} fill={palette[i]} fillOpacity={0.15} strokeWidth={2} />)}
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-panel">
                  <tr>{['Business', 'Score', 'Profit ceiling', 'Exit multiple', 'Biggest con'].map((h) => <th key={h} className="caption border-b border-line px-3 py-3 text-muted">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {picked.map((b, i) => (
                    <tr key={b.id} className={`border-b border-line/60 ${winner?.id === b.id ? 'bg-ok/5' : ''}`}>
                      <td className="px-3 py-2.5 font-medium"><span className="mr-2 inline-block size-2 rounded-full" style={{ background: palette[i] }} />{b.name}</td>
                      <td className="px-3 py-2.5"><ScoreBadge score={b.finalScore} all={all} /></td>
                      <td className="num whitespace-nowrap px-3 py-2.5 text-ok">{formatRange(b.profitCeiling.low, b.profitCeiling.high)}</td>
                      <td className="num whitespace-nowrap px-3 py-2.5 text-warn">{formatMultiple(b.exitMultiple.low)}–{formatMultiple(b.exitMultiple.high)}</td>
                      <td className="px-3 py-2.5 text-[13px] text-muted">{b.biggestCon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
