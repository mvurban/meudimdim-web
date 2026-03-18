// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

// ─────────────────────────────────────────────
// REFERENCE TABLES (admin)
// ─────────────────────────────────────────────
export type CategoryName =
  | 'Renda Fixa'
  | 'Multimercado'
  | 'Renda Variável'
  | 'Internacional'
  | 'Commodities'

export interface Category {
  id: string
  name: CategoryName
  color: string // hex used in charts
}

export interface AssetClass {
  id: string
  name: string
  categoryId: string
  category?: Category
}

export interface Institution {
  id: string
  name: string
  logoUrl?: string
}

export interface Region {
  id: string
  name: string
  isDefault: boolean
}

// ─────────────────────────────────────────────
// EXCHANGE RATES
// ─────────────────────────────────────────────
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BTC'

export interface ExchangeRate {
  id: string
  month: number   // 1–12
  year: number
  currency: CurrencyCode
  rate: number    // value in BRL
}

// ─────────────────────────────────────────────
// LIQUIDITY
// ─────────────────────────────────────────────
export type LiquidityUnit = 'days' | 'months' | 'years'

export interface Liquidity {
  value: number
  unit: LiquidityUnit
}

// ─────────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────────
export type ProductStatus = 'active' | 'closed'
export type ProductCurrency = 'BRL' | 'USD' | 'EUR'
export type RegionType = 'Brasil' | 'Internacional'

export interface Product {
  id: string
  name: string
  cnpj?: string
  categoryId: string
  category?: Category
  assetClassId: string
  assetClass?: AssetClass
  institutionId: string
  institution?: Institution
  regionId: string
  country?: string
  currency: ProductCurrency
  liquidity: Liquidity
  status: ProductStatus
  createdAt: string
  details?: string
  // computed from latest entry
  currentValue?: number
  currentValueBrl?: number
  currentValueUsd?: number
}

// ─────────────────────────────────────────────
// PRODUCT MONTHLY ENTRY (snapshot)
// ─────────────────────────────────────────────
export interface ProductEntry {
  id: string
  productId: string
  product?: Product
  month: number   // 1–12
  year: number
  contribution: number      // aporte
  withdrawal: number        // retirada
  returnPct: number         // rentabilidade %
  // calculated by API:
  income: number            // renda = valor_anterior × rentabilidade%
  valueOriginal: number     // valor na moeda do produto
  valueBrl: number          // convertido para BRL
  valueUsd: number          // convertido para USD
  valueFinal: number        // valor final calculado
  exchangeRate?: number     // cotação usada
  notes?: string
  createdAt: string
}

// ─────────────────────────────────────────────
// DIVIDENDS
// ─────────────────────────────────────────────
export type DividendType = 'Dividendo' | 'JCP' | 'Outros'

export interface Dividend {
  id: string
  productId?: string
  ticker?: string
  date: string      // ISO
  value: number
  type: DividendType
  notes?: string
}

// ─────────────────────────────────────────────
// STOCKS (ações)
// ─────────────────────────────────────────────
export interface StockTicker {
  id: string
  ticker: string
  institutionId: string
  institution?: Institution
  quantity: number
  avgPrice: number         // preço médio de compra
  // fetched from Yahoo Finance:
  currentPrice?: number
  dayChange?: number       // variação do dia %
  totalValue?: number      // quantity × currentPrice
  returnSinceEntry?: number // rentabilidade desde compra %
  lastUpdated?: string
}

export interface StockMonthClose {
  id: string
  institutionId: string
  institution?: Institution
  month: number
  year: number
  confirmedValue: number   // valor total confirmado pelo usuário
  linkedProductEntryId?: string
}

// ─────────────────────────────────────────────
// DASHBOARD / CONSOLIDATION
// ─────────────────────────────────────────────
export interface MonthSummary {
  month: number
  year: number
  totalValue: number
  totalValueUsd: number
  totalContribution: number
  totalWithdrawal: number
  totalIncome: number
  returnPct: number
}

export interface AllocationByCategory {
  category: CategoryName
  value: number
  pct: number
  color: string
}

export interface AllocationByInstitution {
  institution: string
  value: number
  pct: number
}

export interface AllocationByRegion {
  region: RegionType
  value: number
  pct: number
}

export interface DashboardData {
  selectedMonth: number
  selectedYear: number
  totalValue: number
  totalValueUsd: number
  monthContribution: number
  monthWithdrawal: number
  monthIncome: number
  monthReturnPct: number
  byCategory: AllocationByCategory[]
  byInstitution: AllocationByInstitution[]
  byRegion: AllocationByRegion[]
  monthlyEvolution: MonthSummary[]
}

// ─────────────────────────────────────────────
// INSTITUTION VIEW
// ─────────────────────────────────────────────
export interface InstitutionMonthlyData {
  month: number
  year: number
  totalValue: number
  totalContribution: number
  totalWithdrawal: number
  totalIncome: number
  returnPct: number
  accumulatedReturn: number
}

export interface InstitutionView {
  institution: Institution
  monthlyData: InstitutionMonthlyData[]
  products: Product[]
}

// ─────────────────────────────────────────────
// API RESPONSE WRAPPER
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// ─────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────
export type Theme = 'dark' | 'light'

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
