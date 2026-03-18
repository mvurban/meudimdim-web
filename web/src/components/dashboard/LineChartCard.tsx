'use client'

import {
  ResponsiveContainer,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { SectionCard } from './SectionCard'
import { formatBRL, formatUSD } from '@/lib/utils'

export interface ChartLine {
  key: string
  name: string
  color: string
  /** If provided, the line attaches to this Y-axis id */
  yAxisId?: string
  strokeDasharray?: string
}

interface SecondaryAxis {
  id: string
  /** 'brl' | 'usd' — controls tooltip/tick formatter */
  currency: 'brl' | 'usd'
}

interface LineChartCardProps {
  title: string
  /** Array of objects where each key is a line key or the x-axis label ("label") */
  data: Record<string, string | number>[]
  lines: ChartLine[]
  height?: number
  /** When set, renders a second Y-axis on the right */
  secondaryAxis?: SecondaryAxis
}

function tickFmt(v: number) {
  return `${(v / 1000).toFixed(0)}k`
}

export function LineChartCard({ title, data, lines, height = 280, secondaryAxis }: LineChartCardProps) {
  const tooltipFormatter = (value: unknown, name: unknown) => {
    const v = typeof value === 'number' ? value : 0
    const n = String(name)
    const line = lines.find(l => l.name === n)
    if (line?.yAxisId === secondaryAxis?.id && secondaryAxis?.currency === 'usd') {
      return [formatUSD(v), n]
    }
    return [formatBRL(v), n]
  }

  return (
    <SectionCard title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          />
          {/* Primary Y-axis (left) */}
          <YAxis
            yAxisId="primary"
            orientation="left"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickFormatter={tickFmt}
          />
          {/* Optional secondary Y-axis (right) */}
          {secondaryAxis && (
            <YAxis
              yAxisId={secondaryAxis.id}
              orientation="right"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickFormatter={v => secondaryAxis.currency === 'usd' ? `$${tickFmt(v)}` : tickFmt(v)}
            />
          )}
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: 4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              yAxisId={line.yAxisId ?? 'primary'}
              strokeDasharray={line.strokeDasharray}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>
  )
}
