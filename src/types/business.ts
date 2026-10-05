export type Criterion = 'speed' | 'cost' | 'mktg' | 'scale' | 'sell' | 'sat' | 'feas'

export type Category =
  | 'SaaS' | 'Content' | 'Service' | 'Product'
  | 'Marketplace' | 'Media' | 'Education' | 'Community'

export interface Business {
  id: string
  name: string
  category: Category
  tier: 'high-ceiling' | 'sellable-lowcost'
  scores: Record<Criterion, number>
  profitCeiling: { low: number; high: number; currency: 'USD'; note?: string }
  exitMultiple: { low: number; high: number; basis: 'annual-profit' | 'arr' | 'monthly-profit'; note?: string }
  feasibility: { score: number; leverage: 'high' | 'medium' | 'low'; reason: string }
  markets?: { label: string; lat: number; lng: number }[]
  biggestCon: string
  description?: string
  tags?: string[]
}

export type Weights = Record<Criterion, number>

export interface WeightPreset {
  id: string
  label: string
  weights: Weights
}

export type ViewId = 'dashboard' | 'scatter' | 'tree' | 'map' | 'compare'
export type SortKey = Criterion | 'name' | 'finalScore' | 'salePrice' | 'profitCeiling' | 'exitMultiple'
