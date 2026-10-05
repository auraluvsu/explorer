import { X, Check } from 'lucide-react'
import { useEffect } from 'react'
import { useExplorerStore, useScoredBusinesses } from '@/store/useExplorerStore'
import { CRITERIA } from '@/lib/presets'
import { formatCurrency, formatMultiple, formatRange } from '@/lib/format'
import { ScoreBadge } from './ScoreBadge'
import { TagPill } from './TagPill'

export function SidePanel() {
  const detailId = useExplorerStore((s) => s.detailId)
  const close = () => useExplorerStore.getState().openDetail(null)
  const selected = useExplorerStore((s) => s.selectedBusinessIds)
  const toggle = useExplorerStore((s) => s.toggleBusiness)
  const scored = useScoredBusinesses()
  const b = scored.find((x) => x.id === detailId)

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  if (!b) return null
  const all = scored.map((x) => x.finalScore)
  const inCompare = selected.includes(b.id)

  return (
    <>
      <div className="fixed inset-0 z-30 bg-base/60" onClick={close} aria-hidden />
      <aside role="dialog" aria-label={`${b.name} detail`} className="slide-in fixed inset-y-0 right-0 z-40 flex w-full max-w-[420px] flex-col border-l border-line bg-panel shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="caption text-muted">Rank #{b.rank}</p>
            <h2 className="text-[22px] font-semibold leading-[30px]">{b.name}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <TagPill tone="category">{b.category}</TagPill>
              <TagPill>{b.tier === 'high-ceiling' ? 'High-Ceiling' : 'Sellable / Low-Cost'}</TagPill>
            </div>
          </div>
          <button onClick={close} aria-label="Close" className="rounded p-1.5 text-muted hover:bg-elevated hover:text-ink"><X size={18} /></button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <p className="text-muted">{b.description}</p>
          <div className="flex items-center justify-between rounded-lg border border-line bg-base/50 p-4">
            <span className="caption text-muted">Weighted score</span>
            <ScoreBadge score={b.finalScore} all={all} />
          </div>
          <section>
            <h3 className="caption mb-3 text-muted">Criteria scores</h3>
            <ul className="space-y-2.5">
              {CRITERIA.map((c) => (
                <li key={c.key} className="grid grid-cols-[130px_1fr_24px] items-center gap-3">
                  <span className="text-[13px]">{c.label}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-sky" style={{ width: `${b.scores[c.key] * 10}%` }} /></span>
                  <span className="num text-right text-[13px]">{b.scores[c.key]}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-line p-3">
              <p className="caption text-muted">Profit ceiling <span className="normal-case">(est.)</span></p>
              <p className="num mt-1 text-[16px] text-ok">{formatRange(b.profitCeiling.low, b.profitCeiling.high)}</p>
              <p className="text-[12px] text-muted">per year</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="caption text-muted">Exit multiple <span className="normal-case">(est.)</span></p>
              <p className="num mt-1 text-[16px] text-warn">{formatMultiple(b.exitMultiple.low)}–{formatMultiple(b.exitMultiple.high)}</p>
              <p className="text-[12px] text-muted">of {b.exitMultiple.basis.replace('-', ' ')}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-line p-3">
              <p className="caption text-muted">Estimated sale price</p>
              <p className="num mt-1 text-[16px]">{formatRange(b.salePrice.low, b.salePrice.high, formatCurrency)}</p>
            </div>
          </section>
          <section className="rounded-lg border border-bad/30 bg-bad/10 p-4">
            <h3 className="caption mb-1 text-bad">Biggest con</h3>
            <p>{b.biggestCon}</p>
          </section>
          <section className="rounded-lg border border-sky/30 bg-sky/10 p-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="caption text-sky">Feasibility reason</h3>
              <span className="num text-[13px]">{b.feasibility.score}/10 · {b.feasibility.leverage} leverage</span>
            </div>
            <p>{b.feasibility.reason}</p>
          </section>
        </div>
        <footer className="border-t border-line p-4">
          <button
            onClick={() => toggle(b.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${inCompare ? 'border border-sky text-sky hover:bg-sky/10' : 'bg-sky text-base hover:bg-sky/90'}`}
          >
            {inCompare ? <><Check size={16} /> In compare — remove</> : 'Add to compare'}
          </button>
        </footer>
      </aside>
    </>
  )
}
