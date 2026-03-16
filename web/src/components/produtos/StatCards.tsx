import { formatBRL, formatUSD } from '@/lib/utils'

interface StatCardsProps {
  totalBrl: number
  totalUsd: number
  totalIncome: number
}

export function StatCards({ totalBrl, totalUsd, totalIncome }: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card stat-card">
        <div className="stat-card__label">Total Geral</div>
        <div className="stat-card__value">{formatBRL(totalBrl)}</div>
        <div className="stat-card__sub">patrimônio no mês</div>
      </div>

      <div className="card stat-card">
        <div className="stat-card__label">Total em Dólar</div>
        <div className="stat-card__value">{formatUSD(totalUsd)}</div>
        <div className="stat-card__sub">convertido pela cotação do mês</div>
      </div>

      <div className="card stat-card">
        <div className="stat-card__label">Ganhos no Mês</div>
        <div className="stat-card__value text-brand">{formatBRL(totalIncome)}</div>
        <div className="stat-card__sub">rendimento bruto</div>
      </div>
    </div>
  )
}
