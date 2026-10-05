import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemo } from 'react'
import type { Business, SortKey, ViewId, Weights } from '@/types/business'
import { PRESETS, DEFAULT_PRESET_ID } from '@/lib/presets'
import { BUSINESSES } from '@/data/businesses'
import { estimatedSalePrice, finalScore } from '@/lib/scoring'

interface ExplorerState {
  weights: Weights
  activePresetId: string
  selectedBusinessIds: string[]
  detailId: string | null
  activeView: ViewId
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  setWeight: (k: keyof Weights, v: number) => void
  applyPreset: (id: string) => void
  toggleBusiness: (id: string) => void
  clearSelection: () => void
  openDetail: (id: string | null) => void
  setView: (v: ViewId) => void
  setSort: (k: SortKey) => void
}

export const useExplorerStore = create<ExplorerState>()(
  persist(
    (set) => ({
      weights: PRESETS[0].weights,
      activePresetId: DEFAULT_PRESET_ID,
      selectedBusinessIds: [],
      detailId: null,
      activeView: 'dashboard',
      sortKey: 'finalScore',
      sortDir: 'desc',
      setWeight: (k, v) => set((s) => ({ weights: { ...s.weights, [k]: v }, activePresetId: 'custom' })),
      applyPreset: (id) => {
        const p = PRESETS.find((x) => x.id === id)
        if (p) set({ weights: p.weights, activePresetId: id })
      },
      toggleBusiness: (id) =>
        set((s) => ({
          selectedBusinessIds: s.selectedBusinessIds.includes(id)
            ? s.selectedBusinessIds.filter((x) => x !== id)
            : s.selectedBusinessIds.length >= 4
              ? s.selectedBusinessIds
              : [...s.selectedBusinessIds, id],
        })),
      clearSelection: () => set({ selectedBusinessIds: [] }),
      openDetail: (id) => set({ detailId: id }),
      setView: (v) => set({ activeView: v }),
      setSort: (k) =>
        set((s) => (s.sortKey === k ? { sortDir: s.sortDir === 'desc' ? 'asc' : 'desc' } : { sortKey: k, sortDir: k === 'name' ? 'asc' : 'desc' })),
    }),
    {
      name: 'business-explorer-v2',
      partialize: (s) => ({ weights: s.weights, activePresetId: s.activePresetId, selectedBusinessIds: s.selectedBusinessIds, activeView: s.activeView }),
    },
  ),
)

export interface Scored extends Business {
  finalScore: number
  rank: number
  salePrice: { low: number; high: number }
}

export function useScoredBusinesses(): Scored[] {
  const weights = useExplorerStore((s) => s.weights)
  return useMemo(() => {
    const scored = BUSINESSES.map((b) => ({ ...b, finalScore: finalScore(b, weights), salePrice: estimatedSalePrice(b) }))
    scored.sort((a, b) => b.finalScore - a.finalScore)
    return scored.map((b, i) => ({ ...b, rank: i + 1 }))
  }, [weights])
}

export function useSortedBusinesses(): Scored[] {
  const scored = useScoredBusinesses()
  const sortKey = useExplorerStore((s) => s.sortKey)
  const sortDir = useExplorerStore((s) => s.sortDir)
  return useMemo(() => {
    const val = (b: Scored): number | string => {
      switch (sortKey) {
        case 'name': return b.name
        case 'finalScore': return b.finalScore
        case 'salePrice': return b.salePrice.high
        case 'profitCeiling': return b.profitCeiling.high
        case 'exitMultiple': return b.exitMultiple.high
        default: return b.scores[sortKey]
      }
    }
    const dir = sortDir === 'asc' ? 1 : -1
    return [...scored].sort((a, b) => {
      const x = val(a), y = val(b)
      return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * dir
    })
  }, [scored, sortKey, sortDir])
}

export function useSalePrice(id: string) {
  const b = BUSINESSES.find((x) => x.id === id)
  return b ? estimatedSalePrice(b) : null
}

export interface GraphNode {
  id: string
  label: string
  kind: 'root' | 'tier' | 'category' | 'business'
  score?: number
  size?: number
}

export function useGraphData() {
  const scored = useScoredBusinesses()
  return useMemo(() => {
    const tierLabel = { 'high-ceiling': 'High-Ceiling', 'sellable-lowcost': 'Sellable / Low-Cost' } as const
    const nodes: GraphNode[] = [{ id: 'root', label: '$1M Online Businesses', kind: 'root' }]
    const edges: { source: string; target: string }[] = []
    for (const tier of ['high-ceiling', 'sellable-lowcost'] as const) {
      nodes.push({ id: tier, label: tierLabel[tier], kind: 'tier' })
      edges.push({ source: 'root', target: tier })
      const inTier = scored.filter((b) => b.tier === tier)
      for (const cat of [...new Set(inTier.map((b) => b.category))].sort()) {
        const catId = `${tier}:${cat}`
        nodes.push({ id: catId, label: cat, kind: 'category' })
        edges.push({ source: tier, target: catId })
        for (const b of inTier.filter((x) => x.category === cat)) {
          nodes.push({ id: b.id, label: b.name, kind: 'business', score: b.finalScore, size: b.profitCeiling.high })
          edges.push({ source: catId, target: b.id })
        }
      }
    }
    return { nodes, edges }
  }, [scored])
}

export interface MapPin {
  id: string
  businessId: string
  name: string
  category: string
  market: string
  lat: number
  lng: number
  score: number
  ceiling: number
}

export function useMapPins() {
  const scored = useScoredBusinesses()
  return useMemo(() => {
    const pins: MapPin[] = []
    const remote: Scored[] = []
    for (const b of scored) {
      if (!b.markets?.length) remote.push(b)
      else for (const m of b.markets) pins.push({ id: `${b.id}@${m.label}`, businessId: b.id, name: b.name, category: b.category, market: m.label, lat: m.lat, lng: m.lng, score: b.finalScore, ceiling: b.profitCeiling.high })
    }
    return { pins, remote }
  }, [scored])
}
