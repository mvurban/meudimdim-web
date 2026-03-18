'use client'

import { useState } from 'react'
import type { Dividend } from '@/types'
import { formatBRL } from '@/lib/utils'
import { MONTHS } from '@/lib/utils'
import { ModalPortal } from '@/components/ui/ModalPortal'

interface DividendModalProps {
  productId: string
  productName: string
  month: number
  year: number
  dividends: Dividend[]
  onClose: () => void
  onSave: (updated: Dividend[]) => void
}

type FormState = { day: number; dividendo: string; jcp: string; outros: string }

export function DividendModal({
  productId,
  productName,
  month,
  year,
  dividends,
  onClose,
  onSave,
}: DividendModalProps) {
  const today = new Date()
  const [form, setForm] = useState<FormState>({
    day: today.getDate(),
    dividendo: '',
    jcp: '',
    outros: '',
  })

  const totalDoMes = dividends.reduce(
    (acc, d) => acc + d.dividendo + d.jcp + d.outros,
    0,
  )

  function addRecord() {
    const dividendo = parseFloat(form.dividendo) || 0
    const jcp = parseFloat(form.jcp) || 0
    const outros = parseFloat(form.outros) || 0
    if (dividendo === 0 && jcp === 0 && outros === 0) return

    const mm = String(month).padStart(2, '0')
    const dd = String(Math.max(1, Math.min(31, form.day))).padStart(2, '0')
    const newRecord: Dividend = {
      id: `d_${Date.now()}`,
      productId,
      date: `${year}-${mm}-${dd}`,
      dividendo,
      jcp,
      outros,
    }
    const updated = [...dividends, newRecord]
    onSave(updated)
    setForm({ day: today.getDate(), dividendo: '', jcp: '', outros: '' })
  }

  function removeRecord(id: string) {
    onSave(dividends.filter(d => d.id !== id))
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
        style={{ padding: '1.5rem' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Dividendos — {productName}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {MONTHS[month - 1]}/{year}
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
                <th style={thStyle}>Dia</th>
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
                    Nenhum registro neste mês.
                  </td>
                </tr>
              )}
              {dividends.map(d => {
                const rowTotal = d.dividendo + d.jcp + d.outros
                const day = d.date.slice(8, 10)
                return (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>{day}</td>
                    <td style={tdStyle}>{d.dividendo > 0 ? formatBRL(d.dividendo) : '—'}</td>
                    <td style={tdStyle}>{d.jcp > 0 ? formatBRL(d.jcp) : '—'}</td>
                    <td style={tdStyle}>{d.outros > 0 ? formatBRL(d.outros) : '—'}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--success)' }}>{formatBRL(rowTotal)}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', padding: '8px 8px' }}>
                      <button
                        onClick={() => removeRecord(d.id)}
                        style={trashBtn}
                        title="Remover"
                      >
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

        {/* Add form */}
        <div
          className="flex gap-2 items-end flex-wrap"
          style={{ padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16 }}
        >
          <div style={{ width: 64 }}>
            <label style={labelStyle}>Dia</label>
            <input
              type="number"
              min={1}
              max={31}
              value={form.day}
              onChange={e => setForm(f => ({ ...f, day: parseInt(e.target.value) || 1 }))}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label style={labelStyle}>Dividendo R$</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.dividendo}
              onChange={e => setForm(f => ({ ...f, dividendo: e.target.value }))}
              placeholder="0,00"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label style={labelStyle}>JCP R$</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.jcp}
              onChange={e => setForm(f => ({ ...f, jcp: e.target.value }))}
              placeholder="0,00"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label style={labelStyle}>Outros R$</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.outros}
              onChange={e => setForm(f => ({ ...f, outros: e.target.value }))}
              placeholder="0,00"
              style={inputStyle}
            />
          </div>
          <button
            onClick={addRecord}
            className="btn-brand"
            style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}
          >
            + Adicionar
          </button>
        </div>

        {/* Footer: total + fechar */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            Total do mês:&nbsp;
            <span style={{ color: totalDoMes > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
              {formatBRL(totalDoMes)}
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
