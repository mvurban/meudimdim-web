'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { SectionCard } from './SectionCard'
import { formatBRL } from '@/lib/utils'

export interface PizzaItem {
  name: string
  value: number
  pct: number
  color: string
}

interface PizzaCardProps {
  title: string
  data: PizzaItem[]
}

export function PizzaCard({ title, data }: PizzaCardProps) {
  return (
    <SectionCard title={title}>
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
            formatter={(value: unknown) => [formatBRL(typeof value === 'number' ? value : 0), '']}
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {data.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: item.color,
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {item.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
