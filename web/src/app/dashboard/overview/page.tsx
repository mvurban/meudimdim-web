'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { LineChartCard } from '@/components/dashboard/LineChartCard'
import { PizzaCard } from '@/components/dashboard/PizzaCard'
import {
  getProducts,
  getProductEntries,
  getInstitutions,
  getCategories,
  getRegions,
} from '@/lib/mock-store'
import { formatBRL, formatUSD, formatPct, monthLabel } from '@/lib/utils'
import { useYear, CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'
import type { Product, ProductEntry, Institution, Category, Region } from '@/types'

const INSTITUTION_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#f97316']

const evolutionLines = [
  { key: 'brl', name: 'BRL', color: '#22c55e', yAxisId: 'primary' },
  { key: 'usd', name: 'USD', color: '#a855f7', yAxisId: 'usd', strokeDasharray: '5 3' },
]
const evolutionSecondaryAxis = { id: 'usd', currency: 'usd' as const }

export default function OverviewPage() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''
  const { selectedYear } = useYear()

  const [products,     setProductsState]     = useState<Product[]>([])
  const [entries,      setEntriesState]      = useState<ProductEntry[]>([])
  const [institutions, setInstitutionsState] = useState<Institution[]>([])
  const [categories,   setCategoriesState]   = useState<Category[]>([])
  const [regions,      setRegionsState]      = useState<Region[]>([])

  useEffect(() => {
    if (!email) return
    setProductsState(getProducts(email))
    setEntriesState(getProductEntries(email))
    setInstitutionsState(getInstitutions(email))
    setCategoriesState(getCategories(email))
    setRegionsState(getRegions(email))
  }, [email])

  const refMonth = selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12
  const refLabel = monthLabel(refMonth, selectedYear, true)

  // ── Helpers ──────────────────────────────────────────────────────
  function entriesForMonth(month: number, year: number) {
    return entries.filter(e => {
      if (e.month !== month || e.year !== year) return false
      const p = products.find(p => p.id === e.productId)
      return p && p.status !== 'closed'
    })
  }

  function sumEntries(month: number, year: number) {
    const es = entriesForMonth(month, year)
    const totalValue   = es.reduce((s, e) => s + e.valueFinal, 0)
    const totalValueUsd = es.reduce((s, e) => s + e.valueUsd, 0)
    const contribution = es.reduce((s, e) => s + e.contribution, 0)
    const withdrawal   = es.reduce((s, e) => s + e.withdrawal, 0)
    const income       = es.reduce((s, e) => s + e.income, 0)
    const returnPct    = totalValue > 0
      ? es.reduce((s, e) => s + e.returnPct * e.valueFinal, 0) / totalValue
      : 0
    return { totalValue, totalValueUsd, contribution, withdrawal, income, returnPct }
  }

  // ── KPIs do mês de referência ─────────────────────────────────────
  const kpi = useMemo(() => sumEntries(refMonth, selectedYear),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries, products, refMonth, selectedYear])

  // ── Meses para os gráficos ────────────────────────────────────────
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

  // ── Evolução patrimonial ──────────────────────────────────────────
  const evolutionData = useMemo(() =>
    months.map(({ month, year }) => {
      const { totalValue, totalValueUsd } = sumEntries(month, year)
      return { label: monthLabel(month, year, true), brl: totalValue, usd: totalValueUsd }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [months, entries, products])

  // ── Por categoria ─────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const es = entriesForMonth(refMonth, selectedYear)
    const total = es.reduce((s, e) => s + e.valueFinal, 0)
    return categories
      .map(cat => {
        const value = es
          .filter(e => products.find(p => p.id === e.productId)?.categoryId === cat.id)
          .reduce((s, e) => s + e.valueFinal, 0)
        return { name: cat.name, value, pct: total > 0 ? value / total * 100 : 0, color: cat.color }
      })
      .filter(x => x.value > 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, products, categories, refMonth, selectedYear])

  // ── Por instituição ───────────────────────────────────────────────
  const institutionData = useMemo(() => {
    const es = entriesForMonth(refMonth, selectedYear)
    const total = es.reduce((s, e) => s + e.valueFinal, 0)
    return institutions
      .map((inst, i) => {
        const value = es
          .filter(e => products.find(p => p.id === e.productId)?.institutionId === inst.id)
          .reduce((s, e) => s + e.valueFinal, 0)
        return { name: inst.name, value, pct: total > 0 ? value / total * 100 : 0, color: INSTITUTION_COLORS[i % INSTITUTION_COLORS.length] }
      })
      .filter(x => x.value > 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, products, institutions, refMonth, selectedYear])

  // ── Por região ────────────────────────────────────────────────────
  const regionData = useMemo(() => {
    const es = entriesForMonth(refMonth, selectedYear)
    const total = es.reduce((s, e) => s + e.valueFinal, 0)
    const REGION_COLORS: Record<string, string> = { Brasil: '#22c55e', Internacional: '#a855f7' }
    return regions
      .map(reg => {
        const value = es
          .filter(e => products.find(p => p.id === e.productId)?.regionId === reg.id)
          .reduce((s, e) => s + e.valueFinal, 0)
        return { name: reg.name, value, pct: total > 0 ? value / total * 100 : 0, color: REGION_COLORS[reg.name] ?? '#6b7280' }
      })
      .filter(x => x.value > 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, products, regions, refMonth, selectedYear])

  return (
    <AppShell>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Visão geral do patrimônio · {refLabel}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard label="Patrimônio Total"  value={formatBRL(kpi.totalValue)} />
        <KpiCard label="Patrimônio em USD" value={formatUSD(kpi.totalValueUsd)} />
        <KpiCard label="Aporte do mês"     value={formatBRL(kpi.contribution)} />
        <KpiCard label="Rendimento do mês" value={formatBRL(kpi.income)} />
        <KpiCard label="Retorno do mês"    value={formatPct(kpi.returnPct)} color="#22c55e" />
      </div>

      <LineChartCard
        title="Evolução Patrimonial"
        data={evolutionData}
        lines={evolutionLines}
        secondaryAxis={evolutionSecondaryAxis}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <PizzaCard title="Por Categoria"   data={categoryData}    />
        <PizzaCard title="Por Instituição" data={institutionData} />
        <PizzaCard title="Por Região"      data={regionData}      />
      </div>
    </AppShell>
  )
}
