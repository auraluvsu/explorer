import type { Scored } from '@/store/useExplorerStore'
import { CRITERIA } from './presets'

const esc = (v: string | number) => {
  const s = String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(rows: Scored[]): string {
  const head = ['Rank', 'Name', 'Category', 'Tier', ...CRITERIA.map((c) => c.label), 'Final score', 'Profit ceiling low', 'Profit ceiling high', 'Exit multiple low', 'Exit multiple high', 'Exit basis', 'Est. sale low', 'Est. sale high', 'Biggest con', 'Feasibility leverage', 'Feasibility reason']
  const lines = rows.map((b) => [
    b.rank, b.name, b.category, b.tier,
    ...CRITERIA.map((c) => b.scores[c.key]),
    b.finalScore.toFixed(3),
    b.profitCeiling.low, b.profitCeiling.high, b.exitMultiple.low, b.exitMultiple.high, b.exitMultiple.basis,
    Math.round(b.salePrice.low), Math.round(b.salePrice.high),
    b.biggestCon, b.feasibility.leverage, b.feasibility.reason,
  ].map(esc).join(','))
  return [head.map(esc).join(','), ...lines].join('\r\n')
}

export function downloadCsv(rows: Scored[], filename = 'business-ideas-ranking.csv') {
  const url = URL.createObjectURL(new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
