import { api } from './api'
import type { AssetClass, Institution, Region, LiquidityOption, Product, ProductEntry, StockDividend } from '@/types'

interface AcaoItem {
  id: string
  ticker: string
  institutionId: string
  assetClassId: string
  quantidade: number
  precoMedio: number
  precoAtual: number
}

let _upsertInProgress = false

export async function upsertAggregatedProducts(
  month: number,
  year: number,
): Promise<{ upserted: number }> {
  // Mutex: impede chamadas concorrentes que causariam produtos agregados duplicados
  if (_upsertInProgress) return { upserted: 0 }
  _upsertInProgress = true

  try {
    return await _doUpsert(month, year)
  } finally {
    _upsertInProgress = false
  }
}

async function _doUpsert(month: number, year: number): Promise<{ upserted: number }> {
  let apiAcoes: AcaoItem[] = []
  let apiAcs: AssetClass[] = []
  let apiInsts: Institution[] = []
  let apiRegions: Region[] = []
  let apiLiqs: LiquidityOption[] = []
  let apiProducts: Product[] = []
  let apiStockDivs: any[] = []

  try {
    ;[apiAcoes, apiAcs, apiInsts, apiRegions, apiLiqs, apiProducts, apiStockDivs] = await Promise.all([
      api.get<AcaoItem[]>('/api/acoes'),
      api.get<AssetClass[]>('/api/assetclasses'),
      api.get<Institution[]>('/api/institutions'),
      api.get<Region[]>('/api/regions'),
      api.get<LiquidityOption[]>('/api/liquidity'),
      api.get<Product[]>('/api/products'),
      api.get<any[]>('/api/stock-dividends'),
    ])
  } catch {
    return { upserted: 0 }
  }

  if (apiAcoes.length === 0) return { upserted: 0 }

  // Normaliza stockTickerId → acaoId
  const stockDividends: StockDividend[] = apiStockDivs.map((d: any) => ({ ...d, acaoId: d.stockTickerId ?? d.acaoId }))

  const apiDefaultRegion = apiRegions.find(r => r.isDefault) ?? apiRegions[0]
  const apiDefaultLiqId  = apiLiqs[0]?.id

  // Group by (assetClassId, institutionId)
  type GroupKey = string
  const groups = new Map<GroupKey, { acId: string; instId: string; totalBrl: number }>()

  for (const acao of apiAcoes) {
    const gKey: GroupKey = `${acao.assetClassId}__${acao.institutionId}`
    const valueBrl = acao.quantidade * (acao.precoAtual || acao.precoMedio)
    const existing = groups.get(gKey)
    if (existing) {
      existing.totalBrl += valueBrl
    } else {
      groups.set(gKey, { acId: acao.assetClassId, instId: acao.institutionId, totalBrl: valueBrl })
    }
  }

  let upserted = 0

  for (const [gKey, group] of groups) {
    const apiAc   = apiAcs.find(a => a.id === group.acId)
    const apiInst = apiInsts.find(i => i.id === group.instId)
    if (!apiAc || !apiInst) continue

    const valueBrl = Math.round(group.totalBrl * 100) / 100

    let aggProduct = apiProducts.find(
      p => p.isAggregated && p.assetClassId === apiAc.id && p.institutionId === apiInst.id
    )

    if (!aggProduct) {
      try {
        aggProduct = await api.post<Product>('/api/products', {
          name: `${apiAc.name} ${apiInst.name}`,
          categoryId: apiAc.categoryId,
          assetClassId: apiAc.id,
          institutionId: apiInst.id,
          regionId: apiDefaultRegion?.id,
          liquidityId: apiDefaultLiqId,
          currency: 'BRL',
          isAggregated: true,
        })
        apiProducts.push(aggProduct)
      } catch {
        continue
      }
    }

    try {
      await api.put('/api/entries/upsert', {
        productId: aggProduct.id,
        month,
        year,
        contribution: 0,
        withdrawal: 0,
        returnPct: 0,
        valueOriginal: valueBrl,
        valueBrl,
        valueUsd: 0,
      })
    } catch {
      continue
    }

    // Agregar dividendos das ações do grupo
    const groupAcoes = apiAcoes.filter(a => `${a.assetClassId}__${a.institutionId}` === gKey)
    const acaoIds = new Set(groupAcoes.map(a => a.id))
    const monthStr = String(month).padStart(2, '0')

    const total = stockDividends
      .filter(sd => {
        if (!acaoIds.has(sd.acaoId)) return false
        const [y, m] = sd.date.split('-').map(Number)
        return m === month && y === year
      })
      .reduce((acc, sd) => ({
        dividendo: acc.dividendo + sd.dividendo,
        jcp: acc.jcp + sd.jcp,
        outros: acc.outros + sd.outros,
      }), { dividendo: 0, jcp: 0, outros: 0 })

    if (total.dividendo > 0 || total.jcp > 0 || total.outros > 0) {
      try {
        await api.put('/api/dividends/upsert', {
          productId: aggProduct.id,
          date: `${year}-${monthStr}-01`,
          dividendo: Math.round(total.dividendo * 100) / 100,
          jcp: Math.round(total.jcp * 100) / 100,
          outros: Math.round(total.outros * 100) / 100,
        })
      } catch {
        // silencioso
      }
    }

    upserted++
  }

  // Agregados sem ações correspondentes: remove a entry do mês
  for (const p of apiProducts) {
    if (!p.isAggregated) continue
    const stillActive = [...groups.values()].some(g => g.acId === p.assetClassId && g.instId === p.institutionId)
    if (stillActive) continue
    try {
      const entries = await api.get<ProductEntry[]>(`/api/entries?productId=${p.id}&month=${month}&year=${year}`)
      await Promise.all(entries.map(e => api.delete(`/api/entries/${e.id}`)))
    } catch {
      // silencioso
    }
  }

  return { upserted }
}
