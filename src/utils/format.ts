// src/utils/format.ts
const usd = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function formatAmountUSD(n: number | null | undefined): string {
  return usd.format(n ?? 0)
}

export function labelPeriod(p: string): string {
  return p === 'weekly' ? 'Weekly' : p === 'monthly' ? 'Monthly' : p
}

export function formatYMDToLocal(s?: string | null): string {
  if (!s) return '—'
  return new Date(`${s}T00:00:00`).toLocaleDateString()
}

export function formatFee(pct?: number | null, flatUSD?: number | null): string {
  return `${pct ?? 0}% + ${formatAmountUSD(flatUSD ?? 0)}`
}
