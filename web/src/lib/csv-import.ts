import type { Category, AssetClass, Institution, Region, LiquidityOption, Product, ProductEntry } from '@/types'

export interface ImportResult {
  products: Product[]
  entries: ProductEntry[]
  newCategories: Category[]
  newAssetClasses: AssetClass[]
  newInstitutions: Institution[]
  newRegions: Region[]
  newLiquidityOptions: LiquidityOption[]
}

type ParseSuccess = { ok: true; result: ImportResult }
type ParseFailure = { ok: false; errors: string[] }

// Ordem das colunas obrigatórias (0-6) e opcionais (7-15):
// 0=nome 1=categoria 2=classe_ativo 3=instituicao 4=mes 5=ano 6=valor_brl
// 7=detalhes 8=cnpj 9=regiao 10=liquidez 11=aporte 12=retirada 13=ganhos 14=valor_usd 15=cotacao
const TEMPLATE_HEADERS = ['nome', 'categoria', 'classe_ativo', 'instituicao', 'mes', 'ano', 'valor_brl', 'detalhes', 'cnpj', 'regiao', 'liquidez', 'aporte', 'retirada', 'ganhos', 'valor_usd', 'cotacao'] as const

const DEFAULT_COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4']

function parseNum(val: string): number {
  return parseFloat(val.replace(',', '.')) || 0
}

function detectSeparator(line: string): ',' | ';' {
  const commas = (line.match(/,/g) || []).length
  const semis  = (line.match(/;/g) || []).length
  return semis > commas ? ';' : ','
}

function splitLine(line: string, sep: ',' | ';'): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === sep && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

