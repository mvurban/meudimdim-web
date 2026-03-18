import { formatBRL, formatPct } from '@/lib/utils'

export interface MonthlyTableRow {
  label: string        // "Mar/26"
  contribution: number
  withdrawal: number
  returnPct: number
  income: number
  totalValue: number
}

interface MonthlyTableProps {
  rows: MonthlyTableRow[]
}

const COL: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 13,
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

const HEAD: React.CSSProperties = {
  ...COL,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

export function MonthlyTable({ rows }: MonthlyTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ ...HEAD, textAlign: 'left' }}>Mês/Ano</th>
            <th style={HEAD}>Aporte</th>
            <th style={HEAD}>Retirada</th>
            <th style={HEAD}>Rentabilidade</th>
            <th style={HEAD}>Renda</th>
            <th style={HEAD}>Valor Final</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              style={{
                borderBottom: '1px solid var(--border)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
              }}
            >
              <td style={{ ...COL, textAlign: 'left', fontWeight: 500, color: 'var(--text-primary)' }}>
                {row.label}
              </td>
              <td style={{ ...COL, color: 'var(--text-primary)' }}>
                {formatBRL(row.contribution, true)}
              </td>
              <td style={{ ...COL, color: row.withdrawal > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                {row.withdrawal > 0 ? formatBRL(row.withdrawal, true) : '—'}
              </td>
              <td style={{ ...COL, color: row.returnPct >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {formatPct(row.returnPct)}
              </td>
              <td style={{ ...COL, color: 'var(--text-primary)' }}>
                {formatBRL(row.income, true)}
              </td>
              <td style={{ ...COL, fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatBRL(row.totalValue, true)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
