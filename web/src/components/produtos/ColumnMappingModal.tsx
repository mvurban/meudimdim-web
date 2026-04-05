'use client'

import { useRef, useState, useEffect } from 'react'
import type { Category, AssetClass, Institution, Region, LiquidityOption } from '@/types'
import { parseCsvImport } from '@/lib/csv-import'
import type { ImportResult } from '@/lib/csv-import'
import { ModalPortal } from '@/components/ui/ModalPortal'

interface ColumnMappingModalProps {
  categories: Category[]
  assetClasses: AssetClass[]
  institutions: Institution[]
  regions: Region[]
  liquidityOptions: LiquidityOption[]
  onCancel: () => void
  onImport: (result: ImportResult) => void
}

type Screen = 'upload' | 'mapping' | 'preview' | 'error' | 'importing' | 'done'

const IMPORT_DURATION_MS = 900

// System fields in positional order (matches parseCsvImport expectations)
const SYSTEM_FIELDS = [
  { key: 'nome',         label: 'Nome do produto',        required: true,  allowDefault: false },
  { key: 'categoria',    label: 'Categoria',               required: true,  allowDefault: true  },
  { key: 'classe_ativo', label: 'Classe de ativo',         required: true,  allowDefault: true  },
  { key: 'instituicao',  label: 'Instituição',             required: true,  allowDefault: true  },
  { key: 'mes',          label: 'Mês (1–12)',              required: true,  allowDefault: true  },
  { key: 'ano',          label: 'Ano (ex: 2026)',          required: true,  allowDefault: true  },
  { key: 'valor_brl',    label: 'Valor em R$',             required: true,  allowDefault: false },
  { key: 'detalhes',     label: 'Detalhes',                required: false, allowDefault: false },
  { key: 'cnpj',         label: 'CNPJ',                   required: false, allowDefault: false },
  { key: 'regiao',       label: 'Região',                  required: false, allowDefault: true  },
  { key: 'liquidez',     label: 'Liquidez',                required: false, allowDefault: false },
  { key: 'aporte',       label: 'Aporte',                  required: false, allowDefault: false },
  { key: 'retirada',     label: 'Retirada',                required: false, allowDefault: false },
  { key: 'ganhos',       label: 'Ganhos',                  required: false, allowDefault: false },
  { key: 'valor_usd',    label: 'Valor em USD',            required: false, allowDefault: false },
  { key: 'cotacao',      label: 'Cotação do dólar',        required: false, allowDefault: false },
] as const

type FieldKey = typeof SYSTEM_FIELDS[number]['key']
const FIELD_ORDER = SYSTEM_FIELDS.map(f => f.key) as FieldKey[]

function detectSep(line: string): ',' | ';' {
  return (line.match(/;/g) || []).length > (line.match(/,/g) || []).length ? ';' : ','
}

function splitLine(line: string, sep: ',' | ';'): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === sep && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += ch }
  }
  result.push(current.trim())
  return result
}

function autoMap(lastHeaders: string[], combinedHeaders: string[]): Record<FieldKey, string> {
  const initial = {} as Record<FieldKey, string>
  SYSTEM_FIELDS.forEach(f => { initial[f.key] = '' })
  lastHeaders.forEach((h, i) => {
    const normalized = h.toLowerCase().replace(/\s+/g, '_')
    const match = SYSTEM_FIELDS.find(f => f.key === normalized || f.key === h.toLowerCase())
    if (match && !initial[match.key]) initial[match.key] = combinedHeaders[i]
  })
  return initial
}

function rebuildCsv(
  rawLines: string[],
  sep: ',' | ';',
  mapping: Record<FieldKey, string>,
  defaults: Record<FieldKey, string>,
  userHeaders: string[],
  headerRows: number,
): string {
  const colIndex: Record<string, number> = {}
  userHeaders.forEach((h, i) => { colIndex[h] = i })

  const dataLines = rawLines.slice(headerRows).filter(l => l.trim() !== '').map(line => {
    const row = splitLine(line, sep)
    const newRow = FIELD_ORDER.map(field => {
      const userCol = mapping[field] || ''
      if (userCol) {
        const idx = colIndex[userCol]
        const val = idx !== undefined ? (row[idx] ?? '') : ''
        return val.includes(',') || val.includes(';') ? `"${val}"` : val
      }
      const def = defaults[field] || ''
      return def.includes(',') || def.includes(';') ? `"${def}"` : def
    })
    return newRow.join(',')
  })

  return [FIELD_ORDER.join(','), ...dataLines].join('\n')
}

