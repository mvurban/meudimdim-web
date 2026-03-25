import type { Category, AssetClass, Institution, Region, LiquidityOption, Dividend, BenchmarkEntry, StockDividend, Product, ProductEntry } from '@/types'
import { mockCategories, mockAssetClasses, mockInstitutions, mockRegions, mockLiquidityOptions, mockDividends, mockBenchmarks, mockProducts, mockEntries } from './mock-data'

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
// Creates or updates one Product per (assetClass × institution) pair
// and sets a single ProductEntry for the given month/year with the
// summed value from the AcaoItem portfolio.
// ─────────────────────────────────────────────
export function upsertAggregatedProducts(
  email: string,
  month: number,
  year: number,
): { upserted: number } {
  const acoes = getAcoes(email)
  const assetClasses = getAssetClasses(email)
  const institutions = getInstitutions(email)
  const regions = getRegions(email)

  const defaultRegion = regions.find(r => r.isDefault) ?? regions[0]
  const defaultLiquidityId = 'liq3' // D+2 — padrão para renda variável

  // Group by (assetClassId, institutionId)
  type GroupKey = string
  const groups = new Map<GroupKey, { assetClassId: string; institutionId: string; totalBrl: number }>()

  for (const acao of acoes) {
    const gKey: GroupKey = `${acao.assetClassId}__${acao.institutionId}`
    const existing = groups.get(gKey)
    const valueBrl = acao.quantidade * acao.precoAtual
    if (existing) {
      existing.totalBrl += valueBrl
    } else {
      groups.set(gKey, { assetClassId: acao.assetClassId, institutionId: acao.institutionId, totalBrl: valueBrl })
    }
  }

  const products = getProducts(email)
  const entries = getProductEntries(email)

  for (const [, group] of groups) {
    const ac = assetClasses.find(a => a.id === group.assetClassId)
    const inst = institutions.find(i => i.id === group.institutionId)
    if (!ac || !inst) continue

    const productName = `${ac.name} ${inst.name}`
    const valueBrl = Math.round(group.totalBrl * 100) / 100

    // Find or create aggregated product
    let product = products.find(
      p => p.isAggregated && p.assetClassId === group.assetClassId && p.institutionId === group.institutionId
    )

    if (!product) {
      product = {
        id: `agg_${group.assetClassId}_${group.institutionId}`,
        name: productName,
        categoryId: ac.categoryId,
        assetClassId: group.assetClassId,
        institutionId: group.institutionId,
        regionId: defaultRegion?.id ?? 'r1',
        currency: 'BRL',
        liquidityId: defaultLiquidityId,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
        isAggregated: true,
      }
      products.push(product)
    }

    // Upsert entry for this month/year
    const entryId = `agg_entry_${product.id}_${year}${String(month).padStart(2, '0')}`
    const existingEntryIdx = entries.findIndex(e => e.productId === product!.id && e.month === month && e.year === year)

    // Calc contribution/withdrawal vs previous month
    const prevEntry = entries
      .filter(e => e.productId === product!.id)
      .filter(e => e.year < year || (e.year === year && e.month < month))
      .sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month))[0]

    const prevValue = prevEntry?.valueBrl ?? 0
    const contribution = Math.max(0, Math.round((valueBrl - prevValue) * 100) / 100)
    const withdrawal = Math.max(0, Math.round((prevValue - valueBrl) * 100) / 100)

    const newEntry: ProductEntry = {
      id: entryId,
      productId: product.id,
      month,
      year,
      contribution,
      withdrawal,
      returnPct: 0,
      income: 0,
      valueOriginal: valueBrl,
      valueBrl,
      valueUsd: 0,
      valueFinal: valueBrl,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    if (existingEntryIdx >= 0) {
      entries[existingEntryIdx] = newEntry
    } else {
      entries.push(newEntry)
    }
  }

  // Produtos agregados sem ações correspondentes: remove a entrada do mês corrente.
  // O produto em si é preservado para manter continuidade histórica.
  const activeGroupKeys = new Set(groups.keys())
  for (const p of products) {
    if (!p.isAggregated) continue
    const gKey = `${p.assetClassId}__${p.institutionId}`
    if (activeGroupKeys.has(gKey)) continue
    const idx = entries.findIndex(e => e.productId === p.id && e.month === month && e.year === year)
    if (idx >= 0) entries.splice(idx, 1)
  }

  setProducts(email, products)
  setProductEntries(email, entries)

  // Record last refresh timestamp
  localStorage.setItem(key(email, 'lastRefresh'), new Date().toISOString())

  return { upserted: groups.size }
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
