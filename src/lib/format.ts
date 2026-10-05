export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${+(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${+(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export function formatRange(low: number, high: number, fmt: (n: number) => string = formatCurrency): string {
  return `${fmt(low)}–${fmt(high)}`
}

export function formatMultiple(n: number): string {
  return `${+n.toFixed(2)}x`
}

export function formatPercent(n: number): string {
  return `${Math.round(n * 100)}%`
}
