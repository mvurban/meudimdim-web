'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { getRegions, setRegions } from '@/lib/mock-store'
import type { Region } from '@/types'

export default function RegioesConfigPage() {
  const { data: session } = useSession()
  const [items, setItemsState] = useState<Region[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (email) setItemsState(getRegions(email))
  }, [email])

  function setItems(updater: Region[] | ((prev: Region[]) => Region[])) {
    setItemsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (email) setRegions(email, next)
      return next
    })
  }

  function startAdd() {
    setEditing(null)
    setName('')
    setAdding(true)
  }

  function startEdit(item: Region) {
    setAdding(false)
    setName(item.name)
    setEditing(item.id)
  }

  function cancel() {
    setAdding(false)
    setEditing(null)
    setName('')
  }

  function save() {
    if (!name.trim()) return
    if (adding) {
      const newItem: Region = { id: `r${Date.now()}`, name: name.trim(), isDefault: false }
      setItems(prev => [...prev, newItem])
    } else if (editing) {
      setItems(prev => prev.map(i => i.id === editing ? { ...i, name: name.trim() } : i))
    }
    cancel()
  }

  function setDefault(id: string) {
    setItems(prev => prev.map(i => ({ ...i, isDefault: i.id === id })))
  }

  function remove(id: string) {
    setItems(prev => {
      if (prev.length <= 1) return prev // always keep at least one
      const isRemovingDefault = prev.find(i => i.id === id)?.isDefault ?? false
      const remaining = prev.filter(i => i.id !== id)
      // if we removed the default, promote the first remaining
      if (isRemovingDefault) {
        return remaining.map((i, idx) => ({ ...i, isDefault: idx === 0 }))
      }
      return remaining
    })
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Regiões</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Gerencie as regiões geográficas dos produtos. A região padrão é usada quando nenhuma for especificada.
          </p>
        </div>
        <button onClick={startAdd} style={btnStyle('#22c55e')}>+ Adicionar</button>
      </div>

      {(adding || editing) && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {adding ? 'Nova Região' : 'Editar Região'}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={labelStyle}>Nome</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Brasil, EUA, Europa…"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && save()}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={btnStyle('#22c55e')}>Salvar</button>
              <button onClick={cancel} style={btnStyle('var(--bg-elevated)')}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={thStyle}>Nome</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={tdStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.name}
                    {item.isDefault && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.5px',
                        padding: '2px 8px', borderRadius: 99,
                        background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.25)',
                      }}>
                        ★ Padrão
                      </span>
                    )}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {!item.isDefault && (
                    <button
                      onClick={() => setDefault(item.id)}
                      style={{ ...actionBtn, color: 'var(--text-muted)' }}
                      title="Definir como padrão"
                    >
                      Definir padrão
                    </button>
                  )}
                  <button onClick={() => startEdit(item)} style={actionBtn}>Editar</button>
                  <button
                    onClick={() => remove(item.id)}
                    disabled={items.length <= 1}
                    style={{
                      ...actionBtn,
                      color: items.length <= 1 ? 'var(--text-muted)' : 'var(--danger)',
                      opacity: items.length <= 1 ? 0.4 : 1,
                      cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                    }}
                    title={items.length <= 1 ? 'Deve haver pelo menos uma região' : undefined}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={2} style={{ ...tdStyle, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                  Nenhuma região cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
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
  padding: '10px 12px 10px 0',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 6,
  letterSpacing: '0.5px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: 13.5,
  outline: 'none',
  boxSizing: 'border-box',
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: bg,
    color: bg === '#22c55e' ? '#0d1117' : 'var(--text-primary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  }
}

const actionBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '2px 8px',
}
