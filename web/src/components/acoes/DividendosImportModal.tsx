'use client'

import { useRef, useState } from 'react'
import { parseCsvDividendosAcoes, generateDividendosCsvTemplate } from '@/lib/csv-import-dividendos-acoes'
import type { DividendosImportResult } from '@/lib/csv-import-dividendos-acoes'
import { ModalPortal } from '@/components/ui/ModalPortal'
import { api } from '@/lib/api'

interface DividendosImportModalProps {
  acoes: { id: string; ticker: string; institutionName: string }[]
  onCancel: () => void
  onImport: () => void
}

type Screen = 'idle' | 'preview' | 'error' | 'importing' | 'done'

export function DividendosImportModal({ acoes, onCancel, onImport }: DividendosImportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [screen, setScreen] = useState<Screen>('idle')
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState<DividendosImportResult | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const parsed = parseCsvDividendosAcoes(text, acoes)
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
    const uniqueInstitutions = [...new Set(acoes.map(a => a.institutionName).filter(Boolean))]
    const csv = generateDividendosCsvTemplate(uniqueInstitutions)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_dividendos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function runImport() {
    if (!result) return
    setScreen('importing')

    await api.post('/api/stock-dividends/bulk', {
      dividends: result.dividends.map(d => ({
        stockTickerId: d.acaoId,
        date: d.date,
        dividendo: d.dividendo,
        jcp: d.jcp,
        outros: d.outros,
      })),
    })

    setScreen('done')
  }

  // Agrupa por ticker para o preview
  const byTicker = result
    ? result.dividends.reduce<Record<string, number>>((acc, d) => {
        acc[d.ticker] = (acc[d.ticker] ?? 0) + 1
        return acc
      }, {})
    : {}

  const isLocked = screen === 'importing'

  return (
    <ModalPortal>
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
                Importar Dividendos via CSV
              </span>
            </div>
            {!isLocked && (
              <button onClick={onCancel} className="flex h-7 w-7 items-center justify-center rounded-md" style={{ color: 'var(--text-muted)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* IDLE */}
            {screen === 'idle' && (
              <>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Um arquivo <strong style={{ color: 'var(--text-primary)' }}>.csv</strong> permite importar o histórico de dividendos de várias ações de uma só vez.
                  Os dividendos importados são <strong style={{ color: 'var(--text-primary)' }}>adicionados</strong> aos existentes, sem apagar registros anteriores.
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
                        { col: 'ticker',     desc: 'Código do ativo (deve estar na carteira)',          req: true  },
                        { col: 'instituicao', desc: 'Corretora ou banco (ex: Clear Corretora)',         req: true  },
                        { col: 'data',       desc: 'Data do pagamento (yyyy-mm-dd ou dd/mm/yyyy)',      req: true  },
                        { col: 'dividendo',  desc: 'Valor do dividendo em R$',                          req: true  },
                        { col: 'jcp',        desc: 'Juros sobre Capital Próprio em R$',                 req: false },
                        { col: 'outros',     desc: 'Outros proventos em R$',                            req: false },
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

            {/* PREVIEW */}
            {screen === 'preview' && result && (
              <>
                <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand-border)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Arquivo válido — pronto para importar
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{result.dividends.length}</strong> dividendo{result.dividends.length !== 1 ? 's' : ''} encontrado{result.dividends.length !== 1 ? 's' : ''}
                  </div>
                  {Object.entries(byTicker).map(([ticker, count]) => (
                    <div key={ticker} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      · {ticker}: {count} registro{count !== 1 ? 's' : ''}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
                  <button className="btn-brand text-sm" onClick={runImport}>Iniciar importação</button>
                </div>
              </>
            )}

            {/* ERROR */}
            {screen === 'error' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
                  <button className="btn-brand text-sm" onClick={() => { setScreen('idle'); setErrors([]) }}>Tentar novamente</button>
                </div>
              </>
            )}

            {/* IMPORTING */}
            {screen === 'importing' && result && (
              <div className="py-6 flex flex-col items-center gap-4 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Importando {result.dividends.length} dividendo{result.dividends.length !== 1 ? 's' : ''}…
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Registrando dividendos…
                </p>
              </div>
            )}

            {/* DONE */}
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
                    Os dividendos já estão disponíveis na carteira.
                  </div>
                </div>
                <button className="btn-brand" onClick={onImport}>Concluído</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