export function ColumnMappingModal({
  categories, assetClasses, institutions, regions, liquidityOptions, onCancel, onImport,
}: ColumnMappingModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [screen, setScreen]           = useState<Screen>('upload')
  const [headerRows, setHeaderRows]   = useState(1)
  const [rawLines, setRawLines]       = useState<string[]>([])
  const [sep, setSep]                 = useState<',' | ';'>(',')
  const [userHeaders, setUserHeaders] = useState<string[]>([])
  const [mapping, setMapping]         = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>)
  const [defaults, setDefaults]       = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>)
  const [errors, setErrors]           = useState<string[]>([])
  const [skipped, setSkipped]         = useState(0)
  const [blank, setBlank]             = useState(0)
  const [result, setResult]           = useState<ImportResult | null>(null)
  const [progress, setProgress]       = useState(0)

  // Progress bar
  useEffect(() => {
    if (screen !== 'importing' || !result) return
    setProgress(0)
    const steps = 40
    const interval = IMPORT_DURATION_MS / steps
    let current = 0
    const id = setInterval(() => {
      current += 1
      setProgress(Math.min(Math.round((current / steps) * 100), 100))
      if (current >= steps) { clearInterval(id); setScreen('done') }
    }, interval)
    return () => clearInterval(id)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const lines = text.split(/\r?\n/)
      const nonEmpty = lines.filter(l => l.trim() !== '')
      if (nonEmpty.length < headerRows + 1) {
        setErrors([`O arquivo precisa ter ao menos ${headerRows} linha${headerRows > 1 ? 's' : ''} de cabeçalho e uma linha de dados.`])
        setScreen('error')
        return
      }

      // Detecta separador pela última linha de cabeçalho
      const lastHeaderLine = nonEmpty[headerRows - 1]
      const detectedSep = detectSep(lastHeaderLine)

      // Divide todas as linhas de cabeçalho
      const splitHeaderRows = nonEmpty.slice(0, headerRows).map(line =>
        splitLine(line, detectedSep).map(h => h.replace(/^"|"$/g, '').trim())
      )

      // Para cada coluna, concatena os valores não-vazios de todas as linhas de cabeçalho
      const colCount = Math.max(...splitHeaderRows.map(r => r.length))
      const combinedHeaders = Array.from({ length: colCount }, (_, i) => {
        const parts = splitHeaderRows.map(r => r[i] ?? '').filter(v => v !== '')
        return parts.length > 0 ? parts.join(' / ') : `Coluna ${i + 1}`
      })

      // Usa a última linha de cabeçalho para auto-mapear (nomes mais específicos)
      const lastHeaders = splitHeaderRows[splitHeaderRows.length - 1]

      // Pré-selecionar região padrão
      const defaultRegion = regions.find(r => r.isDefault) ?? regions.find(r => r.name.toLowerCase() === 'brasil') ?? regions[0]

      setRawLines(lines)
      setSep(detectedSep)
      setUserHeaders(combinedHeaders)
      setMapping(autoMap(lastHeaders, combinedHeaders))
      setDefaults(prev => ({
        ...prev,
        regiao: defaultRegion?.name ?? '',
      }))
      setScreen('mapping')
    }
    reader.readAsText(file, 'UTF-8')
  }

  function handleAdvance() {
    const rebuilt = rebuildCsv(rawLines, sep, mapping, defaults, userHeaders, headerRows)
    const parsed = parseCsvImport(rebuilt, { categories, assetClasses, institutions, regions, liquidityOptions })
    if (parsed.ok) {
      setResult(parsed.result)
      setSkipped(parsed.result.skippedCount)
      setBlank(parsed.result.blankCount)
      setScreen('preview')
    } else {
      setErrors(parsed.errors)
      setSkipped(parsed.skippedCount)
      setBlank(parsed.blankCount)
      setScreen('error')
    }
  }

  const NOW_YEAR  = new Date().getFullYear()
  const NOW_MONTH = new Date().getMonth() + 1

  function renderDefaultCell(field: typeof SYSTEM_FIELDS[number], hasMapped: boolean) {
    if (!field.allowDefault) return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>

    const commonStyle = {
      border: '1px solid var(--border)',
      background: hasMapped ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      color: defaults[field.key] ? 'var(--text-primary)' : 'var(--text-muted)',
      outline: 'none',
      opacity: hasMapped ? 0.4 : 1,
      width: '100%',
    }
    const cls = "text-xs rounded-md px-2 py-1.5"

    function onSelect(val: string) {
      setDefaults(prev => ({ ...prev, [field.key]: val }))
      if (val) setMapping(prev => ({ ...prev, [field.key]: '' }))
    }

    if (field.key === 'categoria') {
      return (
        <select
          value={defaults.categoria ?? ''}
          onChange={e => {
            setDefaults(prev => ({ ...prev, categoria: e.target.value, classe_ativo: '' }))
            if (e.target.value) setMapping(prev => ({ ...prev, categoria: '' }))
          }}
          disabled={hasMapped}
          className={cls}
          style={commonStyle}
        >
          <option value="">— escolher —</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      )
    }

    if (field.key === 'classe_ativo') {
      const selectedCat = categories.find(c => c.name === defaults.categoria)
      const filtered = selectedCat ? assetClasses.filter(ac => ac.categoryId === selectedCat.id) : assetClasses
      return (
        <select value={defaults.classe_ativo ?? ''} onChange={e => onSelect(e.target.value)} disabled={hasMapped} className={cls} style={commonStyle}>
          <option value="">— escolher —</option>
          {filtered.map(ac => <option key={ac.id} value={ac.name}>{ac.name}</option>)}
        </select>
      )
    }

    if (field.key === 'instituicao') {
      return (
        <select value={defaults.instituicao ?? ''} onChange={e => onSelect(e.target.value)} disabled={hasMapped} className={cls} style={commonStyle}>
          <option value="">— escolher —</option>
          {institutions.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
        </select>
      )
    }

    if (field.key === 'regiao') {
      return (
        <select value={defaults.regiao ?? ''} onChange={e => onSelect(e.target.value)} disabled={hasMapped} className={cls} style={commonStyle}>
          <option value="">— escolher —</option>
          {regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
        </select>
      )
    }

    if (field.key === 'ano') {
      return (
        <select
          value={defaults.ano ?? ''}
          onChange={e => {
            const val = e.target.value
            setDefaults(prev => {
              const next = { ...prev, ano: val }
              if (val === String(NOW_YEAR)) {
                const m = parseInt(prev.mes ?? '0')
                if (m > NOW_MONTH) next.mes = ''
              }
              return next
            })
            if (val) setMapping(prev => ({ ...prev, ano: '' }))
          }}
          disabled={hasMapped}
          className={cls}
          style={commonStyle}
        >
          <option value="">— escolher —</option>
          {Array.from({ length: NOW_YEAR - 2000 + 1 }, (_, i) => NOW_YEAR - i).map(y => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      )
    }

    if (field.key === 'mes') {
      const anoDefault = parseInt(defaults.ano ?? '0')
      const maxMonth = anoDefault === NOW_YEAR ? NOW_MONTH : 12
      return (
        <select value={defaults.mes ?? ''} onChange={e => onSelect(e.target.value)} disabled={hasMapped} className={cls} style={commonStyle}>
          <option value="">— escolher —</option>
          {Array.from({ length: maxMonth }, (_, i) => i + 1).map(m => (
            <option key={m} value={String(m)}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>
      )
    }

    return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
  }

  const requiredMapped = SYSTEM_FIELDS.filter(f => f.required).every(f => !!mapping[f.key] || !!defaults[f.key])
  const isLocked = screen === 'importing'

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={e => { if (e.target === e.currentTarget && !isLocked) onCancel() }}
      >
        {/* Modal: flex column so header/footer são fixos e o meio rola */}
        <div
          className="card w-full max-w-2xl flex flex-col animate-fade-in"
          style={{ padding: 0, maxHeight: '90vh' }}
        >

          {/* Header fixo */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Relacionar Colunas</span>
            </div>
            {!isLocked && (
              <button onClick={onCancel} className="flex h-7 w-7 items-center justify-center rounded-md" style={{ color: 'var(--text-muted)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Conteúdo rolável */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* ── UPLOAD ── */}
            {screen === 'upload' && (
              <>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Selecione qualquer arquivo <strong style={{ color: 'var(--text-primary)' }}>.csv</strong> — pode ter colunas em qualquer ordem ou com nomes diferentes.
                  Você escolherá na próxima etapa quais colunas do seu arquivo correspondem a cada campo do sistema.
                </p>

                {/* Linhas de cabeçalho */}
                <div className="flex items-center gap-3">
                  <label className="text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    Linhas de cabeçalho no arquivo:
                  </label>
                  <select
                    value={headerRows}
                    onChange={e => setHeaderRows(Number(e.target.value))}
                    className="text-sm rounded-md px-2 py-1.5"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    (a última linha de cabeçalho deve ter os nomes das colunas)
                  </span>
                </div>

                <div className="rounded-lg p-4 text-sm" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Como funciona:</div>
                  <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                    <li>· Selecione seu arquivo CSV (vírgula ou ponto-e-vírgula)</li>
                    <li>· O sistema detecta as colunas automaticamente</li>
                    <li>· Você relaciona cada campo com a coluna correta</li>
                    <li>· O sistema valida e importa os dados</li>
                  </ul>
                </div>

                <div>
                  <button className="btn-brand text-sm" onClick={() => fileRef.current?.click()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Selecionar arquivo .csv
                  </button>
                  <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
                </div>
              </>
            )}

            {/* ── MAPPING ── */}
            {screen === 'mapping' && (
              <>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Arquivo lido com <strong style={{ color: 'var(--text-primary)' }}>{userHeaders.length}</strong> coluna{userHeaders.length !== 1 ? 's' : ''}.
                    Relacione cada campo do sistema com a coluna correspondente do seu arquivo.
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Campos obrigatórios precisam ter uma coluna mapeada <em>ou</em> um valor padrão selecionado para continuar.
                  </p>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-elevated)' }}>
                        <th className="text-left px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', width: '30%' }}>CAMPO DO SISTEMA</th>
                        <th className="text-left px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', width: '35%' }}>COLUNA DO SEU ARQUIVO</th>
                        <th className="text-left px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', width: '35%' }}>VALOR PADRÃO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SYSTEM_FIELDS.map((field, idx) => {
                        const hasMapped  = !!mapping[field.key]
                        const hasDefault = !!defaults[field.key]
                        return (
                          <tr
                            key={field.key}
                            style={{
                              borderTop: '1px solid var(--border)',
                              background: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                            }}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                {field.required
                                  ? <span className="badge badge-green" style={{ fontSize: 10, padding: '1px 5px' }}>obrig.</span>
                                  : <span className="badge badge-gray" style={{ fontSize: 10, padding: '1px 5px' }}>opcional</span>
                                }
                                <span className="font-mono text-xs" style={{ color: 'var(--brand)' }}>{field.key}</span>
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', paddingLeft: 52 }}>{field.label}</div>
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={mapping[field.key] ?? ''}
                                onChange={e => {
                                  const val = e.target.value
                                  setMapping(prev => ({ ...prev, [field.key]: val }))
                                  if (val) setDefaults(prev => ({ ...prev, [field.key]: '' }))
                                }}
                                className="w-full text-xs rounded-md px-2 py-1.5"
                                style={{
                                  border: '1px solid var(--border)',
                                  background: hasDefault ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                  color: hasMapped ? 'var(--text-primary)' : 'var(--text-muted)',
                                  outline: 'none',
                                  opacity: hasDefault ? 0.4 : 1,
                                }}
                                disabled={hasDefault}
                              >
                                <option value="">— não mapear —</option>
                                {userHeaders.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              {renderDefaultCell(field, hasMapped)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── PREVIEW ── */}
            {screen === 'preview' && result && (
              <>
                <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand-border)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Dados válidos — pronto para importar
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{result.products.length}</strong> linha{result.products.length !== 1 ? 's' : ''} válida{result.products.length !== 1 ? 's' : ''} para importar
                  </div>
                  {skipped > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      · {skipped} linha{skipped !== 1 ? 's' : ''} ignorada{skipped !== 1 ? 's' : ''} (campos obrigatórios vazios)
                    </div>
                  )}
                  {blank > 0 && (
                    <div className="text-xs font-medium" style={{ color: '#f97316' }}>
                      · {blank} linha{blank !== 1 ? 's' : ''} em branco encontrada{blank !== 1 ? 's' : ''} e ignorada{blank !== 1 ? 's' : ''}
                    </div>
                  )}
                  {result.newCategories.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {result.newCategories.length} categoria{result.newCategories.length !== 1 ? 's' : ''} nova{result.newCategories.length !== 1 ? 's' : ''}: {result.newCategories.map(c => c.name).join(', ')}
                    </div>
                  )}
                  {result.newAssetClasses.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {result.newAssetClasses.length} classe{result.newAssetClasses.length !== 1 ? 's' : ''} de ativo nova{result.newAssetClasses.length !== 1 ? 's' : ''}: {result.newAssetClasses.map(a => a.name).join(', ')}
                    </div>
                  )}
                  {result.newInstitutions.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {result.newInstitutions.length} instituição{result.newInstitutions.length !== 1 ? 'ões' : ''} nova{result.newInstitutions.length !== 1 ? 's' : ''}: {result.newInstitutions.map(i => i.name).join(', ')}
                    </div>
                  )}
                  {result.newRegions.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {result.newRegions.length} região{result.newRegions.length !== 1 ? 'ões' : ''} nova{result.newRegions.length !== 1 ? 's' : ''}: {result.newRegions.map(r => r.name).join(', ')}
                    </div>
                  )}
                  {result.newLiquidityOptions.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {result.newLiquidityOptions.length} opção{result.newLiquidityOptions.length !== 1 ? 'ões' : ''} de liquidez nova{result.newLiquidityOptions.length !== 1 ? 's' : ''}: {result.newLiquidityOptions.map(l => l.name).join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button className="btn-ghost text-sm" onClick={() => setScreen('mapping')}>Rever mapeamento</button>
                  <button className="btn-brand text-sm" onClick={() => setScreen('importing')}>Iniciar importação</button>
                </div>
              </>
            )}

            {/* ── ERROR ── */}
            {screen === 'error' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Dados inválidos</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Revise o mapeamento ou corrija os dados no arquivo</div>
                  </div>
                </div>
                <div className="rounded-lg p-4 space-y-1" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {errors.map((err, i) => (
                    <div key={i} className="text-sm" style={{ color: 'var(--danger)' }}>· {err}</div>
                  ))}
                </div>
                {skipped > 0 && (
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {skipped} linha{skipped !== 1 ? 's' : ''} ignorada{skipped !== 1 ? 's' : ''} por campos obrigatórios vazios (não contam como erro).
                  </div>
                )}
                {blank > 0 && (
                  <div className="text-xs font-medium" style={{ color: '#f97316' }}>
                    {blank} linha{blank !== 1 ? 's' : ''} em branco encontrada{blank !== 1 ? 's' : ''} e ignorada{blank !== 1 ? 's' : ''}.
                  </div>
                )}
                <div className="flex gap-3">
                  <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
                  {rawLines.length > 0 && (
                    <button className="btn-brand text-sm" onClick={() => { setErrors([]); setScreen('mapping') }}>
                      Rever mapeamento
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ── IMPORTING ── */}
            {screen === 'importing' && result && (
              <div className="py-4 flex flex-col gap-4">
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Importando {result.products.length} produto{result.products.length !== 1 ? 's' : ''}…
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    <span>Progresso</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'var(--bg-elevated)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: 'var(--brand)', width: `${progress}%`, transition: 'width 80ms linear' }}
                    />
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Registrando produtos, entradas e tabelas auxiliares…
                </p>
              </div>
            )}

            {/* ── DONE ── */}
            {screen === 'done' && (
              <div className="py-4 flex flex-col items-center gap-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--brand-subtle)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Importação concluída com sucesso</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {result && (
                      <>
                        <strong style={{ color: 'var(--text-primary)' }}>{result.products.length}</strong> produto{result.products.length !== 1 ? 's' : ''} importado{result.products.length !== 1 ? 's' : ''}.
                        {skipped > 0 && <> · <strong>{skipped}</strong> linha{skipped !== 1 ? 's' : ''} ignorada{skipped !== 1 ? 's' : ''} (campos vazios).</>}
                        {blank > 0 && <> · <strong style={{ color: '#f97316' }}>{blank}</strong><span style={{ color: '#f97316' }}> linha{blank !== 1 ? 's' : ''} em branco.</span></>}
                      </>
                    )}
                  </div>
                </div>
                <button className="btn-brand" onClick={() => result && onImport(result)}>Concluído</button>
              </div>
            )}

          </div>

          {/* Footer fixo — visível apenas na tela de mapeamento */}
          {screen === 'mapping' && (
            <div
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}
            >
              <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
              <button
                className="btn-brand text-sm"
                disabled={!requiredMapped}
                style={{ opacity: requiredMapped ? 1 : 0.45 }}
                onClick={handleAdvance}
              >
                Avançar
              </button>
              {!requiredMapped && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Mapeie todos os campos obrigatórios para continuar
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </ModalPortal>
  )
}
