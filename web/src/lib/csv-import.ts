import type { Category, AssetClass, Institution, Region, Product, ProductEntry } from '@/types'

export interface ImportResult {
  products: Product[]
  entries: ProductEntry[]
  newCategories: Category[]
  newAssetClasses: AssetClass[]
  newInstitutions: Institution[]
  newRegions: Region[]
}

type ParseSuccess = { ok: true; result: ImportResult }
type ParseFailure = { ok: false; errors: string[] }

const REQUIRED_COLS = ['nome', 'categoria', 'classe_ativo', 'instituicao', 'mes', 'ano', 'valor_brl'] as const
const OPTIONAL_COLS = ['detalhes', 'cnpj', 'regiao', 'aporte', 'retirada', 'ganhos', 'valor_usd', 'cotacao'] as const

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
  },
): ParseSuccess | ParseFailure {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) {
    return { ok: false, errors: ['O arquivo precisa ter ao menos uma linha de cabeçalho e uma linha de dados.'] }
  }

  const sep = detectSeparator(lines[0])
  const headers = splitLine(lines[0], sep).map(h => h.toLowerCase().trim())

  const missingCols = REQUIRED_COLS.filter(c => !headers.includes(c))
  if (missingCols.length > 0) {
    return { ok: false, errors: [`Colunas obrigatórias ausentes: ${missingCols.join(', ')}`] }
  }

  const col = (row: string[], name: string): string => {
    const idx = headers.indexOf(name)
    return idx >= 0 ? (row[idx] ?? '').trim() : ''
  }

  // Working copies
  const allCategories   = [...existing.categories]
  const allAssetClasses = [...existing.assetClasses]
  const allInstitutions = [...existing.institutions]
  const allRegions      = [...existing.regions]

  const newCategories:  Category[]    = []
  const newAssetClasses: AssetClass[] = []
  const newInstitutions: Institution[] = []
  const newRegions:     Region[]      = []

  // Determine default region fallback
  const defaultRegion = allRegions.find(r => r.isDefault) ?? allRegions[0]

  const products: Product[]     = []
  const entries:  ProductEntry[] = []
  const errors:   string[]       = []

  const now = new Date().toISOString().slice(0, 10)
  let colorIdx = 0

  for (let i = 1; i < lines.length; i++) {
    const lineNum = i + 1
    const row = splitLine(lines[i], sep)

    const nome     = col(row, 'nome')
    const catName  = col(row, 'categoria')
    const acName   = col(row, 'classe_ativo')
    const instName = col(row, 'instituicao')
    const mesStr   = col(row, 'mes')
    const anoStr   = col(row, 'ano')
    const valorStr = col(row, 'valor_brl')

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
    const regionName = col(row, 'regiao')
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

    // Build Product
    const productId = `p_imp_${Date.now()}_${i}`
    const product: Product = {
      id: productId,
      name: nome,
      cnpj: col(row, 'cnpj') || undefined,
      categoryId: cat.id,
      assetClassId: ac.id,
      institutionId: inst.id,
      regionId: region?.id ?? defaultRegion?.id ?? '',
      currency: 'BRL',
      liquidity: { value: 1, unit: 'days' },
      status: 'active',
      createdAt: now,
      details: col(row, 'detalhes') || undefined,
    }

    // Build ProductEntry
    const valorUsd = parseNum(col(row, 'valor_usd'))
    const cotacao  = parseNum(col(row, 'cotacao'))
    const aporte   = parseNum(col(row, 'aporte'))
    const retirada = parseNum(col(row, 'retirada'))
    const ganhos   = parseNum(col(row, 'ganhos'))

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

  return { ok: true, result: { products, entries, newCategories, newAssetClasses, newInstitutions, newRegions } }
}

export function generateCsvTemplate(): string {
  const headers = [...REQUIRED_COLS, ...OPTIONAL_COLS].join(',')
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
    '1000',              // aporte
    '0',                 // retirada
    '769',               // ganhos
    '14724',             // valor_usd
    '5.83',              // cotacao
  ].join(',')
  return `${headers}\n${example}\n`
}
