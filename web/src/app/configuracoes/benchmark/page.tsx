'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { getBenchmarks, setBenchmarks } from '@/lib/mock-store'
import type { BenchmarkEntry } from '@/types'

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function fmtPct(v: number): string {
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'
}

type EditingCell = { id: string; field: keyof Pick<BenchmarkEntry, 'cdi' | 'ipca' | 'poupanca' | 'ibovespa'> }

export default function BenchmarkPage() {
  const { data: session } = useSession()
  const [items, setItemsState] = useState<BenchmarkEntry[]>([])
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditingCell | null>(null)
  const [editValue, setEditValue] = useState('')

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (email) {
      const data = getBenchmarks(email)
      // sort newest first for display
      setItemsState([...data].sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month))
    }
  }, [email])

  function save(updated: BenchmarkEntry[]) {
    setItemsState([...updated].sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month))
    if (email) setBenchmarks(email, updated)
  }

  async function handleSync() {
    setSyncing(true)
    setSyncError(null)
    try {
      const res = await fetch('/api/benchmarks/sync')
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const synced: BenchmarkEntry[] = await res.json()

      // Merge: synced data takes precedence, preserving any months not returned
      setItemsState(prev => {
        const map = new Map(prev.map(b => [`${b.year}-${b.month}`, b]))
        for (const entry of synced) {
          map.set(`${entry.year}-${entry.month}`, entry)
        }
        const merged = Array.from(map.values())
        if (email) setBenchmarks(email, merged)
        return [...merged].sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month)
      })
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Erro ao sincronizar')
    } finally {
      setSyncing(false)
    }
  }

  function startEdit(id: string, field: EditingCell['field'], current: number) {
    setEditing({ id, field })
    setEditValue(current.toFixed(2))
  }

  function commitEdit() {
    if (!editing) return
    const val = parseFloat(editValue)
    if (isNaN(val)) { setEditing(null); return }
    setItemsState(prev => {
      const updated = prev.map(b =>
        b.id === editing.id ? { ...b, [editing.field]: val } : b
      )
      if (email) setBenchmarks(email, updated)
      return updated
    })
    setEditing(null)
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Benchmark</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Histórico mensal de CDI, IPCA, Poupança e Ibovespa. Clique em qualquer valor para editar.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={syncBtnStyle(syncing)}
          >
            {syncing ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
                Sincronizando…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Sincronizar
              </>
            )}
          </button>
          {syncError && (
            <span style={{ fontSize: 11, color: 'var(--danger)' }}>{syncError}</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        {items.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Nenhum dado. Clique em <strong>Sincronizar</strong> para buscar automaticamente.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Mês/Ano</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>CDI</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>IPCA</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Poupança</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Ibovespa</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 500 }}>{MONTHS_SHORT[item.month - 1]}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>{item.year}</span>
                  </td>
                  {(['cdi', 'ipca', 'poupanca', 'ibovespa'] as const).map(field => {
                    const isEditing = editing?.id === item.id && editing?.field === field
                    const val = item[field]
                    return (
                      <td key={field} style={{ ...tdStyle, textAlign: 'right' }}>
                        {isEditing ? (
                          <input
                            autoFocus
                            type="number"
                            step="0.01"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(null) }}
                            style={editInputStyle}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(item.id, field, val)}
                            style={{
                              ...valueBtnStyle,
                              color: val > 0 ? 'var(--success)' : val < 0 ? 'var(--danger)' : 'var(--text-muted)',
                            }}
                          >
                            {fmtPct(val)}
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 20,
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  padding: '0 12px 10px 0',
}

const tdStyle: React.CSSProperties = {
  fontSize: 13.5,
  color: 'var(--text-primary)',
  padding: '8px 12px 8px 0',
}

const valueBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13.5,
  fontWeight: 500,
  padding: '2px 6px',
  borderRadius: 4,
  fontVariantNumeric: 'tabular-nums',
}

const editInputStyle: React.CSSProperties = {
  width: 80,
  padding: '3px 6px',
  borderRadius: 6,
  border: '1px solid var(--brand)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
  textAlign: 'right',
}

function syncBtnStyle(loading: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: loading ? 'var(--bg-elevated)' : '#22c55e',
    color: loading ? 'var(--text-muted)' : '#0d1117',
    fontSize: 13,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
  }
}
