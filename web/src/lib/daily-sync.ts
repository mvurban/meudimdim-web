import { getAcoes, setAcoes, mockPrecos, upsertAggregatedProducts, setBenchmarks, setLastRefresh } from './mock-store'
import type { BenchmarkEntry } from '@/types'

const FAKE_ERROR_RATE = 0.18

function dailySyncKey(email: string) {
  return `mdd-daily-sync-${email}`
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function hasDoneDailySyncToday(email: string): boolean {
  return localStorage.getItem(dailySyncKey(email)) === todayStr()
}

export async function runDailySyncIfNeeded(
  email: string,
  addNotification: (text: string) => void,
): Promise<void> {
  if (hasDoneDailySyncToday(email)) return

  // Marca imediatamente para evitar execução dupla
  localStorage.setItem(dailySyncKey(email), todayStr())

  const errors: string[] = []

  // 1. Atualizar cotações das ações em background
  try {
    const acoes = getAcoes(email)
    if (acoes.length > 0) {
      const failed: string[] = []
      const updated = acoes
        .map(a => {
          if (Math.random() < FAKE_ERROR_RATE) {
            failed.push(a.ticker)
            return null
          }
          const { precoFechamento, precoAtual } = mockPrecos(a.precoFechamento || a.precoMedio)
          return { id: a.id, precoFechamento, precoAtual }
        })
        .filter(Boolean) as { id: string; precoFechamento: number; precoAtual: number }[]

      const updatedAcoes = acoes.map(a => {
        const u = updated.find(r => r.id === a.id)
        return u ? { ...a, precoFechamento: u.precoFechamento, precoAtual: u.precoAtual } : a
      })

      setAcoes(email, updatedAcoes)
      setLastRefresh(email, new Date().toISOString())

      const now = new Date()
      upsertAggregatedProducts(email, now.getMonth() + 1, now.getFullYear())

      if (failed.length > 0) {
        errors.push(`Não foi possível atualizar ${failed.length} ação(ões): ${failed.join(', ')}`)
      }
    }
  } catch {
    errors.push('Erro ao atualizar cotações das ações.')
  }

  // 2. Sincronizar benchmarks
  try {
    const res = await fetch('/api/benchmarks/sync')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const entries: BenchmarkEntry[] = await res.json()
    setBenchmarks(email, entries)
  } catch {
    errors.push('Erro ao atualizar dados de benchmark.')
  }

  // Reportar erros no sininho
  for (const msg of errors) {
    addNotification(msg)
  }
}
