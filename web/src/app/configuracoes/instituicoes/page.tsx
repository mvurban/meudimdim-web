'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { getInstitutions, setInstitutions, getAcoes } from '@/lib/mock-store'
import { mockProducts } from '@/lib/mock-data'
import type { Institution } from '@/types'

export default function InstituicoesConfigPage() {
  const { data: session } = useSession()
  const [items, setItemsState] = useState<Institution[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [removeModal, setRemoveModal] = useState<{ id: string; name: string; usageCount: number } | null>(null)

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (email) setItemsState(getInstitutions(email))
  }, [email])

  function setItems(updater: Institution[] | ((prev: Institution[]) => Institution[])) {
    setItemsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (email) setInstitutions(email, next)
      return next
    })
  }

  function startAdd() {
    setEditing(null)
    setName('')
    setAdding(true)
  }

  function startEdit(item: Institution) {
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
      const newItem: Institution = { id: `i${Date.now()}`, name: name.trim() }
      setItems(prev => [...prev, newItem])
    } else if (editing) {
      setItems(prev => prev.map(i => i.id === editing ? { ...i, name: name.trim() } : i))
    }
    cancel()
  }

  function requestRemove(item: Institution) {
    const productsCount = mockProducts.filter(p => p.institutionId === item.id).length
    const acoesCount = email ? getAcoes(email).filter(a => a.institutionId === item.id).length : 0
    setRemoveModal({ id: item.id, name: item.name, usageCount: productsCount + acoesCount })
  }

  function confirmRemove() {
    if (!removeModal) return
    setItems(prev => prev.filter(i => i.id !== removeModal.id))
    setRemoveModal(null)
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Instituições</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as instituições financeiras</p>
        </div>
        <button onClick={startAdd} style={btnStyle('#22c55e')}>+ Adicionar</button>
      </div>

      {(adding || editing) && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {adding ? 'Nova Instituição' : 'Editar Instituição'}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={labelStyle}>Nome</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: XP Investimentos"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && save()}
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
                <td style={tdStyle}>{item.name}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button onClick={() => startEdit(item)} style={actionBtn} title="Editar">
                    <IconEdit />
                  </button>
                  <button onClick={() => requestRemove(item)} style={{ ...actionBtn, color: 'var(--danger)' }} title="Excluir">
                    <IconTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {removeModal && createPortal(
        <div style={overlayStyle} onClick={() => setRemoveModal(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconTrashLg />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Remover instituição</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{removeModal.name}</p>
              </div>
            </div>

            {removeModal.usageCount > 0 ? (
              <>
                <div style={{ padding: '12px 14px', borderRadius: 8, marginBottom: 20, background: '#ef444415', border: '1px solid #ef444430' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#f87171', lineHeight: 1.5 }}>
                    Esta instituição está associada a <strong>{removeModal.usageCount} registro{removeModal.usageCount > 1 ? 's' : ''}</strong> (produtos ou ações).
                    Remova ou reclassifique {removeModal.usageCount > 1 ? 'esses registros' : 'esse registro'} antes de excluir esta instituição.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setRemoveModal(null)} style={btnStyle('#22c55e')}>Entendi</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Essa ação é permanente e não pode ser desfeita.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setRemoveModal(null)} style={btnStyle('var(--bg-elevated)')}>Cancelar</button>
                  <button onClick={confirmRemove} style={btnStyle('#ef4444')}>Remover</button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </AppShell>
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
  width: 420,
  maxWidth: 'calc(100vw - 32px)',
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
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 6,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted)',
  padding: 0,
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrashLg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
