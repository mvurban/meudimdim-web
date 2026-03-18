import { formatBRL, formatUSD, formatPct } from '@/lib/utils'

interface StatCardsProps {
  totalBrl: number
  totalUsd: number
  totalIncome: number
  avgReturn: number
  totalContribution: number
  totalWithdrawal: number
  exchangeRate: number
}

export function StatCards({
  totalBrl, totalUsd, totalIncome,
  avgReturn, totalContribution, totalWithdrawal,
  exchangeRate,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">

      {/* Total Geral */}
      <div className="card stat-card">
        <div className="stat-card__label">Total Geral</div>
        <div className="stat-card__value">{formatBRL(totalBrl)}</div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Aportes <span style={{ color: 'var(--text-secondary)' }}>
              {totalContribution > 0 ? formatBRL(totalContribution) : '—'}
            </span>
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Retiradas <span style={{ color: 'var(--text-secondary)' }}>
              {totalWithdrawal > 0 ? formatBRL(totalWithdrawal) : '—'}
            </span>
          </span>
        </div>
      </div>

      {/* Total em Dólar */}
      <div className="card stat-card">
        <div className="stat-card__label">Total em Dólar</div>
        <div className="stat-card__value">{formatUSD(totalUsd)}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Cotação <span style={{ color: 'var(--text-secondary)' }}>
            {exchangeRate > 0 ? formatBRL(exchangeRate) : '—'}
          </span>
        </div>
      </div>

      {/* Ganhos no Mês */}
      <div className="card stat-card">
        <div className="stat-card__label">Ganhos no Mês</div>
        <div
          className="stat-card__value"
          style={{ color: totalIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}
        >
          {formatBRL(totalIncome)}
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Rent. média{' '}
          <span
            className="font-semibold"
            style={{ color: avgReturn >= 0 ? 'var(--success)' : 'var(--danger)' }}
          >
            {formatPct(avgReturn)}
          </span>
        </div>
      </div>

    </div>
  )
}
