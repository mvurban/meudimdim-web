import { mockPrecos, upsertAggregatedProducts, setBenchmarks } from './mock-store'
import { api } from './api'
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
  addNotification: (text: string) => Promise<void>,
): Promise<void> {
  if (hasDoneDailySyncToday(email)) return

  // Marca imediatamente para evitar execução dupla
  localStorage.setItem(dailySyncKey(email), todayStr())

  const errors: string[] = []

  // 1. Atualizar cotações das ações em background
  try {
    const acoes: { id: string; ticker: string; precoMedio: number; precoFechamento: number; precoAtual: number }[] =
      await api.get('/api/acoes')

    if (acoes.length > 0) {
      const failed: string[] = []
      const updates: { id: string; precoFechamento: number; precoAtual: number }[] = []

      for (const a of acoes) {
        if (Math.random() < FAKE_ERROR_RATE) {
          failed.push(a.ticker)
          continue
        }
        const { precoFechamento, precoAtual } = mockPrecos(a.precoFechamento || a.precoMedio)
        updates.push({ id: a.id, precoFechamento, precoAtual })
      }

      if (updates.length > 0) {
        await api.put('/api/acoes/refresh', { updates })
      }

      const now = new Date()
      await upsertAggregatedProducts('', now.getMonth() + 1, now.getFullYear())

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
