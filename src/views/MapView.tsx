import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useExplorerStore, useMapPins, useScoredBusinesses } from '@/store/useExplorerStore'
import { scoreTier } from '@/lib/scoring'
import { formatCurrency } from '@/lib/format'

const COLORS = { high: '#34d399', mid: '#fbbf24', low: '#f87171' }

export function MapView() {
  const { pins, remote } = useMapPins()
  const all = useScoredBusinesses().map((b) => b.finalScore)
  const open = useExplorerStore((s) => s.openDetail)
  const [chip, setChip] = useState('All')
  const chips = useMemo(() => ['All', ...[...new Set([...pins, ...remote.map((b) => ({ category: b.category }))].map((p) => p.category))].sort()], [pins, remote])
  const shown = pins.filter((p) => chip === 'All' || p.category === chip)
  const shownRemote = remote.filter((b) => chip === 'All' || b.category === chip)
  const maxCeil = Math.max(...pins.map((p) => p.ceiling))

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c} onClick={() => setChip(c)} aria-pressed={chip === c}
            className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${chip === c ? 'border-sky bg-sky/10 text-sky' : 'border-line text-muted hover:text-ink'}`}>{c}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="h-[calc(100vh-200px)] min-h-[480px] overflow-hidden rounded-lg border border-line">
          <MapContainer center={[30, 10]} zoom={2} minZoom={2} worldCopyJump style={{ height: '100%', background: '#0f172a' }}>
            <TileLayer attribution='&copy; OpenStreetMap &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {shown.map((p) => {
              const c = COLORS[scoreTier(p.score, all)]
              return (
                <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={6 + (p.ceiling / maxCeil) * 14} pathOptions={{ color: c, fillColor: c, fillOpacity: 0.35, weight: 1.5 }}>
                  <Popup>
                    <div className="text-[13px] text-base">
                      <strong>{p.name}</strong><br />
                      {p.market} · score {p.score.toFixed(2)}<br />
                      Ceiling up to {formatCurrency(p.ceiling)}<br />
                      <button onClick={() => open(p.businessId)} className="mt-1 text-sky-700 underline">Open detail</button>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
        <aside className="rounded-lg border border-line bg-panel p-4">
          <h2 className="caption mb-1 text-muted">Remote-first</h2>
          <p className="mb-3 text-[12px] leading-4 text-muted">Not tied to a market. Sell anywhere.</p>
          <ul className="space-y-1">
            {shownRemote.map((b) => (
              <li key={b.id}><button onClick={() => open(b.id)} className="flex w-full justify-between rounded px-2 py-1 text-left hover:bg-elevated"><span>{b.name}</span><span className="num text-sky">{b.finalScore.toFixed(1)}</span></button></li>
            ))}
            {shownRemote.length === 0 && <li className="text-muted">None in this category.</li>}
          </ul>
          <p className="mt-4 text-[12px] leading-4 text-muted">Target markets are illustrative estimates, editable in <code>businesses.ts</code>.</p>
        </aside>
      </div>
    </div>
  )
}
