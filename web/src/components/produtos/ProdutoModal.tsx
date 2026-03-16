'use client'

import { useState, useEffect } from 'react'
import type { Product, ProductEntry, Category, AssetClass, Institution } from '@/types'
import { MONTHS } from '@/lib/utils'

export interface ProdutoFormData {
  name: string
  categoryId: string
  assetClassId: string
  institutionId: string
  details: string
  contribution: number
  withdrawal: number
  valueBrl: number
  valueUsd: number
  returnPct: number
  income: number
}

interface ProdutoModalProps {
  mode: 'create' | 'edit'
  product?: Product
  entry?: ProductEntry
  selectedMonth: number
  selectedYear: number
  categories: Category[]
  assetClasses: AssetClass[]
  institutions: Institution[]
  onCancel: () => void
  onSubmit: (data: ProdutoFormData) => void
}

const EMPTY_FORM: ProdutoFormData = {
  name: '',
  categoryId: '',
  assetClassId: '',
  institutionId: '',
  details: '',
  contribution: 0,
  withdrawal: 0,
  valueBrl: 0,
  valueUsd: 0,
  returnPct: 0,
  income: 0,
}

export function ProdutoModal({
  mode,
  product,
  entry,
  selectedMonth,
  selectedYear,
  categories,
  assetClasses,
  institutions,
  onCancel,
  onSubmit,
}: ProdutoModalProps) {
  const [form, setForm] = useState<ProdutoFormData>(EMPTY_FORM)

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name:         product.name,
        categoryId:   product.categoryId,
        assetClassId: product.assetClassId,
        institutionId: product.institutionId,
        details:      product.details ?? '',
        contribution: entry?.contribution ?? 0,
        withdrawal:   entry?.withdrawal  ?? 0,
        valueBrl:     entry?.valueBrl    ?? 0,
        valueUsd:     entry?.valueUsd    ?? 0,
        returnPct:    entry?.returnPct   ?? 0,
        income:       entry?.income      ?? 0,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [mode, product, entry])

  const filteredClasses = assetClasses.filter(ac => ac.categoryId === form.categoryId)

  function set<K extends keyof ProdutoFormData>(key: K, value: ProdutoFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleCategoryChange(val: string) {
    setForm(prev => ({ ...prev, categoryId: val, assetClassId: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  const monthLabel = `${MONTHS[selectedMonth - 1]}/${selectedYear}`

  const inputStyle: React.CSSProperties = { }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        style={{ padding: '1.5rem' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {mode === 'create' ? 'Novo Produto' : 'Editar Produto'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {mode === 'create' ? `Será adicionado em ${monthLabel}` : `Editando entrada de ${monthLabel}`}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Nome
              </label>
              <input
                className="input"
                style={inputStyle}
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ex: CDB XP 110% CDI"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Categoria
              </label>
              <select
                className="input"
                required
                value={form.categoryId}
                onChange={e => handleCategoryChange(e.target.value)}
              >
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategoria (Classe) */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Subcategoria
              </label>
              <select
                className="input"
                required
                value={form.assetClassId}
                onChange={e => set('assetClassId', e.target.value)}
                disabled={!form.categoryId}
              >
                <option value="">Selecione...</option>
                {filteredClasses.map(ac => (
                  <option key={ac.id} value={ac.id}>{ac.name}</option>
                ))}
              </select>
            </div>

            {/* Instituição */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Instituição
              </label>
              <select
                className="input"
                required
                value={form.institutionId}
                onChange={e => set('institutionId', e.target.value)}
              >
                <option value="">Selecione...</option>
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>

            {/* Detalhes (full width) */}
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Detalhes
              </label>
              <input
                className="input"
                value={form.details}
                onChange={e => set('details', e.target.value)}
                placeholder="Ex: IPCA +5,6% · 05/2025"
              />
            </div>

            {/* Aporte */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Aporte R$
              </label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.contribution}
                onChange={e => set('contribution', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Retirada */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Retirada R$
              </label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.withdrawal}
                onChange={e => set('withdrawal', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Total BRL */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Total BRL R$
              </label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.valueBrl}
                onChange={e => set('valueBrl', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Total USD */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Total USD $
              </label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.valueUsd}
                onChange={e => set('valueUsd', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Rentabilidade */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Rentabilidade %
              </label>
              <input
                type="number"
                className="input"
                step={0.01}
                value={form.returnPct}
                onChange={e => set('returnPct', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Ganhos */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Ganhos R$
              </label>
              <input
                type="number"
                className="input"
                step={0.01}
                value={form.income}
                onChange={e => set('income', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-brand">
              {mode === 'create' ? 'Adicionar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
