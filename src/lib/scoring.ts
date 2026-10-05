import type { Business, Weights } from '@/types/business'
import { CRITERIA } from './presets'

export function finalScore(b: Business, w: Weights): number {
  const total = CRITERIA.reduce((s, c) => s + w[c.key], 0)
  if (total === 0) return 0
  return CRITERIA.reduce((s, c) => s + b.scores[c.key] * w[c.key], 0) / total
}

export function estimatedSalePrice(b: Business): { low: number; high: number } {
  const mid = (b.profitCeiling.low + b.profitCeiling.high) / 2
  const basis = b.exitMultiple.basis === 'arr' ? mid * 3 : mid
  return { low: basis * b.exitMultiple.low, high: basis * b.exitMultiple.high }
}

export function scoreTier(score: number, all: number[]): 'low' | 'mid' | 'high' {
  const sorted = [...all].sort((a, b) => a - b)
  const q = (p: number) => sorted[Math.floor((sorted.length - 1) * p)]
  if (score >= q(0.75)) return 'high'
  if (score <= q(0.25)) return 'low'
  return 'mid'
}
