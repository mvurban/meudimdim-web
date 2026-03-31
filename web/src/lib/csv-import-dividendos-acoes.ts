export interface DividendosImportResult {
  dividends: {
    acaoId: string
    ticker: string
    date: string     // yyyy-mm-dd normalizado
    dividendo: number
    jcp: number
    outros: number
  }[]
}

type ParseSuccess = { ok: true; result: DividendosImportResult }
type ParseFailure = { ok: false; errors: string[] }

// Ordem das colunas: ticker(0), instituicao(1), data(2), dividendo(3), jcp(4), outros(5)

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

function normalizeDate(raw: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (br) return `${br[3]}-${br[2]}-${br[1]}`
  return null
}

export function parseCsvDividendosAcoes(
  csvText: string,
  existingAcoes: { id: string; ticker: string; institutionName: string }[],
): ParseSuccess | ParseFailure {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) {
    return { ok: false, errors: ['O arquivo precisa ter ao menos uma linha de cabeçalho e uma linha de dados.'] }
  }

  const sep = detectSeparator(lines[0])

  const dividends: DividendosImportResult['dividends'] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const lineNum = i + 1
    const row = splitLine(lines[i], sep)

    // Colunas por posição: ticker(0), instituicao(1), data(2), dividendo(3), jcp(4), outros(5)
    const tickerRaw  = (row[0] ?? '').trim().toUpperCase()
    const instName   = (row[1] ?? '').trim()
    const dataRaw    = (row[2] ?? '').trim()
    const dividendo  = parseNum((row[3] ?? '').trim())
    const jcp        = parseNum((row[4] ?? '').trim())
    const outros     = parseNum((row[5] ?? '').trim())

    const lineErrors: string[] = []

    if (!tickerRaw) lineErrors.push(`campo 'ticker' vazio`)
    if (!instName)  lineErrors.push(`campo 'instituicao' vazio`)
    if (!dataRaw)   lineErrors.push(`campo 'data' vazio`)

    if (dividendo <= 0 && jcp <= 0 && outros <= 0) {
      lineErrors.push(`ao menos um valor (dividendo, jcp ou outros) deve ser maior que zero`)
    }

    const date = normalizeDate(dataRaw)
    if (dataRaw && !date) lineErrors.push(`campo 'data' inválido (${dataRaw}) — use yyyy-mm-dd ou dd/mm/yyyy`)

    if (lineErrors.length > 0) {
      errors.push(`Linha ${lineNum}: ${lineErrors.join(', ')}`)
      continue
    }

    const tickerClean = tickerRaw.replace('.SA', '')

    // Resolve pelo ticker + instituição
    const acao = existingAcoes.find(a =>
      a.ticker.toUpperCase().replace('.SA', '') === tickerClean &&
      a.institutionName.toLowerCase() === instName.toLowerCase()
    )

    if (!acao) {
      // Verifica se o ticker existe em outra instituição para dar mensagem mais clara
      const tickerExists = existingAcoes.some(a => a.ticker.toUpperCase().replace('.SA', '') === tickerClean)
      if (tickerExists) {
        errors.push(`Linha ${lineNum}: ticker '${tickerClean}' não encontrado na instituição '${instName}'`)
      } else {
        errors.push(`Linha ${lineNum}: ticker '${tickerClean}' não encontrado na carteira`)
      }
      continue
    }

    dividends.push({ acaoId: acao.id, ticker: acao.ticker, date: date!, dividendo, jcp, outros })
  }

  if (errors.length > 0) return { ok: false, errors }
  if (dividends.length === 0) return { ok: false, errors: ['Nenhum registro encontrado no arquivo.'] }

  return { ok: true, result: { dividends } }
}

export function generateDividendosCsvTemplate(
  institutionNames?: string[],
): string {
  const headers = ['ticker', 'instituicao', 'data', 'dividendo', 'jcp', 'outros'].join(',')

  const inst1 = institutionNames?.[0] ?? 'Clear Corretora'
  const inst2 = institutionNames?.[1] ?? 'XP Investimentos'

  const examples = [
    `PETR4,${inst1},2024-03-15,1.50,0.20,0`,
    `PETR4,${inst2},2024-03-15,1.50,0.20,0`,
    `ITUB4,${inst1},2024-03-15,0.80,0,0`,
  ].join('\n')

  return `${headers}\n${examples}\n`
}
