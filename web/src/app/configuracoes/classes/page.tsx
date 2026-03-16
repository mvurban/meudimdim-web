'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { mockAssetClasses, mockCategories } from '@/lib/mock-data'
import type { AssetClass, Category } from '@/types'

type FormState = { name: string; categoryId: string }
const EMPTY: FormState = { name: '', categoryId: '' }

export default function ClassesPage() {
  const [items, setItems] = useState<AssetClass[]>(mockAssetClasses)
  const [categories] = useState<Category[]>(mockCategories)
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)

  function getCategoryName(id: string) {
    return categories.find(c => c.id === id)?.name ?? '—'
  }

  function getCategoryColor(id: string) {
    return categories.find(c => c.id === id)?.color ?? '#666'
  }

  function startAdd() {
    setEditing(null)
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? '' })
    setAdding(true)
  }

  function startEdit(item: AssetClass) {
    setAdding(false)
    setForm({ name: item.name, categoryId: item.categoryId })
    setEditing(item.id)
  }

  function cancel() {
    setAdding(false)
    setEditing(null)
    setForm(EMPTY)
  }

  function save() {
    if (!form.name.trim() || !form.categoryId) return
    if (adding) {
      const newItem: AssetClass = {
        id: `ac${Date.now()}`,
        name: form.name.trim(),
        categoryId: form.categoryId,
      }
      setItems(prev => [...prev, newItem])
    } else if (editing) {
      setItems(prev => prev.map(c => c.id === editing ? { ...c, name: form.name.trim(), categoryId: form.categoryId } : c))
    }
    cancel()
  }

  function remove(id: string) {
    setItems(prev => prev.filter(c => c.id !== id))
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Classes de Ativo</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as classes de ativos por categoria</p>
        </div>
        <button onClick={startAdd} style={btnStyle('#22c55e')}>+ Adicionar</button>
      </div>

      {(adding || editing) && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {adding ? 'Nova Classe' : 'Editar Classe'}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={labelStyle}>Nome</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Pós-fixado"
                style={inputStyle}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label style={labelStyle}>Categoria</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
              <th style={thStyle}>Categoria</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '3px 10px', borderRadius: 20, fontSize: 12,
                    background: `${getCategoryColor(item.categoryId)}22`,
                    color: getCategoryColor(item.categoryId),
                    fontWeight: 500,
                  }}>
                    {getCategoryName(item.categoryId)}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button onClick={() => startEdit(item)} style={actionBtn}>Editar</button>
                  <button onClick={() => remove(item.id)} style={{ ...actionBtn, color: 'var(--danger)' }}>Excluir</button>
                </td>
              </tr>
            ))}
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
