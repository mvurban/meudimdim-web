import type { Liquidity, MonthSummary } from '@/types'

// ─────────────────────────────────────────────
// CURRENCY FORMATTING
// ─────────────────────────────────────────────
export function formatBRL(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`
  }
  if (compact && value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatUSD(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `$ ${(value / 1_000_000).toFixed(1)}M`
  }
  if (compact && value >= 1_000) {
    return `$ ${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatPct(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// ─────────────────────────────────────────────
// DATE / MONTH HELPERS
// ─────────────────────────────────────────────
export const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const MONTHS_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function formatMonthYear(month: number, year: number): string {
  return `${MONTHS[month - 1]}/${year}`
}

export function formatMonthYearFull(month: number, year: number): string {
  return `${MONTHS_FULL[month - 1]} de ${year}`
}

export function getPreviousMonth(month: number, year: number): { month: number; year: number } {
  if (month === 1) return { month: 12, year: year - 1 }
  return { month: month - 1, year }
}

export function getNextMonth(month: number, year: number): { month: number; year: number } {
  if (month === 12) return { month: 1, year: year + 1 }
  return { month: month + 1, year }
}

export function sortByMonthYear(data: MonthSummary[]): MonthSummary[] {
  return [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })
}

export function currentMonthYear(): { month: number; year: number } {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

// ─────────────────────────────────────────────
// LIQUIDITY LABEL
// ─────────────────────────────────────────────
export function formatLiquidity(liq: Liquidity): string {
  const { value, unit } = liq
  if (unit === 'days') {
    return value === 1 ? 'D+1' : `D+${value}`
  }
  if (unit === 'months') {
    return value === 1 ? '1 mês' : `${value} meses`
  }
  return value === 1 ? '1 ano' : `${value} anos`
}

// ─────────────────────────────────────────────
// COLOR HELPERS
// ─────────────────────────────────────────────
export function categoryColor(name: string): string {
  const map: Record<string, string> = {
    'Renda Fixa':     '#22c55e',
    'Multimercado':   '#3b82f6',
    'Renda Variável': '#f59e0b',
    'Internacional':  '#a855f7',
    'Commodities':    '#ef4444',
  }
  return map[name] ?? '#6b7280'
}

export function signColor(value: number): string {
  if (value > 0) return 'text-green-500'
  if (value < 0) return 'text-red-500'
  return 'text-muted-foreground'
}

export function signBg(value: number): string {
  if (value > 0) return 'bg-green-500/10 text-green-600 dark:text-green-400'
  if (value < 0) return 'bg-red-500/10 text-red-600 dark:text-red-400'
  return 'bg-muted text-muted-foreground'
}

// ─────────────────────────────────────────────
// CHART DATA HELPERS
// ─────────────────────────────────────────────
export function monthLabel(month: number, year: number, showYear = false): string {
  return showYear ? `${MONTHS[month - 1]}/${String(year).slice(2)}` : MONTHS[month - 1]
}
