import type {
  User, Category, AssetClass, Institution, Region, LiquidityOption,
  ExchangeRate, Product, ProductEntry, Dividend, BenchmarkEntry,
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
  { id: 'ac6',  name: 'Ações',             categoryId: 'cat3', isAcao: true },
  { id: 'ac7',  name: 'FIIs',             categoryId: 'cat3', isAcao: true },
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
// LIQUIDITY OPTIONS
// ─────────────────────────────────────────────
export const mockLiquidityOptions: LiquidityOption[] = [
  { id: 'liq1',  name: 'D+0'            },
  { id: 'liq2',  name: 'D+1'            },
  { id: 'liq3',  name: 'D+2'            },
  { id: 'liq4',  name: 'D+3'            },
  { id: 'liq5',  name: '30 dias'        },
  { id: 'liq6',  name: '60 dias'        },
  { id: 'liq7',  name: '90 dias'        },
  { id: 'liq8',  name: '180 dias'       },
  { id: 'liq9',  name: '1 ano'          },
  { id: 'liq10', name: '2 anos'         },
  { id: 'liq11', name: 'No vencimento'  },
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
// ENTRY GENERATOR (internal — Apr/2024 → Mar/2026)
// ─────────────────────────────────────────────
// CDI monthly rates index 0=Apr2024 … 23=Mar2026
const _CDI=[0.89,0.83,0.81,0.90,0.90,0.88,0.96,0.94,0.97,1.07,1.06,1.12,1.09,1.10,1.07,1.08,1.07,1.05,1.07,1.06,1.07,1.09,1.05,1.03]
const _IBOV=[1.55,-3.01,-1.71,4.69,-2.75,-3.08,-1.59,-3.12,-4.79,4.98,-1.48,-0.34,-1.01,4.22,1.13,2.89,-1.65,3.41,1.78,2.15,-0.88,3.12,-0.97,1.84]
const _FX=[5.05,5.10,5.32,5.40,5.45,5.44,5.65,5.83,6.18,5.95,5.86,5.87,5.79,5.71,5.70,5.68,5.73,5.68,5.72,5.69,5.71,5.80,5.76,5.83]
const _M:[number,number][]=[];(()=>{for(let y=2024;y<=2026;y++){const s=y===2024?4:1,e=y===2026?3:12;for(let m=s;m<=e;m++)_M.push([m,y])}})()
function _idx(m:number,y:number){return y===2024?m-4:y===2025?9+m-1:21+m-1}
type _S=[number,number,number][]
function _gen(pid:string,sm:number,sy:number,sched:_S,cur:'BRL'|'USD'='BRL'):ProductEntry[]{
  const r:ProductEntry[]=[];let prev=0,si=0
  for(const[m,y]of _M){
    if(y<sy||(y===sy&&m<sm))continue
    if(si>=sched.length)break
    const[c,w,ret]=sched[si++]
    const income=Math.round(prev*ret/100)
    const vo=prev+c-w+income
    const fx=_FX[_idx(m,y)]
    const vb=cur==='USD'?Math.round(vo*fx):vo
    const vu=cur==='USD'?vo:Math.round(vo/fx)
    r.push({id:`e_${pid}_${y}${String(m).padStart(2,'0')}`,productId:pid,month:m,year:y,contribution:c,withdrawal:w,returnPct:ret,income,valueOriginal:vo,valueBrl:vb,valueUsd:vu,valueFinal:vb,exchangeRate:cur==='USD'?fx:undefined,createdAt:`${y}-${String(m).padStart(2,'0')}-28`})
    prev=vo
  }
  return r
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
export const mockProducts: Product[] = [
  // ── RENDA FIXA ─────────────────────────────
  { id:'p1',  name:'CDB XP 110% CDI',           categoryId:'cat1', assetClassId:'ac1', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq2',  status:'active', createdAt:'2024-04-01', details:'110% CDI · D+1' },
  { id:'p2',  name:'Tesouro IPCA+ 2029',         categoryId:'cat1', assetClassId:'ac2', institutionId:'i5', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2024-04-01', details:'IPCA + 5,6% · 05/2029' },
  { id:'p3',  name:'CDB Nubank 115% CDI',        categoryId:'cat1', assetClassId:'ac1', institutionId:'i3', regionId:'r1', currency:'BRL', liquidityId:'liq2',  status:'active', createdAt:'2024-05-01', details:'115% CDI · D+1' },
  { id:'p4',  name:'LCI Clear 98% CDI',          categoryId:'cat1', assetClassId:'ac1', institutionId:'i2', regionId:'r1', currency:'BRL', liquidityId:'liq7',  status:'active', createdAt:'2024-06-01', details:'98% CDI · isento IR · 90 dias' },
  { id:'p5',  name:'Tesouro Prefixado 2027',     categoryId:'cat1', assetClassId:'ac3', institutionId:'i5', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2024-08-01', details:'12,95% a.a. · 01/2027' },
  { id:'p6',  name:'LCA Itaú 95% CDI',           categoryId:'cat1', assetClassId:'ac1', institutionId:'i5', regionId:'r1', currency:'BRL', liquidityId:'liq7',  status:'active', createdAt:'2024-09-01', details:'95% CDI · isento IR · 90 dias' },
  { id:'p7',  name:'CRI Agro FIDC',              categoryId:'cat1', assetClassId:'ac4', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2024-11-01', details:'CDI + 1,5% · 11/2027' },
  { id:'p8',  name:'COE Dólar+ XP',              categoryId:'cat1', assetClassId:'ac3', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2025-01-01', details:'100% CDI + exposição cambial' },
  { id:'p9',  name:'CDB Itaú 108% CDI',          categoryId:'cat1', assetClassId:'ac1', institutionId:'i5', regionId:'r1', currency:'BRL', liquidityId:'liq2',  status:'active', createdAt:'2025-03-01', details:'108% CDI · D+1' },
  { id:'p10', name:'CRA Fiagro',                 categoryId:'cat1', assetClassId:'ac4', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2025-10-01', details:'CDI + 1,2% · isenção IR' },
  { id:'p11', name:'Debenture Infraestrutura',   categoryId:'cat1', assetClassId:'ac3', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq11', status:'active', createdAt:'2026-01-01', details:'IPCA + 6,2% · isenção IR · 2031' },
  // ── MULTIMERCADO ───────────────────────────
  { id:'p12', name:'Fundo Multimercado XP',      categoryId:'cat2', assetClassId:'ac5', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq5',  status:'active', createdAt:'2024-04-01', details:'Resgate em 30 dias corridos' },
  { id:'p13', name:'Fundo Macro Verde',          categoryId:'cat2', assetClassId:'ac5', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq5',  status:'active', createdAt:'2024-10-01', details:'Resgate em 30 dias corridos' },
  // ── RENDA VARIÁVEL ─────────────────────────
  { id:'p14', name:'Ações Clear',                categoryId:'cat3', assetClassId:'ac6', institutionId:'i2', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-04-01', details:'Carteira diversificada BR · D+2' },
  { id:'p15', name:'HGLG11 — FII Logística',    categoryId:'cat3', assetClassId:'ac7', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-04-01', details:'FII Logística · D+2' },
  { id:'p16', name:'BOVA11 ETF Ibovespa',        categoryId:'cat3', assetClassId:'ac8', institutionId:'i2', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-06-01', details:'iShares BOVA11 · D+2' },
  { id:'p17', name:'XPML11 FII Shoppings',       categoryId:'cat3', assetClassId:'ac7', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-08-01', details:'XP Malls FII · D+2' },
  { id:'p18', name:'KNRI11 FII Corporativo',     categoryId:'cat3', assetClassId:'ac7', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-12-01', details:'Kinea Renda Imobiliária · D+2' },
  { id:'p19', name:'VISC11 FII Varejo',          categoryId:'cat3', assetClassId:'ac7', institutionId:'i1', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2025-08-01', details:'Vinci Shopping Centers · D+2' },
  // ── INTERNACIONAL ──────────────────────────
  { id:'p20', name:'VNQ — Vanguard Real Estate', categoryId:'cat4', assetClassId:'ac9', institutionId:'i4', regionId:'r2', currency:'USD', liquidityId:'liq3',  status:'active', createdAt:'2024-05-01', details:'Vanguard Real Estate ETF · EUA', country:'EUA' },
  { id:'p21', name:'IVVB11 ETF S&P 500',         categoryId:'cat4', assetClassId:'ac9', institutionId:'i2', regionId:'r2', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2024-10-01', details:'iShares S&P 500 · D+2 · EUA', country:'EUA' },
  { id:'p22', name:'QQQ — Nasdaq ETF',           categoryId:'cat4', assetClassId:'ac9', institutionId:'i4', regionId:'r2', currency:'USD', liquidityId:'liq3',  status:'active', createdAt:'2024-12-01', details:'Invesco QQQ · Nasdaq 100 · EUA', country:'EUA' },
  { id:'p23', name:'BDR Apple (AAPL34)',         categoryId:'cat4', assetClassId:'ac10',institutionId:'i2', regionId:'r2', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2025-04-01', details:'BDR Apple · D+2 · EUA', country:'EUA' },
  { id:'p24', name:'Fundo Global Tech XP',       categoryId:'cat4', assetClassId:'ac9', institutionId:'i1', regionId:'r2', currency:'BRL', liquidityId:'liq5',  status:'active', createdAt:'2025-06-01', details:'Fundo Global Tecnologia · 30 dias', country:'Diversificado' },
  // ── COMMODITIES ────────────────────────────
  { id:'p25', name:'GOLD11 ETF Ouro',            categoryId:'cat5', assetClassId:'ac11',institutionId:'i2', regionId:'r1', currency:'BRL', liquidityId:'liq3',  status:'active', createdAt:'2025-02-01', details:'Ouro via ETF B3 · D+2' },
]

// ─────────────────────────────────────────────
// PRODUCT ENTRIES — Apr/2024 → Mar/2026 (generated)
// ─────────────────────────────────────────────
// CDI×1.10 for 24 months (Apr2024-Mar2026)
const _c110=(i:number)=>parseFloat((_CDI[i]*1.10).toFixed(2))
// CDI×1.15
const _c115=(i:number)=>parseFloat((_CDI[i]*1.15).toFixed(2))
// CDI×0.98
const _c098=(i:number)=>parseFloat((_CDI[i]*0.98).toFixed(2))
// CDI×0.95
const _c095=(i:number)=>parseFloat((_CDI[i]*0.95).toFixed(2))
// CDI×1.08
const _c108=(i:number)=>parseFloat((_CDI[i]*1.08).toFixed(2))

export const mockEntries: ProductEntry[] = [
  // p1 — CDB XP 110% CDI (Apr2024, 24mo) target ~R$123k
  ..._gen('p1',4,2024,_M.filter(([,y])=>y<=2026).slice(0,24).map(([m,y],i)=>[i===0?50000:i<12?2500:2000,0,_c110(i)] as [number,number,number])),
  // p2 — Tesouro IPCA+ 2029 (Apr2024, 24mo) target ~R$76k
  ..._gen('p2',4,2024,Array.from({length:24},(_,i)=>[i===0?30000:1500,0,parseFloat((_CDI[i]*0.92+0.10).toFixed(2))] as [number,number,number])),
  // p3 — CDB Nubank 115% CDI (May2024, 23mo) target ~R$70k
  ..._gen('p3',5,2024,Array.from({length:23},(_,i)=>[i===0?32000:1500,0,_c115(i+1)] as [number,number,number])),
  // p4 — LCI Clear 98% CDI (Jun2024, 22mo) target ~R$52k
  ..._gen('p4',6,2024,Array.from({length:22},(_,i)=>[i===0?28000:1000,0,_c098(i+2)] as [number,number,number])),
  // p5 — Tesouro Prefixado 2027 (Aug2024, 20mo) target ~R$56k
  ..._gen('p5',8,2024,Array.from({length:20},(_,i)=>[i===0?24000:1500,0,1.02] as [number,number,number])),
  // p6 — LCA Itaú 95% CDI (Sep2024, 19mo) target ~R$46k
  ..._gen('p6',9,2024,Array.from({length:19},(_,i)=>[i===0?23000:1200,0,_c095(i+5)] as [number,number,number])),
  // p7 — CRI Agro FIDC (Nov2024, 17mo) target ~R$22k
  ..._gen('p7',11,2024,Array.from({length:17},(_,i)=>[i===0?14000:500,0,parseFloat((_CDI[i+7]+0.125).toFixed(2))] as [number,number,number])),
  // p8 — COE Dólar+ (Jan2025, 15mo) target ~R$32k
  ..._gen('p8',1,2025,Array.from({length:15},(_,i)=>[i===0?20000:800,0,_c095(i+9)] as [number,number,number])),
  // p9 — CDB Itaú 108% CDI (Mar2025, 13mo) target ~R$27k
  ..._gen('p9',3,2025,Array.from({length:13},(_,i)=>[i===0?20000:500,0,_c108(i+11)] as [number,number,number])),
  // p10 — CRA Fiagro (Oct2025, 6mo) target ~R$12k
  ..._gen('p10',10,2025,Array.from({length:6},(_,i)=>[i===0?8000:500,0,parseFloat((_CDI[i+18]+0.10).toFixed(2))] as [number,number,number])),
  // p11 — Debenture Infra (Jan2026, 3mo) target ~R$15k
  ..._gen('p11',1,2026,[[15000,0,0.97],[0,0,0.95],[0,0,0.97]]),
  // p12 — Fundo Multimercado XP (Apr2024, 24mo) target ~R$48k
  ..._gen('p12',4,2024,[[20000,0,0.78],[1000,0,0.65],[1000,0,0.72],[1000,0,0.95],[1000,0,0.82],[1000,0,0.70],[1000,0,0.88],[1000,0,0.76],[1000,0,0.91],[1000,0,1.05],[1000,0,0.98],[1000,0,1.10],[1000,0,1.02],[1000,0,1.08],[1000,0,0.95],[1000,0,1.12],[1000,0,1.05],[1000,0,0.88],[1000,0,1.10],[1000,0,1.08],[1000,0,1.03],[1000,0,1.15],[1000,0,1.09],[1000,0,1.01]]),
  // p13 — Fundo Macro Verde (Oct2024, 18mo) target ~R$30k
  ..._gen('p13',10,2024,Array.from({length:18},(_,i)=>[i===0?14000:800,0,_CDI[i+6]] as [number,number,number])),
  // p14 — Ações Clear (Apr2024, 24mo) target ~R$76k
  ..._gen('p14',4,2024,Array.from({length:24},(_,i)=>[i===0?30000:2000,0,_IBOV[i]] as [number,number,number])),
  // p15 — HGLG11 FII Logística (Apr2024, 24mo) target ~R$57k
  ..._gen('p15',4,2024,Array.from({length:24},(_,i)=>[i===0?25000:1200,0,0.72] as [number,number,number])),
  // p16 — BOVA11 ETF Ibovespa (Jun2024, 22mo) target ~R$42k
  ..._gen('p16',6,2024,Array.from({length:22},(_,i)=>[i===0?20000:1000,0,_IBOV[i+2]] as [number,number,number])),
  // p17 — XPML11 FII Shoppings (Aug2024, 20mo) target ~R$37k
  ..._gen('p17',8,2024,Array.from({length:20},(_,i)=>[i===0?19000:1000,0,0.70] as [number,number,number])),
  // p18 — KNRI11 FII Corporativo (Dec2024, 16mo) target ~R$32k
  ..._gen('p18',12,2024,Array.from({length:16},(_,i)=>[i===0?19000:800,0,0.72] as [number,number,number])),
  // p19 — VISC11 FII Varejo (Aug2025, 8mo) target ~R$18k
  ..._gen('p19',8,2025,Array.from({length:8},(_,i)=>[i===0?14000:500,0,0.72] as [number,number,number])),
  // p20 — VNQ USD (May2024, 23mo) target ~R$64k (USD)
  ..._gen('p20',5,2024,Array.from({length:23},(_,i)=>[i===0?6500:200,0,0.80] as [number,number,number]),'USD'),
  // p21 — IVVB11 ETF S&P500 (Oct2024, 18mo) target ~R$56k
  ..._gen('p21',10,2024,[[24000,0,1.20],[1500,0,1.15],[1500,0,0.80],[1500,0,2.50],[1500,0,-0.50],[1500,0,0.80],[1500,0,1.30],[1500,0,1.15],[1500,0,0.90],[1500,0,1.80],[1500,0,0.70],[1500,0,1.10],[1500,0,1.35],[1500,0,1.00],[1500,0,0.85],[1500,0,2.20],[1500,0,0.90],[1500,0,1.50]]),
  // p22 — QQQ USD (Dec2024, 16mo) target ~R$48k (USD)
  ..._gen('p22',12,2024,Array.from({length:16},(_,i)=>[i===0?4800:200,0,1.30] as [number,number,number]),'USD'),
  // p23 — BDR Apple (Apr2025, 12mo) target ~R$18k
  ..._gen('p23',4,2025,Array.from({length:12},(_,i)=>[i===0?10000:500,0,1.20] as [number,number,number])),
  // p24 — Fundo Global Tech (Jun2025, 10mo) target ~R$18k
  ..._gen('p24',6,2025,Array.from({length:10},(_,i)=>[i===0?12000:500,0,1.10] as [number,number,number])),
  // p25 — GOLD11 ETF Ouro (Feb2025, 14mo) target ~R$42k
  ..._gen('p25',2,2025,[[22000,0,1.80],[1000,0,2.20],[1000,0,1.50],[1000,0,2.80],[1000,0,1.20],[1000,0,2.50],[1000,0,0.80],[1000,0,2.10],[1000,0,1.40],[1000,0,2.20],[1000,0,-0.50],[1000,0,1.80],[1000,0,0.90],[1000,0,1.60]]),
]

// ─────────────────────────────────────────────
// BENCHMARKS (abr/2024 → mar/2026)
// Valores aproximados baseados em dados históricos reais do mercado brasileiro
// ─────────────────────────────────────────────
export const mockBenchmarks: BenchmarkEntry[] = [
  { id: 'bm1',  month: 4,  year: 2024, cdi: 0.89, ipca: 0.38, poupanca: 0.62, ibovespa:  1.55 },
  { id: 'bm2',  month: 5,  year: 2024, cdi: 0.83, ipca: 0.46, poupanca: 0.62, ibovespa: -3.01 },
  { id: 'bm3',  month: 6,  year: 2024, cdi: 0.81, ipca: 0.20, poupanca: 0.62, ibovespa: -1.71 },
  { id: 'bm4',  month: 7,  year: 2024, cdi: 0.90, ipca: 0.38, poupanca: 0.62, ibovespa:  4.69 },
  { id: 'bm5',  month: 8,  year: 2024, cdi: 0.90, ipca: 0.44, poupanca: 0.62, ibovespa: -2.75 },
  { id: 'bm6',  month: 9,  year: 2024, cdi: 0.88, ipca: 0.44, poupanca: 0.62, ibovespa: -3.08 },
  { id: 'bm7',  month: 10, year: 2024, cdi: 0.96, ipca: 0.56, poupanca: 0.62, ibovespa: -1.59 },
  { id: 'bm8',  month: 11, year: 2024, cdi: 0.94, ipca: 0.39, poupanca: 0.62, ibovespa: -3.12 },
  { id: 'bm9',  month: 12, year: 2024, cdi: 0.97, ipca: 0.52, poupanca: 0.62, ibovespa: -4.79 },
  { id: 'bm10', month: 1,  year: 2025, cdi: 1.07, ipca: 0.16, poupanca: 0.74, ibovespa:  4.98 },
  { id: 'bm11', month: 2,  year: 2025, cdi: 1.06, ipca: 1.31, poupanca: 0.74, ibovespa: -1.48 },
  { id: 'bm12', month: 3,  year: 2025, cdi: 1.12, ipca: 0.56, poupanca: 0.74, ibovespa: -0.34 },
  { id: 'bm13', month: 4,  year: 2025, cdi: 1.09, ipca: 0.43, poupanca: 0.74, ibovespa: -1.01 },
  { id: 'bm14', month: 5,  year: 2025, cdi: 1.10, ipca: 0.51, poupanca: 0.74, ibovespa:  4.22 },
  { id: 'bm15', month: 6,  year: 2025, cdi: 1.07, ipca: 0.40, poupanca: 0.74, ibovespa:  1.13 },
  { id: 'bm16', month: 7,  year: 2025, cdi: 1.08, ipca: 0.36, poupanca: 0.74, ibovespa:  2.89 },
  { id: 'bm17', month: 8,  year: 2025, cdi: 1.07, ipca: 0.44, poupanca: 0.74, ibovespa: -1.65 },
  { id: 'bm18', month: 9,  year: 2025, cdi: 1.05, ipca: 0.38, poupanca: 0.74, ibovespa:  3.41 },
  { id: 'bm19', month: 10, year: 2025, cdi: 1.07, ipca: 0.45, poupanca: 0.74, ibovespa:  1.78 },
  { id: 'bm20', month: 11, year: 2025, cdi: 1.06, ipca: 0.39, poupanca: 0.74, ibovespa:  2.15 },
  { id: 'bm21', month: 12, year: 2025, cdi: 1.07, ipca: 0.52, poupanca: 0.74, ibovespa: -0.88 },
  { id: 'bm22', month: 1,  year: 2026, cdi: 1.09, ipca: 0.48, poupanca: 0.74, ibovespa:  3.12 },
  { id: 'bm23', month: 2,  year: 2026, cdi: 1.05, ipca: 0.42, poupanca: 0.74, ibovespa: -0.97 },
  { id: 'bm24', month: 3,  year: 2026, cdi: 1.03, ipca: 0.37, poupanca: 0.74, ibovespa:  1.84 },
]

// ─────────────────────────────────────────────
// DIVIDENDS
// ─────────────────────────────────────────────
export const mockDividends: Dividend[] = [
  // HGLG11 — FII Logística (p15)
  { id: 'd1',  productId: 'p15', date: '2026-03-14', dividendo: 385.00, jcp: 0, outros: 0 },
  { id: 'd2',  productId: 'p15', date: '2026-02-14', dividendo: 378.00, jcp: 0, outros: 0 },
  { id: 'd3',  productId: 'p15', date: '2026-01-14', dividendo: 371.00, jcp: 0, outros: 0 },
  // XPML11 — FII Shoppings (p17)
  { id: 'd4',  productId: 'p17', date: '2026-03-12', dividendo: 248.00, jcp: 0, outros: 0 },
  { id: 'd5',  productId: 'p17', date: '2026-02-12', dividendo: 242.00, jcp: 0, outros: 0 },
  { id: 'd6',  productId: 'p17', date: '2026-01-12', dividendo: 238.00, jcp: 0, outros: 0 },
  // KNRI11 — FII Corporativo (p18)
  { id: 'd7',  productId: 'p18', date: '2026-03-15', dividendo: 216.00, jcp: 0, outros: 0 },
  { id: 'd8',  productId: 'p18', date: '2026-02-15', dividendo: 210.00, jcp: 0, outros: 0 },
  { id: 'd9',  productId: 'p18', date: '2026-01-15', dividendo: 205.00, jcp: 0, outros: 0 },
  // VISC11 — FII Varejo (p19)
  { id: 'd10', productId: 'p19', date: '2026-03-13', dividendo: 118.00, jcp: 0, outros: 0 },
  { id: 'd11', productId: 'p19', date: '2026-02-13', dividendo: 115.00, jcp: 0, outros: 0 },
  // Ações Clear — JCP (p14)
  { id: 'd12', productId: 'p14', date: '2026-03-10', dividendo: 0, jcp: 420.00, outros: 0 },
  { id: 'd13', productId: 'p14', date: '2026-02-10', dividendo: 0, jcp: 390.00, outros: 0 },
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
  totalValue: 1082000,
  totalValueUsd: 185591,
  monthContribution: 18500,
  monthWithdrawal: 0,
  monthIncome: 9850,
  monthReturnPct: 1.02,
  byCategory: [
    { category: 'Renda Fixa',     value: 536000, pct: 49.5, color: '#22c55e' },
    { category: 'Renda Variável', value: 265000, pct: 24.5, color: '#f59e0b' },
    { category: 'Internacional',  value: 203000, pct: 18.8, color: '#a855f7' },
    { category: 'Multimercado',   value:  78000, pct:  7.2, color: '#3b82f6' },
    { category: 'Commodities',    value:  42000, pct:  3.9, color: '#ef4444' },
  ],
  byInstitution: [
    { institution: 'XP Investimentos', value: 452000, pct: 41.8 },
    { institution: 'Clear Corretora',  value: 278000, pct: 25.7 },
    { institution: 'Itaú',             value: 204000, pct: 18.9 },
    { institution: 'Avenue',           value: 112000, pct: 10.4 },
  ],
  byRegion: [
    { region: 'Brasil',        value: 879000, pct: 81.2 },
    { region: 'Internacional', value: 203000, pct: 18.8 },
  ],
  monthlyEvolution: [
    { month: 4,  year: 2025, totalValue: 772000,  totalValueUsd: 133333, totalContribution: 18000, totalWithdrawal: 0,    totalIncome: 7200, returnPct: 0.96 },
    { month: 5,  year: 2025, totalValue: 801000,  totalValueUsd: 140280, totalContribution: 18500, totalWithdrawal: 0,    totalIncome: 7400, returnPct: 0.96 },
    { month: 6,  year: 2025, totalValue: 832000,  totalValueUsd: 145965, totalContribution: 19000, totalWithdrawal: 0,    totalIncome: 7600, returnPct: 0.95 },
    { month: 7,  year: 2025, totalValue: 863000,  totalValueUsd: 151937, totalContribution: 18500, totalWithdrawal: 0,    totalIncome: 7900, returnPct: 0.95 },
    { month: 8,  year: 2025, totalValue: 896000,  totalValueUsd: 156370, totalContribution: 19000, totalWithdrawal: 0,    totalIncome: 8200, returnPct: 0.96 },
    { month: 9,  year: 2025, totalValue: 930000,  totalValueUsd: 163732, totalContribution: 19500, totalWithdrawal: 0,    totalIncome: 8400, returnPct: 0.94 },
    { month: 10, year: 2025, totalValue: 963000,  totalValueUsd: 168357, totalContribution: 18500, totalWithdrawal: 0,    totalIncome: 8600, returnPct: 0.93 },
    { month: 11, year: 2025, totalValue: 995000,  totalValueUsd: 174868, totalContribution: 19000, totalWithdrawal: 0,    totalIncome: 8900, returnPct: 0.93 },
    { month: 12, year: 2025, totalValue: 1025000, totalValueUsd: 179510, totalContribution: 18500, totalWithdrawal: 3000, totalIncome: 9100, returnPct: 0.94 },
    { month: 1,  year: 2026, totalValue: 1048000, totalValueUsd: 180690, totalContribution: 18500, totalWithdrawal: 0,    totalIncome: 9300, returnPct: 0.93 },
    { month: 2,  year: 2026, totalValue: 1065000, totalValueUsd: 184896, totalContribution: 18000, totalWithdrawal: 0,    totalIncome: 9500, returnPct: 0.96 },
    { month: 3,  year: 2026, totalValue: 1082000, totalValueUsd: 185591, totalContribution: 18500, totalWithdrawal: 0,    totalIncome: 9850, returnPct: 1.02 },
  ],
}

// ─────────────────────────────────────────────
// YEAR SNAPSHOTS — Overview para anos anteriores
// ─────────────────────────────────────────────
export const mockYearSnapshots: Record<number, DashboardData> = {
  2024: {
    selectedMonth: 12,
    selectedYear: 2024,
    totalValue: 652000,
    totalValueUsd: 105502,
    monthContribution: 19000,
    monthWithdrawal: 0,
    monthIncome: 5400,
    monthReturnPct: 0.89,
    byCategory: [
      { category: 'Renda Fixa',     value: 262000, pct: 40.2, color: '#22c55e' },
      { category: 'Renda Variável', value: 195000, pct: 29.9, color: '#f59e0b' },
      { category: 'Internacional',  value: 129000, pct: 19.8, color: '#a855f7' },
      { category: 'Multimercado',   value:  66000, pct: 10.1, color: '#3b82f6' },
      { category: 'Commodities',    value:      0, pct:  0.0, color: '#ef4444' },
    ],
    byInstitution: [
      { institution: 'XP Investimentos', value: 270000, pct: 41.4 },
      { institution: 'Clear Corretora',  value: 166000, pct: 25.5 },
      { institution: 'Itaú',             value: 132000, pct: 20.2 },
      { institution: 'Avenue',           value:  84000, pct: 12.9 },
    ],
    byRegion: [
      { region: 'Brasil',        value: 523000, pct: 80.2 },
      { region: 'Internacional', value: 129000, pct: 19.8 },
    ],
    monthlyEvolution: [
      { month:  1, year: 2024, totalValue:  95000, totalValueUsd:  19000, totalContribution:  2000, totalWithdrawal: 0, totalIncome:  780, returnPct: 0.83 },
      { month:  2, year: 2024, totalValue:  97500, totalValueUsd:  19500, totalContribution:  2000, totalWithdrawal: 0, totalIncome:  800, returnPct: 0.83 },
      { month:  3, year: 2024, totalValue: 100000, totalValueUsd:  20000, totalContribution:  2000, totalWithdrawal: 0, totalIncome:  820, returnPct: 0.83 },
      { month:  4, year: 2024, totalValue: 290000, totalValueUsd:  57426, totalContribution:185000, totalWithdrawal: 0, totalIncome:  940, returnPct: 0.88 },
      { month:  5, year: 2024, totalValue: 363000, totalValueUsd:  71176, totalContribution: 68500, totalWithdrawal: 0, totalIncome: 1850, returnPct: 0.82 },
      { month:  6, year: 2024, totalValue: 443000, totalValueUsd:  83271, totalContribution: 72000, totalWithdrawal: 0, totalIncome: 2200, returnPct: 0.79 },
      { month:  7, year: 2024, totalValue: 490000, totalValueUsd:  90741, totalContribution: 44000, totalWithdrawal: 0, totalIncome: 3100, returnPct: 0.80 },
      { month:  8, year: 2024, totalValue: 532000, totalValueUsd:  97706, totalContribution: 40000, totalWithdrawal: 0, totalIncome: 3400, returnPct: 0.81 },
      { month:  9, year: 2024, totalValue: 572000, totalValueUsd: 105147, totalContribution: 38000, totalWithdrawal: 0, totalIncome: 3900, returnPct: 0.81 },
      { month: 10, year: 2024, totalValue: 612000, totalValueUsd: 108319, totalContribution: 35500, totalWithdrawal: 0, totalIncome: 4200, returnPct: 0.84 },
      { month: 11, year: 2024, totalValue: 630000, totalValueUsd: 108062, totalContribution: 12000, totalWithdrawal: 0, totalIncome: 4500, returnPct: 0.86 },
      { month: 12, year: 2024, totalValue: 652000, totalValueUsd: 105502, totalContribution: 19000, totalWithdrawal: 0, totalIncome: 5400, returnPct: 0.89 },
    ],
  },
  2025: {
    selectedMonth: 12,
    selectedYear: 2025,
    totalValue: 1025000,
    totalValueUsd: 179510,
    monthContribution: 18500,
    monthWithdrawal: 3000,
    monthIncome: 9100,
    monthReturnPct: 0.94,
    byCategory: [
      { category: 'Renda Fixa',     value: 505000, pct: 49.3, color: '#22c55e' },
      { category: 'Renda Variável', value: 255000, pct: 24.9, color: '#f59e0b' },
      { category: 'Internacional',  value: 190000, pct: 18.5, color: '#a855f7' },
      { category: 'Multimercado',   value:  75000, pct:  7.3, color: '#3b82f6' },
      { category: 'Commodities',    value:  38000, pct:  3.7, color: '#ef4444' },
    ],
    byInstitution: [
      { institution: 'XP Investimentos', value: 430000, pct: 41.9 },
      { institution: 'Clear Corretora',  value: 262000, pct: 25.6 },
      { institution: 'Itaú',             value: 194000, pct: 18.9 },
      { institution: 'Avenue',           value: 107000, pct: 10.4 },
    ],
    byRegion: [
      { region: 'Brasil',        value: 835000, pct: 81.5 },
      { region: 'Internacional', value: 190000, pct: 18.5 },
    ],
    monthlyEvolution: [
      { month:  1, year: 2025, totalValue: 668000,  totalValueUsd: 112269, totalContribution: 21000, totalWithdrawal: 0,    totalIncome: 5800, returnPct: 0.91 },
      { month:  2, year: 2025, totalValue: 692000,  totalValueUsd: 118089, totalContribution: 22500, totalWithdrawal: 0,    totalIncome: 6100, returnPct: 0.92 },
      { month:  3, year: 2025, totalValue: 719000,  totalValueUsd: 122487, totalContribution: 21500, totalWithdrawal: 0,    totalIncome: 6300, returnPct: 0.92 },
      { month:  4, year: 2025, totalValue: 745000,  totalValueUsd: 128670, totalContribution: 19500, totalWithdrawal: 0,    totalIncome: 6700, returnPct: 0.94 },
      { month:  5, year: 2025, totalValue: 772000,  totalValueUsd: 135201, totalContribution: 20000, totalWithdrawal: 0,    totalIncome: 6900, returnPct: 0.93 },
      { month:  6, year: 2025, totalValue: 800000,  totalValueUsd: 140351, totalContribution: 19500, totalWithdrawal: 0,    totalIncome: 7200, returnPct: 0.94 },
      { month:  7, year: 2025, totalValue: 830000,  totalValueUsd: 146127, totalContribution: 19000, totalWithdrawal: 0,    totalIncome: 7500, returnPct: 0.95 },
      { month:  8, year: 2025, totalValue: 862000,  totalValueUsd: 150435, totalContribution: 22000, totalWithdrawal: 0,    totalIncome: 7800, returnPct: 0.95 },
      { month:  9, year: 2025, totalValue: 896000,  totalValueUsd: 157746, totalContribution: 20000, totalWithdrawal: 0,    totalIncome: 8100, returnPct: 0.95 },
      { month: 10, year: 2025, totalValue: 930000,  totalValueUsd: 162587, totalContribution: 20000, totalWithdrawal: 0,    totalIncome: 8400, returnPct: 0.94 },
      { month: 11, year: 2025, totalValue: 962000,  totalValueUsd: 169069, totalContribution: 19500, totalWithdrawal: 0,    totalIncome: 8700, returnPct: 0.94 },
      { month: 12, year: 2025, totalValue: 1025000, totalValueUsd: 179510, totalContribution: 18500, totalWithdrawal: 3000, totalIncome: 9100, returnPct: 0.94 },
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
  // ── Jan/2024 (total ~95k — pré-sistema) ──────────────────────────
  { institutionId:'i1', month:1, year:2024, contribution:1000, withdrawal:0, income: 330, returnPct:0.83, totalValue: 40000 },
  { institutionId:'i2', month:1, year:2024, contribution: 500, withdrawal:0, income: 165, returnPct:0.82, totalValue: 20000 },
  { institutionId:'i4', month:1, year:2024, contribution: 300, withdrawal:0, income: 149, returnPct:0.83, totalValue: 18000 },
  { institutionId:'i5', month:1, year:2024, contribution: 300, withdrawal:0, income: 142, returnPct:0.84, totalValue: 17000 },
  // ── Fev/2024 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:2, year:2024, contribution:1000, withdrawal:0, income: 332, returnPct:0.83, totalValue: 41000 },
  { institutionId:'i2', month:2, year:2024, contribution: 500, withdrawal:0, income: 166, returnPct:0.83, totalValue: 20500 },
  { institutionId:'i4', month:2, year:2024, contribution: 300, withdrawal:0, income: 150, returnPct:0.83, totalValue: 18500 },
  { institutionId:'i5', month:2, year:2024, contribution: 300, withdrawal:0, income: 143, returnPct:0.84, totalValue: 17500 },
  // ── Mar/2024 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:3, year:2024, contribution:1000, withdrawal:0, income: 340, returnPct:0.83, totalValue: 42000 },
  { institutionId:'i2', month:3, year:2024, contribution: 500, withdrawal:0, income: 170, returnPct:0.83, totalValue: 21000 },
  { institutionId:'i4', month:3, year:2024, contribution: 300, withdrawal:0, income: 154, returnPct:0.83, totalValue: 19000 },
  { institutionId:'i5', month:3, year:2024, contribution: 300, withdrawal:0, income: 147, returnPct:0.84, totalValue: 18000 },
  // ── Abr/2024 — produtos principais abertos ───────────────────────
  { institutionId:'i1', month:4, year:2024, contribution:95000, withdrawal:0, income: 334, returnPct:0.88, totalValue:137000 },
  { institutionId:'i2', month:4, year:2024, contribution:30000, withdrawal:0, income: 175, returnPct:0.82, totalValue: 51000 },
  { institutionId:'i4', month:4, year:2024, contribution:   0,  withdrawal:0, income: 158, returnPct:0.83, totalValue: 19200 },
  { institutionId:'i5', month:4, year:2024, contribution:32000, withdrawal:0, income: 150, returnPct:0.83, totalValue: 50200 },
  // ── Mai/2024 — VNQ(i4) e CDB Nubank abertas ──────────────────────
  { institutionId:'i1', month:5, year:2024, contribution: 4500, withdrawal:0, income:1100, returnPct:0.83, totalValue:143000 },
  { institutionId:'i2', month:5, year:2024, contribution: 2000, withdrawal:0, income: 310, returnPct:0.83, totalValue: 53500 },
  { institutionId:'i4', month:5, year:2024, contribution:33000, withdrawal:0, income: 160, returnPct:0.83, totalValue: 52500 },
  { institutionId:'i5', month:5, year:2024, contribution: 1500, withdrawal:0, income: 417, returnPct:0.83, totalValue: 52200 },
  // ── Jun/2024 — LCI e BOVA11 abertas ──────────────────────────────
  { institutionId:'i1', month:6, year:2024, contribution: 4500, withdrawal:0, income:1188, returnPct:0.83, totalValue:149000 },
  { institutionId:'i2', month:6, year:2024, contribution:51000, withdrawal:0, income: 300, returnPct:0.80, totalValue:105000 },
  { institutionId:'i4', month:6, year:2024, contribution:  200, withdrawal:0, income: 430, returnPct:0.82, totalValue: 53200 },
  { institutionId:'i5', month:6, year:2024, contribution: 1500, withdrawal:0, income: 434, returnPct:0.83, totalValue: 54200 },
  // ── Jul/2024 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:7, year:2024, contribution: 4500, withdrawal:0, income:1239, returnPct:0.83, totalValue:155000 },
  { institutionId:'i2', month:7, year:2024, contribution: 3000, withdrawal:0, income: 693, returnPct:0.83, totalValue:109000 },
  { institutionId:'i4', month:7, year:2024, contribution:  200, withdrawal:0, income: 437, returnPct:0.82, totalValue: 53900 },
  { institutionId:'i5', month:7, year:2024, contribution: 1500, withdrawal:0, income: 450, returnPct:0.83, totalValue: 56200 },
  // ── Ago/2024 — Tesouro Prefixado(i5) aberto ──────────────────────
  { institutionId:'i1', month:8, year:2024, contribution: 5500, withdrawal:0, income:1290, returnPct:0.83, totalValue:162000 },
  { institutionId:'i2', month:8, year:2024, contribution: 3000, withdrawal:0, income: 720, returnPct:0.83, totalValue:113000 },
  { institutionId:'i4', month:8, year:2024, contribution:  200, withdrawal:0, income: 442, returnPct:0.82, totalValue: 54600 },
  { institutionId:'i5', month:8, year:2024, contribution:26500, withdrawal:0, income: 466, returnPct:0.83, totalValue: 83300 },
  // ── Set/2024 — LCA Itaú(i5) aberta ──────────────────────────────
  { institutionId:'i1', month:9, year:2024, contribution: 5500, withdrawal:0, income:1348, returnPct:0.83, totalValue:169000 },
  { institutionId:'i2', month:9, year:2024, contribution: 3000, withdrawal:0, income: 746, returnPct:0.82, totalValue:117000 },
  { institutionId:'i4', month:9, year:2024, contribution:  200, withdrawal:0, income: 448, returnPct:0.82, totalValue: 55200 },
  { institutionId:'i5', month:9, year:2024, contribution:24200, withdrawal:0, income: 693, returnPct:0.83, totalValue:108700 },
  // ── Out/2024 — IVVB11(i2) e Fundo Macro Verde(i1) abertos ────────
  { institutionId:'i1', month:10,year:2024, contribution:19500, withdrawal:0, income:1406, returnPct:0.83, totalValue:190000 },
  { institutionId:'i2', month:10,year:2024, contribution:26000, withdrawal:0, income: 770, returnPct:0.82, totalValue:144000 },
  { institutionId:'i4', month:10,year:2024, contribution:  200, withdrawal:0, income: 454, returnPct:0.82, totalValue: 55900 },
  { institutionId:'i5', month:10,year:2024, contribution: 2700, withdrawal:0, income: 903, returnPct:0.83, totalValue:112400 },
  // ── Nov/2024 — CRI Agro(i1) aberto ──────────────────────────────
  { institutionId:'i1', month:11,year:2024, contribution:15000, withdrawal:0, income:1584, returnPct:0.83, totalValue:207000 },
  { institutionId:'i2', month:11,year:2024, contribution: 2500, withdrawal:0, income: 951, returnPct:0.82, totalValue:147500 },
  { institutionId:'i4', month:11,year:2024, contribution:  200, withdrawal:0, income: 459, returnPct:0.82, totalValue: 56600 },
  { institutionId:'i5', month:11,year:2024, contribution: 1200, withdrawal:0, income: 936, returnPct:0.83, totalValue:114700 },
  // ── Dez/2024 — KNRI11(i1) e QQQ(i4) abertos ─────────────────────
  { institutionId:'i1', month:12,year:2024, contribution:19000, withdrawal:0, income:1733, returnPct:0.83, totalValue:228000 },
  { institutionId:'i2', month:12,year:2024, contribution: 2000, withdrawal:0, income: 975, returnPct:0.82, totalValue:150500 },
  { institutionId:'i4', month:12,year:2024, contribution:29700, withdrawal:0, income: 465, returnPct:0.82, totalValue: 86800 },
  { institutionId:'i5', month:12,year:2024, contribution: 1200, withdrawal:0, income: 954, returnPct:0.83, totalValue:116900 },
  // ── Jan/2025 — COE(i1) aberto ────────────────────────────────────
  { institutionId:'i1', month:1, year:2025, contribution:21000, withdrawal:0, income:1903, returnPct:0.83, totalValue:251000 },
  { institutionId:'i2', month:1, year:2025, contribution: 2000, withdrawal:0, income:1015, returnPct:0.83, totalValue:153500 },
  { institutionId:'i4', month:1, year:2025, contribution:  400, withdrawal:0, income: 732, returnPct:0.84, totalValue: 87900 },
  { institutionId:'i5', month:1, year:2025, contribution: 1200, withdrawal:0, income: 999, returnPct:0.85, totalValue:119200 },
  // ── Fev/2025 — GOLD11(i2) aberto ─────────────────────────────────
  { institutionId:'i1', month:2, year:2025, contribution: 8000, withdrawal:0, income:2094, returnPct:0.83, totalValue:261000 },
  { institutionId:'i2', month:2, year:2025, contribution:24000, withdrawal:0, income:1064, returnPct:0.83, totalValue:178800 },
  { institutionId:'i4', month:2, year:2025, contribution:  400, withdrawal:0, income: 741, returnPct:0.84, totalValue: 89100 },
  { institutionId:'i5', month:2, year:2025, contribution: 1200, withdrawal:0, income:1014, returnPct:0.85, totalValue:121500 },
  // ── Mar/2025 — CDB Itaú(i5) aberto ──────────────────────────────
  { institutionId:'i1', month:3, year:2025, contribution: 8000, withdrawal:0, income:2186, returnPct:0.83, totalValue:271000 },
  { institutionId:'i2', month:3, year:2025, contribution: 2500, withdrawal:0, income:1233, returnPct:0.83, totalValue:182600 },
  { institutionId:'i4', month:3, year:2025, contribution:  400, withdrawal:0, income: 750, returnPct:0.84, totalValue: 90300 },
  { institutionId:'i5', month:3, year:2025, contribution:21200, withdrawal:0, income:1030, returnPct:0.85, totalValue:144000 },
  // ── Abr/2025 — BDR Apple(i2) aberta ─────────────────────────────
  { institutionId:'i1', month:4, year:2025, contribution: 8000, withdrawal:0, income:2262, returnPct:0.83, totalValue:281000 },
  { institutionId:'i2', month:4, year:2025, contribution:12500, withdrawal:0, income:1268, returnPct:0.83, totalValue:196500 },
  { institutionId:'i4', month:4, year:2025, contribution:  400, withdrawal:0, income: 760, returnPct:0.84, totalValue: 91500 },
  { institutionId:'i5', month:4, year:2025, contribution: 2200, withdrawal:0, income:1225, returnPct:0.85, totalValue:148000 },
  // ── Mai/2025 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:5, year:2025, contribution: 8000, withdrawal:0, income:2341, returnPct:0.83, totalValue:291000 },
  { institutionId:'i2', month:5, year:2025, contribution: 2500, withdrawal:0, income:1362, returnPct:0.83, totalValue:200500 },
  { institutionId:'i4', month:5, year:2025, contribution:  400, withdrawal:0, income: 769, returnPct:0.84, totalValue: 92700 },
  { institutionId:'i5', month:5, year:2025, contribution: 2200, withdrawal:0, income:1258, returnPct:0.85, totalValue:151700 },
  // ── Jun/2025 — Fundo Global Tech(i1) aberto ──────────────────────
  { institutionId:'i1', month:6, year:2025, contribution:20000, withdrawal:0, income:2426, returnPct:0.83, totalValue:314000 },
  { institutionId:'i2', month:6, year:2025, contribution: 2500, withdrawal:0, income:1398, returnPct:0.83, totalValue:204500 },
  { institutionId:'i4', month:6, year:2025, contribution:  400, withdrawal:0, income: 779, returnPct:0.84, totalValue: 93900 },
  { institutionId:'i5', month:6, year:2025, contribution: 2200, withdrawal:0, income:1289, returnPct:0.85, totalValue:155400 },
  // ── Jul/2025 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:7, year:2025, contribution: 8000, withdrawal:0, income:2616, returnPct:0.83, totalValue:325000 },
  { institutionId:'i2', month:7, year:2025, contribution: 2500, withdrawal:0, income:1437, returnPct:0.83, totalValue:208500 },
  { institutionId:'i4', month:7, year:2025, contribution:  400, withdrawal:0, income: 789, returnPct:0.84, totalValue: 95100 },
  { institutionId:'i5', month:7, year:2025, contribution: 2200, withdrawal:0, income:1321, returnPct:0.85, totalValue:159200 },
  // ── Ago/2025 — VISC11(i1) aberto ─────────────────────────────────
  { institutionId:'i1', month:8, year:2025, contribution:22000, withdrawal:0, income:2708, returnPct:0.83, totalValue:350000 },
  { institutionId:'i2', month:8, year:2025, contribution: 2500, withdrawal:0, income:1476, returnPct:0.83, totalValue:212600 },
  { institutionId:'i4', month:8, year:2025, contribution:  400, withdrawal:0, income: 799, returnPct:0.84, totalValue: 96400 },
  { institutionId:'i5', month:8, year:2025, contribution: 2200, withdrawal:0, income:1353, returnPct:0.85, totalValue:163200 },
  // ── Set/2025 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:9, year:2025, contribution: 8000, withdrawal:0, income:2918, returnPct:0.83, totalValue:361000 },
  { institutionId:'i2', month:9, year:2025, contribution: 2500, withdrawal:0, income:1517, returnPct:0.83, totalValue:216600 },
  { institutionId:'i4', month:9, year:2025, contribution:  400, withdrawal:0, income: 810, returnPct:0.84, totalValue: 97700 },
  { institutionId:'i5', month:9, year:2025, contribution: 2200, withdrawal:0, income:1387, returnPct:0.85, totalValue:167200 },
  // ── Out/2025 — CRA Fiagro(i1) aberto ─────────────────────────────
  { institutionId:'i1', month:10,year:2025, contribution:16500, withdrawal:0, income:3008, returnPct:0.83, totalValue:381000 },
  { institutionId:'i2', month:10,year:2025, contribution: 2500, withdrawal:0, income:1558, returnPct:0.83, totalValue:220700 },
  { institutionId:'i4', month:10,year:2025, contribution:  400, withdrawal:0, income: 821, returnPct:0.84, totalValue: 99000 },
  { institutionId:'i5', month:10,year:2025, contribution: 2200, withdrawal:0, income:1421, returnPct:0.85, totalValue:171200 },
  // ── Nov/2025 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:11,year:2025, contribution: 8000, withdrawal:0, income:3176, returnPct:0.83, totalValue:392000 },
  { institutionId:'i2', month:11,year:2025, contribution: 2500, withdrawal:0, income:1600, returnPct:0.83, totalValue:225000 },
  { institutionId:'i4', month:11,year:2025, contribution:  400, withdrawal:0, income: 832, returnPct:0.84, totalValue:100400 },
  { institutionId:'i5', month:11,year:2025, contribution: 2200, withdrawal:0, income:1456, returnPct:0.85, totalValue:175200 },
  // ── Dez/2025 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:12,year:2025, contribution: 8000, withdrawal:3000, income:3267, returnPct:0.83, totalValue:400000 },
  { institutionId:'i2', month:12,year:2025, contribution: 2500, withdrawal:0,    income:1643, returnPct:0.83, totalValue:229300 },
  { institutionId:'i4', month:12,year:2025, contribution:  400, withdrawal:0,    income: 843, returnPct:0.84, totalValue:101600 },
  { institutionId:'i5', month:12,year:2025, contribution: 2200, withdrawal:0,    income:1491, returnPct:0.85, totalValue:179200 },
  // ── Jan/2026 — Debenture Infra(i1) aberta ────────────────────────
  { institutionId:'i1', month:1, year:2026, contribution:23000, withdrawal:0, income:3330, returnPct:0.83, totalValue:427000 },
  { institutionId:'i2', month:1, year:2026, contribution: 2000, withdrawal:0, income:1685, returnPct:0.83, totalValue:233000 },
  { institutionId:'i4', month:1, year:2026, contribution:  400, withdrawal:0, income: 854, returnPct:0.84, totalValue:102900 },
  { institutionId:'i5', month:1, year:2026, contribution: 2200, withdrawal:0, income:1524, returnPct:0.85, totalValue:183100 },
  // ── Fev/2026 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:2, year:2026, contribution: 8000, withdrawal:0, income:3557, returnPct:0.83, totalValue:439000 },
  { institutionId:'i2', month:2, year:2026, contribution: 2000, withdrawal:0, income:1714, returnPct:0.84, totalValue:237000 },
  { institutionId:'i4', month:2, year:2026, contribution:  400, withdrawal:0, income: 864, returnPct:0.84, totalValue:104200 },
  { institutionId:'i5', month:2, year:2026, contribution: 2200, withdrawal:0, income:1558, returnPct:0.85, totalValue:187100 },
  // ── Mar/2026 ─────────────────────────────────────────────────────
  { institutionId:'i1', month:3, year:2026, contribution: 8000, withdrawal:0, income:3657, returnPct:0.83, totalValue:451000 },
  { institutionId:'i2', month:3, year:2026, contribution: 2000, withdrawal:0, income:1742, returnPct:0.84, totalValue:241000 },
  { institutionId:'i4', month:3, year:2026, contribution:  400, withdrawal:0, income: 876, returnPct:0.84, totalValue:105600 },
  { institutionId:'i5', month:3, year:2026, contribution: 2200, withdrawal:0, income:1591, returnPct:0.85, totalValue:191000 },
]

// ─────────────────────────────────────────────
// CONSOLIDADO MENSAL — por classe de ativo (12 meses × 6 classes)
// ac1=Pós-fixado(cat1), ac2=IPCA+(cat1), ac5=Multimercado(cat2),
// ac6=Ações BR(cat3), ac7=FII(cat3), ac9=ETF Int(cat4)
// ─────────────────────────────────────────────
export const mockMonthlyByAssetClass: {
  assetClassId: string; month: number; year: number; totalValue: number
}[] = [
  // Jan/2024 (pré-sistema: 95k)
  { assetClassId:'ac1', month:1, year:2024, totalValue: 50000 },
  { assetClassId:'ac2', month:1, year:2024, totalValue: 22000 },
  { assetClassId:'ac5', month:1, year:2024, totalValue: 14000 },
  { assetClassId:'ac6', month:1, year:2024, totalValue:  9000 },
  // Fev/2024 (99k)
  { assetClassId:'ac1', month:2, year:2024, totalValue: 52000 },
  { assetClassId:'ac2', month:2, year:2024, totalValue: 22500 },
  { assetClassId:'ac5', month:2, year:2024, totalValue: 14500 },
  { assetClassId:'ac6', month:2, year:2024, totalValue: 10000 },
  // Mar/2024 (105k)
  { assetClassId:'ac1', month:3, year:2024, totalValue: 55000 },
  { assetClassId:'ac2', month:3, year:2024, totalValue: 23000 },
  { assetClassId:'ac5', month:3, year:2024, totalValue: 15000 },
  { assetClassId:'ac6', month:3, year:2024, totalValue: 12000 },
  // Abr/2024 (275k — início do sistema, carteira documentada)
  { assetClassId:'ac1', month:4, year:2024, totalValue:150000 },
  { assetClassId:'ac2', month:4, year:2024, totalValue: 35000 },
  { assetClassId:'ac3', month:4, year:2024, totalValue: 15000 },
  { assetClassId:'ac5', month:4, year:2024, totalValue: 38000 },
  { assetClassId:'ac6', month:4, year:2024, totalValue: 22000 },
  { assetClassId:'ac7', month:4, year:2024, totalValue: 15000 },
  // Mai/2024 (318k — p3 Nubank ac1, p20 VNQ ac9)
  { assetClassId:'ac1', month:5, year:2024, totalValue:168000 },
  { assetClassId:'ac2', month:5, year:2024, totalValue: 37000 },
  { assetClassId:'ac3', month:5, year:2024, totalValue: 15500 },
  { assetClassId:'ac5', month:5, year:2024, totalValue: 39500 },
  { assetClassId:'ac6', month:5, year:2024, totalValue: 21000 },
  { assetClassId:'ac7', month:5, year:2024, totalValue: 17000 },
  { assetClassId:'ac9', month:5, year:2024, totalValue: 20000 },
  // Jun/2024 (358k — p4 LCI ac1, p16 BOVA11 ac8)
  { assetClassId:'ac1', month:6, year:2024, totalValue:183000 },
  { assetClassId:'ac2', month:6, year:2024, totalValue: 39000 },
  { assetClassId:'ac3', month:6, year:2024, totalValue: 16000 },
  { assetClassId:'ac5', month:6, year:2024, totalValue: 41000 },
  { assetClassId:'ac6', month:6, year:2024, totalValue: 23000 },
  { assetClassId:'ac7', month:6, year:2024, totalValue: 19000 },
  { assetClassId:'ac8', month:6, year:2024, totalValue: 15000 },
  { assetClassId:'ac9', month:6, year:2024, totalValue: 22000 },
  // Jul/2024 (378k)
  { assetClassId:'ac1', month:7, year:2024, totalValue:192000 },
  { assetClassId:'ac2', month:7, year:2024, totalValue: 41000 },
  { assetClassId:'ac3', month:7, year:2024, totalValue: 17000 },
  { assetClassId:'ac5', month:7, year:2024, totalValue: 42500 },
  { assetClassId:'ac6', month:7, year:2024, totalValue: 22500 },
  { assetClassId:'ac7', month:7, year:2024, totalValue: 21000 },
  { assetClassId:'ac8', month:7, year:2024, totalValue: 17000 },
  { assetClassId:'ac9', month:7, year:2024, totalValue: 25000 },
  // Ago/2024 (433k — p5 Tesouro Pré ac3, p17 XPML11 ac7)
  { assetClassId:'ac1', month:8, year:2024, totalValue:200000 },
  { assetClassId:'ac2', month:8, year:2024, totalValue: 43000 },
  { assetClassId:'ac3', month:8, year:2024, totalValue: 42000 },
  { assetClassId:'ac5', month:8, year:2024, totalValue: 44000 },
  { assetClassId:'ac6', month:8, year:2024, totalValue: 24000 },
  { assetClassId:'ac7', month:8, year:2024, totalValue: 33000 },
  { assetClassId:'ac8', month:8, year:2024, totalValue: 19000 },
  { assetClassId:'ac9', month:8, year:2024, totalValue: 28000 },
  // Set/2024 (456k — p6 LCA Itaú ac1)
  { assetClassId:'ac1', month:9, year:2024, totalValue:208000 },
  { assetClassId:'ac2', month:9, year:2024, totalValue: 45000 },
  { assetClassId:'ac3', month:9, year:2024, totalValue: 44000 },
  { assetClassId:'ac5', month:9, year:2024, totalValue: 45500 },
  { assetClassId:'ac6', month:9, year:2024, totalValue: 24000 },
  { assetClassId:'ac7', month:9, year:2024, totalValue: 35500 },
  { assetClassId:'ac8', month:9, year:2024, totalValue: 22000 },
  { assetClassId:'ac9', month:9, year:2024, totalValue: 32000 },
  // Out/2024 (514k — p13 Fundo Verde ac5, p21 IVVB11 ac9)
  { assetClassId:'ac1', month:10,year:2024, totalValue:215000 },
  { assetClassId:'ac2', month:10,year:2024, totalValue: 47000 },
  { assetClassId:'ac3', month:10,year:2024, totalValue: 46000 },
  { assetClassId:'ac5', month:10,year:2024, totalValue: 65000 },
  { assetClassId:'ac6', month:10,year:2024, totalValue: 26000 },
  { assetClassId:'ac7', month:10,year:2024, totalValue: 38000 },
  { assetClassId:'ac8', month:10,year:2024, totalValue: 25000 },
  { assetClassId:'ac9', month:10,year:2024, totalValue: 52000 },
  // Nov/2024 (564k — p7 CRI ac4)
  { assetClassId:'ac1', month:11,year:2024, totalValue:222000 },
  { assetClassId:'ac2', month:11,year:2024, totalValue: 50000 },
  { assetClassId:'ac3', month:11,year:2024, totalValue: 47000 },
  { assetClassId:'ac4', month:11,year:2024, totalValue: 20000 },
  { assetClassId:'ac5', month:11,year:2024, totalValue: 66500 },
  { assetClassId:'ac6', month:11,year:2024, totalValue: 28000 },
  { assetClassId:'ac7', month:11,year:2024, totalValue: 41000 },
  { assetClassId:'ac8', month:11,year:2024, totalValue: 27000 },
  { assetClassId:'ac9', month:11,year:2024, totalValue: 62000 },
  // Dez/2024 (652k — p18 KNRI11 ac7, p22 QQQ ac9)
  { assetClassId:'ac1', month:12,year:2024, totalValue:235000 },
  { assetClassId:'ac2', month:12,year:2024, totalValue: 60000 },
  { assetClassId:'ac3', month:12,year:2024, totalValue: 48000 },
  { assetClassId:'ac4', month:12,year:2024, totalValue: 25000 },
  { assetClassId:'ac5', month:12,year:2024, totalValue: 68000 },
  { assetClassId:'ac6', month:12,year:2024, totalValue: 36000 },
  { assetClassId:'ac7', month:12,year:2024, totalValue: 75000 },
  { assetClassId:'ac8', month:12,year:2024, totalValue: 28000 },
  { assetClassId:'ac9', month:12,year:2024, totalValue: 77000 },
  // Jan/2025 (687k — p8 COE ac3)
  { assetClassId:'ac1', month:1, year:2025, totalValue:237000 },
  { assetClassId:'ac2', month:1, year:2025, totalValue: 62000 },
  { assetClassId:'ac3', month:1, year:2025, totalValue: 62000 },
  { assetClassId:'ac4', month:1, year:2025, totalValue: 28000 },
  { assetClassId:'ac5', month:1, year:2025, totalValue: 70000 },
  { assetClassId:'ac6', month:1, year:2025, totalValue: 38000 },
  { assetClassId:'ac7', month:1, year:2025, totalValue: 78000 },
  { assetClassId:'ac8', month:1, year:2025, totalValue: 30000 },
  { assetClassId:'ac9', month:1, year:2025, totalValue: 82000 },
  // Fev/2025 (716k — p25 GOLD11 ac11)
  { assetClassId:'ac1', month:2, year:2025, totalValue:242000 },
  { assetClassId:'ac2', month:2, year:2025, totalValue: 64000 },
  { assetClassId:'ac3', month:2, year:2025, totalValue: 64000 },
  { assetClassId:'ac4', month:2, year:2025, totalValue: 29000 },
  { assetClassId:'ac5', month:2, year:2025, totalValue: 72000 },
  { assetClassId:'ac6', month:2, year:2025, totalValue: 37000 },
  { assetClassId:'ac7', month:2, year:2025, totalValue: 81000 },
  { assetClassId:'ac8', month:2, year:2025, totalValue: 31000 },
  { assetClassId:'ac9', month:2, year:2025, totalValue: 88000 },
  { assetClassId:'ac11',month:2, year:2025, totalValue:  8000 },
  // Mar/2025 (748k — p9 CDB Itaú ac1)
  { assetClassId:'ac1', month:3, year:2025, totalValue:256000 },
  { assetClassId:'ac2', month:3, year:2025, totalValue: 65000 },
  { assetClassId:'ac3', month:3, year:2025, totalValue: 66000 },
  { assetClassId:'ac4', month:3, year:2025, totalValue: 33000 },
  { assetClassId:'ac5', month:3, year:2025, totalValue: 73000 },
  { assetClassId:'ac6', month:3, year:2025, totalValue: 39000 },
  { assetClassId:'ac7', month:3, year:2025, totalValue: 84000 },
  { assetClassId:'ac8', month:3, year:2025, totalValue: 33000 },
  { assetClassId:'ac9', month:3, year:2025, totalValue: 90000 },
  { assetClassId:'ac11',month:3, year:2025, totalValue:  9000 },
  // Abr/2025 (777k — p23 BDR Apple ac10)
  { assetClassId:'ac1', month:4, year:2025, totalValue:262000 },
  { assetClassId:'ac2', month:4, year:2025, totalValue: 66000 },
  { assetClassId:'ac3', month:4, year:2025, totalValue: 67000 },
  { assetClassId:'ac4', month:4, year:2025, totalValue: 35000 },
  { assetClassId:'ac5', month:4, year:2025, totalValue: 74000 },
  { assetClassId:'ac6', month:4, year:2025, totalValue: 40000 },
  { assetClassId:'ac7', month:4, year:2025, totalValue: 86000 },
  { assetClassId:'ac8', month:4, year:2025, totalValue: 34000 },
  { assetClassId:'ac9', month:4, year:2025, totalValue: 95000 },
  { assetClassId:'ac10',month:4, year:2025, totalValue:  8000 },
  { assetClassId:'ac11',month:4, year:2025, totalValue: 10000 },
  // Mai/2025 (802k)
  { assetClassId:'ac1', month:5, year:2025, totalValue:268000 },
  { assetClassId:'ac2', month:5, year:2025, totalValue: 67000 },
  { assetClassId:'ac3', month:5, year:2025, totalValue: 68000 },
  { assetClassId:'ac4', month:5, year:2025, totalValue: 38000 },
  { assetClassId:'ac5', month:5, year:2025, totalValue: 75000 },
  { assetClassId:'ac6', month:5, year:2025, totalValue: 41000 },
  { assetClassId:'ac7', month:5, year:2025, totalValue: 88000 },
  { assetClassId:'ac8', month:5, year:2025, totalValue: 35000 },
  { assetClassId:'ac9', month:5, year:2025, totalValue:100000 },
  { assetClassId:'ac10',month:5, year:2025, totalValue: 10000 },
  { assetClassId:'ac11',month:5, year:2025, totalValue: 12000 },
  // Jun/2025 (831k — p24 Global Tech ac9)
  { assetClassId:'ac1', month:6, year:2025, totalValue:273000 },
  { assetClassId:'ac2', month:6, year:2025, totalValue: 68000 },
  { assetClassId:'ac3', month:6, year:2025, totalValue: 69000 },
  { assetClassId:'ac4', month:6, year:2025, totalValue: 41000 },
  { assetClassId:'ac5', month:6, year:2025, totalValue: 76000 },
  { assetClassId:'ac6', month:6, year:2025, totalValue: 43000 },
  { assetClassId:'ac7', month:6, year:2025, totalValue: 91000 },
  { assetClassId:'ac8', month:6, year:2025, totalValue: 36000 },
  { assetClassId:'ac9', month:6, year:2025, totalValue:110000 },
  { assetClassId:'ac10',month:6, year:2025, totalValue: 11000 },
  { assetClassId:'ac11',month:6, year:2025, totalValue: 13000 },
  // Jul/2025 (866k)
  { assetClassId:'ac1', month:7, year:2025, totalValue:280000 },
  { assetClassId:'ac2', month:7, year:2025, totalValue: 69000 },
  { assetClassId:'ac3', month:7, year:2025, totalValue: 71000 },
  { assetClassId:'ac4', month:7, year:2025, totalValue: 45000 },
  { assetClassId:'ac5', month:7, year:2025, totalValue: 77000 },
  { assetClassId:'ac6', month:7, year:2025, totalValue: 45000 },
  { assetClassId:'ac7', month:7, year:2025, totalValue: 95000 },
  { assetClassId:'ac8', month:7, year:2025, totalValue: 37000 },
  { assetClassId:'ac9', month:7, year:2025, totalValue:120000 },
  { assetClassId:'ac10',month:7, year:2025, totalValue: 12000 },
  { assetClassId:'ac11',month:7, year:2025, totalValue: 15000 },
  // Ago/2025 (904k — p19 VISC11 ac7)
  { assetClassId:'ac1', month:8, year:2025, totalValue:285000 },
  { assetClassId:'ac2', month:8, year:2025, totalValue: 70000 },
  { assetClassId:'ac3', month:8, year:2025, totalValue: 72000 },
  { assetClassId:'ac4', month:8, year:2025, totalValue: 48000 },
  { assetClassId:'ac5', month:8, year:2025, totalValue: 78000 },
  { assetClassId:'ac6', month:8, year:2025, totalValue: 46000 },
  { assetClassId:'ac7', month:8, year:2025, totalValue:110000 },
  { assetClassId:'ac8', month:8, year:2025, totalValue: 38000 },
  { assetClassId:'ac9', month:8, year:2025, totalValue:128000 },
  { assetClassId:'ac10',month:8, year:2025, totalValue: 13000 },
  { assetClassId:'ac11',month:8, year:2025, totalValue: 16000 },
  // Set/2025 (937k)
  { assetClassId:'ac1', month:9, year:2025, totalValue:289000 },
  { assetClassId:'ac2', month:9, year:2025, totalValue: 71000 },
  { assetClassId:'ac3', month:9, year:2025, totalValue: 74000 },
  { assetClassId:'ac4', month:9, year:2025, totalValue: 53000 },
  { assetClassId:'ac5', month:9, year:2025, totalValue: 79000 },
  { assetClassId:'ac6', month:9, year:2025, totalValue: 47000 },
  { assetClassId:'ac7', month:9, year:2025, totalValue:120000 },
  { assetClassId:'ac8', month:9, year:2025, totalValue: 38000 },
  { assetClassId:'ac9', month:9, year:2025, totalValue:135000 },
  { assetClassId:'ac10',month:9, year:2025, totalValue: 14000 },
  { assetClassId:'ac11',month:9, year:2025, totalValue: 17000 },
  // Out/2025 (971k — p10 CRA ac4)
  { assetClassId:'ac1', month:10,year:2025, totalValue:293000 },
  { assetClassId:'ac2', month:10,year:2025, totalValue: 72000 },
  { assetClassId:'ac3', month:10,year:2025, totalValue: 75000 },
  { assetClassId:'ac4', month:10,year:2025, totalValue: 62000 },
  { assetClassId:'ac5', month:10,year:2025, totalValue: 80000 },
  { assetClassId:'ac6', month:10,year:2025, totalValue: 47000 },
  { assetClassId:'ac7', month:10,year:2025, totalValue:130000 },
  { assetClassId:'ac8', month:10,year:2025, totalValue: 39000 },
  { assetClassId:'ac9', month:10,year:2025, totalValue:140000 },
  { assetClassId:'ac10',month:10,year:2025, totalValue: 15000 },
  { assetClassId:'ac11',month:10,year:2025, totalValue: 18000 },
  // Nov/2025 (998k)
  { assetClassId:'ac1', month:11,year:2025, totalValue:297000 },
  { assetClassId:'ac2', month:11,year:2025, totalValue: 72000 },
  { assetClassId:'ac3', month:11,year:2025, totalValue: 77000 },
  { assetClassId:'ac4', month:11,year:2025, totalValue: 64000 },
  { assetClassId:'ac5', month:11,year:2025, totalValue: 81000 },
  { assetClassId:'ac6', month:11,year:2025, totalValue: 48000 },
  { assetClassId:'ac7', month:11,year:2025, totalValue:140000 },
  { assetClassId:'ac8', month:11,year:2025, totalValue: 40000 },
  { assetClassId:'ac9', month:11,year:2025, totalValue:145000 },
  { assetClassId:'ac10',month:11,year:2025, totalValue: 15000 },
  { assetClassId:'ac11',month:11,year:2025, totalValue: 19000 },
  // Dez/2025 (1.025k)
  { assetClassId:'ac1', month:12,year:2025, totalValue:301000 },
  { assetClassId:'ac2', month:12,year:2025, totalValue: 72000 },
  { assetClassId:'ac3', month:12,year:2025, totalValue: 78000 },
  { assetClassId:'ac4', month:12,year:2025, totalValue: 61000 },
  { assetClassId:'ac5', month:12,year:2025, totalValue: 82000 },
  { assetClassId:'ac6', month:12,year:2025, totalValue: 48000 },
  { assetClassId:'ac7', month:12,year:2025, totalValue:155000 },
  { assetClassId:'ac8', month:12,year:2025, totalValue: 40000 },
  { assetClassId:'ac9', month:12,year:2025, totalValue:152000 },
  { assetClassId:'ac10',month:12,year:2025, totalValue: 16000 },
  { assetClassId:'ac11',month:12,year:2025, totalValue: 20000 },
  // Jan/2026 (1.040k — p11 Debenture ac3)
  { assetClassId:'ac1', month:1, year:2026, totalValue:305000 },
  { assetClassId:'ac2', month:1, year:2026, totalValue: 73000 },
  { assetClassId:'ac3', month:1, year:2026, totalValue: 80000 },
  { assetClassId:'ac4', month:1, year:2026, totalValue: 63000 },
  { assetClassId:'ac5', month:1, year:2026, totalValue: 83000 },
  { assetClassId:'ac6', month:1, year:2026, totalValue: 49000 },
  { assetClassId:'ac7', month:1, year:2026, totalValue:157000 },
  { assetClassId:'ac8', month:1, year:2026, totalValue: 41000 },
  { assetClassId:'ac9', month:1, year:2026, totalValue:153000 },
  { assetClassId:'ac10',month:1, year:2026, totalValue: 16000 },
  { assetClassId:'ac11',month:1, year:2026, totalValue: 20000 },
  // Fev/2026 (1.058k)
  { assetClassId:'ac1', month:2, year:2026, totalValue:309000 },
  { assetClassId:'ac2', month:2, year:2026, totalValue: 74000 },
  { assetClassId:'ac3', month:2, year:2026, totalValue: 83000 },
  { assetClassId:'ac4', month:2, year:2026, totalValue: 65000 },
  { assetClassId:'ac5', month:2, year:2026, totalValue: 84000 },
  { assetClassId:'ac6', month:2, year:2026, totalValue: 50000 },
  { assetClassId:'ac7', month:2, year:2026, totalValue:160000 },
  { assetClassId:'ac8', month:2, year:2026, totalValue: 41000 },
  { assetClassId:'ac9', month:2, year:2026, totalValue:155000 },
  { assetClassId:'ac10',month:2, year:2026, totalValue: 16000 },
  { assetClassId:'ac11',month:2, year:2026, totalValue: 21000 },
  // Mar/2026 (1.082k)
  { assetClassId:'ac1', month:3, year:2026, totalValue:315000 },
  { assetClassId:'ac2', month:3, year:2026, totalValue: 75000 },
  { assetClassId:'ac3', month:3, year:2026, totalValue: 87000 },
  { assetClassId:'ac4', month:3, year:2026, totalValue: 68000 },
  { assetClassId:'ac5', month:3, year:2026, totalValue: 85000 },
  { assetClassId:'ac6', month:3, year:2026, totalValue: 52000 },
  { assetClassId:'ac7', month:3, year:2026, totalValue:163000 },
  { assetClassId:'ac8', month:3, year:2026, totalValue: 42000 },
  { assetClassId:'ac9', month:3, year:2026, totalValue:157000 },
  { assetClassId:'ac10',month:3, year:2026, totalValue: 17000 },
  { assetClassId:'ac11',month:3, year:2026, totalValue: 21000 },
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
