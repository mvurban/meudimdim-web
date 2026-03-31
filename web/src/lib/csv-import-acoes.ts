import type { AssetClass, Institution } from '@/types'

export interface AcoesImportResult {
  acoes: {
    ticker: string
    institutionId: string
    assetClassId: string
    quantidade: number
    precoMedio: number
  }[]
  newInstitutions: { id: string; name: string }[]
}

type ParseSuccess = { ok: true; result: AcoesImportResult }
type ParseFailure = { ok: false; errors: string[] }

// Ordem das colunas: ticker(0), instituicao(1), tipo_acao(2), quantidade(3), preco_medio(4)
const REQUIRED_COLS = ['ticker', 'instituicao', 'tipo_acao', 'quantidade', 'preco_medio'] as const

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

export function parseCsvAcoes(
  csvText: string,
  existing: {
    institutions: Institution[]
    assetClasses: AssetClass[] // já filtrados com isAcao=true
    acoes: { ticker: string }[]
  },
): ParseSuccess | ParseFailure {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) {
    return { ok: false, errors: ['O arquivo precisa ter ao menos uma linha de cabeçalho e uma linha de dados.'] }
  }

  // Detecta separador pela primeira linha (cabeçalho) e pula ela
  const sep = detectSeparator(lines[0])

  const allInstitutions = [...existing.institutions]
  const newInstitutions: AcoesImportResult['newInstitutions'] = []

  const validClassNames = existing.assetClasses.map(a => a.name.toLowerCase())

  // Tickers já cadastrados na carteira
  const existingTickers = new Set(existing.acoes.map(a => a.ticker.toUpperCase().replace('.SA', '')))

  const acoes: AcoesImportResult['acoes'] = []
  const errors: string[] = []
  const seenTickers = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const lineNum = i + 1
    const row = splitLine(lines[i], sep)

    // Colunas por posição: ticker(0), instituicao(1), tipo_acao(2), quantidade(3), preco_medio(4)
    const ticker   = (row[0] ?? '').trim().toUpperCase().replace('.SA', '')
    const instName = (row[1] ?? '').trim()
    const tipoAcao = (row[2] ?? '').trim()
    const qtdStr   = (row[3] ?? '').trim()
    const precoStr = (row[4] ?? '').trim()

    const lineErrors: string[] = []

    if (!ticker)   lineErrors.push(`campo 'ticker' vazio`)
    if (!instName) lineErrors.push(`campo 'instituicao' vazio`)
    if (!tipoAcao) lineErrors.push(`campo 'tipo_acao' vazio`)

    const quantidade = parseInt(qtdStr, 10)
    if (isNaN(quantidade) || quantidade <= 0) lineErrors.push(`campo 'quantidade' inválido (${qtdStr})`)

    const precoMedio = parseNum(precoStr)
    if (!precoMedio || precoMedio <= 0) lineErrors.push(`campo 'preco_medio' inválido (${precoStr})`)

    if (lineErrors.length > 0) {
      errors.push(`Linha ${lineNum}: ${lineErrors.join(', ')}`)
      continue
    }

    const tickerKey = `${ticker}|${instName.toLowerCase()}`
    if (seenTickers.has(tickerKey)) {
      errors.push(`Linha ${lineNum}: ticker '${ticker}' duplicado na instituição '${instName}'`)
      continue
    }
    seenTickers.add(tickerKey)

    if (existingTickers.has(ticker)) {
      errors.push(`Linha ${lineNum}: ticker '${ticker}' já está cadastrado na sua carteira`)
      continue
    }

    // Resolve institution
    let inst = allInstitutions.find(ins => ins.name.toLowerCase() === instName.toLowerCase())
    if (!inst) {
      inst = { id: `inst_imp_${Date.now()}_${i}`, name: instName }
      allInstitutions.push(inst)
      newInstitutions.push(inst)
    }

    // Resolve asset class — deve ser uma existente com isAcao=true
    const ac = existing.assetClasses.find(a => a.name.toLowerCase() === tipoAcao.toLowerCase())
    if (!ac) {
      errors.push(`Linha ${lineNum}: tipo_acao '${tipoAcao}' inválido — valores aceitos: ${validClassNames.join(', ')}`)
      continue
    }

    acoes.push({ ticker, institutionId: inst.id, assetClassId: ac.id, quantidade, precoMedio })
  }

  if (errors.length > 0) return { ok: false, errors }
  if (acoes.length === 0) return { ok: false, errors: ['Nenhum registro encontrado no arquivo.'] }

  return { ok: true, result: { acoes, newInstitutions } }
}

export function generateAcoesCsvTemplate(): string {
  const headers = REQUIRED_COLS.join(',')
  const examples = [
    'PETR4,Clear Corretora,Ações,100,28.50',
    'ITUB4,XP Investimentos,Ações,200,22.00',
    'XPML11,Clear Corretora,FIIs,50,98.00',
  ].join('\n')
  return `${headers}\n${examples}\n`
}
