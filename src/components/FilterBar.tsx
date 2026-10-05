import { Download, RotateCcw, BarChart3, ScatterChart as Sc, Network, Map, GitCompare } from 'lucide-react'
import { useExplorerStore, useSortedBusinesses } from '@/store/useExplorerStore'
import { PRESETS } from '@/lib/presets'
import { downloadCsv } from '@/lib/exportCsv'
import type { ViewId } from '@/types/business'

const views: { id: ViewId; label: string; icon: typeof Map }[] = [
  { id: 'dashboard', label: 'Ranking', icon: BarChart3 },
  { id: 'scatter', label: 'Scatter', icon: Sc },
  { id: 'tree', label: 'Tree', icon: Network },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'compare', label: 'Compare', icon: GitCompare },
]

export function FilterBar() {
  const { activeView, setView, activePresetId, applyPreset, selectedBusinessIds } = useExplorerStore()
  const rows = useSortedBusinesses()
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line bg-panel px-6 py-3">
      <div className="mr-2">
        <h1 className="text-[16px] font-semibold leading-5 tracking-tight">Business Ideas Explorer</h1>
        <p className="caption text-muted">20 ideas · 6 weighted criteria</p>
      </div>
      <nav aria-label="Views" className="flex gap-1 rounded-lg bg-base p-1">
        {views.map((v) => {
          const on = v.id === activeView
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              aria-pressed={on}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${on ? 'bg-sky text-base' : 'text-muted hover:text-ink'}`}
            >
              <v.icon size={14} />
              {v.label}
              {v.id === 'compare' && selectedBusinessIds.length > 0 && (
                <span className={`num rounded-full px-1.5 text-[11px] ${on ? 'bg-base/20' : 'bg-sky/20 text-sky'}`}>{selectedBusinessIds.length}</span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <label htmlFor="preset" className="caption text-muted">Preset</label>
        <select
          id="preset"
          value={activePresetId}
          onChange={(e) => applyPreset(e.target.value)}
          className="rounded-md border border-line bg-base px-2.5 py-1.5 text-[13px] hover:border-muted"
        >
          {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          {activePresetId === 'custom' && <option value="custom">Custom</option>}
        </select>
        <button onClick={() => applyPreset('balanced')} className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[13px] text-muted hover:border-muted hover:text-ink">
          <RotateCcw size={13} /> Reset
        </button>
        <button onClick={() => downloadCsv(rows)} className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[13px] text-muted hover:border-muted hover:text-ink">
          <Download size={13} /> Export CSV
        </button>
      </div>
    </header>
  )
}
