import type { Criterion, WeightPreset } from '@/types/business'

export const CRITERIA: { key: Criterion; label: string; short: string; hint: string }[] = [
  { key: 'speed', label: 'Startup Speed', short: 'Speed', hint: 'How quickly you can launch and earn.' },
  { key: 'cost', label: 'Startup Cost', short: 'Cost', hint: '10 = cheapest to start.' },
  { key: 'mktg', label: 'Low Marketing Reliance', short: 'Mktg', hint: '10 = needs the least marketing.' },
  { key: 'scale', label: 'Scalability', short: 'Scale', hint: 'Revenue growth without linear effort.' },
  { key: 'sell', label: 'Ease to Sell', short: 'Sell', hint: 'How easy the business is to exit.' },
  { key: 'sat', label: 'Low Saturation', short: 'Sat', hint: '10 = open market.' },
  { key: 'feas', label: 'Feasibility (build ease)', short: 'Feas', hint: '10 = easiest for a solo junior full-stack engineer to ship.' },
]

const w = (speed: number, cost: number, mktg: number, scale: number, sell: number, sat: number, feas: number) => ({ speed, cost, mktg, scale, sell, sat, feas })

export const DEFAULT_PRESET_ID = 'builder'

export const PRESETS: WeightPreset[] = [
  { id: 'builder', label: 'Builder Mode', weights: w(0, 0.15, 0, 0.2, 0.15, 0.1, 0.4) },
  { id: 'balanced', label: 'Balanced (default)', weights: w(0.15, 0.15, 0.15, 0.2, 0.15, 0.2, 0) },
  { id: 'high-ceiling', label: 'High-Ceiling', weights: w(0.1, 0.1, 0.15, 0.3, 0.15, 0.2, 0) },
  { id: 'sellable-lowcost', label: 'Sellable + Low Cost', weights: w(0.1, 0.2, 0.15, 0.1, 0.25, 0.2, 0) },
  { id: 'fast-cash', label: 'Fast Cash', weights: w(0.35, 0.25, 0.15, 0.05, 0.05, 0.15, 0) },
]

export const HIDES_FEASIBILITY = (presetId: string) => presetId === 'balanced'
