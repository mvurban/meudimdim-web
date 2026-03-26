'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { SectionCard } from '@/components/dashboard/SectionCard'
import { DropdownFilter } from '@/components/dashboard/DropdownFilter'
import { MonthlyTable, type MonthlyTableRow } from '@/components/dashboard/MonthlyTable'
import { LineChartCard, type ChartLine } from '@/components/dashboard/LineChartCard'
import {
  getProducts,
  getProductEntries,
  getInstitutions,
  getCategories,
  getAssetClasses,
} from '@/lib/mock-store'
import { monthLabel } from '@/lib/utils'
import { useYear, CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'
import type { Product, ProductEntry, Institution, Category, AssetClass } from '@/types'

const LINE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#f97316']

export default function ConsolidadoMensalPage() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''
  const { selectedYear } = useYear()

  const [products,     setProductsState]     = useState<Product[]>([])
  const [entries,      setEntriesState]      = useState<ProductEntry[]>([])
  const [institutions, setInstitutionsState] = useState<Institution[]>([])
  const [categories,   setCategoriesState]   = useState<Category[]>([])
  const [assetClasses, setAssetClassesState] = useState<AssetClass[]>([])

  const [selInstitutions, setSelInstitutions] = useState<string[]>([])
  const [selCategories,   setSelCategories]   = useState<string[]>([])

  useEffect(() => {
    if (!email) return
    const insts = getInstitutions(email)
    const cats  = getCategories(email)
    setInstitutionsState(insts)
    setCategoriesState(cats)
    setSelInstitutions(insts.map(i => i.id))
    setSelCategories(cats.map(c => c.id))
    setProductsState(getProducts(email))
    setEntriesState(getProductEntries(email))
    setAssetClassesState(getAssetClasses(email))
  }, [email])

  // ── Meses a exibir ────────────────────────────────────────────────
  const months = useMemo(() => {
    if (selectedYear === CURRENT_YEAR) {
      const result: { month: number; year: number }[] = []
      for (let i = 11; i >= 0; i--) {
        let m = CURRENT_MONTH - i
        let y = CURRENT_YEAR
        if (m <= 0) { m += 12; y -= 1 }
        result.push({ month: m, year: y })
      }
      return result
    }
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, year: selectedYear }))
  }, [selectedYear])

  // ── Filtra entries por instituição e categoria ───────────────────
  function filteredEntries(month: number, year: number, instIds: string[], catIds: string[]) {
    return entries.filter(e => {
      if (e.month !== month || e.year !== year) return false
      const p = products.find(p => p.id === e.productId)
      if (!p || p.status === 'inactive') return false
      return instIds.includes(p.institutionId) && catIds.includes(p.categoryId)
    })
  }

  // ── Tabela mensal ─────────────────────────────────────────────────
  const tableRows = useMemo<MonthlyTableRow[]>(() => {
    return [...months].reverse().map(({ month, year }) => {
      const es = filteredEntries(month, year, selInstitutions, selCategories)
      const totalValue   = es.reduce((s, e) => s + e.valueFinal, 0)
      const contribution = es.reduce((s, e) => s + e.contribution, 0)
      const withdrawal   = es.reduce((s, e) => s + e.withdrawal, 0)
      const income       = es.reduce((s, e) => s + e.income, 0)
      const returnPct    = totalValue > 0
        ? es.reduce((s, e) => s + e.returnPct * e.valueFinal, 0) / totalValue
        : 0
      return { label: monthLabel(month, year, true), contribution, withdrawal, returnPct, income, totalValue }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, entries, products, selInstitutions, selCategories])

  // ── Gráfico 1: por instituição ────────────────────────────────────
  const institutionChartData = useMemo(() =>
    months.map(({ month, year }) => {
      const entry: Record<string, string | number> = { label: monthLabel(month, year, true) }
      for (const id of selInstitutions) {
        const es = entries.filter(e => {
          if (e.month !== month || e.year !== year) return false
          const p = products.find(p => p.id === e.productId)
          return p && p.institutionId === id && p.status !== 'inactive'
        })
        entry[id] = es.reduce((s, e) => s + e.valueFinal, 0)
      }
      return entry
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [selInstitutions, months, entries, products])

  const institutionLines = useMemo<ChartLine[]>(() =>
    selInstitutions.map((id, i) => ({
      key: id,
      name: institutions.find(inst => inst.id === id)?.name ?? id,
      color: LINE_COLORS[i % LINE_COLORS.length],
    })),
  [selInstitutions, institutions])

  // ── Gráfico 2: por categoria ──────────────────────────────────────
  const categoryChartData = useMemo(() =>
    months.map(({ month, year }) => {
      const entry: Record<string, string | number> = { label: monthLabel(month, year, true) }
      for (const catId of selCategories) {
        const classIds = assetClasses.filter(ac => ac.categoryId === catId).map(ac => ac.id)
        const es = entries.filter(e => {
          if (e.month !== month || e.year !== year) return false
          const p = products.find(p => p.id === e.productId)
          return p && classIds.includes(p.assetClassId) && p.status !== 'inactive'
        })
        entry[catId] = es.reduce((s, e) => s + e.valueFinal, 0)
      }
      return entry
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [selCategories, months, entries, products, assetClasses])

  const categoryLines = useMemo<ChartLine[]>(() =>
    selCategories.map(catId => {
      const cat = categories.find(c => c.id === catId)
      return { key: catId, name: cat?.name ?? catId, color: cat?.color ?? '#6b7280' }
    }),
  [selCategories, categories])

  return (
    <AppShell>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          Consolidado Mensal
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          {selectedYear === CURRENT_YEAR
            ? 'Últimos 12 meses por instituição e categoria'
            : `Janeiro a Dezembro de ${selectedYear}`}
        </p>
      </div>

      <SectionCard title="Filtros">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <DropdownFilter
            label="Instituições"
            items={institutions.map(i => ({ id: i.id, name: i.name }))}
            selected={selInstitutions}
            onToggle={id => setSelInstitutions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            onSelectAll={() => setSelInstitutions(
              selInstitutions.length === institutions.length ? [] : institutions.map(i => i.id)
            )}
          />
          <DropdownFilter
            label="Categorias"
            items={categories.map(c => ({ id: c.id, name: c.name, color: c.color }))}
            selected={selCategories}
            onToggle={id => setSelCategories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            onSelectAll={() => setSelCategories(
              selCategories.length === categories.length ? [] : categories.map(c => c.id)
            )}
          />
        </div>
      </SectionCard>

      <SectionCard title="Resumo Mensal">
        <MonthlyTable rows={tableRows} />
      </SectionCard>

      <LineChartCard
        title="Evolução por Instituição"
        data={institutionChartData}
        lines={institutionLines}
      />

      <LineChartCard
        title="Evolução por Categoria"
        data={categoryChartData}
        lines={categoryLines}
      />
    </AppShell>
  )
}
