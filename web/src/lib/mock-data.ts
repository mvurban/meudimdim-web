import type {
  User, Category, AssetClass, Institution,
  ExchangeRate, Product, ProductEntry, Dividend,
  StockTicker, DashboardData, InstitutionView,
} from '@/types'

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export const mockUser: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  createdAt: '2024-01-01',
}

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Renda Fixa',      color: '#22c55e' },
  { id: 'cat2', name: 'Multimercado',    color: '#3b82f6' },
  { id: 'cat3', name: 'Renda Variável',  color: '#f59e0b' },
  { id: 'cat4', name: 'Internacional',   color: '#a855f7' },
  { id: 'cat5', name: 'Commodities',     color: '#ef4444' },
]

// ─────────────────────────────────────────────
// ASSET CLASSES
// ─────────────────────────────────────────────
export const mockAssetClasses: AssetClass[] = [
  { id: 'ac1',  name: 'Pós-fixado',       categoryId: 'cat1' },
  { id: 'ac2',  name: 'Inflação (IPCA+)', categoryId: 'cat1' },
  { id: 'ac3',  name: 'Prefixado',        categoryId: 'cat1' },
  { id: 'ac4',  name: 'CRI/CRA',          categoryId: 'cat1' },
  { id: 'ac5',  name: 'Multimercado',     categoryId: 'cat2' },
  { id: 'ac6',  name: 'Ações BR',         categoryId: 'cat3' },
  { id: 'ac7',  name: 'FII',              categoryId: 'cat3' },
  { id: 'ac8',  name: 'ETF BR',           categoryId: 'cat3' },
  { id: 'ac9',  name: 'ETF Internacional',categoryId: 'cat4' },
  { id: 'ac10', name: 'BDR',              categoryId: 'cat4' },
  { id: 'ac11', name: 'Ouro',             categoryId: 'cat5' },
]

// ─────────────────────────────────────────────
// INSTITUTIONS
// ─────────────────────────────────────────────
export const mockInstitutions: Institution[] = [
  { id: 'i1', name: 'XP Investimentos' },
  { id: 'i2', name: 'Clear Corretora'  },
  { id: 'i3', name: 'Nubank'           },
  { id: 'i4', name: 'Avenue'           },
  { id: 'i5', name: 'Itaú'             },
]

// ─────────────────────────────────────────────
// EXCHANGE RATES
// ─────────────────────────────────────────────
export const mockExchangeRates: ExchangeRate[] = [
  { id: 'er1', month: 1,  year: 2025, currency: 'USD', rate: 4.97 },
  { id: 'er2', month: 2,  year: 2025, currency: 'USD', rate: 5.12 },
  { id: 'er3', month: 3,  year: 2025, currency: 'USD', rate: 5.05 },
  { id: 'er4', month: 4,  year: 2025, currency: 'USD', rate: 5.18 },
  { id: 'er5', month: 5,  year: 2025, currency: 'USD', rate: 5.22 },
  { id: 'er6', month: 6,  year: 2025, currency: 'USD', rate: 5.31 },
  { id: 'er7', month: 7,  year: 2025, currency: 'USD', rate: 5.28 },
  { id: 'er8', month: 8,  year: 2025, currency: 'USD', rate: 5.35 },
  { id: 'er9', month: 9,  year: 2025, currency: 'USD', rate: 5.40 },
  { id: 'er10',month: 10, year: 2025, currency: 'USD', rate: 5.55 },
  { id: 'er11',month: 11, year: 2025, currency: 'USD', rate: 5.62 },
  { id: 'er12',month: 12, year: 2025, currency: 'USD', rate: 5.71 },
  { id: 'er13',month: 1,  year: 2026, currency: 'USD', rate: 5.80 },
  { id: 'er14',month: 2,  year: 2026, currency: 'USD', rate: 5.76 },
  { id: 'er15',month: 3,  year: 2026, currency: 'USD', rate: 5.83 },
]

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'CDB XP 110% CDI',
    categoryId: 'cat1',
    assetClassId: 'ac1',
    institutionId: 'i1',
    region: 'Brasil',
    currency: 'BRL',
    liquidity: { value: 1, unit: 'days' },
    status: 'active',
    createdAt: '2024-01-01',
    details: '110% CDI · D+1',
    currentValue: 85400,
    currentValueBrl: 85400,
    currentValueUsd: 14654,
  },
  {
    id: 'p2',
    name: 'Tesouro IPCA+ 2029',
    categoryId: 'cat1',
    assetClassId: 'ac2',
    institutionId: 'i5',
    region: 'Brasil',
    currency: 'BRL',
    liquidity: { value: 4, unit: 'years' },
    status: 'active',
    createdAt: '2024-03-01',
    details: 'IPCA + 5,6% · 05/2029',
    currentValue: 62300,
    currentValueBrl: 62300,
    currentValueUsd: 10688,
  },
  {
    id: 'p3',
    name: 'Fundo Multimercado XP',
    categoryId: 'cat2',
    assetClassId: 'ac5',
    institutionId: 'i1',
    region: 'Brasil',
    currency: 'BRL',
    liquidity: { value: 30, unit: 'days' },
    status: 'active',
    createdAt: '2023-06-01',
    details: 'Resgate em 30 dias corridos',
    currentValue: 43200,
    currentValueBrl: 43200,
    currentValueUsd: 7408,
  },
  {
    id: 'p4',
    name: 'Ações Clear',
    categoryId: 'cat3',
    assetClassId: 'ac6',
    institutionId: 'i2',
    region: 'Brasil',
    currency: 'BRL',
    liquidity: { value: 2, unit: 'days' },
    status: 'active',
    createdAt: '2023-01-01',
    details: 'Carteira diversificada BR',
    currentValue: 78500,
    currentValueBrl: 78500,
    currentValueUsd: 13470,
  },
  {
    id: 'p5',
    name: 'VNQ — Real Estate ETF',
    categoryId: 'cat4',
    assetClassId: 'ac9',
    institutionId: 'i4',
    region: 'Internacional',
    country: 'EUA',
    currency: 'USD',
    liquidity: { value: 2, unit: 'days' },
    status: 'active',
    createdAt: '2023-09-01',
    details: 'Vanguard Real Estate ETF · EUA',
    currentValue: 12500,
    currentValueBrl: 72875,
    currentValueUsd: 12500,
  },
  {
    id: 'p6',
    name: 'HGLG11 — FII Logística',
    categoryId: 'cat3',
    assetClassId: 'ac7',
    institutionId: 'i1',
    region: 'Brasil',
    currency: 'BRL',
    liquidity: { value: 2, unit: 'days' },
    status: 'active',
    createdAt: '2024-02-01',
    details: 'FII Logística · D+2',
    currentValue: 55200,
    currentValueBrl: 55200,
    currentValueUsd: 9469,
  },
]

