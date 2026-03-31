import type { Category, AssetClass, Institution, Region, LiquidityOption, Dividend, BenchmarkEntry, StockDividend, Product, ProductEntry } from '@/types'
import { mockCategories, mockAssetClasses, mockInstitutions, mockRegions, mockLiquidityOptions, mockDividends, mockBenchmarks, mockProducts, mockEntries } from './mock-data'
import { api } from './api'

// ─────────────────────────────────────────────
// Ações (mock-only type — será substituído por API + Yahoo Finance)
// ─────────────────────────────────────────────
export interface AcaoItem {
  id: string
  ticker: string
  institutionId: string
  assetClassId: string     // deve ser uma classe com isAcao: true (ac6=Ações, ac7=FIIs)
  quantidade: number
  precoMedio: number
  precoFechamento: number  // Yahoo Finance (futuro)
  precoAtual: number       // Yahoo Finance (futuro)
}

// Gera preços mock próximos ao preço médio de compra.
// precoFechamento: variação de -20% a +40% (simula ganho/perda acumulado desde a compra)
// precoAtual: variação de ±1,5% em relação ao fechamento (simula pregão do dia)
export function mockPrecos(precoMedio: number, seed = Math.random()): Pick<AcaoItem, 'precoFechamento' | 'precoAtual'> {
  const variacao = -0.20 + seed * 0.60
  const precoFechamento = parseFloat((precoMedio * (1 + variacao)).toFixed(2))
  const intraday = -0.015 + Math.random() * 0.03
  const precoAtual = parseFloat((precoFechamento * (1 + intraday)).toFixed(2))
  return { precoFechamento, precoAtual }
}

