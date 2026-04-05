'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { DividendModal } from '@/components/produtos/DividendModal'
import { DeleteProductModal } from '@/components/produtos/DeleteProductModal'
import { ReactivateProductModal } from '@/components/produtos/ReactivateProductModal'
import { PastMonthWarningModal } from '@/components/produtos/PastMonthWarningModal'
import { upsertAggregatedProducts } from '@/lib/acoes-sync'
import { api } from '@/lib/api'
import { PageLoader } from '@/components/ui/PageLoader'
import type { Product, ProductEntry, Category, AssetClass, Institution, Region, LiquidityOption, Dividend } from '@/types'
import { useYear, CURRENT_YEAR, CURRENT_MONTH, AVAILABLE_YEARS } from '@/lib/year-context'
import { YearSelect } from '@/components/layout/YearSelect'

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; productId: string }

export default function ProdutosPage() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? null
  const router = useRouter()

  const { selectedYear, setSelectedYear } = useYear()
  const [selectedMonth, setSelectedMonth] = useState(
    selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12
  )

  useEffect(() => {
    setSelectedMonth(selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12)
  }, [selectedYear])

  const [categoryFilter, setCategoryFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  // Dados de referência (tabelas auxiliares — ainda via mock enquanto ações não migra)
  const [categories, setCategoriesState]             = useState<Category[]>([])
  const [assetClasses, setAssetClassesState]         = useState<AssetClass[]>([])
  const [institutions, setInstitutionsState]         = useState<Institution[]>([])
  const [regions, setRegionsState]                   = useState<Region[]>([])
  const [liquidityOptions, setLiquidityOptionsState] = useState<LiquidityOption[]>([])

  // Dados principais (API)
  const [products, setProducts]           = useState<Product[]>([])
  const [monthEntries, setMonthEntries]   = useState<ProductEntry[]>([])
  const [prevMonthEntries, setPrevMonthEntries] = useState<ProductEntry[]>([])
  const [monthDividends, setMonthDividends] = useState<Dividend[]>([])
  const [detailEntries, setDetailEntries] = useState<ProductEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingEntries, setLoadingEntries] = useState(false)

  // Previous month/year
  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1
  const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear

  // Carrega tabelas auxiliares e produtos na montagem (via API)
  useEffect(() => {
    async function loadStaticData() {
      try {
        const [cats, acs, insts, regs, liqs, prods] = await Promise.all([
          api.get<Category[]>('/api/categories'),
          api.get<AssetClass[]>('/api/assetclasses'),
          api.get<Institution[]>('/api/institutions'),
          api.get<Region[]>('/api/regions'),
          api.get<LiquidityOption[]>('/api/liquidity'),
          api.get<Product[]>('/api/products'),
        ])
        setCategoriesState(cats)
        setAssetClassesState(acs)
        setInstitutionsState(insts)
        setRegionsState(regs)
        setLiquidityOptionsState(liqs)
        setProducts(prods)
      } catch {
        // silencioso
      } finally {
        setLoading(false)
      }
    }
    if (email) loadStaticData()
  }, [email])

  // Carrega entries e dividendos quando mês/ano mudam
  useEffect(() => {
    async function loadMonthData() {
      setLoadingEntries(true)
      try {
        const [current, prev, divs] = await Promise.all([
          api.get<ProductEntry[]>(`/api/entries?month=${selectedMonth}&year=${selectedYear}`),
          api.get<ProductEntry[]>(`/api/entries?month=${prevMonth}&year=${prevYear}`),
          api.get<Dividend[]>(`/api/dividends?month=${selectedMonth}&year=${selectedYear}`),
        ])
        setMonthEntries(current)
        setPrevMonthEntries(prev)
        setMonthDividends(divs)
      } catch {
        // silencioso
      } finally {
        setLoadingEntries(false)
      }
    }
    loadMonthData()
  }, [selectedMonth, selectedYear, prevMonth, prevYear])

  const [modal, setModal]               = useState<ModalState>({ open: false })
  const [importOpen, setImportOpen]       = useState(false)
  const [copyModalOpen, setCopyModalOpen] = useState(false)
  const [detailProductId, setDetailProductId] = useState<string | null>(null)
  const [dividendProductId, setDividendProductId] = useState<string | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [reactivateProductId, setReactivateProductId] = useState<string | null>(null)

  // Carrega histórico completo quando modal de detalhe abre
  useEffect(() => {
    if (!detailProductId) { setDetailEntries([]); return }
    api.get<ProductEntry[]>(`/api/entries?productId=${detailProductId}`)
      .then(setDetailEntries)
      .catch(() => setDetailEntries([]))
  }, [detailProductId])
  const [showClosed, setShowClosed] = useState(false)
  const [copyAggWarning, setCopyAggWarning] = useState(false)

  useEffect(() => { setCopyAggWarning(false) }, [selectedMonth, selectedYear])
  const [pastMonthWarning, setPastMonthWarning] = useState<{
    mode: 'create' | 'edit' | 'delete' | 'import'
    onConfirm: () => void
  } | null>(null)

  function isPastMonth() {
    return selectedYear * 12 + selectedMonth < CURRENT_YEAR * 12 + CURRENT_MONTH
  }

  function guardPastMonth(mode: 'create' | 'edit' | 'delete', action: () => void) {
    if (isPastMonth()) {
      setPastMonthWarning({ mode, onConfirm: () => { setPastMonthWarning(null); action() } })
    } else {
      action()
    }
  }

  // Apply category, institution and name filters
  const filteredEntries = useMemo(() => {
    const search = nameFilter.trim().toLowerCase()
    return monthEntries.filter(e => {
      const product = products.find(p => p.id === e.productId)
      if (!product) return false
      if (showClosed ? !e.isClosed : e.isClosed) return false
      if (categoryFilter && product.categoryId !== categoryFilter) return false
      if (institutionFilter && product.institutionId !== institutionFilter) return false
      if (search && !product.name.toLowerCase().includes(search)) return false
      return true
    })
  }, [monthEntries, products, categoryFilter, institutionFilter, nameFilter, showClosed])

  // Dividend totals per product for the selected month
  const dividendByProduct: Record<string, number> = {}
  for (const d of monthDividends) {
    dividendByProduct[d.productId] = (dividendByProduct[d.productId] ?? 0) + d.dividendo + d.jcp + d.outros
  }

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
    ? monthEntries.find(e => e.productId === editProduct.id)
    : undefined

  async function handleAdd(data: ProdutoFormData) {
    try {
      const product = await api.post<Product>('/api/products', {
        name: data.name,
        cnpj: data.cnpj || undefined,
        categoryId: data.categoryId,
        assetClassId: data.assetClassId,
        institutionId: data.institutionId,
        regionId: data.regionId,
        liquidityId: data.liquidityId,
        currency: 'BRL',
        details: data.details || undefined,
      })
      const entry = await api.post<ProductEntry>('/api/entries', {
        productId: product.id,
        month: selectedMonth,
        year: selectedYear,
        contribution: data.contribution,
        withdrawal: data.withdrawal,
        returnPct: 0,
        valueOriginal: data.valueBrl,
        valueBrl: data.valueBrl,
        valueUsd: data.valueUsd,
      })
      setProducts(prev => [...prev, product])
      setMonthEntries(prev => [...prev, entry])
      setModal({ open: false })
    } catch {
      // silencioso — tratar erros globalmente depois
    }
  }

  async function handleSave(data: ProdutoFormData) {
    if (!modal.open || modal.mode !== 'edit') return
    const productId = modal.productId
    try {
      const updatedProduct = await api.put<Product>(`/api/products/${productId}`, {
        name: data.name,
        cnpj: data.cnpj || undefined,
        categoryId: data.categoryId,
        assetClassId: data.assetClassId,
        institutionId: data.institutionId,
        regionId: data.regionId,
        liquidityId: data.liquidityId,
        details: data.details || undefined,
      })

      let updatedEntry: ProductEntry
      if (editEntry) {
        updatedEntry = await api.put<ProductEntry>(`/api/entries/${editEntry.id}`, {
          contribution: data.contribution,
          withdrawal: data.withdrawal,
          valueBrl: data.valueBrl,
          valueUsd: data.valueUsd,
          valueOriginal: data.valueBrl,
        })
      } else {
        updatedEntry = await api.post<ProductEntry>('/api/entries', {
          productId,
          month: selectedMonth,
          year: selectedYear,
          contribution: data.contribution,
          withdrawal: data.withdrawal,
          returnPct: 0,
          valueOriginal: data.valueBrl,
          valueBrl: data.valueBrl,
          valueUsd: data.valueUsd,
        })
      }

      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p))
      setMonthEntries(prev => {
        const hasEntry = prev.some(e => e.productId === productId)
        if (hasEntry) return prev.map(e => e.productId === productId ? updatedEntry : e)
        return [...prev, updatedEntry]
      })
      setModal({ open: false })
    } catch {
      // silencioso
    }
  }

  async function handleCopyFromPrev() {
    try {
      // Remove todas as entries do mês destino (ativas e encerradas) antes de copiar
      await Promise.all(monthEntries.map(e => api.delete(`/api/entries/${e.id}`)))

      // Cria novas entries independentes a partir do mês anterior (apenas ativas)
      const toCopy = prevMonthEntries.filter(e => !e.isClosed)
      const aggregatedProductIds = new Set(
        toCopy
          .map(e => products.find(p => p.id === e.productId))
          .filter(p => p?.isAggregated)
          .map(p => p!.id)
      )

      await Promise.all(
        toCopy.map(e =>
          api.post<ProductEntry>('/api/entries', {
            productId: e.productId,
            month: selectedMonth,
            year: selectedYear,
            contribution: 0,
            withdrawal: 0,
            returnPct: 0,
            valueOriginal: e.valueOriginal,
            valueBrl: e.valueBrl,
            valueUsd: e.valueUsd,
          })
        )
      )

      // Recalcula agregados (Ações/FIIs) e carrega tudo de uma vez no final
      await upsertAggregatedProducts(selectedMonth, selectedYear)
      const [updatedProducts, updatedEntries] = await Promise.all([
        api.get<Product[]>('/api/products'),
        api.get<ProductEntry[]>(`/api/entries?month=${selectedMonth}&year=${selectedYear}`),
      ])
      setProducts(updatedProducts)
      setMonthEntries(updatedEntries)

      // Verifica se algum produto agregado foi fechado pelo upsert (sem ações cadastradas)
      if (aggregatedProductIds.size > 0) {
        const lostAgg = [...aggregatedProductIds].some(id => {
          const entry = updatedEntries.find(e => e.productId === id)
          return !entry || entry.isClosed
        })
        if (lostAgg) setCopyAggWarning(true)
      }
    } catch {
      // silencioso
    }
    setCopyModalOpen(false)
  }

  async function handleSaveDividends(productId: string, month: number, year: number, updated: Dividend[]) {
    try {
      // Estratégia replace: apaga todos do produto/mês e recria
      const toDelete = monthDividends.filter(d => d.productId === productId)
      await Promise.all(toDelete.map(d => api.delete(`/api/dividends/${d.id}`)))

      const created = await Promise.all(updated.map(d =>
        api.post<Dividend>('/api/dividends', {
          productId,
          date: d.date,
          dividendo: d.dividendo,
          jcp: d.jcp,
          outros: d.outros,
        })
      ))

      setMonthDividends(prev => [
        ...prev.filter(d => d.productId !== productId),
        ...created,
      ])
    } catch {
      // silencioso
    }
  }

  async function handleReactivate(productId: string) {
    const entry = monthEntries.find(e => e.productId === productId)
    if (entry) {
      try {
        const updated = await api.put<ProductEntry>(`/api/entries/${entry.id}`, { isClosed: false })
        setMonthEntries(prev => prev.map(e => e.id === entry.id ? updated : e))
      } catch {
        // silencioso
      }
    }
    setReactivateProductId(null)
  }

  async function handleDelete(productId: string) {
    const product = products.find(p => p.id === productId)
    const entry = monthEntries.find(e => e.productId === productId)
    try {
      if (product?.isAggregated) {
        if (entry) {
          await api.delete(`/api/entries/${entry.id}`)
          setMonthEntries(prev => prev.filter(e => e.id !== entry.id))
        }
        const aggDivs = monthDividends.filter(d => d.productId === productId)
        await Promise.all(aggDivs.map(d => api.delete(`/api/dividends/${d.id}`)))
        setMonthDividends(prev => prev.filter(d => d.productId !== productId))
      } else {
        if (entry) {
          const updated = await api.put<ProductEntry>(`/api/entries/${entry.id}`, { isClosed: true })
          setMonthEntries(prev => prev.map(e => e.id === entry.id ? updated : e))
        }
      }
    } catch {
      // silencioso
    }
    setDeleteProductId(null)
  }

  // Import ainda usa mock (fora do escopo desta migração)
  function handleImport(result: ImportResult) {
    setCategoriesState(prev => [...prev, ...result.newCategories])
    setAssetClassesState(prev => [...prev, ...result.newAssetClasses])
    setInstitutionsState(prev => [...prev, ...result.newInstitutions])
    setRegionsState(prev => [...prev, ...result.newRegions])
    setLiquidityOptionsState(prev => [...prev, ...result.newLiquidityOptions])
    setProducts(prev => [...prev, ...result.products])
    setMonthEntries(prev => [...prev, ...result.entries.filter(
      e => e.month === selectedMonth && e.year === selectedYear
    )])
    setImportOpen(false)
  }

  const topbarAction = (
    <div className="flex items-center gap-2">
      <button
        className="btn-ghost"
        onClick={() => guardPastMonth('import', () => setImportOpen(true))}
        title="Importar CSV"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Importar CSV
      </button>
      <button className="btn-brand" onClick={() => guardPastMonth('create', () => setModal({ open: true, mode: 'create' }))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo Produto
      </button>
    </div>
  )

  if (loading) return <PageLoader />

  return (
    <AppShell topbarAction={topbarAction}>
      <div className="space-y-5">
        {/* Year + Month selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '0.75rem' }}>
          <div className="card" style={{ padding: '0.875rem 1.25rem', flexShrink: 0, width: 120, display: 'flex', alignItems: 'center' }}>
            <YearSelect
              value={selectedYear}
              options={AVAILABLE_YEARS}
              onChange={setSelectedYear}
              fontSize={22}
              triggerStyle={{ padding: 0, background: 'transparent', color: 'var(--text-primary)', borderRadius: 0, gap: 10 }}
            />
          </div>
          <div className="card" style={{ padding: '0.875rem 1.25rem', flex: 1, display: 'flex', alignItems: 'center' }}>
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>
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

        {/* Filter bar + copiar do mês anterior */}
        <div className="flex items-center gap-4">
          <FilterBar
            categories={availableCategories}
            institutions={availableInstitutions}
            categoryFilter={categoryFilter}
            institutionFilter={institutionFilter}
            onCategoryChange={val => { setCategoryFilter(val); setInstitutionFilter(''); setShowClosed(false) }}
            onInstitutionChange={val => { setInstitutionFilter(val); setShowClosed(false) }}
          />
          <div style={{ position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              style={{
                padding: '7px 10px 7px 28px',
                paddingRight: nameFilter ? 28 : 10,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
                width: 200,
              }}
            />
            {nameFilter && (
              <button
                onClick={() => setNameFilter('')}
                style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex', alignItems: 'center' }}
                title="Limpar busca"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer flex-shrink-0" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={showClosed}
              onChange={e => setShowClosed(e.target.checked)}
              style={{ accentColor: 'var(--brand)', width: 14, height: 14, cursor: 'pointer' }}
            />
            Mostrar encerrados
          </label>
          {prevMonthEntries.filter(e => !e.isClosed).length > 0 && monthEntries.filter(e => !e.isClosed).length > 0 && (
            <>
              <div style={{ flex: 1 }} />
              <button
                className="btn-ghost text-sm flex items-center gap-2 flex-shrink-0"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setCopyModalOpen(true)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar do mês anterior
              </button>
            </>
          )}
        </div>

        {/* Banner: mês vazio — copiar do mês anterior */}
        {prevMonthEntries.filter(e => !e.isClosed).length > 0 && monthEntries.filter(e => !e.isClosed).length === 0 && (
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
                {' '}Deseja copiar os <strong>{prevMonthEntries.filter(e => !e.isClosed).length} produtos</strong> de {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][prevMonth - 1]}/{prevYear}?
              </span>
            </div>
            <button className="btn-brand text-sm flex-shrink-0" onClick={() => setCopyModalOpen(true)}>
              Copiar do mês anterior
            </button>
          </div>
        )}

        {/* Aviso: produto agregado não copiado por falta de ações */}
        {copyAggWarning && (
          <div
            className="card flex items-center justify-between gap-4 px-5 py-4"
            style={{ borderLeft: '3px solid #f59e0b', background: '#f59e0b10' }}
          >
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Um ou mais <strong>produtos agregados</strong> não foram copiados pois não há ações cadastradas.
                Adicione ações na área{' '}
                <a href="/acoes" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'underline' }}>Ações/FIIs</a>
                {' '}para que apareçam automaticamente.
              </span>
            </div>
            <button
              onClick={() => setCopyAggWarning(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, padding: 4 }}
              title="Fechar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Category groups */}
        {groups.length === 0 ? (
          <div
            className="card flex flex-col items-center justify-center py-16 gap-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {showClosed ? (
              <>
                <span>Não há produtos encerrados neste mês.</span>
                <button
                  className="text-sm"
                  style={{ color: 'var(--brand)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setShowClosed(false)}
                >
                  Voltar para produtos ativos
                </button>
              </>
            ) : (
              <span>Nenhum produto encontrado para este mês / filtro.</span>
            )}
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
                onEdit={productId => guardPastMonth('edit', () => setModal({ open: true, mode: 'edit', productId }))}
                onDetail={setDetailProductId}
                onDividend={setDividendProductId}
                onDelete={productId => guardPastMonth('delete', () => setDeleteProductId(productId))}
                onReactivate={setReactivateProductId}
                onAggregated={(institutionId, assetClassId) =>
                  router.push(`/acoes?institution=${institutionId}&assetClass=${assetClassId}`)
                }
                dividendByProduct={dividendByProduct}
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
          liquidityOptions={liquidityOptions}
          onCancel={() => setModal({ open: false })}
          onSubmit={modal.mode === 'create' ? handleAdd : handleSave}
          onDividend={modal.mode === 'edit' ? () => {
            setDividendProductId(modal.productId)
            setModal({ open: false })
          } : undefined}
        />
      )}

      {/* Modal de cópia do mês anterior */}
      {copyModalOpen && (
        <CopyFromPrevModal
          prevMonth={prevMonth}
          prevYear={prevYear}
          destMonth={selectedMonth}
          destYear={selectedYear}
          prevCount={prevMonthEntries.filter(e => !e.isClosed).length}
          destCount={monthEntries.filter(e => !e.isClosed).length}
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
          liquidityOptions={liquidityOptions}
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
        const region          = product ? regions.find(r => r.id === product.regionId) : undefined
        const liquidityOption = product ? liquidityOptions.find(l => l.id === product.liquidityId) : undefined
        const currentEntry = detailEntries.find(e => e.month === selectedMonth && e.year === selectedYear)
        const dividendTotal = monthDividends
          .filter(d => d.productId === detailProductId)
          .reduce((acc, d) => acc + d.dividendo + d.jcp + d.outros, 0)
        if (!product || !category || !assetClass || !institution) return null
        return (
          <ProductDetailModal
            product={product}
            currentEntry={currentEntry}
            entries={detailEntries}
            category={category}
            assetClass={assetClass}
            institution={institution}
            region={region}
            liquidityOption={liquidityOption}
            dividendTotal={dividendTotal}
            onClose={() => setDetailProductId(null)}
          />
        )
      })()}

      {/* Modal de dividendos */}
      {dividendProductId && (() => {
        const product = products.find(p => p.id === dividendProductId)
        if (!product) return null
        const productDividends = monthDividends.filter(d => d.productId === dividendProductId)
        return (
          <DividendModal
            productId={dividendProductId}
            productName={product.name}
            month={selectedMonth}
            year={selectedYear}
            dividends={productDividends}
            onClose={() => setDividendProductId(null)}
            onSave={updated => handleSaveDividends(dividendProductId, selectedMonth, selectedYear, updated)}
          />
        )
      })()}

      {/* Modal de reativação de produto */}
      {reactivateProductId && (() => {
        const product = products.find(p => p.id === reactivateProductId)
        const institution = product ? institutions.find(i => i.id === product.institutionId) : undefined
        if (!product || !institution) return null
        return (
          <ReactivateProductModal
            product={product}
            institution={institution}
            onCancel={() => setReactivateProductId(null)}
            onConfirm={() => handleReactivate(reactivateProductId)}
          />
        )
      })()}

      {/* Modal de exclusão de produto */}
      {deleteProductId && (() => {
        const product = products.find(p => p.id === deleteProductId)
        const institution = product ? institutions.find(i => i.id === product.institutionId) : undefined
        if (!product || !institution) return null
        return (
          <DeleteProductModal
            product={product}
            institution={institution}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onCancel={() => setDeleteProductId(null)}
            onConfirm={() => handleDelete(deleteProductId)}
          />
        )
      })()}

      {/* Popup danger zone — mês passado */}
      {pastMonthWarning && (
        <PastMonthWarningModal
          month={selectedMonth}
          year={selectedYear}
          mode={pastMonthWarning.mode}
          onCancel={() => setPastMonthWarning(null)}
          onConfirm={pastMonthWarning.onConfirm}
        />
      )}

      {/* Overlay de loading — bloqueia interação ao trocar de mês */}
      {loadingEntries && (
        <>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '28px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>Carregando...</span>
            </div>
          </div>
        </>
      )}
    </AppShell>
  )
}
