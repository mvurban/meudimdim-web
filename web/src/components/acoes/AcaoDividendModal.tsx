'use client'

import { useState } from 'react'
import type { StockDividend } from '@/types'
import { ModalPortal } from '@/components/ui/ModalPortal'

interface AcaoDividendModalProps {
  acaoId: string
  ticker: string
  dividends: StockDividend[]
  onClose: () => void
  onSave: (updated: StockDividend[]) => void
}

type FormState = { day: number; month: number; year: number; dividendo: string; jcp: string; outros: string }

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const PAGE_SIZE = 10

export function AcaoDividendModal({ acaoId, ticker, dividends, onClose, onSave }: AcaoDividendModalProps) {
  const today = new Date()
  const [form, setForm] = useState<FormState>({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    dividendo: '',
    jcp: '',
    outros: '',
  })
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(dividends.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = dividends.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalGeral = dividends.reduce((acc, d) => acc + d.dividendo + d.jcp + d.outros, 0)

  function addRecord() {
    const dividendo = parseFloat(form.dividendo) || 0
    const jcp = parseFloat(form.jcp) || 0
    const outros = parseFloat(form.outros) || 0
    if (dividendo === 0 && jcp === 0 && outros === 0) return

    const dd = String(Math.max(1, Math.min(31, form.day))).padStart(2, '0')
    const mm = String(Math.max(1, Math.min(12, form.month))).padStart(2, '0')
    const newRecord: StockDividend = {
      id: `sd_${Date.now()}`,
      acaoId,
      date: `${form.year}-${mm}-${dd}`,
      dividendo,
      jcp,
      outros,
    }
    const next = [newRecord, ...dividends]
    onSave(next)
    setPage(1)
    setForm(f => ({ ...f, dividendo: '', jcp: '', outros: '' }))
  }

  function removeRecord(id: string) {
    const next = dividends.filter(d => d.id !== id)
    onSave(next)
    const newTotalPages = Math.max(1, Math.ceil(next.length / PAGE_SIZE))
    if (currentPage > newTotalPages) setPage(newTotalPages)
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div
          className="card w-full max-w-2xl animate-fade-in"
          style={{ padding: '1.5rem', maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Dividendos — {ticker}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Proventos recebidos por esta ação
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Dividendo</th>
                  <th style={thStyle}>JCP</th>
                  <th style={thStyle}>Outros</th>
                  <th style={thStyle}>Total</th>
                  <th style={{ ...thStyle, width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {dividends.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '20px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
                {paginated.map(d => {
                  const rowTotal = d.dividendo + d.jcp + d.outros
                  const [y, m, day] = d.date.split('-')
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{`${day}/${m}/${y}`}</td>
                      <td style={tdStyle}>{d.dividendo > 0 ? `R$ ${fmt(d.dividendo)}` : '—'}</td>
                      <td style={tdStyle}>{d.jcp > 0 ? `R$ ${fmt(d.jcp)}` : '—'}</td>
                      <td style={tdStyle}>{d.outros > 0 ? `R$ ${fmt(d.outros)}` : '—'}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--success)' }}>R$ {fmt(rowTotal)}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', padding: '8px 8px' }}>
                        <button onClick={() => removeRecord(d.id)} style={trashBtn} title="Remover">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-3" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{dividends.length} registro{dividends.length !== 1 ? 's' : ''} — página {currentPage} de {totalPages}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ ...pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
                >‹</button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ ...pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
                >›</button>
              </div>
            </div>
          )}

          {/* Add form */}
          <div
            className="flex gap-2 items-end flex-wrap"
            style={{ padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16 }}
          >
            <div style={{ width: 56 }}>
              <label style={labelStyle}>Dia</label>
              <input type="number" min={1} max={31} value={form.day}
                onChange={e => setForm(f => ({ ...f, day: parseInt(e.target.value) || 1 }))}
                style={inputStyle} />
            </div>
            <div style={{ width: 56 }}>
              <label style={labelStyle}>Mês</label>
              <input type="number" min={1} max={12} value={form.month}
                onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) || 1 }))}
                style={inputStyle} />
            </div>
            <div style={{ width: 72 }}>
              <label style={labelStyle}>Ano</label>
              <input type="number" min={2000} value={form.year}
                onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || today.getFullYear() }))}
                style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <label style={labelStyle}>Dividendo R$</label>
              <input type="number" min={0} step="0.01" value={form.dividendo} placeholder="0,00"
                onChange={e => setForm(f => ({ ...f, dividendo: e.target.value }))}
                style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <label style={labelStyle}>JCP R$</label>
              <input type="number" min={0} step="0.01" value={form.jcp} placeholder="0,00"
                onChange={e => setForm(f => ({ ...f, jcp: e.target.value }))}
                style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <label style={labelStyle}>Outros R$</label>
              <input type="number" min={0} step="0.01" value={form.outros} placeholder="0,00"
                onChange={e => setForm(f => ({ ...f, outros: e.target.value }))}
                style={inputStyle} />
            </div>
            <button onClick={addRecord} className="btn-brand" style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
              + Adicionar
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Total recebido:&nbsp;
              <span style={{ color: totalGeral > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                R$ {fmt(totalGeral)}
              </span>
            </span>
            <button className="btn-ghost" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  padding: '10px 16px',
}

const tdStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-primary)',
  padding: '10px 16px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 5,
  letterSpacing: '0.5px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

const pageBtn: React.CSSProperties = {
  padding: '2px 10px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: 14,
  cursor: 'pointer',
}

const trashBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  borderRadius: 6,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--danger)',
  padding: 0,
}