// i1=XP Investimentos  i2=Clear Corretora  i3=Nubank  i4=Avenue  i5=Itaú
// ac6=Ações  ac7=FIIs
const DEFAULT_ACOES: AcaoItem[] = [
  // Ações
  { id: 'a1',  ticker: 'AXBR3',  institutionId: 'i2', assetClassId: 'ac6', quantidade: 800,  precoMedio: 14.30, ...mockPrecos(14.30, 0.55) },
  { id: 'a2',  ticker: 'LMTC4',  institutionId: 'i1', assetClassId: 'ac6', quantidade: 1200, precoMedio: 7.80,  ...mockPrecos(7.80,  0.40) },
  { id: 'a3',  ticker: 'VRND3',  institutionId: 'i2', assetClassId: 'ac6', quantidade: 450,  precoMedio: 33.60, ...mockPrecos(33.60, 0.78) },
  { id: 'a4',  ticker: 'KSOL4',  institutionId: 'i1', assetClassId: 'ac6', quantidade: 1700, precoMedio: 4.20,  ...mockPrecos(4.20,  0.30) },
  { id: 'a5',  ticker: 'PTGX3',  institutionId: 'i5', assetClassId: 'ac6', quantidade: 600,  precoMedio: 52.90, ...mockPrecos(52.90, 0.62) },
  { id: 'a6',  ticker: 'BNVL4',  institutionId: 'i5', assetClassId: 'ac6', quantidade: 300,  precoMedio: 94.50, ...mockPrecos(94.50, 0.85) },
  { id: 'a7',  ticker: 'DRCT3',  institutionId: 'i2', assetClassId: 'ac6', quantidade: 2100, precoMedio: 9.10,  ...mockPrecos(9.10,  0.20) },
  { id: 'a8',  ticker: 'FSTR4',  institutionId: 'i1', assetClassId: 'ac6', quantidade: 350,  precoMedio: 61.70, ...mockPrecos(61.70, 0.68) },
  // FIIs
  { id: 'a9',  ticker: 'GLPX11', institutionId: 'i2', assetClassId: 'ac7', quantidade: 900,  precoMedio: 18.40, ...mockPrecos(18.40, 0.92) },
  { id: 'a10', ticker: 'HDNV11', institutionId: 'i1', assetClassId: 'ac7', quantidade: 1400, precoMedio: 6.55,  ...mockPrecos(6.55,  0.15) },
  { id: 'a11', ticker: 'IMRK11', institutionId: 'i5', assetClassId: 'ac7', quantidade: 500,  precoMedio: 27.80, ...mockPrecos(27.80, 0.73) },
  { id: 'a12', ticker: 'JVNT11', institutionId: 'i3', assetClassId: 'ac7', quantidade: 750,  precoMedio: 43.20, ...mockPrecos(43.20, 0.48) },
  { id: 'a13', ticker: 'KNRI11', institutionId: 'i1', assetClassId: 'ac7', quantidade: 600,  precoMedio: 162.50, ...mockPrecos(162.50, 0.58) },
  { id: 'a14', ticker: 'KFOF11', institutionId: 'i1', assetClassId: 'ac7', quantidade: 400,  precoMedio: 78.90,  ...mockPrecos(78.90,  0.44) },
  { id: 'a15', ticker: 'MXRF11', institutionId: 'i2', assetClassId: 'ac7', quantidade: 3000, precoMedio: 9.85,   ...mockPrecos(9.85,   0.67) },
  { id: 'a16', ticker: 'MCCI11', institutionId: 'i2', assetClassId: 'ac7', quantidade: 800,  precoMedio: 88.20,  ...mockPrecos(88.20,  0.72) },
  { id: 'a17', ticker: 'HGLG11', institutionId: 'i5', assetClassId: 'ac7', quantidade: 200,  precoMedio: 154.00, ...mockPrecos(154.00, 0.81) },
  { id: 'a18', ticker: 'HGRU11', institutionId: 'i5', assetClassId: 'ac7', quantidade: 350,  precoMedio: 116.40, ...mockPrecos(116.40, 0.36) },
  { id: 'a19', ticker: 'XPML11', institutionId: 'i1', assetClassId: 'ac7', quantidade: 500,  precoMedio: 95.60,  ...mockPrecos(95.60,  0.63) },
  { id: 'a20', ticker: 'XPLG11', institutionId: 'i1', assetClassId: 'ac7', quantidade: 300,  precoMedio: 102.30, ...mockPrecos(102.30, 0.49) },
  { id: 'a21', ticker: 'VISC11', institutionId: 'i3', assetClassId: 'ac7', quantidade: 450,  precoMedio: 89.70,  ...mockPrecos(89.70,  0.71) },
  { id: 'a22', ticker: 'VGIR11', institutionId: 'i3', assetClassId: 'ac7', quantidade: 1200, precoMedio: 10.15,  ...mockPrecos(10.15,  0.55) },
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function key(email: string, entity: string) {
  return `mdd_${email}_${entity}`
}

export function initUserData(email: string): void {
  if (localStorage.getItem(key(email, 'initialized'))) return
  localStorage.setItem(key(email, 'categories'), JSON.stringify(mockCategories))
  localStorage.setItem(key(email, 'assetClasses'), JSON.stringify(mockAssetClasses))
  localStorage.setItem(key(email, 'institutions'), JSON.stringify(mockInstitutions))
  localStorage.setItem(key(email, 'regions'), JSON.stringify(mockRegions))
  localStorage.setItem(key(email, 'liquidityOptions'), JSON.stringify(mockLiquidityOptions))
  localStorage.setItem(key(email, 'products'), JSON.stringify(mockProducts))
  localStorage.setItem(key(email, 'productEntries'), JSON.stringify(mockEntries))
  localStorage.setItem(key(email, 'dividends'), JSON.stringify(mockDividends))
  localStorage.setItem(key(email, 'benchmarks'), JSON.stringify(mockBenchmarks))
  localStorage.setItem(key(email, 'acoes'), JSON.stringify(DEFAULT_ACOES))
  localStorage.setItem(key(email, 'products_seeded'), '1')
  localStorage.setItem(key(email, 'initialized'), '1')
}

export function getCategories(email: string): Category[] {
  const d = localStorage.getItem(key(email, 'categories'))
  return d ? JSON.parse(d) : []
}

export function setCategories(email: string, items: Category[]): void {
  localStorage.setItem(key(email, 'categories'), JSON.stringify(items))
}

export function getAssetClasses(email: string): AssetClass[] {
  const d = localStorage.getItem(key(email, 'assetClasses'))
  const classes: AssetClass[] = d ? JSON.parse(d) : []

  // Migration: ensure ac6/ac7 have isAcao flag and correct names
  const needsMigration = classes.some(c => (c.id === 'ac6' || c.id === 'ac7') && !c.isAcao)
  if (needsMigration) {
    const migrated = classes.map(c => {
      if (c.id === 'ac6') return { ...c, name: 'Ações', isAcao: true }
      if (c.id === 'ac7') return { ...c, name: 'FIIs',  isAcao: true }
      return c
    })
    localStorage.setItem(key(email, 'assetClasses'), JSON.stringify(migrated))
    return migrated
  }

  return classes
}

export function setAssetClasses(email: string, items: AssetClass[]): void {
  localStorage.setItem(key(email, 'assetClasses'), JSON.stringify(items))
}

export function getInstitutions(email: string): Institution[] {
  const d = localStorage.getItem(key(email, 'institutions'))
  return d ? JSON.parse(d) : []
}

export function setInstitutions(email: string, items: Institution[]): void {
  localStorage.setItem(key(email, 'institutions'), JSON.stringify(items))
}

export function getRegions(email: string): Region[] {
  const d = localStorage.getItem(key(email, 'regions'))
  const regions: Region[] = d ? JSON.parse(d) : mockRegions

  // Migration: ensure exactly one region has isDefault
  const hasDefault = regions.some(r => r.isDefault)
  if (!hasDefault && regions.length > 0) {
    const brasil = regions.find(r => r.name.toLowerCase() === 'brasil')
    const target = brasil ?? regions[0]
    const migrated = regions.map(r => ({ ...r, isDefault: r.id === target.id }))
    localStorage.setItem(key(email, 'regions'), JSON.stringify(migrated))
    return migrated
  }
  return regions
}

export function setRegions(email: string, items: Region[]): void {
  localStorage.setItem(key(email, 'regions'), JSON.stringify(items))
}

export function getLiquidityOptions(email: string): LiquidityOption[] {
  const d = localStorage.getItem(key(email, 'liquidityOptions'))
  return d ? JSON.parse(d) : mockLiquidityOptions
}

export function setLiquidityOptions(email: string, items: LiquidityOption[]): void {
  localStorage.setItem(key(email, 'liquidityOptions'), JSON.stringify(items))
}

export function getDefaultRegion(email: string): Region | undefined {
  const regions = getRegions(email)
  return regions.find(r => r.isDefault) ?? regions[0]
}

export function getBenchmarks(email: string): BenchmarkEntry[] {
  const d = localStorage.getItem(key(email, 'benchmarks'))
  return d ? JSON.parse(d) : mockBenchmarks
}

export function setBenchmarks(email: string, items: BenchmarkEntry[]): void {
  localStorage.setItem(key(email, 'benchmarks'), JSON.stringify(items))
}

export function getDividends(email: string): Dividend[] {
  const d = localStorage.getItem(key(email, 'dividends'))
  return d ? JSON.parse(d) : mockDividends
}

export function setDividends(email: string, items: Dividend[]): void {
  localStorage.setItem(key(email, 'dividends'), JSON.stringify(items))
}

export function getAcoes(email: string): AcaoItem[] {
  const d = localStorage.getItem(key(email, 'acoes'))
  const acoes: AcaoItem[] = d ? JSON.parse(d) : []

  // Migration: ensure all items have assetClassId
  const needsMigration = acoes.some(a => !a.assetClassId)
  if (needsMigration) {
    const migrated = acoes.map(a => ({
      ...a,
      assetClassId: a.assetClassId ?? 'ac6', // default: Ações
    }))
    localStorage.setItem(key(email, 'acoes'), JSON.stringify(migrated))
    return migrated
  }

  return acoes
}

export function setAcoes(email: string, items: AcaoItem[]): void {
  localStorage.setItem(key(email, 'acoes'), JSON.stringify(items))
}

export function getStockDividends(email: string): StockDividend[] {
  const d = localStorage.getItem(key(email, 'stock_dividends'))
  return d ? JSON.parse(d) : []
}

export function setStockDividends(email: string, items: StockDividend[]): void {
  localStorage.setItem(key(email, 'stock_dividends'), JSON.stringify(items))
}

// ─────────────────────────────────────────────
// User preferences
// ─────────────────────────────────────────────
export interface UserPrefs {
  acoesPageSize: 10 | 20 | 50 | 100
}

const DEFAULT_PREFS: UserPrefs = { acoesPageSize: 20 }

export function getUserPrefs(email: string): UserPrefs {
  const d = localStorage.getItem(key(email, 'prefs'))
  return d ? { ...DEFAULT_PREFS, ...JSON.parse(d) } : DEFAULT_PREFS
}

export function setUserPrefs(email: string, prefs: Partial<UserPrefs>): void {
  const current = getUserPrefs(email)
  localStorage.setItem(key(email, 'prefs'), JSON.stringify({ ...current, ...prefs }))
}

// ─────────────────────────────────────────────
// Products & Entries
// ─────────────────────────────────────────────
export function getProducts(email: string): Product[] {
  const d = localStorage.getItem(key(email, 'products'))
  if (!d) return mockProducts

  const stored: Product[] = JSON.parse(d)

  // Migração: produtos foram inicializados com [] antes da correção.
  // Roda uma única vez — mescla mockProducts com eventuais agregados já salvos.
  if (!localStorage.getItem(key(email, 'products_seeded'))) {
    const aggregated = stored.filter(p => p.isAggregated)
    const migrated = [...mockProducts, ...aggregated]
    localStorage.setItem(key(email, 'products'), JSON.stringify(migrated))
    localStorage.setItem(key(email, 'products_seeded'), '1')
    return migrated
  }

  return stored
}

export function setProducts(email: string, items: Product[]): void {
  localStorage.setItem(key(email, 'products'), JSON.stringify(items))
}

export function getProductEntries(email: string): ProductEntry[] {
  const d = localStorage.getItem(key(email, 'productEntries'))
  return d ? JSON.parse(d) : mockEntries
}

export function setProductEntries(email: string, items: ProductEntry[]): void {
  localStorage.setItem(key(email, 'productEntries'), JSON.stringify(items))
}

// ─────────────────────────────────────────────
// Aggregated products (Ações/FIIs auto-managed)
// Lê ações da API e escreve produtos/entries/dividends na API.
// ─────────────────────────────────────────────
let _upsertInProgress = false

export async function upsertAggregatedProducts(
  _email: string,
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
  // Busca dados da API
  let apiAcoes: AcaoItem[] = []
  let apiAcs: AssetClass[] = []
  let apiInsts: Institution[] = []
  let apiRegions: Region[] = []
  let apiLiqs: LiquidityOption[] = []
  let apiProducts: Product[] = []
  let apiStockDivs: StockDividend[] = []

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

  // Normaliza stockTickerId → acaoId para reutilizar a lógica abaixo
  const stockDividends: StockDividend[] = apiStockDivs.map((d: any) => ({ ...d, acaoId: d.stockTickerId ?? d.acaoId }))

  const apiDefaultRegion = apiRegions.find(r => r.isDefault) ?? apiRegions[0]
  const apiDefaultLiqId  = apiLiqs[0]?.id

  // Group by (assetClassId, institutionId) — IDs reais da API
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

    // Find or create aggregated product na API
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

    // Upsert entry na API
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

  // Agregados sem ações correspondentes: remove a entry do mês na API
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

export function getLastRefresh(email: string): string | null {
  return localStorage.getItem(key(email, 'lastRefresh'))
}

export function setLastRefresh(email: string, iso: string): void {
  localStorage.setItem(key(email, 'lastRefresh'), iso)
}

export function deleteUserData(email: string): void {
  ['categories', 'assetClasses', 'institutions', 'regions', 'liquidityOptions', 'products', 'productEntries', 'dividends', 'benchmarks', 'acoes', 'initialized', 'lastRefresh', 'products_seeded'].forEach(e => {
    localStorage.removeItem(key(email, e))
  })
}
