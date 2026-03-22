'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mockPrecos } from '@/lib/mock-store'
import type { AcaoItem } from '@/lib/mock-store'

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

const DELAY_PER_TICKER = 180 // ms
const FAKE_ERROR_RATE = 0.18 // ~18% de chance de falha por ticker

export function RefreshModal({ acoes, onDone, onClose, summary }: RefreshModalProps) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [results, setResults] = useState<RefreshResult[]>([])
  const [failed, setFailed] = useState<{ id: string; ticker: string }[]>([])
  const [done, setDone] = useState(false)
  const running = useRef(false)

  useEffect(() => {
    if (running.current || acoes.length === 0) return
    running.current = true

    const collected: RefreshResult[] = []
    const errors: { id: string; ticker: string }[] = []

    async function run() {
      for (let i = 0; i < acoes.length; i++) {
        const acao = acoes[i]
        setCurrentIndex(i)

        await new Promise(r => setTimeout(r, DELAY_PER_TICKER))

        // Simula falha para alguns tickers
        if (Math.random() < FAKE_ERROR_RATE) {
          errors.push({ id: acao.id, ticker: acao.ticker })
          setFailed([...errors])
          continue
        }

        const seed = Math.random()
        const { precoFechamento, precoAtual } = mockPrecos(acao.precoFechamento || acao.precoMedio, seed)
        collected.push({ id: acao.id, ticker: acao.ticker, precoFechamento, precoAtual })
        setResults([...collected])
      }

      setCurrentIndex(acoes.length)
      setDone(true)
      onDone(collected)
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = acoes.length === 0 ? 100 : Math.round((Math.max(0, currentIndex) / acoes.length) * 100)
  const currentTicker = currentIndex >= 0 && currentIndex < acoes.length ? acoes[currentIndex].ticker : null
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

        {/* Progress bar */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 99, height: 6, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: 99,
            background: readyToClose
              ? hasErrors ? '#f59e0b' : '#22c55e'
              : '#3b82f6',
            width: `${progress}%`,
            transition: 'width 0.2s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {done
              ? `${acoes.length} tickers processados`
              : currentTicker ? `Buscando ${currentTicker}...` : 'Iniciando...'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progress}%</span>
        </div>

        {/* Resumo pós-conclusão */}
        {readyToClose && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {/* Sucesso */}
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

            {/* Erros */}
            {hasErrors && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: failed.length > 0 ? 6 : 0 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    ✗ Itens não atualizados
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
          </div>
        )}

        {/* Lista de tickers em processamento */}
        {results.length > 0 && !readyToClose && (
          <div style={{
            maxHeight: 160,
            overflowY: 'auto',
            background: 'var(--bg-elevated)',
            borderRadius: 8,
            padding: '4px 0',
            marginBottom: 16,
          }}>
            {[...results].reverse().map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 12px', fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.5px' }}>{r.ticker}</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  R$ {r.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Aguardando salvamento */}
        {done && !readyToClose && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center' }}>
            Salvando dados...
          </p>
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
