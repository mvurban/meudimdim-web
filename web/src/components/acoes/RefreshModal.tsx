'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { api } from '@/lib/api'

interface AcaoItem {
  id: string
  ticker: string
  precoMedio: number
  precoFechamento: number
  precoAtual: number
}

interface RefreshResult {
  id: string
  ticker: string
  precoFechamento: number
  precoAtual: number
}

interface RefreshModalProps {
  acoes: AcaoItem[]
  onDone: (updated: RefreshResult[]) => void
  onClose: () => void
  summary?: { tickers: number; products: number } | null
}

export function RefreshModal({ acoes, onDone, onClose, summary }: RefreshModalProps) {
  const [results, setResults] = useState<RefreshResult[]>([])
  const [failed, setFailed] = useState<{ id: string; ticker: string }[]>([])
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const running = useRef(false)
  const fakeTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running.current || acoes.length === 0) return
    running.current = true

    // Barra fake: avança até 85% em ~8s, desacelerando conforme se aproxima
    fakeTimer.current = setInterval(() => {
      setProgress(p => {
        if (p >= 85) { clearInterval(fakeTimer.current!); return p }
        const step = Math.max(0.5, (85 - p) * 0.06)
        return Math.min(85, p + step)
      })
    }, 200)

    async function run() {
      try {
        const { results: fetched, failed: errors } = await api.post<{
          results: RefreshResult[]
          failed: { id: string; ticker: string }[]
        }>('/api/acoes/fetch-quotes', {
          tickers: acoes.map(a => ({ id: a.id, ticker: a.ticker })),
        })
        setResults(fetched)
        setFailed(errors)
        onDone(fetched)
      } catch {
        setFailed(acoes.map(a => ({ id: a.id, ticker: a.ticker })))
        onDone([])
      } finally {
        clearInterval(fakeTimer.current!)
        setProgress(100)
        setDone(true)
      }
    }

    run()

    return () => { clearInterval(fakeTimer.current!) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const readyToClose = done && summary != null
  const hasErrors = failed.length > 0

  return createPortal(
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: readyToClose
              ? hasErrors ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.15)'
              : 'rgba(59,130,246,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {readyToClose ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={hasErrors ? '#f59e0b' : '#22c55e'}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            )}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {readyToClose ? 'Atualização concluída' : 'Atualizando cotações'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              {readyToClose
                ? hasErrors ? 'Concluído com alguns erros' : 'Carteira sincronizada com sucesso'
                : 'Buscando preços via Yahoo Finance...'}
            </p>
          </div>
        </div>

        {/* Barra de progresso — visível até readyToClose */}
        {!readyToClose && (
          <div style={{ padding: '8px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {!done
                  ? (progress === 0 ? 'Iniciando...' : `Buscando ${acoes.length} tickers...`)
                  : 'Salvando dados...'}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: 3,
                background: '#3b82f6',
                width: `${progress}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        {/* Resumo pós-conclusão */}
        {readyToClose && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <div style={{
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                ✓ Cotações atualizadas com sucesso
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>
                {summary.tickers}
              </span>
            </div>

            {hasErrors && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    ✗ Itens não encontrados
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>
                    {failed.length}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#f87171', lineHeight: 1.5 }}>
                  {failed.map(f => f.ticker).join(', ')}
                </p>
              </div>
            )}

            {/* Tickers atualizados */}
            {results.length > 0 && (
              <div style={{
                maxHeight: 160, overflowY: 'auto',
                background: 'var(--bg-elevated)', borderRadius: 8, padding: '4px 0',
              }}>
                {results.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 12px', fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.5px' }}>{r.ticker}</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      R$ {r.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {!done && (
            <button onClick={onClose} style={ghostBtn}>Cancelar</button>
          )}
          {readyToClose && (
            <button onClick={onClose} style={brandBtn}>Fechar</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 50,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const modalStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 24,
  width: 440,
  maxWidth: 'calc(100vw - 32px)',
}

const brandBtn: React.CSSProperties = {
  padding: '8px 20px', borderRadius: 8, border: 'none',
  background: '#22c55e', color: '#0d1117',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: 'none',
  background: 'var(--bg-elevated)', color: 'var(--text-primary)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
}
