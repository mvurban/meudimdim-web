'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { SectionCard } from '@/components/dashboard/SectionCard'
import { DropdownFilter } from '@/components/dashboard/DropdownFilter'
import { MonthlyTable, type MonthlyTableRow } from '@/components/dashboard/MonthlyTable'
import { LineChartCard, type ChartLine } from '@/components/dashboard/LineChartCard'
import {
  mockInstitutions,
  mockCategories,
  mockAssetClasses,
  mockDashboard,
  mockMonthlyByInstitution,
  mockMonthlyByAssetClass,
} from '@/lib/mock-data'
import { monthLabel } from '@/lib/utils'
import { useYear, CURRENT_YEAR } from '@/lib/year-context'

const ALL_INSTITUTION_IDS = ['i1', 'i2', 'i4', 'i5']
const ALL_CATEGORY_IDS    = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5']
const LINE_COLORS         = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#f97316']

const FILTER_INSTITUTIONS = mockInstitutions.filter(i => ALL_INSTITUTION_IDS.includes(i.id))

export default function ConsolidadoMensalPage() {
  const { selectedYear } = useYear()
  const [selInstitutions, setSelInstitutions] = useState<string[]>(ALL_INSTITUTION_IDS)
  const [selCategories,   setSelCategories]   = useState<string[]>(ALL_CATEGORY_IDS)

  function toggleInstitution(id: string) {
    if (selInstitutions.includes(id) && selInstitutions.length === 1) return
    setSelInstitutions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function selectAllInstitutions() {
    setSelInstitutions(
      selInstitutions.length === ALL_INSTITUTION_IDS.length ? [ALL_INSTITUTION_IDS[0]] : ALL_INSTITUTION_IDS
    )
  }

  function toggleCategory(id: string) {
    if (selCategories.includes(id) && selCategories.length === 1) return
    setSelCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function selectAllCategories() {
    setSelCategories(
      selCategories.length === ALL_CATEGORY_IDS.length ? [ALL_CATEGORY_IDS[0]] : ALL_CATEGORY_IDS
    )
  }

  const months = useMemo(() => {
    if (selectedYear === CURRENT_YEAR) {
      return mockDashboard.monthlyEvolution.map(m => ({ month: m.month, year: m.year }))
    }
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, year: selectedYear }))
  }, [selectedYear])

  // ── Tabela: somar por instituições selecionadas ───────────────────
  const tableRows = useMemo<MonthlyTableRow[]>(() => {
    return months.map(({ month, year }) => {
      const rows = mockMonthlyByInstitution.filter(
        r => r.month === month && r.year === year && selInstitutions.includes(r.institutionId)
      )
      const totalValue   = rows.reduce((s, r) => s + r.totalValue,   0)
      const contribution = rows.reduce((s, r) => s + r.contribution, 0)
      const withdrawal   = rows.reduce((s, r) => s + r.withdrawal,   0)
      const income       = rows.reduce((s, r) => s + r.income,       0)
      const returnPct    = totalValue > 0
        ? rows.reduce((s, r) => s + r.returnPct * r.totalValue, 0) / totalValue
        : 0
      return { label: monthLabel(month, year, true), contribution, withdrawal, returnPct, income, totalValue }
    })
  }, [selInstitutions, months])

  // ── Gráfico 1: por instituição ────────────────────────────────────
  const institutionChartData = useMemo(() =>
    months.map(({ month, year }) => {
      const entry: Record<string, string | number> = { label: monthLabel(month, year, true) }
      for (const id of selInstitutions) {
        const row = mockMonthlyByInstitution.find(
          r => r.month === month && r.year === year && r.institutionId === id
        )
        entry[id] = row?.totalValue ?? 0
      }
      return entry
    }),
  [selInstitutions, months])

  const institutionLines = useMemo<ChartLine[]>(() =>
    selInstitutions.map((id, i) => ({
      key: id,
      name: mockInstitutions.find(inst => inst.id === id)?.name ?? id,
      color: LINE_COLORS[i % LINE_COLORS.length],
    })),
  [selInstitutions])

  // ── Gráfico 2: por categoria (soma das classes de ativo da categoria) ─
  const categoryChartData = useMemo(() =>
    months.map(({ month, year }) => {
      const entry: Record<string, string | number> = { label: monthLabel(month, year, true) }
      for (const catId of selCategories) {
        const classIds = mockAssetClasses
          .filter(ac => ac.categoryId === catId)
          .map(ac => ac.id)
        entry[catId] = mockMonthlyByAssetClass
          .filter(r => r.month === month && r.year === year && classIds.includes(r.assetClassId))
          .reduce((s, r) => s + r.totalValue, 0)
      }
      return entry
    }),
  [selCategories, months])

  const categoryLines = useMemo<ChartLine[]>(() =>
    selCategories.map(catId => {
      const cat = mockCategories.find(c => c.id === catId)
      return { key: catId, name: cat?.name ?? catId, color: cat?.color ?? '#6b7280' }
    }),
  [selCategories])

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

      {/* Filtros em dropdown */}
      <SectionCard title="Filtros">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <DropdownFilter
            label="Instituições"
            items={FILTER_INSTITUTIONS}
            selected={selInstitutions}
            onToggle={toggleInstitution}
            onSelectAll={selectAllInstitutions}
          />
          <DropdownFilter
            label="Categorias"
            items={mockCategories.map(c => ({ id: c.id, name: c.name, color: c.color }))}
            selected={selCategories}
            onToggle={toggleCategory}
            onSelectAll={selectAllCategories}
          />
        </div>
      </SectionCard>

      {/* Tabela resumo */}
      <SectionCard title="Resumo Mensal">
        <MonthlyTable rows={tableRows} />
      </SectionCard>

      {/* Gráfico por instituição */}
      <LineChartCard
        title="Evolução por Instituição"
        data={institutionChartData}
        lines={institutionLines}
      />

      {/* Gráfico por categoria */}
      <LineChartCard
        title="Evolução por Categoria"
        data={categoryChartData}
        lines={categoryLines}
      />
    </AppShell>
  )
}
