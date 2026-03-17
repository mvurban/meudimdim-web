import type { Category, AssetClass, Institution } from '@/types'
import { mockCategories, mockAssetClasses, mockInstitutions } from './mock-data'

// ─────────────────────────────────────────────
// Ações (mock-only type — será substituído por API + Yahoo Finance)
// ─────────────────────────────────────────────
export interface AcaoItem {
  id: string
  ticker: string
  institutionId: string
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
const DEFAULT_ACOES: AcaoItem[] = [
  { id: 'a1',  ticker: 'AXBR3', institutionId: 'i2', quantidade: 800,  precoMedio: 14.30, ...mockPrecos(14.30, 0.55) },
  { id: 'a2',  ticker: 'LMTC4', institutionId: 'i1', quantidade: 1200, precoMedio: 7.80,  ...mockPrecos(7.80,  0.40) },
  { id: 'a3',  ticker: 'VRND3', institutionId: 'i2', quantidade: 450,  precoMedio: 33.60, ...mockPrecos(33.60, 0.78) },
  { id: 'a4',  ticker: 'KSOL4', institutionId: 'i1', quantidade: 1700, precoMedio: 4.20,  ...mockPrecos(4.20,  0.30) },
  { id: 'a5',  ticker: 'PTGX3', institutionId: 'i5', quantidade: 600,  precoMedio: 52.90, ...mockPrecos(52.90, 0.62) },
  { id: 'a6',  ticker: 'BNVL4', institutionId: 'i5', quantidade: 300,  precoMedio: 94.50, ...mockPrecos(94.50, 0.85) },
  { id: 'a7',  ticker: 'DRCT3', institutionId: 'i2', quantidade: 2100, precoMedio: 9.10,  ...mockPrecos(9.10,  0.20) },
  { id: 'a8',  ticker: 'FSTR4', institutionId: 'i1', quantidade: 350,  precoMedio: 61.70, ...mockPrecos(61.70, 0.68) },
  { id: 'a9',  ticker: 'GLPX3', institutionId: 'i2', quantidade: 900,  precoMedio: 18.40, ...mockPrecos(18.40, 0.92) },
  { id: 'a10', ticker: 'HDNV4', institutionId: 'i1', quantidade: 1400, precoMedio: 6.55,  ...mockPrecos(6.55,  0.15) },
  { id: 'a11', ticker: 'IMRK3', institutionId: 'i5', quantidade: 500,  precoMedio: 27.80, ...mockPrecos(27.80, 0.73) },
  { id: 'a12', ticker: 'JVNT4', institutionId: 'i3', quantidade: 750,  precoMedio: 43.20, ...mockPrecos(43.20, 0.48) },
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
  localStorage.setItem(key(email, 'products'), JSON.stringify([]))
  localStorage.setItem(key(email, 'acoes'), JSON.stringify(DEFAULT_ACOES))
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
  return d ? JSON.parse(d) : []
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

export function getAcoes(email: string): AcaoItem[] {
  const d = localStorage.getItem(key(email, 'acoes'))
  return d ? JSON.parse(d) : []
}

export function setAcoes(email: string, items: AcaoItem[]): void {
  localStorage.setItem(key(email, 'acoes'), JSON.stringify(items))
}

export function deleteUserData(email: string): void {
  ['categories', 'assetClasses', 'institutions', 'products', 'acoes', 'initialized'].forEach(e => {
    localStorage.removeItem(key(email, e))
  })
}
