import { useExplorerStore } from '@/store/useExplorerStore'
import { CRITERIA, HIDES_FEASIBILITY } from '@/lib/presets'
import { formatPercent } from '@/lib/format'
import { WeightSlider } from './WeightSlider'

export function WeightRail() {
  const { weights, setWeight, activePresetId } = useExplorerStore()
  const criteria = HIDES_FEASIBILITY(activePresetId) ? CRITERIA.filter((c) => c.key !== 'feas') : CRITERIA
  const total = criteria.reduce((s, c) => s + weights[c.key], 0)
  return (
    <aside aria-label="Weights" className="space-y-5 border-line p-6 lg:border-r">
      <div className="flex items-baseline justify-between">
        <h2 className="caption text-muted">Weights</h2>
        <span className="num text-[12px] text-muted" title="Weights are normalized, so scores stay on a 1–10 scale">Σ {formatPercent(total)}</span>
      </div>
      {criteria.map((c) => (
        <WeightSlider key={c.key} id={`w-${c.key}`} label={c.label} hint={c.hint} value={weights[c.key]} onChange={(v) => setWeight(c.key, v)} />
      ))}
    </aside>
  )
}
