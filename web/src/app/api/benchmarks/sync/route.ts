import { NextResponse } from 'next/server'
import type { BenchmarkEntry } from '@/types'

const BCB_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'
const MONTHS = 36

async function fetchBcb(series: number): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  try {
    const res = await fetch(
      `${BCB_BASE}.${series}/dados/ultimos/${MONTHS}?formato=json`,
      { next: { revalidate: 86400 } },
    )
    if (!res.ok) return map
    const data: Array<{ data: string; valor: string }> = await res.json()
    for (const item of data) {
      // data format: "DD/MM/YYYY"
      const parts = item.data.split('/')
      const month = parseInt(parts[1], 10)
      const year  = parseInt(parts[2], 10)
      map.set(`${year}-${month}`, parseFloat(item.valor.replace(',', '.')))
    }
  } catch {
    // return empty map on failure — caller handles missing values
  }
  return map
}

async function fetchIbovespa(): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?interval=1mo&range=3y',
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 86400 },
      },
    )
    if (!res.ok) return map
    const json = await res.json()
    const result = json?.chart?.result?.[0]
    if (!result) return map

    const timestamps: number[] = result.timestamp ?? []
    const closes: (number | null)[] = result.indicators?.adjclose?.[0]?.adjclose ?? []

    for (let i = 1; i < timestamps.length; i++) {
      const prev = closes[i - 1]
      const curr = closes[i]
      if (!prev || !curr) continue
      const date  = new Date(timestamps[i] * 1000)
      const month = date.getMonth() + 1
      const year  = date.getFullYear()
      const pct   = ((curr - prev) / prev) * 100
      map.set(`${year}-${month}`, parseFloat(pct.toFixed(2)))
    }
  } catch {
    // return empty map on failure
  }
  return map
}

export async function GET() {
  const [cdiMap, ipcaMap, poupancaMap, ibovespaMap] = await Promise.all([
    fetchBcb(4391),   // CDI acumulado mensal
    fetchBcb(433),    // IPCA variação mensal
    fetchBcb(195),    // Poupança rendimento mensal
    fetchIbovespa(),
  ])

  // Build result from CDI keys (most complete series)
  const entries: BenchmarkEntry[] = []
  const source = cdiMap.size > 0 ? cdiMap : ipcaMap

  let idx = 1
  for (const [key] of source) {
    const [yearStr, monthStr] = key.split('-')
    const year  = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    entries.push({
      id:       `bm_sync_${year}_${month}`,
      month,
      year,
      cdi:      cdiMap.get(key)      ?? 0,
      ipca:     ipcaMap.get(key)     ?? 0,
      poupanca: poupancaMap.get(key) ?? 0,
      ibovespa: ibovespaMap.get(key) ?? 0,
    })
    idx++
  }

  // Sort oldest → newest
  entries.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)

  return NextResponse.json(entries)
}
