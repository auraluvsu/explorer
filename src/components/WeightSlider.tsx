import { formatPercent } from '@/lib/format'

interface Props { id: string; label: string; hint: string; value: number; onChange: (v: number) => void; disabled?: boolean }

export function WeightSlider({ id, label, hint, value, onChange, disabled }: Props) {
  return (
    <div className={disabled ? 'opacity-40' : ''}>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">{label}</label>
        <span className="num text-[13px] text-sky">{formatPercent(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={50}
        step={1}
        disabled={disabled}
        value={Math.round(value * 100)}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="wslider"
        style={{ ['--pct' as string]: `${(value / 0.5) * 100}%` }}
      />
      <p id={`${id}-hint`} className="text-[12px] leading-4 text-muted">{hint}</p>
    </div>
  )
}
