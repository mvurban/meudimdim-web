'use client'

import { useState, useEffect } from 'react'
import type { Product, ProductEntry, Category, AssetClass, Institution, Region } from '@/types'
import { MONTHS } from '@/lib/utils'

export interface ProdutoFormData {
  name: string
  cnpj: string
  categoryId: string
  assetClassId: string
  institutionId: string
  regionId: string
  details: string
  contribution: number
  withdrawal: number
  valueUsd: number
  valueBrl: number
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
  regions: Region[]
  onCancel: () => void
  onSubmit: (data: ProdutoFormData) => void
}

const EMPTY_FORM: ProdutoFormData = {
  name: '',
  cnpj: '',
  categoryId: '',
  assetClassId: '',
  institutionId: '',
  regionId: '',
  details: '',
  contribution: 0,
  withdrawal: 0,
  valueUsd: 0,
  valueBrl: 0,
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
  regions,
  onCancel,
  onSubmit,
}: ProdutoModalProps) {
  const [form, setForm] = useState<ProdutoFormData>(EMPTY_FORM)

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name:          product.name,
        cnpj:          product.cnpj ?? '',
        categoryId:    product.categoryId,
        assetClassId:  product.assetClassId,
        institutionId: product.institutionId,
        regionId:      product.regionId ?? '',
        details:       product.details ?? '',
        contribution:  entry?.contribution ?? 0,
        withdrawal:    entry?.withdrawal   ?? 0,
        valueUsd:      entry?.valueUsd     ?? 0,
        valueBrl:      entry?.valueBrl     ?? 0,
      })
    } else {
      const defaultRegion = regions.find(r => r.isDefault) ?? regions[0]
      setForm({ ...EMPTY_FORM, regionId: defaultRegion?.id ?? '' })
    }
  }, [mode, product, entry, regions])

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        style={{ padding: '1.5rem' }}
      >
        {/* Header */}
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
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Seção 1: dados do produto ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nome</label>
              <input
                className="input"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ex: CDB XP 110% CDI"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Categoria</label>
              <select
                className="input"
                required
                value={form.categoryId}
                onChange={e => handleCategoryChange(e.target.value)}
              >
                <option value="">Selecione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Subcategoria */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Subcategoria</label>
              <select
                className="input"
                required
                value={form.assetClassId}
                onChange={e => set('assetClassId', e.target.value)}
                disabled={!form.categoryId}
              >
                <option value="">Selecione...</option>
                {filteredClasses.map(ac => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
              </select>
            </div>

            {/* Instituição */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Instituição</label>
              <select
                className="input"
                required
                value={form.institutionId}
                onChange={e => set('institutionId', e.target.value)}
              >
                <option value="">Selecione...</option>
                {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            {/* Região */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Região</label>
              <select
                className="input"
                value={form.regionId}
                onChange={e => set('regionId', e.target.value)}
              >
                <option value="">Selecione...</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            {/* CNPJ */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>CNPJ</label>
              <input
                className="input"
                value={form.cnpj}
                onChange={e => set('cnpj', e.target.value)}
                placeholder="Ex: 00.000.000/0001-00"
              />
            </div>

            {/* Detalhes */}
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Detalhes</label>
              <input
                className="input"
                value={form.details}
                onChange={e => set('details', e.target.value)}
                placeholder="Ex: IPCA +5,6% · 05/2025"
              />
            </div>
          </div>

          {/* ── Separador ── */}
          <div className="flex items-center gap-3 pt-1">
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Movimentação do mês
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* ── Seção 2: movimentação ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Aporte */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Aporte R$</label>
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
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Retirada R$</label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.withdrawal}
                onChange={e => set('withdrawal', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Total USD */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Total USD $</label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.valueUsd}
                onChange={e => set('valueUsd', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Total BRL */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Total BRL R$</label>
              <input
                type="number"
                className="input"
                min={0}
                step={0.01}
                value={form.valueBrl}
                onChange={e => set('valueBrl', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-brand">
              {mode === 'create' ? 'Adicionar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
