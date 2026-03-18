import type {
  User, Category, AssetClass, Institution, Region,
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
// REGIONS
// ─────────────────────────────────────────────
export const mockRegions: Region[] = [
  { id: 'r1', name: 'Brasil',   isDefault: true  },
  { id: 'r2', name: 'EUA',      isDefault: false },
  { id: 'r3', name: 'Europa',   isDefault: false },
  { id: 'r4', name: 'China',    isDefault: false },
  { id: 'r5', name: 'Pacífico', isDefault: false },
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
    regionId: 'r1',
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
    regionId: 'r1',
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
    regionId: 'r1',
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
    regionId: 'r1',
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
    regionId: 'r2',
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
    regionId: 'r1',
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
    contribution: 0, withdrawal: 5000, returnPct: -0.48,
    income: -207, valueOriginal: 43200, valueBrl: 43200, valueUsd: 7408,
    valueFinal: 43200, exchangeRate: 5.83, createdAt: '2026-03-31',
  },
  // p4 — Ações Clear
  {
    id: 'e6', productId: 'p4', month: 3, year: 2026,
    contribution: 0, withdrawal: 3200, returnPct: -1.87,
    income: -1468, valueOriginal: 78500, valueBrl: 78500, valueUsd: 13470,
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
    contribution: 0, withdrawal: 1500, returnPct: -0.31,
    income: -171, valueOriginal: 55200, valueBrl: 55200, valueUsd: 9469,
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
// YEAR SNAPSHOTS — Overview para anos anteriores
// ─────────────────────────────────────────────
export const mockYearSnapshots: Record<number, DashboardData> = {
  2024: {
    selectedMonth: 12,
    selectedYear: 2024,
    totalValue: 260000,
    totalValueUsd: 52000,
    monthContribution: 3500,
    monthWithdrawal: 0,
    monthIncome: 2200,
    monthReturnPct: 0.86,
    byCategory: [
      { category: 'Renda Fixa',     value:  98800, pct: 38.0, color: '#22c55e' },
      { category: 'Renda Variável', value:  83200, pct: 32.0, color: '#f59e0b' },
      { category: 'Internacional',  value:  46800, pct: 18.0, color: '#a855f7' },
      { category: 'Multimercado',   value:  31200, pct: 12.0, color: '#3b82f6' },
      { category: 'Commodities',    value:      0, pct:  0.0, color: '#ef4444' },
    ],
    byInstitution: [
      { institution: 'XP Investimentos', value: 119600, pct: 46.0 },
      { institution: 'Clear Corretora',  value:  52000, pct: 20.0 },
      { institution: 'Avenue',           value:  46800, pct: 18.0 },
      { institution: 'Itaú',             value:  41600, pct: 16.0 },
    ],
    byRegion: [
      { region: 'Brasil',        value: 213200, pct: 82.0 },
      { region: 'Internacional', value:  46800, pct: 18.0 },
    ],
    monthlyEvolution: [
      { month:  1, year: 2024, totalValue: 220000, totalValueUsd: 44000, totalContribution: 3000, totalWithdrawal: 0, totalIncome: 1800, returnPct: 0.82 },
      { month:  2, year: 2024, totalValue: 224500, totalValueUsd: 44900, totalContribution: 3000, totalWithdrawal: 0, totalIncome: 1840, returnPct: 0.83 },
      { month:  3, year: 2024, totalValue: 229000, totalValueUsd: 45800, totalContribution: 3000, totalWithdrawal: 0, totalIncome: 1860, returnPct: 0.83 },
      { month:  4, year: 2024, totalValue: 233500, totalValueUsd: 46700, totalContribution: 3000, totalWithdrawal: 0, totalIncome: 1880, returnPct: 0.82 },
      { month:  5, year: 2024, totalValue: 237500, totalValueUsd: 47500, totalContribution: 2500, totalWithdrawal: 0, totalIncome: 1910, returnPct: 0.82 },
      { month:  6, year: 2024, totalValue: 241500, totalValueUsd: 48300, totalContribution: 2500, totalWithdrawal: 0, totalIncome: 1940, returnPct: 0.82 },
      { month:  7, year: 2024, totalValue: 245500, totalValueUsd: 49100, totalContribution: 2500, totalWithdrawal: 0, totalIncome: 1960, returnPct: 0.81 },
      { month:  8, year: 2024, totalValue: 249500, totalValueUsd: 49900, totalContribution: 2500, totalWithdrawal: 0, totalIncome: 2000, returnPct: 0.82 },
      { month:  9, year: 2024, totalValue: 252500, totalValueUsd: 50500, totalContribution: 2000, totalWithdrawal: 0, totalIncome: 2060, returnPct: 0.83 },
      { month: 10, year: 2024, totalValue: 255000, totalValueUsd: 51000, totalContribution: 2000, totalWithdrawal: 0, totalIncome: 2100, returnPct: 0.84 },
      { month: 11, year: 2024, totalValue: 257500, totalValueUsd: 51500, totalContribution: 2000, totalWithdrawal: 0, totalIncome: 2150, returnPct: 0.85 },
      { month: 12, year: 2024, totalValue: 260000, totalValueUsd: 52000, totalContribution: 3500, totalWithdrawal: 0, totalIncome: 2200, returnPct: 0.86 },
    ],
  },
  2025: {
    selectedMonth: 12,
    selectedYear: 2025,
    totalValue: 381500,
    totalValueUsd: 66812,
    monthContribution: 5000,
    monthWithdrawal: 1000,
    monthIncome: 3850,
    monthReturnPct: 1.05,
    byCategory: [
      { category: 'Renda Fixa',     value: 159100, pct: 41.7, color: '#22c55e' },
      { category: 'Renda Variável', value: 127400, pct: 33.4, color: '#f59e0b' },
      { category: 'Internacional',  value:  68900, pct: 18.1, color: '#a855f7' },
      { category: 'Multimercado',   value:  41400, pct: 10.9, color: '#3b82f6' },
      { category: 'Commodities',    value:      0, pct:  0.0, color: '#ef4444' },
    ],
    byInstitution: [
      { institution: 'XP Investimentos', value: 175800, pct: 46.1 },
      { institution: 'Clear Corretora',  value:  76100, pct: 20.0 },
      { institution: 'Avenue',           value:  68900, pct: 18.1 },
      { institution: 'Itaú',             value:  60700, pct: 15.9 },
    ],
    byRegion: [
      { region: 'Brasil',        value: 312600, pct: 81.9 },
      { region: 'Internacional', value:  68900, pct: 18.1 },
    ],
    monthlyEvolution: [
      { month:  1, year: 2025, totalValue: 271000, totalValueUsd: 54521, totalContribution: 5000, totalWithdrawal: 0, totalIncome: 2300, returnPct: 0.87 },
      { month:  2, year: 2025, totalValue: 282000, totalValueUsd: 55078, totalContribution: 5000, totalWithdrawal: 0, totalIncome: 2450, returnPct: 0.88 },
      { month:  3, year: 2025, totalValue: 296000, totalValueUsd: 58614, totalContribution: 5000, totalWithdrawal: 0, totalIncome: 2600, returnPct: 0.89 },
      { month:  4, year: 2025, totalValue: 310000, totalValueUsd: 59847, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 2800, returnPct: 0.91 },
      { month:  5, year: 2025, totalValue: 318500, totalValueUsd: 61017, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 2900, returnPct: 0.94 },
      { month:  6, year: 2025, totalValue: 325200, totalValueUsd: 61242, totalContribution: 3500, totalWithdrawal: 0, totalIncome: 3100, returnPct: 0.96 },
      { month:  7, year: 2025, totalValue: 333800, totalValueUsd: 63257, totalContribution: 4500, totalWithdrawal: 2000, totalIncome: 3200, returnPct: 0.98 },
      { month:  8, year: 2025, totalValue: 342100, totalValueUsd: 63944, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 3400, returnPct: 1.01 },
      { month:  9, year: 2025, totalValue: 352400, totalValueUsd: 65259, totalContribution: 5000, totalWithdrawal: 0, totalIncome: 3550, returnPct: 1.04 },
      { month: 10, year: 2025, totalValue: 361700, totalValueUsd: 65171, totalContribution: 4000, totalWithdrawal: 0, totalIncome: 3620, returnPct: 1.03 },
      { month: 11, year: 2025, totalValue: 371200, totalValueUsd: 66049, totalContribution: 4500, totalWithdrawal: 0, totalIncome: 3720, returnPct: 1.02 },
      { month: 12, year: 2025, totalValue: 381500, totalValueUsd: 66812, totalContribution: 5000, totalWithdrawal: 1000, totalIncome: 3850, returnPct: 1.05 },
    ],
  },
}

// ─────────────────────────────────────────────
// CONSOLIDADO MENSAL — por instituição (12 meses × 4 instituições)
// Meses: Abr/2025 → Mar/2026  |  i1=XP ~46%, i2=Clear ~20%, i4=Avenue ~18%, i5=Itaú ~16%
// ─────────────────────────────────────────────
export const mockMonthlyByInstitution: {
  institutionId: string; month: number; year: number
  contribution: number; withdrawal: number; income: number; returnPct: number; totalValue: number
}[] = [
  // ── Jan/2024 (total 220000) ──────────────────────────────────────
  { institutionId:'i1', month:1, year:2024, contribution:1500, withdrawal:0, income: 900, returnPct:0.80, totalValue:101200 },
  { institutionId:'i2', month:1, year:2024, contribution: 750, withdrawal:0, income: 360, returnPct:0.74, totalValue: 44000 },
  { institutionId:'i4', month:1, year:2024, contribution: 500, withdrawal:0, income: 320, returnPct:0.74, totalValue: 39600 },
  { institutionId:'i5', month:1, year:2024, contribution: 500, withdrawal:0, income: 340, returnPct:0.84, totalValue: 35200 },
  // ── Fev/2024 (total 224500) ──────────────────────────────────────
  { institutionId:'i1', month:2, year:2024, contribution:1500, withdrawal:0, income: 920, returnPct:0.81, totalValue:103270 },
  { institutionId:'i2', month:2, year:2024, contribution: 750, withdrawal:0, income: 370, returnPct:0.76, totalValue: 44900 },
  { institutionId:'i4', month:2, year:2024, contribution: 500, withdrawal:0, income: 330, returnPct:0.76, totalValue: 40410 },
  { institutionId:'i5', month:2, year:2024, contribution: 500, withdrawal:0, income: 350, returnPct:0.86, totalValue: 35920 },
  // ── Mar/2024 (total 229000) ──────────────────────────────────────
  { institutionId:'i1', month:3, year:2024, contribution:1500, withdrawal:0, income: 940, returnPct:0.82, totalValue:105340 },
  { institutionId:'i2', month:3, year:2024, contribution: 750, withdrawal:0, income: 380, returnPct:0.77, totalValue: 45800 },
  { institutionId:'i4', month:3, year:2024, contribution: 500, withdrawal:0, income: 340, returnPct:0.77, totalValue: 41220 },
  { institutionId:'i5', month:3, year:2024, contribution: 500, withdrawal:0, income: 360, returnPct:0.88, totalValue: 36640 },
  // ── Abr/2024 (total 233500) ──────────────────────────────────────
  { institutionId:'i1', month:4, year:2024, contribution:1500, withdrawal:0, income: 960, returnPct:0.82, totalValue:107410 },
  { institutionId:'i2', month:4, year:2024, contribution: 750, withdrawal:0, income: 385, returnPct:0.77, totalValue: 46700 },
  { institutionId:'i4', month:4, year:2024, contribution: 500, withdrawal:0, income: 345, returnPct:0.77, totalValue: 42030 },
  { institutionId:'i5', month:4, year:2024, contribution: 500, withdrawal:0, income: 365, returnPct:0.88, totalValue: 37360 },
  // ── Mai/2024 (total 237500) ──────────────────────────────────────
  { institutionId:'i1', month:5, year:2024, contribution:1250, withdrawal:0, income: 980, returnPct:0.82, totalValue:109250 },
  { institutionId:'i2', month:5, year:2024, contribution: 625, withdrawal:0, income: 390, returnPct:0.78, totalValue: 47500 },
  { institutionId:'i4', month:5, year:2024, contribution: 375, withdrawal:0, income: 350, returnPct:0.78, totalValue: 42750 },
  { institutionId:'i5', month:5, year:2024, contribution: 375, withdrawal:0, income: 370, returnPct:0.89, totalValue: 38000 },
  // ── Jun/2024 (total 241500) ──────────────────────────────────────
  { institutionId:'i1', month:6, year:2024, contribution:1250, withdrawal:0, income: 995, returnPct:0.82, totalValue:111090 },
  { institutionId:'i2', month:6, year:2024, contribution: 625, withdrawal:0, income: 398, returnPct:0.78, totalValue: 48300 },
  { institutionId:'i4', month:6, year:2024, contribution: 375, withdrawal:0, income: 355, returnPct:0.78, totalValue: 43470 },
  { institutionId:'i5', month:6, year:2024, contribution: 375, withdrawal:0, income: 376, returnPct:0.89, totalValue: 38640 },
  // ── Jul/2024 (total 245500) ──────────────────────────────────────
  { institutionId:'i1', month:7, year:2024, contribution:1250, withdrawal:0, income:1010, returnPct:0.83, totalValue:112930 },
  { institutionId:'i2', month:7, year:2024, contribution: 625, withdrawal:0, income: 404, returnPct:0.79, totalValue: 49100 },
  { institutionId:'i4', month:7, year:2024, contribution: 375, withdrawal:0, income: 360, returnPct:0.79, totalValue: 44190 },
  { institutionId:'i5', month:7, year:2024, contribution: 375, withdrawal:0, income: 382, returnPct:0.89, totalValue: 39280 },
  // ── Ago/2024 (total 249500) ──────────────────────────────────────
  { institutionId:'i1', month:8, year:2024, contribution:1250, withdrawal:0, income:1025, returnPct:0.83, totalValue:114770 },
  { institutionId:'i2', month:8, year:2024, contribution: 625, withdrawal:0, income: 410, returnPct:0.79, totalValue: 49900 },
  { institutionId:'i4', month:8, year:2024, contribution: 375, withdrawal:0, income: 366, returnPct:0.79, totalValue: 44910 },
  { institutionId:'i5', month:8, year:2024, contribution: 375, withdrawal:0, income: 388, returnPct:0.90, totalValue: 39920 },
  // ── Set/2024 (total 252500) ──────────────────────────────────────
  { institutionId:'i1', month:9, year:2024, contribution:1000, withdrawal:0, income:1040, returnPct:0.83, totalValue:116150 },
  { institutionId:'i2', month:9, year:2024, contribution: 500, withdrawal:0, income: 416, returnPct:0.80, totalValue: 50500 },
  { institutionId:'i4', month:9, year:2024, contribution: 250, withdrawal:0, income: 371, returnPct:0.80, totalValue: 45450 },
  { institutionId:'i5', month:9, year:2024, contribution: 250, withdrawal:0, income: 393, returnPct:0.90, totalValue: 40400 },
  // ── Out/2024 (total 255000) ──────────────────────────────────────
  { institutionId:'i1', month:10,year:2024, contribution:1000, withdrawal:0, income:1055, returnPct:0.84, totalValue:117300 },
  { institutionId:'i2', month:10,year:2024, contribution: 500, withdrawal:0, income: 422, returnPct:0.80, totalValue: 51000 },
  { institutionId:'i4', month:10,year:2024, contribution: 250, withdrawal:0, income: 376, returnPct:0.80, totalValue: 45900 },
  { institutionId:'i5', month:10,year:2024, contribution: 250, withdrawal:0, income: 398, returnPct:0.90, totalValue: 40800 },
  // ── Nov/2024 (total 257500) ──────────────────────────────────────
  { institutionId:'i1', month:11,year:2024, contribution:1000, withdrawal:0, income:1070, returnPct:0.85, totalValue:118450 },
  { institutionId:'i2', month:11,year:2024, contribution: 500, withdrawal:0, income: 428, returnPct:0.81, totalValue: 51500 },
  { institutionId:'i4', month:11,year:2024, contribution: 250, withdrawal:0, income: 381, returnPct:0.81, totalValue: 46350 },
  { institutionId:'i5', month:11,year:2024, contribution: 250, withdrawal:0, income: 403, returnPct:0.91, totalValue: 41200 },
  // ── Dez/2024 (total 260000) ──────────────────────────────────────
  { institutionId:'i1', month:12,year:2024, contribution:1750, withdrawal:0, income:1090, returnPct:0.86, totalValue:119600 },
  { institutionId:'i2', month:12,year:2024, contribution: 875, withdrawal:0, income: 436, returnPct:0.82, totalValue: 52000 },
  { institutionId:'i4', month:12,year:2024, contribution: 525, withdrawal:0, income: 388, returnPct:0.82, totalValue: 46800 },
  { institutionId:'i5', month:12,year:2024, contribution: 525, withdrawal:0, income: 410, returnPct:0.92, totalValue: 41600 },
  // ── Jan/2025 (total 271000) ──────────────────────────────────────
  { institutionId:'i1', month:1, year:2025, contribution:2500, withdrawal:0, income:1060, returnPct:0.85, totalValue:125000 },
  { institutionId:'i2', month:1, year:2025, contribution:1250, withdrawal:0, income: 426, returnPct:0.80, totalValue: 54200 },
  { institutionId:'i4', month:1, year:2025, contribution: 750, withdrawal:0, income: 380, returnPct:0.80, totalValue: 49000 },
  { institutionId:'i5', month:1, year:2025, contribution: 750, withdrawal:0, income: 402, returnPct:0.90, totalValue: 42800 },
  // ── Fev/2025 (total 282000) ──────────────────────────────────────
  { institutionId:'i1', month:2, year:2025, contribution:2500, withdrawal:0, income:1130, returnPct:0.87, totalValue:130000 },
  { institutionId:'i2', month:2, year:2025, contribution:1250, withdrawal:0, income: 452, returnPct:0.82, totalValue: 56500 },
  { institutionId:'i4', month:2, year:2025, contribution: 750, withdrawal:0, income: 404, returnPct:0.83, totalValue: 51000 },
  { institutionId:'i5', month:2, year:2025, contribution: 750, withdrawal:0, income: 427, returnPct:0.93, totalValue: 44500 },
  // ── Mar/2025 (total 296000) ──────────────────────────────────────
  { institutionId:'i1', month:3, year:2025, contribution:2500, withdrawal:0, income:1185, returnPct:0.88, totalValue:136500 },
  { institutionId:'i2', month:3, year:2025, contribution:1250, withdrawal:0, income: 476, returnPct:0.85, totalValue: 59200 },
  { institutionId:'i4', month:3, year:2025, contribution: 750, withdrawal:0, income: 427, returnPct:0.86, totalValue: 53600 },
  { institutionId:'i5', month:3, year:2025, contribution: 750, withdrawal:0, income: 453, returnPct:0.97, totalValue: 46700 },
  // ── Abr/2025 (total 310000) ──────────────────────────────────────
  { institutionId:'i1', month:4, year:2025, contribution:2000, withdrawal:0, income:1200, returnPct:0.89, totalValue:143000 },
  { institutionId:'i2', month:4, year:2025, contribution:1000, withdrawal:0, income: 560, returnPct:0.82, totalValue: 62000 },
  { institutionId:'i4', month:4, year:2025, contribution: 500, withdrawal:0, income: 510, returnPct:0.90, totalValue: 56000 },
  { institutionId:'i5', month:4, year:2025, contribution: 500, withdrawal:0, income: 530, returnPct:1.10, totalValue: 49000 },
  // ── Mai/2025 (total 318500) ───────────────────────────────────────
  { institutionId:'i1', month:5, year:2025, contribution:2000, withdrawal:0, income:1280, returnPct:0.91, totalValue:147000 },
  { institutionId:'i2', month:5, year:2025, contribution:1000, withdrawal:0, income: 580, returnPct:0.87, totalValue: 63500 },
  { institutionId:'i4', month:5, year:2025, contribution: 500, withdrawal:0, income: 520, returnPct:0.93, totalValue: 57500 },
  { institutionId:'i5', month:5, year:2025, contribution: 500, withdrawal:0, income: 520, returnPct:1.05, totalValue: 50500 },
  // ── Jun/2025 (total 325200) ───────────────────────────────────────
  { institutionId:'i1', month:6, year:2025, contribution:1500, withdrawal:0, income:1350, returnPct:0.93, totalValue:150000 },
  { institutionId:'i2', month:6, year:2025, contribution:1000, withdrawal:0, income: 600, returnPct:0.90, totalValue: 64800 },
  { institutionId:'i4', month:6, year:2025, contribution: 500, withdrawal:0, income: 540, returnPct:0.95, totalValue: 58800 },
  { institutionId:'i5', month:6, year:2025, contribution: 500, withdrawal:0, income: 610, returnPct:1.20, totalValue: 51600 },
  // ── Jul/2025 (total 333800) ───────────────────────────────────────
  { institutionId:'i1', month:7, year:2025, contribution:2000, withdrawal:1000, income:1400, returnPct:0.95, totalValue:154000 },
  { institutionId:'i2', month:7, year:2025, contribution:1500, withdrawal:1000, income: 620, returnPct:0.93, totalValue: 66500 },
  { institutionId:'i4', month:7, year:2025, contribution: 500, withdrawal:  0, income: 560, returnPct:0.97, totalValue: 60300 },
  { institutionId:'i5', month:7, year:2025, contribution: 500, withdrawal:  0, income: 620, returnPct:1.20, totalValue: 53000 },
  // ── Ago/2025 (total 342100) ───────────────────────────────────────
  { institutionId:'i1', month:8, year:2025, contribution:2000, withdrawal:0, income:1480, returnPct:0.97, totalValue:157700 },
  { institutionId:'i2', month:8, year:2025, contribution:1000, withdrawal:0, income: 640, returnPct:0.96, totalValue: 68200 },
  { institutionId:'i4', month:8, year:2025, contribution: 500, withdrawal:0, income: 580, returnPct:0.98, totalValue: 61700 },
  { institutionId:'i5', month:8, year:2025, contribution: 500, withdrawal:0, income: 700, returnPct:1.33, totalValue: 54500 },
  // ── Set/2025 (total 352400) ───────────────────────────────────────
  { institutionId:'i1', month:9, year:2025, contribution:2500, withdrawal:0, income:1550, returnPct:0.99, totalValue:162500 },
  { institutionId:'i2', month:9, year:2025, contribution:1500, withdrawal:0, income: 660, returnPct:0.97, totalValue: 70500 },
  { institutionId:'i4', month:9, year:2025, contribution: 500, withdrawal:0, income: 610, returnPct:1.00, totalValue: 63500 },
  { institutionId:'i5', month:9, year:2025, contribution: 500, withdrawal:0, income: 730, returnPct:1.35, totalValue: 55900 },
  // ── Out/2025 (total 361700) ───────────────────────────────────────
  { institutionId:'i1', month:10,year:2025, contribution:2000, withdrawal:0, income:1620, returnPct:1.00, totalValue:166800 },
  { institutionId:'i2', month:10,year:2025, contribution:1000, withdrawal:0, income: 680, returnPct:0.97, totalValue: 72200 },
  { institutionId:'i4', month:10,year:2025, contribution: 500, withdrawal:0, income: 630, returnPct:1.01, totalValue: 65200 },
  { institutionId:'i5', month:10,year:2025, contribution: 500, withdrawal:0, income: 690, returnPct:1.24, totalValue: 57500 },
  // ── Nov/2025 (total 371200) ───────────────────────────────────────
  { institutionId:'i1', month:11,year:2025, contribution:2500, withdrawal:0, income:1700, returnPct:1.02, totalValue:171200 },
  { institutionId:'i2', month:11,year:2025, contribution:1000, withdrawal:0, income: 710, returnPct:0.99, totalValue: 74000 },
  { institutionId:'i4', month:11,year:2025, contribution: 500, withdrawal:0, income: 660, returnPct:1.03, totalValue: 67000 },
  { institutionId:'i5', month:11,year:2025, contribution: 500, withdrawal:0, income: 650, returnPct:1.14, totalValue: 59000 },
  // ── Dez/2025 (total 381500) ───────────────────────────────────────
  { institutionId:'i1', month:12,year:2025, contribution:2500, withdrawal:1000, income:1760, returnPct:1.03, totalValue:175800 },
  { institutionId:'i2', month:12,year:2025, contribution:1500, withdrawal:  0,  income: 740, returnPct:1.01, totalValue: 76100 },
  { institutionId:'i4', month:12,year:2025, contribution: 500, withdrawal:  0,  income: 690, returnPct:1.05, totalValue: 68900 },
  { institutionId:'i5', month:12,year:2025, contribution: 500, withdrawal:  0,  income: 660, returnPct:1.13, totalValue: 60700 },
  // ── Jan/2026 (total 388200) ───────────────────────────────────────
  { institutionId:'i1', month:1, year:2026, contribution:2000, withdrawal:0, income:1820, returnPct:1.04, totalValue:179000 },
  { institutionId:'i2', month:1, year:2026, contribution: 500, withdrawal:0, income: 760, returnPct:1.01, totalValue: 77400 },
  { institutionId:'i4', month:1, year:2026, contribution: 500, withdrawal:0, income: 720, returnPct:1.06, totalValue: 70600 },
  { institutionId:'i5', month:1, year:2026, contribution: 500, withdrawal:0, income: 600, returnPct:1.00, totalValue: 61200 },
  // ── Fev/2026 (total 393400) ───────────────────────────────────────
  { institutionId:'i1', month:2, year:2026, contribution:1500, withdrawal:0, income:1900, returnPct:1.06, totalValue:181500 },
  { institutionId:'i2', month:2, year:2026, contribution:1000, withdrawal:0, income: 780, returnPct:1.02, totalValue: 79100 },
  { institutionId:'i4', month:2, year:2026, contribution: 500, withdrawal:0, income: 750, returnPct:1.08, totalValue: 70600 },
  { institutionId:'i5', month:2, year:2026, contribution:  0,  withdrawal:0, income: 670, returnPct:1.10, totalValue: 62200 },
  // ── Mar/2026 (total 397575) ───────────────────────────────────────
  { institutionId:'i1', month:3, year:2026, contribution:2000, withdrawal:0, income:1965, returnPct:1.09, totalValue:183600 },
  { institutionId:'i2', month:3, year:2026, contribution:  0,  withdrawal:0, income:1806, returnPct:2.30, totalValue: 78500 },
  { institutionId:'i4', month:3, year:2026, contribution:1000, withdrawal:0, income:1057, returnPct:1.45, totalValue: 72875 },
  { institutionId:'i5', month:3, year:2026, contribution: 500, withdrawal:0, income: 993, returnPct:1.61, totalValue: 62600 },
]

// ─────────────────────────────────────────────
// CONSOLIDADO MENSAL — por classe de ativo (12 meses × 6 classes)
// ac1=Pós-fixado(cat1), ac2=IPCA+(cat1), ac5=Multimercado(cat2),
// ac6=Ações BR(cat3), ac7=FII(cat3), ac9=ETF Int(cat4)
// ─────────────────────────────────────────────
export const mockMonthlyByAssetClass: {
  assetClassId: string; month: number; year: number; totalValue: number
}[] = [
  // Jan/2024
  { assetClassId:'ac1', month:1, year:2024, totalValue: 62000 },
  { assetClassId:'ac2', month:1, year:2024, totalValue: 36800 },
  { assetClassId:'ac5', month:1, year:2024, totalValue: 22000 },
  { assetClassId:'ac6', month:1, year:2024, totalValue: 44000 },
  { assetClassId:'ac7', month:1, year:2024, totalValue: 35600 },
  { assetClassId:'ac9', month:1, year:2024, totalValue: 39600 },
  // Fev/2024
  { assetClassId:'ac1', month:2, year:2024, totalValue: 63200 },
  { assetClassId:'ac2', month:2, year:2024, totalValue: 37600 },
  { assetClassId:'ac5', month:2, year:2024, totalValue: 22600 },
  { assetClassId:'ac6', month:2, year:2024, totalValue: 45000 },
  { assetClassId:'ac7', month:2, year:2024, totalValue: 36200 },
  { assetClassId:'ac9', month:2, year:2024, totalValue: 39900 },
  // Mar/2024
  { assetClassId:'ac1', month:3, year:2024, totalValue: 64500 },
  { assetClassId:'ac2', month:3, year:2024, totalValue: 38400 },
  { assetClassId:'ac5', month:3, year:2024, totalValue: 23200 },
  { assetClassId:'ac6', month:3, year:2024, totalValue: 46000 },
  { assetClassId:'ac7', month:3, year:2024, totalValue: 36900 },
  { assetClassId:'ac9', month:3, year:2024, totalValue: 40000 },
  // Abr/2024
  { assetClassId:'ac1', month:4, year:2024, totalValue: 65800 },
  { assetClassId:'ac2', month:4, year:2024, totalValue: 39200 },
  { assetClassId:'ac5', month:4, year:2024, totalValue: 23800 },
  { assetClassId:'ac6', month:4, year:2024, totalValue: 47000 },
  { assetClassId:'ac7', month:4, year:2024, totalValue: 37600 },
  { assetClassId:'ac9', month:4, year:2024, totalValue: 40100 },
  // Mai/2024
  { assetClassId:'ac1', month:5, year:2024, totalValue: 67000 },
  { assetClassId:'ac2', month:5, year:2024, totalValue: 39900 },
  { assetClassId:'ac5', month:5, year:2024, totalValue: 24300 },
  { assetClassId:'ac6', month:5, year:2024, totalValue: 47900 },
  { assetClassId:'ac7', month:5, year:2024, totalValue: 38300 },
  { assetClassId:'ac9', month:5, year:2024, totalValue: 40100 },
  // Jun/2024
  { assetClassId:'ac1', month:6, year:2024, totalValue: 68200 },
  { assetClassId:'ac2', month:6, year:2024, totalValue: 40600 },
  { assetClassId:'ac5', month:6, year:2024, totalValue: 24800 },
  { assetClassId:'ac6', month:6, year:2024, totalValue: 48800 },
  { assetClassId:'ac7', month:6, year:2024, totalValue: 39000 },
  { assetClassId:'ac9', month:6, year:2024, totalValue: 40100 },
  // Jul/2024
  { assetClassId:'ac1', month:7, year:2024, totalValue: 69400 },
  { assetClassId:'ac2', month:7, year:2024, totalValue: 41300 },
  { assetClassId:'ac5', month:7, year:2024, totalValue: 25400 },
  { assetClassId:'ac6', month:7, year:2024, totalValue: 49700 },
  { assetClassId:'ac7', month:7, year:2024, totalValue: 39700 },
  { assetClassId:'ac9', month:7, year:2024, totalValue: 40000 },
  // Ago/2024
  { assetClassId:'ac1', month:8, year:2024, totalValue: 70600 },
  { assetClassId:'ac2', month:8, year:2024, totalValue: 42000 },
  { assetClassId:'ac5', month:8, year:2024, totalValue: 25900 },
  { assetClassId:'ac6', month:8, year:2024, totalValue: 50600 },
  { assetClassId:'ac7', month:8, year:2024, totalValue: 40400 },
  { assetClassId:'ac9', month:8, year:2024, totalValue: 39990 },
  // Set/2024
  { assetClassId:'ac1', month:9, year:2024, totalValue: 71500 },
  { assetClassId:'ac2', month:9, year:2024, totalValue: 42500 },
  { assetClassId:'ac5', month:9, year:2024, totalValue: 26300 },
  { assetClassId:'ac6', month:9, year:2024, totalValue: 51200 },
  { assetClassId:'ac7', month:9, year:2024, totalValue: 40900 },
  { assetClassId:'ac9', month:9, year:2024, totalValue: 40100 },
  // Out/2024
  { assetClassId:'ac1', month:10,year:2024, totalValue: 72500 },
  { assetClassId:'ac2', month:10,year:2024, totalValue: 43000 },
  { assetClassId:'ac5', month:10,year:2024, totalValue: 26600 },
  { assetClassId:'ac6', month:10,year:2024, totalValue: 51900 },
  { assetClassId:'ac7', month:10,year:2024, totalValue: 41400 },
  { assetClassId:'ac9', month:10,year:2024, totalValue: 39600 },
  // Nov/2024
  { assetClassId:'ac1', month:11,year:2024, totalValue: 73500 },
  { assetClassId:'ac2', month:11,year:2024, totalValue: 43500 },
  { assetClassId:'ac5', month:11,year:2024, totalValue: 27000 },
  { assetClassId:'ac6', month:11,year:2024, totalValue: 52500 },
  { assetClassId:'ac7', month:11,year:2024, totalValue: 41900 },
  { assetClassId:'ac9', month:11,year:2024, totalValue: 39100 },
  // Dez/2024
  { assetClassId:'ac1', month:12,year:2024, totalValue: 74700 },
  { assetClassId:'ac2', month:12,year:2024, totalValue: 44100 },
  { assetClassId:'ac5', month:12,year:2024, totalValue: 27500 },
  { assetClassId:'ac6', month:12,year:2024, totalValue: 53400 },
  { assetClassId:'ac7', month:12,year:2024, totalValue: 42500 },
  { assetClassId:'ac9', month:12,year:2024, totalValue: 37800 },
  // Jan/2025
  { assetClassId:'ac1', month:1, year:2025, totalValue: 76500 },
  { assetClassId:'ac2', month:1, year:2025, totalValue: 45200 },
  { assetClassId:'ac5', month:1, year:2025, totalValue: 28500 },
  { assetClassId:'ac6', month:1, year:2025, totalValue: 55000 },
  { assetClassId:'ac7', month:1, year:2025, totalValue: 43200 },
  { assetClassId:'ac9', month:1, year:2025, totalValue: 42600 },
  // Fev/2025
  { assetClassId:'ac1', month:2, year:2025, totalValue: 78000 },
  { assetClassId:'ac2', month:2, year:2025, totalValue: 46400 },
  { assetClassId:'ac5', month:2, year:2025, totalValue: 29500 },
  { assetClassId:'ac6', month:2, year:2025, totalValue: 56800 },
  { assetClassId:'ac7', month:2, year:2025, totalValue: 44500 },
  { assetClassId:'ac9', month:2, year:2025, totalValue: 46800 },
  // Mar/2025
  { assetClassId:'ac1', month:3, year:2025, totalValue: 80000 },
  { assetClassId:'ac2', month:3, year:2025, totalValue: 47500 },
  { assetClassId:'ac5', month:3, year:2025, totalValue: 30900 },
  { assetClassId:'ac6', month:3, year:2025, totalValue: 58700 },
  { assetClassId:'ac7', month:3, year:2025, totalValue: 45900 },
  { assetClassId:'ac9', month:3, year:2025, totalValue: 53000 },
  // Abr/2025
  { assetClassId:'ac1', month:4, year:2025, totalValue: 82000 },
  { assetClassId:'ac2', month:4, year:2025, totalValue: 48000 },
  { assetClassId:'ac5', month:4, year:2025, totalValue: 33000 },
  { assetClassId:'ac6', month:4, year:2025, totalValue: 60000 },
  { assetClassId:'ac7', month:4, year:2025, totalValue: 44000 },
  { assetClassId:'ac9', month:4, year:2025, totalValue: 43000 },
  // Mai/2025
  { assetClassId:'ac1', month:5, year:2025, totalValue: 84200 },
  { assetClassId:'ac2', month:5, year:2025, totalValue: 49200 },
  { assetClassId:'ac5', month:5, year:2025, totalValue: 33900 },
  { assetClassId:'ac6', month:5, year:2025, totalValue: 61500 },
  { assetClassId:'ac7', month:5, year:2025, totalValue: 45100 },
  { assetClassId:'ac9', month:5, year:2025, totalValue: 44600 },
  // Jun/2025
  { assetClassId:'ac1', month:6, year:2025, totalValue: 86100 },
  { assetClassId:'ac2', month:6, year:2025, totalValue: 50300 },
  { assetClassId:'ac5', month:6, year:2025, totalValue: 34700 },
  { assetClassId:'ac6', month:6, year:2025, totalValue: 62800 },
  { assetClassId:'ac7', month:6, year:2025, totalValue: 46000 },
  { assetClassId:'ac9', month:6, year:2025, totalValue: 45300 },
  // Jul/2025
  { assetClassId:'ac1', month:7, year:2025, totalValue: 88200 },
  { assetClassId:'ac2', month:7, year:2025, totalValue: 51400 },
  { assetClassId:'ac5', month:7, year:2025, totalValue: 35800 },
  { assetClassId:'ac6', month:7, year:2025, totalValue: 64700 },
  { assetClassId:'ac7', month:7, year:2025, totalValue: 47200 },
  { assetClassId:'ac9', month:7, year:2025, totalValue: 46500 },
  // Ago/2025
  { assetClassId:'ac1', month:8, year:2025, totalValue: 90400 },
  { assetClassId:'ac2', month:8, year:2025, totalValue: 52700 },
  { assetClassId:'ac5', month:8, year:2025, totalValue: 36800 },
  { assetClassId:'ac6', month:8, year:2025, totalValue: 66200 },
  { assetClassId:'ac7', month:8, year:2025, totalValue: 48400 },
  { assetClassId:'ac9', month:8, year:2025, totalValue: 47600 },
  // Set/2025
  { assetClassId:'ac1', month:9, year:2025, totalValue: 92900 },
  { assetClassId:'ac2', month:9, year:2025, totalValue: 54100 },
  { assetClassId:'ac5', month:9, year:2025, totalValue: 37900 },
  { assetClassId:'ac6', month:9, year:2025, totalValue: 68200 },
  { assetClassId:'ac7', month:9, year:2025, totalValue: 49800 },
  { assetClassId:'ac9', month:9, year:2025, totalValue: 49500 },
  // Out/2025
  { assetClassId:'ac1', month:10,year:2025, totalValue: 95300 },
  { assetClassId:'ac2', month:10,year:2025, totalValue: 55500 },
  { assetClassId:'ac5', month:10,year:2025, totalValue: 38900 },
  { assetClassId:'ac6', month:10,year:2025, totalValue: 69900 },
  { assetClassId:'ac7', month:10,year:2025, totalValue: 51100 },
  { assetClassId:'ac9', month:10,year:2025, totalValue: 51000 },
  // Nov/2025
  { assetClassId:'ac1', month:11,year:2025, totalValue: 97900 },
  { assetClassId:'ac2', month:11,year:2025, totalValue: 56900 },
  { assetClassId:'ac5', month:11,year:2025, totalValue: 40100 },
  { assetClassId:'ac6', month:11,year:2025, totalValue: 71700 },
  { assetClassId:'ac7', month:11,year:2025, totalValue: 52400 },
  { assetClassId:'ac9', month:11,year:2025, totalValue: 52200 },
  // Dez/2025
  { assetClassId:'ac1', month:12,year:2025, totalValue:100700 },
  { assetClassId:'ac2', month:12,year:2025, totalValue: 58400 },
  { assetClassId:'ac5', month:12,year:2025, totalValue: 41400 },
  { assetClassId:'ac6', month:12,year:2025, totalValue: 73600 },
  { assetClassId:'ac7', month:12,year:2025, totalValue: 53800 },
  { assetClassId:'ac9', month:12,year:2025, totalValue: 53600 },
  // Jan/2026
  { assetClassId:'ac1', month:1, year:2026, totalValue:102800 },
  { assetClassId:'ac2', month:1, year:2026, totalValue: 59500 },
  { assetClassId:'ac5', month:1, year:2026, totalValue: 42100 },
  { assetClassId:'ac6', month:1, year:2026, totalValue: 75000 },
  { assetClassId:'ac7', month:1, year:2026, totalValue: 54800 },
  { assetClassId:'ac9', month:1, year:2026, totalValue: 54000 },
  // Fev/2026
  { assetClassId:'ac1', month:2, year:2026, totalValue:104200 },
  { assetClassId:'ac2', month:2, year:2026, totalValue: 60400 },
  { assetClassId:'ac5', month:2, year:2026, totalValue: 42700 },
  { assetClassId:'ac6', month:2, year:2026, totalValue: 76400 },
  { assetClassId:'ac7', month:2, year:2026, totalValue: 55600 },
  { assetClassId:'ac9', month:2, year:2026, totalValue: 54100 },
  // Mar/2026
  { assetClassId:'ac1', month:3, year:2026, totalValue:105700 },
  { assetClassId:'ac2', month:3, year:2026, totalValue: 62300 },
  { assetClassId:'ac5', month:3, year:2026, totalValue: 43200 },
  { assetClassId:'ac6', month:3, year:2026, totalValue: 78500 },
  { assetClassId:'ac7', month:3, year:2026, totalValue: 55200 },
  { assetClassId:'ac9', month:3, year:2026, totalValue: 52675 },
]

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
