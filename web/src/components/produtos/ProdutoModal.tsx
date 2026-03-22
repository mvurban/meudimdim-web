'use client'

import { useState, useEffect } from 'react'
import type { Product, ProductEntry, Category, AssetClass, Institution, Region, LiquidityOption } from '@/types'
import { MONTHS } from '@/lib/utils'
import { ModalPortal } from '@/components/ui/ModalPortal'

export interface ProdutoFormData {
  name: string
  cnpj: string
  categoryId: string
  assetClassId: string
  institutionId: string
  regionId: string
  liquidityId: string
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
  liquidityOptions: LiquidityOption[]
  onCancel: () => void
  onSubmit: (data: ProdutoFormData) => void
  onDividend?: () => void
}

const EMPTY_FORM: ProdutoFormData = {
  name: '',
  cnpj: '',
  categoryId: '',
  assetClassId: '',
  institutionId: '',
  regionId: '',
  liquidityId: '',
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
  liquidityOptions,
  onCancel,
  onSubmit,
  onDividend,
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
        liquidityId:   product.liquidityId ?? '',
        details:       product.details ?? '',
        contribution:  entry?.contribution ?? 0,
        withdrawal:    entry?.withdrawal   ?? 0,
        valueUsd:      entry?.valueUsd     ?? 0,
        valueBrl:      entry?.valueBrl     ?? 0,
      })
    } else {
      const defaultRegion = regions.find(r => r.isDefault) ?? regions[0]
      setForm({ ...EMPTY_FORM, regionId: defaultRegion?.id ?? '', liquidityId: liquidityOptions[0]?.id ?? '' })
    }
  }, [mode, product, entry, regions, liquidityOptions])

  const isAggregated = mode === 'edit' && (product?.isAggregated ?? false)
  const filteredClasses = assetClasses.filter(ac => ac.categoryId === form.categoryId)
  const selectedClassIsAcao = !isAggregated && (assetClasses.find(ac => ac.id === form.assetClassId)?.isAcao ?? false)

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
    <ModalPortal>
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

          {/* Aviso produto agregado */}
          {isAggregated && (
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: '#f59e0b15', border: '1px solid #f59e0b40',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ margin: 0, fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}>
                Este produto é gerenciado automaticamente pela área{' '}
                <a href="/acoes" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'underline' }}>Ações/FIIs</a>.
                {' '}Nome, categoria, subcategoria, instituição e valores totais são sobrescritos a cada atualização de cotações.
              </p>
            </div>
          )}

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
                disabled={isAggregated}
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
                disabled={isAggregated}
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
                disabled={isAggregated || !form.categoryId}
              >
                <option value="">Selecione...</option>
                {filteredClasses.map(ac => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
              </select>
              {selectedClassIsAcao && (
                <div style={{
                  marginTop: 8, padding: '10px 12px', borderRadius: 8,
                  background: '#f59e0b15', border: '1px solid #f59e0b40',
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}>
                    Esta classe é gerenciada automaticamente pela área{' '}
                    <a href="/acoes" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'underline' }}>Ações/FIIs</a>.
                    Cadastre seus ativos lá para que os valores sejam calculados corretamente.
                  </p>
                </div>
              )}
            </div>

            {/* Instituição */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Instituição</label>
              <select
                className="input"
                required
                value={form.institutionId}
                onChange={e => set('institutionId', e.target.value)}
                disabled={isAggregated}
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

            {/* Liquidez */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Liquidez</label>
              <select
                className="input"
                value={form.liquidityId}
                onChange={e => set('liquidityId', e.target.value)}
              >
                <option value="">Selecione...</option>
                {liquidityOptions.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
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
                disabled={isAggregated}
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
                disabled={isAggregated}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {mode === 'edit' && onDividend && (
                <button
                  type="button"
                  className="btn-ghost flex items-center gap-2"
                  onClick={onDividend}
                  style={{ color: 'var(--success)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Dividendos
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
              <button type="submit" className="btn-brand">
                {mode === 'create' ? 'Adicionar' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
