import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'
import { useExplorerStore, useSortedBusinesses, useScoredBusinesses } from '@/store/useExplorerStore'
import type { SortKey, Criterion } from '@/types/business'
import { CRITERIA, HIDES_FEASIBILITY } from '@/lib/presets'
import { formatMultiple, formatRange } from '@/lib/format'
import { ScoreBadge, scoreColor } from './ScoreBadge'

const allCols: { key: SortKey | null; label: string; align?: 'right' | 'center' }[] = [
  { key: null, label: 'Rank', align: 'center' },
  { key: 'name', label: 'Business' },
  ...CRITERIA.map((c) => ({ key: c.key as SortKey, label: c.key === 'feas' ? 'Feasibility' : c.short, align: 'center' as const })),
  { key: 'finalScore', label: 'Score', align: 'center' },
  { key: 'profitCeiling', label: 'Profit ceiling' },
  { key: 'exitMultiple', label: 'Exit multiple' },
  { key: null, label: 'Biggest con' },
  { key: null, label: 'Feasibility reason' },
]

export function RankingTable() {
  const rows = useSortedBusinesses()
  const scoredAll = useScoredBusinesses()
  const all = scoredAll.map((b) => b.finalScore)
  const feasAll = scoredAll.map((b) => b.scores.feas)
  const { sortKey, sortDir, setSort, openDetail, detailId, activePresetId } = useExplorerStore()
  const hideFeas = HIDES_FEASIBILITY(activePresetId)
  const cols = hideFeas ? allCols.filter((c) => c.key !== 'feas') : allCols
  const criteria = hideFeas ? CRITERIA.filter((c) => c.key !== 'feas') : CRITERIA

  return (
    <div className="overflow-auto rounded-lg border border-line" style={{ maxHeight: 'calc(100vh - 150px)' }}>
      <table className="w-full min-w-[1400px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-panel">
          <tr>
            {cols.map((c, i) => {
              const active = c.key === sortKey
              return (
                <th
                  key={i}
                  scope="col"
                  aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`caption border-b border-line px-3 py-3 text-muted ${c.align === 'center' ? 'text-center' : ''}`}
                >
                  {c.key ? (
                    <button onClick={() => setSort(c.key!)} className={`inline-flex items-center gap-1 uppercase hover:text-ink ${active ? 'text-sky' : ''}`}>
                      {c.label}
                      {active && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  ) : c.label}
                </th>
              )
            })}
            <th className="border-b border-line" />
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => (
            <tr
              key={b.id}
              tabIndex={0}
              onClick={() => openDetail(b.id)}
              onKeyDown={(e) => e.key === 'Enter' && openDetail(b.id)}
              className={`group cursor-pointer border-b border-line/60 transition-colors hover:bg-elevated ${detailId === b.id ? 'bg-elevated' : i % 2 ? 'bg-panel/40' : ''}`}
            >
              <td className="num px-3 py-2.5 text-center text-muted">{b.rank}</td>
              <td className="px-3 py-2.5">
                <div className="font-medium">{b.name}</div>
                <div className="caption text-muted">{b.category}</div>
              </td>
              {criteria.map((c) =>
                c.key === 'feas' ? (
                  <td key={c.key} className="px-3 py-2.5 text-center"><ScoreBadge score={b.scores.feas} all={feasAll} digits={0} /></td>
                ) : (
                  <td key={c.key} className={`num px-3 py-2.5 text-center ${scoreColor(b.scores[c.key as Criterion])}`}>{b.scores[c.key]}</td>
                ),
              )}
              <td className="px-3 py-2.5 text-center"><ScoreBadge score={b.finalScore} all={all} /></td>
              <td className="num whitespace-nowrap px-3 py-2.5 text-ok">{formatRange(b.profitCeiling.low, b.profitCeiling.high)}</td>
              <td className="num whitespace-nowrap px-3 py-2.5 text-warn">{formatMultiple(b.exitMultiple.low)}–{formatMultiple(b.exitMultiple.high)}</td>
              <td className="max-w-[240px] px-3 py-2.5 text-[13px] text-muted">{b.biggestCon}</td>
              <td className="max-w-[240px] px-3 py-2.5 text-[13px] text-sky/90">{b.feasibility.reason}</td>
              <td className="pr-3 text-muted group-hover:text-sky"><ChevronRight size={16} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