export function parseCsvImport(
  csvText: string,
  existing: {
    categories: Category[]
    assetClasses: AssetClass[]
    institutions: Institution[]
    regions: Region[]
    liquidityOptions: LiquidityOption[]
  },
): ParseSuccess | ParseFailure {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) {
    return { ok: false, errors: ['O arquivo precisa ter ao menos uma linha de cabeçalho e uma linha de dados.'] }
  }

  // Detecta separador pela primeira linha (cabeçalho) e pula ela
  // Colunas por posição:
  //   0=nome 1=categoria 2=classe_ativo 3=instituicao 4=mes 5=ano 6=valor_brl
  //   7=detalhes 8=cnpj 9=regiao 10=liquidez 11=aporte 12=retirada 13=ganhos 14=valor_usd 15=cotacao
  const sep = detectSeparator(lines[0])

  // Working copies
  const allCategories   = [...existing.categories]
  const allAssetClasses = [...existing.assetClasses]
  const allInstitutions = [...existing.institutions]
  const allRegions          = [...existing.regions]
  const allLiquidityOptions = [...existing.liquidityOptions]

  const newCategories:      Category[]       = []
  const newAssetClasses:    AssetClass[]     = []
  const newInstitutions:    Institution[]    = []
  const newRegions:         Region[]         = []
  const newLiquidityOptions: LiquidityOption[] = []

  // Determine default region fallback
  const defaultRegion = allRegions.find(r => r.isDefault) ?? allRegions[0]
  // Determine default liquidity fallback (D+1 or first option)
  const defaultLiquidity = allLiquidityOptions.find(l => l.name === 'D+1') ?? allLiquidityOptions[0]

  const products: Product[]     = []
  const entries:  ProductEntry[] = []
  const errors:   string[]       = []

  const now = new Date().toISOString().slice(0, 10)
  let colorIdx = 0

  for (let i = 1; i < lines.length; i++) {
    const lineNum = i + 1
    const row = splitLine(lines[i], sep)

    const nome     = (row[0]  ?? '').trim()
    const catName  = (row[1]  ?? '').trim()
    const acName   = (row[2]  ?? '').trim()
    const instName = (row[3]  ?? '').trim()
    const mesStr   = (row[4]  ?? '').trim()
    const anoStr   = (row[5]  ?? '').trim()
    const valorStr = (row[6]  ?? '').trim()

    const lineErrors: string[] = []

    if (!nome)    lineErrors.push(`campo 'nome' vazio`)
    if (!catName) lineErrors.push(`campo 'categoria' vazio`)
    if (!acName)  lineErrors.push(`campo 'classe_ativo' vazio`)
    if (!instName)lineErrors.push(`campo 'instituicao' vazio`)

    const mes = parseInt(mesStr, 10)
    if (isNaN(mes) || mes < 1 || mes > 12) lineErrors.push(`campo 'mes' inválido (${mesStr})`)

    const ano = parseInt(anoStr, 10)
    if (isNaN(ano) || ano < 2000 || ano > 2100) lineErrors.push(`campo 'ano' inválido (${anoStr})`)

    const valorBrl = parseNum(valorStr)
    if (isNaN(valorBrl)) lineErrors.push(`campo 'valor_brl' inválido (${valorStr})`)

    if (lineErrors.length > 0) {
      errors.push(`Linha ${lineNum}: ${lineErrors.join(', ')}`)
      continue
    }

    // Auto-register category
    let cat = allCategories.find(c => c.name.toLowerCase() === catName.toLowerCase())
    if (!cat) {
      cat = {
        id: `cat_imp_${Date.now()}_${i}`,
        name: catName as Category['name'],
        color: DEFAULT_COLORS[colorIdx++ % DEFAULT_COLORS.length],
      }
      allCategories.push(cat)
      newCategories.push(cat)
    }

    // Auto-register asset class
    let ac = allAssetClasses.find(
      a => a.name.toLowerCase() === acName.toLowerCase() && a.categoryId === cat!.id,
    )
    if (!ac) {
      ac = { id: `ac_imp_${Date.now()}_${i}`, name: acName, categoryId: cat.id }
      allAssetClasses.push(ac)
      newAssetClasses.push(ac)
    }

    // Auto-register institution
    let inst = allInstitutions.find(ins => ins.name.toLowerCase() === instName.toLowerCase())
    if (!inst) {
      inst = { id: `inst_imp_${Date.now()}_${i}`, name: instName }
      allInstitutions.push(inst)
      newInstitutions.push(inst)
    }

    // Resolve region — auto-register or fallback to default
    const regionName = (row[9] ?? '').trim()
    let region: Region | undefined
    if (regionName) {
      region = allRegions.find(r => r.name.toLowerCase() === regionName.toLowerCase())
      if (!region) {
        region = { id: `reg_imp_${Date.now()}_${i}`, name: regionName, isDefault: false }
        allRegions.push(region)
        newRegions.push(region)
      }
    } else {
      region = defaultRegion
    }

    // Resolve liquidity — auto-register or fallback to default
    const liquidityName = (row[10] ?? '').trim()
    let liquidity: LiquidityOption | undefined
    if (liquidityName) {
      liquidity = allLiquidityOptions.find(l => l.name.toLowerCase() === liquidityName.toLowerCase())
      if (!liquidity) {
        liquidity = { id: `liq_imp_${Date.now()}_${i}`, name: liquidityName }
        allLiquidityOptions.push(liquidity)
        newLiquidityOptions.push(liquidity)
      }
    } else {
      liquidity = defaultLiquidity
    }

    // Build Product
    const productId = `p_imp_${Date.now()}_${i}`
    const product: Product = {
      id: productId,
      name: nome,
      cnpj: (row[8] ?? '').trim() || undefined,
      categoryId: cat.id,
      assetClassId: ac.id,
      institutionId: inst.id,
      regionId: region?.id ?? defaultRegion?.id ?? '',
      liquidityId: liquidity?.id ?? defaultLiquidity?.id ?? '',
      currency: 'BRL',
      status: 'active',
      createdAt: now,
      details: (row[7] ?? '').trim() || undefined,
    }

    // Build ProductEntry
    const valorUsd = parseNum((row[14] ?? '').trim())
    const cotacao  = parseNum((row[15] ?? '').trim())
    const aporte   = parseNum((row[11] ?? '').trim())
    const retirada = parseNum((row[12] ?? '').trim())
    const ganhos   = parseNum((row[13] ?? '').trim())

    const entry: ProductEntry = {
      id: `e_imp_${Date.now()}_${i}`,
      productId,
      month: mes,
      year: ano,
      contribution: aporte,
      withdrawal: retirada,
      returnPct: 0,
      income: ganhos,
      valueOriginal: valorBrl,
      valueBrl: valorBrl,
      valueUsd: valorUsd,
      valueFinal: valorBrl,
      exchangeRate: cotacao || undefined,
      createdAt: now,
    }

    products.push(product)
    entries.push(entry)
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, result: { products, entries, newCategories, newAssetClasses, newInstitutions, newRegions, newLiquidityOptions } }
}

export function generateCsvTemplate(): string {
  const headers = [...TEMPLATE_HEADERS].join(',')
  const example = [
    'CDB XP 110% CDI',  // nome
    'Renda Fixa',        // categoria
    'Pós-fixado',        // classe_ativo
    'XP Investimentos',  // instituicao
    '3',                 // mes
    '2026',              // ano
    '85400',             // valor_brl
    'Vence em dez/2027', // detalhes
    '12.345.678/0001-90',// cnpj
    'Brasil',            // regiao
    'D+1',               // liquidez
    '1000',              // aporte
    '0',                 // retirada
    '769',               // ganhos
    '14724',             // valor_usd
    '5.83',              // cotacao
  ].join(',')
  return `${headers}\n${example}\n`
}
