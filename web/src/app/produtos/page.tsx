'use client'

import { useState, useMemo, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { MonthSelector } from '@/components/produtos/MonthSelector'
import { FilterBar } from '@/components/produtos/FilterBar'
import { StatCards } from '@/components/produtos/StatCards'
import { CategoryGroup } from '@/components/produtos/CategoryGroup'
import { ProdutoModal } from '@/components/produtos/ProdutoModal'
import type { ProdutoFormData } from '@/components/produtos/ProdutoModal'
import { ImportModal } from '@/components/produtos/ImportModal'
import type { ImportResult } from '@/lib/csv-import'
import { CopyFromPrevModal } from '@/components/produtos/CopyFromPrevModal'
import { ProductDetailModal } from '@/components/produtos/ProductDetailModal'
import {
  mockProducts,
  mockEntries,
  mockCategories,
  mockAssetClasses,
  mockInstitutions,
  mockRegions,
} from '@/lib/mock-data'
import type { Product, ProductEntry, Category, AssetClass, Institution, Region } from '@/types'
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
  const [categories, setCategories]     = useState<Category[]>(mockCategories)
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>(mockAssetClasses)
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions)
  const [regions, setRegions]           = useState<Region[]>(mockRegions)
  const [products, setProducts]         = useState<Product[]>(mockProducts)
  const [entries, setEntries]           = useState<ProductEntry[]>(mockEntries)
  const [modal, setModal]               = useState<ModalState>({ open: false })
  const [importOpen, setImportOpen]       = useState(false)
  const [copyModalOpen, setCopyModalOpen] = useState(false)
  const [detailProductId, setDetailProductId] = useState<string | null>(null)

  // Previous month/year
  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1
  const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear

  // Entries for the selected month/year
  const monthEntries = useMemo(
    () => entries.filter(e => e.month === selectedMonth && e.year === selectedYear),
    [entries, selectedMonth, selectedYear],
  )

  // Entries for the previous month/year
  const prevMonthEntries = useMemo(
    () => entries.filter(e => e.month === prevMonth && e.year === prevYear),
    [entries, prevMonth, prevYear],
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

  // Group entries by category (preserving category order)
  const groups = useMemo(() => {
    const map = new Map<string, { category: Category; entries: ProductEntry[] }>()
    for (const entry of filteredEntries) {
      const product = products.find(p => p.id === entry.productId)
      if (!product) continue
      const cat = categories.find(c => c.id === product.categoryId)
      if (!cat) continue
      if (!map.has(product.categoryId)) {
        map.set(product.categoryId, { category: cat, entries: [] })
      }
      map.get(product.categoryId)!.entries.push(entry)
    }
    return categories
      .map(c => map.get(c.id))
      .filter((g): g is NonNullable<typeof g> => g !== undefined)
  }, [filteredEntries, products, categories])

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
    return categories.filter(c => catIds.has(c.id))
  }, [monthEntries, products, categories])

  const availableInstitutions = useMemo(() => {
    const instIds = new Set(
      monthEntries
        .map(e => products.find(p => p.id === e.productId)?.institutionId)
        .filter(Boolean),
    )
    return institutions.filter(i => instIds.has(i.id))
  }, [monthEntries, products, institutions])

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
      cnpj: data.cnpj || undefined,
      categoryId: data.categoryId,
      assetClassId: data.assetClassId,
      institutionId: data.institutionId,
      regionId: data.regionId,
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
      returnPct: 0,
      income: 0,
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
              cnpj: data.cnpj || undefined,
              categoryId: data.categoryId,
              assetClassId: data.assetClassId,
              institutionId: data.institutionId,
              regionId: data.regionId,
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
              valueBrl: data.valueBrl,
              valueUsd: data.valueUsd,
              valueFinal: data.valueBrl,
            }
          : e,
      ),
    )
    setModal({ open: false })
  }

  function handleCopyFromPrev() {
    const now = new Date().toISOString().slice(0, 10)
    setEntries(prev => {
      const withoutDest = prev.filter(
        e => !(e.month === selectedMonth && e.year === selectedYear),
      )
      const copied = prevMonthEntries.map((e, i) => ({
        ...e,
        id: `e_copy_${Date.now()}_${i}`,
        month: selectedMonth,
        year: selectedYear,
        contribution: 0,
        withdrawal: 0,
        returnPct: 0,
        income: 0,
        createdAt: now,
      }))
      return [...withoutDest, ...copied]
    })
    setCopyModalOpen(false)
  }

  function handleImport(result: ImportResult) {
    setCategories(prev => [...prev, ...result.newCategories])
    setAssetClasses(prev => [...prev, ...result.newAssetClasses])
    setInstitutions(prev => [...prev, ...result.newInstitutions])
    setRegions(prev => [...prev, ...result.newRegions])
    setProducts(prev => [...prev, ...result.products])
    setEntries(prev => [...prev, ...result.entries])
    setImportOpen(false)
  }

  const topbarAction = (
    <div className="flex items-center gap-2">
      <button
        className="btn-ghost"
        onClick={() => setImportOpen(true)}
        title="Importar CSV"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Importar CSV
      </button>
      <button className="btn-brand" onClick={() => setModal({ open: true, mode: 'create' })}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo Produto
      </button>
    </div>
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

        {/* Banner: copiar do mês anterior */}
        {prevMonthEntries.length > 0 && !categoryFilter && !institutionFilter && (
          monthEntries.length === 0 ? (
            // Mês vazio — banner destacado
            <div
              className="card flex items-center justify-between gap-4 px-5 py-4"
              style={{ borderLeft: '3px solid var(--brand)', background: 'var(--brand-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Nenhum produto em {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][selectedMonth - 1]}/{selectedYear}.
                  {' '}Deseja copiar os <strong>{prevMonthEntries.length} produtos</strong> de {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][prevMonth - 1]}/{prevYear}?
                </span>
              </div>
              <button className="btn-brand text-sm flex-shrink-0" onClick={() => setCopyModalOpen(true)}>
                Copiar do mês anterior
              </button>
            </div>
          ) : (
            // Mês com dados — botão discreto
            <div className="flex justify-end">
              <button
                className="btn-ghost text-sm flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setCopyModalOpen(true)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar do mês anterior
              </button>
            </div>
          )
        )}

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
                assetClasses={assetClasses}
                institutions={institutions}
                onEdit={productId => setModal({ open: true, mode: 'edit', productId })}
                onDetail={setDetailProductId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de produto */}
      {modal.open && (
        <ProdutoModal
          mode={modal.mode}
          product={editProduct}
          entry={editEntry}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          categories={categories}
          assetClasses={assetClasses}
          institutions={institutions}
          regions={regions}
          onCancel={() => setModal({ open: false })}
          onSubmit={modal.mode === 'create' ? handleAdd : handleSave}
        />
      )}

      {/* Modal de cópia do mês anterior */}
      {copyModalOpen && (
        <CopyFromPrevModal
          prevMonth={prevMonth}
          prevYear={prevYear}
          destMonth={selectedMonth}
          destYear={selectedYear}
          prevCount={prevMonthEntries.length}
          destCount={monthEntries.length}
          onCancel={() => setCopyModalOpen(false)}
          onConfirm={handleCopyFromPrev}
        />
      )}

      {/* Modal de importação CSV */}
      {importOpen && (
        <ImportModal
          categories={categories}
          assetClasses={assetClasses}
          institutions={institutions}
          regions={regions}
          onCancel={() => setImportOpen(false)}
          onImport={handleImport}
        />
      )}

      {/* Modal de detalhe do produto */}
      {detailProductId && (() => {
        const product      = products.find(p => p.id === detailProductId)
        const category     = product ? categories.find(c => c.id === product.categoryId) : undefined
        const assetClass   = product ? assetClasses.find(a => a.id === product.assetClassId) : undefined
        const institution  = product ? institutions.find(i => i.id === product.institutionId) : undefined
        const region       = product ? regions.find(r => r.id === product.regionId) : undefined
        const prodEntries  = entries.filter(e => e.productId === detailProductId)
        const currentEntry = prodEntries.find(e => e.month === selectedMonth && e.year === selectedYear)
        if (!product || !category || !assetClass || !institution) return null
        return (
          <ProductDetailModal
            product={product}
            currentEntry={currentEntry}
            entries={prodEntries}
            category={category}
            assetClass={assetClass}
            institution={institution}
            region={region}
            onClose={() => setDetailProductId(null)}
          />
        )
      })()}
    </AppShell>
  )
}
