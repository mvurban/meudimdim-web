'use client'

import { useRef, useState, useEffect } from 'react'
import type { Category, AssetClass, Institution, Region } from '@/types'
import { parseCsvImport, generateCsvTemplate } from '@/lib/csv-import'
import type { ImportResult } from '@/lib/csv-import'

interface ImportModalProps {
  categories: Category[]
  assetClasses: AssetClass[]
  institutions: Institution[]
  regions: Region[]
  onCancel: () => void
  onImport: (result: ImportResult) => void
}

type Screen = 'idle' | 'preview' | 'error' | 'importing' | 'done'

const IMPORT_DURATION_MS = 900

export function ImportModal({ categories, assetClasses, institutions, regions, onCancel, onImport }: ImportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [screen, setScreen]   = useState<Screen>('idle')
  const [errors, setErrors]   = useState<string[]>([])
  const [result, setResult]   = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)

  // Progress bar — runs when importing
  useEffect(() => {
    if (screen !== 'importing' || !result) return

    setProgress(0)
    const steps = 40
    const interval = IMPORT_DURATION_MS / steps
    let current = 0

    const id = setInterval(() => {
      current += 1
      const pct = Math.min(Math.round((current / steps) * 100), 100)
      setProgress(pct)

      if (current >= steps) {
        clearInterval(id)
        setScreen('done')
      }
    }, interval)

    return () => clearInterval(id)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const parsed = parseCsvImport(text, { categories, assetClasses, institutions, regions })
      if (parsed.ok) {
        setResult(parsed.result)
        setScreen('preview')
      } else {
        setErrors(parsed.errors)
        setScreen('error')
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  function downloadTemplate() {
    const csv = generateCsvTemplate()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_produtos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const isLocked = screen === 'importing'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget && !isLocked) onCancel() }}
    >
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in" style={{ padding: 0 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Importar Produtos via CSV
            </span>
          </div>
          {!isLocked && (
            <button
              onClick={onCancel}
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* ── IDLE ── */}
          {screen === 'idle' && (
            <>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Um arquivo <strong style={{ color: 'var(--text-primary)' }}>.csv</strong> (valores separados por vírgula ou ponto-e-vírgula) permite cadastrar vários produtos de uma só vez.
                Categorias, classes de ativo e instituições que ainda não existirem serão criadas automaticamente.
              </p>

              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Colunas do arquivo
                </div>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left py-1.5 pr-4" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 11 }}>COLUNA</th>
                      <th className="text-left py-1.5 pr-4" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 11 }}>DESCRIÇÃO</th>
                      <th className="text-left py-1.5"       style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 11 }}>OBRIG.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { col: 'nome',         desc: 'Nome do produto',               req: true  },
                      { col: 'categoria',    desc: 'Categoria (ex: Renda Fixa)',    req: true  },
                      { col: 'classe_ativo', desc: 'Classe de ativo (ex: CRI/CRA)', req: true  },
                      { col: 'instituicao',  desc: 'Instituição (ex: XP)',          req: true  },
                      { col: 'mes',          desc: 'Mês numérico (1 a 12)',         req: true  },
                      { col: 'ano',          desc: 'Ano (ex: 2026)',                req: true  },
                      { col: 'valor_brl',    desc: 'Valor em R$',                  req: true  },
                      { col: 'detalhes',     desc: 'Descrição livre',               req: false },
                      { col: 'cnpj',         desc: 'CNPJ do produto',               req: false },
                      { col: 'regiao',       desc: 'Região (usa padrão se vazio)',   req: false },
                      { col: 'aporte',       desc: 'Valor aportado no mês',         req: false },
                      { col: 'retirada',     desc: 'Valor retirado no mês',         req: false },
                      { col: 'ganhos',       desc: 'Rendimento bruto do mês',       req: false },
                      { col: 'valor_usd',    desc: 'Valor em dólar',               req: false },
                      { col: 'cotacao',      desc: 'Cotação do dólar no mês',      req: false },
                    ].map(({ col, desc, req }) => (
                      <tr key={col} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-1.5 pr-4 font-mono text-xs" style={{ color: 'var(--brand)' }}>{col}</td>
                        <td className="py-1.5 pr-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</td>
                        <td className="py-1.5 text-xs">
                          {req ? <span className="badge badge-green">Sim</span> : <span className="badge badge-gray">Não</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button className="btn-outline text-sm" onClick={downloadTemplate}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Baixar modelo .csv
                </button>
                <button className="btn-brand text-sm" onClick={() => fileRef.current?.click()}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Selecionar arquivo .csv
                </button>
                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              </div>
            </>
          )}

          {/* ── PREVIEW ── */}
          {screen === 'preview' && result && (
            <>
              <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand-border)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Arquivo válido — pronto para importar
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{result.products.length}</strong> produto{result.products.length !== 1 ? 's' : ''} encontrado{result.products.length !== 1 ? 's' : ''}
                </div>
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
                    · {result.newInstitutions.length} instituição{result.newInstitutions.length !== 1 ? 's' : ''} nova{result.newInstitutions.length !== 1 ? 's' : ''}: {result.newInstitutions.map(i => i.name).join(', ')}
                  </div>
                )}
                {result.newRegions.length > 0 && (
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    · {result.newRegions.length} região{result.newRegions.length !== 1 ? 'ões' : ''} nova{result.newRegions.length !== 1 ? 's' : ''}: {result.newRegions.map(r => r.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
                <button className="btn-brand text-sm" onClick={() => setScreen('importing')}>
                  Iniciar importação
                </button>
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
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Arquivo inválido</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Corrija os erros abaixo e tente novamente</div>
                </div>
              </div>

              <div className="rounded-lg p-4 space-y-1" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {errors.map((err, i) => (
                  <div key={i} className="text-sm" style={{ color: 'var(--danger)' }}>· {err}</div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
                <button className="btn-brand text-sm" onClick={() => { setScreen('idle'); setErrors([]) }}>
                  Tentar novamente
                </button>
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
                    style={{
                      background: 'var(--brand)',
                      width: `${progress}%`,
                      transition: 'width 80ms linear',
                    }}
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
                  Os produtos já estão disponíveis na listagem.
                </div>
              </div>
              <button className="btn-brand" onClick={() => result && onImport(result)}>
                Concluído
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