// ─────────────────────────────────────────────
// PRODUCT ENTRIES (last 3 months for p1)
// ─────────────────────────────────────────────
export const mockEntries: ProductEntry[] = [
  // p1 — CDB XP 110% CDI
  {
    id: 'e1', productId: 'p1', month: 1, year: 2026,
    contribution: 1000, withdrawal: 0, returnPct: 0.91,
    income: 769, valueOriginal: 85400, valueBrl: 85400, valueUsd: 14724,
    valueFinal: 85400, exchangeRate: 5.80, createdAt: '2026-01-31',
  },
  {
    id: 'e2', productId: 'p1', month: 2, year: 2026,
    contribution: 0, withdrawal: 0, returnPct: 0.87,
    income: 743, valueOriginal: 86143, valueBrl: 86143, valueUsd: 14951,
    valueFinal: 86143, exchangeRate: 5.76, createdAt: '2026-02-28',
  },
  {
    id: 'e3', productId: 'p1', month: 3, year: 2026,
    contribution: 500, withdrawal: 0, returnPct: 0.89,
    income: 766, valueOriginal: 87409, valueBrl: 87409, valueUsd: 14994,
    valueFinal: 87409, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p2 — Tesouro IPCA+ 2029
  {
    id: 'e4', productId: 'p2', month: 3, year: 2026,
    contribution: 0, withdrawal: 0, returnPct: 1.15,
    income: 716, valueOriginal: 62300, valueBrl: 62300, valueUsd: 10688,
    valueFinal: 62300, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p3 — Fundo Multimercado XP
  {
    id: 'e5', productId: 'p3', month: 3, year: 2026,
    contribution: 2000, withdrawal: 0, returnPct: 0.72,
    income: 311, valueOriginal: 43200, valueBrl: 43200, valueUsd: 7408,
    valueFinal: 43200, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p4 — Ações Clear
  {
    id: 'e6', productId: 'p4', month: 3, year: 2026,
    contribution: 0, withdrawal: 0, returnPct: 2.30,
    income: 1806, valueOriginal: 78500, valueBrl: 78500, valueUsd: 13470,
    valueFinal: 78500, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p5 — VNQ Real Estate ETF
  {
    id: 'e7', productId: 'p5', month: 3, year: 2026,
    contribution: 1000, withdrawal: 0, returnPct: 1.45,
    income: 1057, valueOriginal: 12500, valueBrl: 72875, valueUsd: 12500,
    valueFinal: 72875, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p6 — HGLG11 FII Logística
  {
    id: 'e8', productId: 'p6', month: 3, year: 2026,
    contribution: 0, withdrawal: 0, returnPct: 1.59,
    income: 877, valueOriginal: 55200, valueBrl: 55200, valueUsd: 9469,
    valueFinal: 55200, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
]

// ─────────────────────────────────────────────
// DIVIDENDS
// ─────────────────────────────────────────────
export const mockDividends: Dividend[] = [
  { id: 'd1', productId: 'p6', date: '2026-03-14', value: 876.00, type: 'Dividendo' },
  { id: 'd2', productId: 'p6', date: '2026-02-14', value: 841.50, type: 'Dividendo' },
  { id: 'd3', productId: 'p4', date: '2026-03-10', value: 320.00, type: 'JCP' },
  { id: 'd4', productId: 'p4', date: '2026-02-10', value: 290.00, type: 'JCP' },
]

// ─────────────────────────────────────────────
// STOCKS
// ─────────────────────────────────────────────
export const mockTickers: StockTicker[] = [
  {
    id: 't1', ticker: 'PETR4', institutionId: 'i2',
    quantity: 500, avgPrice: 32.40,
    currentPrice: 36.78, dayChange: 1.2,
    totalValue: 18390, returnSinceEntry: 13.5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 't2', ticker: 'ITUB4', institutionId: 'i2',
    quantity: 300, avgPrice: 28.10,
    currentPrice: 31.45, dayChange: -0.4,
    totalValue: 9435, returnSinceEntry: 11.9,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 't3', ticker: 'MXRF11', institutionId: 'i1',
    quantity: 2000, avgPrice: 9.80,
    currentPrice: 10.12, dayChange: 0.3,
    totalValue: 20240, returnSinceEntry: 3.3,
    lastUpdated: new Date().toISOString(),
  },
]

// ─────────────────────────────────────────────
// DASHBOARD DATA
// ─────────────────────────────────────────────
export const mockDashboard: DashboardData = {
  selectedMonth: 3,
  selectedYear: 2026,
  totalValue: 397575,
  totalValueUsd: 68193,
  monthContribution: 3500,
  monthWithdrawal: 0,
  monthIncome: 4821,
  monthReturnPct: 1.23,
  byCategory: [
    { category: 'Renda Fixa',     value: 147700, pct: 37.1, color: '#22c55e' },
    { category: 'Renda Variável', value: 133700, pct: 33.6, color: '#f59e0b' },
    { category: 'Internacional',  value: 72875,  pct: 18.3, color: '#a855f7' },
    { category: 'Multimercado',   value: 43200,  pct: 10.9, color: '#3b82f6' },
    { category: 'Commodities',    value: 0,      pct: 0,    color: '#ef4444' },
  ],
  byInstitution: [
    { institution: 'XP Investimentos', value: 184200, pct: 46.3 },
    { institution: 'Clear Corretora',  value: 78500,  pct: 19.7 },
    { institution: 'Avenue',           value: 72875,  pct: 18.3 },
    { institution: 'Itaú',             value: 62300,  pct: 15.7 },
  ],
  byRegion: [
    { region: 'Brasil',        value: 324700, pct: 81.7 },
    { region: 'Internacional', value: 72875,  pct: 18.3 },
  ],
  monthlyEvolution: [
    { month: 4,  year: 2025, totalValue: 310000, totalValueUsd: 59847, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 2800, returnPct: 0.91 },
    { month: 5,  year: 2025, totalValue: 318500, totalValueUsd: 61017, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 2900, returnPct: 0.94 },
    { month: 6,  year: 2025, totalValue: 325200, totalValueUsd: 61242, totalContribution: 3500, totalWithdrawal: 0, totalIncome: 3100, returnPct: 0.96 },
    { month: 7,  year: 2025, totalValue: 333800, totalValueUsd: 63257, totalContribution: 4500, totalWithdrawal: 2000, totalIncome: 3200, returnPct: 0.98 },
    { month: 8,  year: 2025, totalValue: 342100, totalValueUsd: 63944, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 3400, returnPct: 1.01 },
    { month: 9,  year: 2025, totalValue: 352400, totalValueUsd: 65259, totalContribution: 5000, totalWithdrawal: 0, totalIncome: 3550, returnPct: 1.04 },
    { month: 10, year: 2025, totalValue: 361700, totalValueUsd: 65171, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 3620, returnPct: 1.03 },
    { month: 11, year: 2025, totalValue: 371200, totalValueUsd: 66049, totalContribution: 4500, totalWithdrawal: 0, totalIncome: 3720, returnPct: 1.02 },
    { month: 12, year: 2025, totalValue: 381500, totalValueUsd: 66812, totalContribution: 5000, totalWithdrawal: 1000, totalIncome: 3850, returnPct: 1.05 },
    { month: 1,  year: 2026, totalValue: 388200, totalValueUsd: 66931, totalContribution: 3500, totalWithdrawal: 0, totalIncome: 3900, returnPct: 1.04 },
    { month: 2,  year: 2026, totalValue: 393400, totalValueUsd: 68299, totalContribution: 3000, totalWithdrawal: 0, totalIncome: 4100, returnPct: 1.06 },
    { month: 3,  year: 2026, totalValue: 397575, totalValueUsd: 68193, totalContribution: 3500, totalWithdrawal: 0, totalIncome: 4821, returnPct: 1.23 },
  ],
}

// ─────────────────────────────────────────────
// INSTITUTION VIEW (XP example)
// ─────────────────────────────────────────────
export const mockInstitutionView: InstitutionView = {
  institution: mockInstitutions[0],
  products: mockProducts.filter(p => p.institutionId === 'i1'),
  monthlyData: mockDashboard.monthlyEvolution.map((m, i) => ({
    ...m,
    accumulatedReturn: parseFloat((((310000 + i * 7000) / 310000 - 1) * 100).toFixed(2)),
  })),
}
