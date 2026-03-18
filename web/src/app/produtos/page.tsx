'use client'

import { useState, useMemo, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { MonthSelector } from '@/components/produtos/MonthSelector'
import { FilterBar } from '@/components/produtos/FilterBar'
import { StatCards } from '@/components/produtos/StatCards'
import { CategoryGroup } from '@/components/produtos/CategoryGroup'
import { ProdutoModal } from '@/components/produtos/ProdutoModal'
import type { ProdutoFormData } from '@/components/produtos/ProdutoModal'
import {
  mockProducts,
  mockEntries,
  mockCategories,
  mockAssetClasses,
  mockInstitutions,
} from '@/lib/mock-data'
import type { Product, ProductEntry, Category } from '@/types'
import { useYear, CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; productId: string }

export default function ProdutosPage() {
  const { selectedYear } = useYear()
  const [selectedMonth, setSelectedMonth] = useState(
    selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12
  )

  useEffect(() => {
    setSelectedMonth(selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12)
  }, [selectedYear])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [entries, setEntries] = useState<ProductEntry[]>(mockEntries)
  const [modal, setModal] = useState<ModalState>({ open: false })

  // Entries for the selected month/year
  const monthEntries = useMemo(
    () => entries.filter(e => e.month === selectedMonth && e.year === selectedYear),
    [entries, selectedMonth, selectedYear],
  )

  // Apply category and institution filters
  const filteredEntries = useMemo(() => {
    return monthEntries.filter(e => {
      const product = products.find(p => p.id === e.productId)
      if (!product) return false
      if (categoryFilter && product.categoryId !== categoryFilter) return false
      if (institutionFilter && product.institutionId !== institutionFilter) return false
      return true
    })
  }, [monthEntries, products, categoryFilter, institutionFilter])

  // Group entries by category (preserving category order from mockCategories)
  const groups = useMemo(() => {
    const map = new Map<string, { category: Category; entries: ProductEntry[] }>()
    for (const entry of filteredEntries) {
      const product = products.find(p => p.id === entry.productId)
      if (!product) continue
      const cat = mockCategories.find(c => c.id === product.categoryId)
      if (!cat) continue
      if (!map.has(product.categoryId)) {
        map.set(product.categoryId, { category: cat, entries: [] })
      }
      map.get(product.categoryId)!.entries.push(entry)
    }
    // Sort groups by category order in mockCategories
    return mockCategories
      .map(c => map.get(c.id))
      .filter((g): g is NonNullable<typeof g> => g !== undefined)
  }, [filteredEntries, products])

  // Stat totals
  const totalBrl          = filteredEntries.reduce((s, e) => s + e.valueBrl, 0)
  const totalUsd          = filteredEntries.reduce((s, e) => s + e.valueUsd, 0)
  const totalIncome       = filteredEntries.reduce((s, e) => s + e.income, 0)
  const totalContribution = filteredEntries.reduce((s, e) => s + e.contribution, 0)
  const totalWithdrawal   = filteredEntries.reduce((s, e) => s + e.withdrawal, 0)
  const avgReturn         = filteredEntries.length
    ? filteredEntries.reduce((s, e) => s + e.returnPct, 0) / filteredEntries.length
    : 0
  const exchangeRate      = filteredEntries[0]?.exchangeRate ?? 0

  // Available categories and institutions based on current month's data
  const availableCategories = useMemo(() => {
    const catIds = new Set(
      monthEntries
        .map(e => products.find(p => p.id === e.productId)?.categoryId)
        .filter(Boolean),
    )
    return mockCategories.filter(c => catIds.has(c.id))
  }, [monthEntries, products])

  const availableInstitutions = useMemo(() => {
    const instIds = new Set(
      monthEntries
        .map(e => products.find(p => p.id === e.productId)?.institutionId)
        .filter(Boolean),
    )
    return mockInstitutions.filter(i => instIds.has(i.id))
  }, [monthEntries, products])

  // Modal helpers
  const editProduct = modal.open && modal.mode === 'edit'
    ? products.find(p => p.id === modal.productId)
    : undefined
  const editEntry = editProduct
    ? entries.find(e => e.productId === editProduct.id && e.month === selectedMonth && e.year === selectedYear)
    : undefined

  function handleAdd(data: ProdutoFormData) {
    const newId = `p${Date.now()}`
    const newProduct: Product = {
      id: newId,
      name: data.name,
      categoryId: data.categoryId,
      assetClassId: data.assetClassId,
      institutionId: data.institutionId,
      region: 'Brasil',
      currency: 'BRL',
      liquidity: { value: 1, unit: 'days' },
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      details: data.details || undefined,
    }
    const newEntry: ProductEntry = {
      id: `e${Date.now()}`,
      productId: newId,
      month: selectedMonth,
      year: selectedYear,
      contribution: data.contribution,
      withdrawal: data.withdrawal,
      returnPct: data.returnPct,
      income: data.income,
      valueOriginal: data.valueBrl,
      valueBrl: data.valueBrl,
      valueUsd: data.valueUsd,
      valueFinal: data.valueBrl,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setProducts(prev => [...prev, newProduct])
    setEntries(prev => [...prev, newEntry])
    setModal({ open: false })
  }

  function handleSave(data: ProdutoFormData) {
    if (!modal.open || modal.mode !== 'edit') return
    const productId = modal.productId
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              name: data.name,
              categoryId: data.categoryId,
              assetClassId: data.assetClassId,
              institutionId: data.institutionId,
              details: data.details || undefined,
            }
          : p,
      ),
    )
    setEntries(prev =>
      prev.map(e =>
        e.productId === productId && e.month === selectedMonth && e.year === selectedYear
          ? {
              ...e,
              contribution: data.contribution,
              withdrawal: data.withdrawal,
              returnPct: data.returnPct,
              income: data.income,
              valueBrl: data.valueBrl,
              valueUsd: data.valueUsd,
              valueFinal: data.valueBrl,
            }
          : e,
      ),
    )
    setModal({ open: false })
  }

  const topbarAction = (
    <button className="btn-brand" onClick={() => setModal({ open: true, mode: 'create' })}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Novo Produto
    </button>
  )

  return (
    <AppShell topbarAction={topbarAction}>
      <div className="space-y-5">
        {/* Month selector */}
        <div className="card" style={{ padding: '0.875rem 1.25rem' }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {/* Stat cards */}
        <StatCards
          totalBrl={totalBrl}
          totalUsd={totalUsd}
          totalIncome={totalIncome}
          avgReturn={avgReturn}
          totalContribution={totalContribution}
          totalWithdrawal={totalWithdrawal}
          exchangeRate={exchangeRate}
        />

        {/* Filter bar */}
        <div className="flex items-center">
          <FilterBar
            categories={availableCategories}
            institutions={availableInstitutions}
            categoryFilter={categoryFilter}
            institutionFilter={institutionFilter}
            onCategoryChange={val => { setCategoryFilter(val); setInstitutionFilter('') }}
            onInstitutionChange={setInstitutionFilter}
          />
        </div>

        {/* Category groups */}
        {groups.length === 0 ? (
          <div
            className="card flex items-center justify-center py-16 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Nenhum produto encontrado para este mês / filtro.
          </div>
        ) : (
          <div className="space-y-4 stagger">
            {groups.map(({ category, entries: groupEntries }) => (
              <CategoryGroup
                key={category.id}
                category={category}
                entries={groupEntries}
                products={products}
                assetClasses={mockAssetClasses}
                institutions={mockInstitutions}
                onEdit={productId => setModal({ open: true, mode: 'edit', productId })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <ProdutoModal
          mode={modal.mode}
          product={editProduct}
          entry={editEntry}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          categories={mockCategories}
          assetClasses={mockAssetClasses}
          institutions={mockInstitutions}
          onCancel={() => setModal({ open: false })}
          onSubmit={modal.mode === 'create' ? handleAdd : handleSave}
        />
      )}
    </AppShell>
  )
}
