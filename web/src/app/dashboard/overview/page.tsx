'use client'

import { useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { LineChartCard } from '@/components/dashboard/LineChartCard'
import { PizzaCard } from '@/components/dashboard/PizzaCard'
import { mockDashboard, mockYearSnapshots } from '@/lib/mock-data'
import { formatBRL, formatUSD, formatPct, monthLabel } from '@/lib/utils'
import { useYear, CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'

const INSTITUTION_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

const evolutionLines = [
  { key: 'brl', name: 'BRL', color: '#22c55e', yAxisId: 'primary' },
  { key: 'usd', name: 'USD', color: '#a855f7', yAxisId: 'usd', strokeDasharray: '5 3' },
]

const evolutionSecondaryAxis = { id: 'usd', currency: 'usd' as const }

export default function OverviewPage() {
  const { selectedYear } = useYear()
  const d = selectedYear === CURRENT_YEAR ? mockDashboard : mockYearSnapshots[selectedYear]

  const refMonth = selectedYear === CURRENT_YEAR ? CURRENT_MONTH : 12
  const refLabel = monthLabel(refMonth, selectedYear, true)

  const evolutionData = useMemo(() =>
    d.monthlyEvolution.map(m => ({
      label: monthLabel(m.month, m.year, true),
      brl: m.totalValue,
      usd: m.totalValueUsd,
    })),
  [d])

  const categoryData = d.byCategory
    .filter(x => x.value > 0)
    .map(x => ({ name: x.category, value: x.value, pct: x.pct, color: x.color }))

  const institutionData = d.byInstitution.map((x, i) => ({
    name: x.institution,
    value: x.value,
    pct: x.pct,
    color: INSTITUTION_COLORS[i % INSTITUTION_COLORS.length],
  }))

  const regionData = d.byRegion.map(x => ({
    name: x.region,
    value: x.value,
    pct: x.pct,
    color: x.region === 'Brasil' ? '#22c55e' : '#a855f7',
  }))

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
        <KpiCard label="Patrimônio Total"   value={formatBRL(d.totalValue)} />
        <KpiCard label="Patrimônio em USD"  value={formatUSD(d.totalValueUsd)} />
        <KpiCard label="Aporte do mês"      value={formatBRL(d.monthContribution)} />
        <KpiCard label="Rendimento do mês"  value={formatBRL(d.monthIncome)} />
        <KpiCard label="Retorno do mês"     value={formatPct(d.monthReturnPct)} color="#22c55e" />
      </div>

      <LineChartCard
        title="Evolução Patrimonial"
        data={evolutionData}
        lines={evolutionLines}
        secondaryAxis={evolutionSecondaryAxis}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <PizzaCard title="Por Categoria"    data={categoryData}    />
        <PizzaCard title="Por Instituição"  data={institutionData} />
        <PizzaCard title="Por Região"       data={regionData}      />
      </div>
    </AppShell>
  )
}
