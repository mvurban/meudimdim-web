'use client'

import { AppShell } from '@/components/layout/AppShell'
import { mockDashboard } from '@/lib/mock-data'
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts'

const MONTH_NAMES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtUSD(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const INSTITUTION_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

const evolutionData = mockDashboard.monthlyEvolution.map(m => ({
  label: `${MONTH_NAMES[m.month]}/${String(m.year).slice(2)}`,
  brl: m.totalValue,
  usd: m.totalValueUsd,
}))

export default function DashboardPage() {
  const d = mockDashboard

  return (
    <AppShell>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Visão geral do patrimônio · {MONTH_NAMES[d.selectedMonth]}/{d.selectedYear}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard label="Patrimônio Total" value={`R$ ${fmtBRL(d.totalValue)}`} />
        <KpiCard label="Patrimônio em USD" value={`USD ${fmtUSD(d.totalValueUsd)}`} />
        <KpiCard label="Aporte do mês" value={`R$ ${fmtBRL(d.monthContribution)}`} />
        <KpiCard label="Rendimento do mês" value={`R$ ${fmtBRL(d.monthIncome)}`} />
        <KpiCard
          label="Retorno do mês"
          value={`${d.monthReturnPct >= 0 ? '+' : ''}${d.monthReturnPct.toFixed(2).replace('.', ',')}%`}
          color="#22c55e"
        />
      </div>

      {/* Evolução Patrimonial */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Evolução Patrimonial</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={evolutionData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis
              yAxisId="brl"
              orientation="left"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="usd"
              orientation="right"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'BRL'
                  ? [`R$ ${fmtBRL(value)}`, 'BRL']
                  : [`USD ${fmtUSD(value)}`, 'USD']
              }
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: 4 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
            <Line yAxisId="brl" type="monotone" dataKey="brl" name="BRL" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line yAxisId="usd" type="monotone" dataKey="usd" name="USD" stroke="#a855f7" strokeWidth={2} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pizza charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <PizzaCard
          title="Por Categoria"
          data={d.byCategory.filter(x => x.value > 0).map(x => ({ name: x.category, value: x.value, pct: x.pct, color: x.color }))}
        />
        <PizzaCard
          title="Por Instituição"
          data={d.byInstitution.map((x, i) => ({ name: x.institution, value: x.value, pct: x.pct, color: INSTITUTION_COLORS[i % INSTITUTION_COLORS.length] }))}
        />
        <PizzaCard
          title="Por Região"
          data={[
            ...d.byRegion.map(x => ({ name: x.region, value: x.value, pct: x.pct, color: x.region === 'Brasil' ? '#22c55e' : '#a855f7' })),
          ]}
        />
      </div>
    </AppShell>
  )
}

// ── Sub-componentes ───────────────────────────

function KpiCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ ...cardStyle, marginBottom: 0, padding: '16px 20px' }}>
      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: color ?? 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

type PizzaItem = { name: string; value: number; pct: number; color: string }

function PizzaCard({ title, data }: { title: string; data: PizzaItem[] }) {
  return (
    <div style={cardStyle}>
      <p style={sectionTitle}>{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`R$ ${fmtBRL(value)}`, '']}
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0, display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-primary)',
}
