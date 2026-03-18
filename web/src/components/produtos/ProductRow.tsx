import type { Product, ProductEntry, AssetClass, Institution } from '@/types'
import { formatBRL, formatUSD, formatPct } from '@/lib/utils'

function instAbbr(name: string): string {
  const first = name.split(' ')[0]
  if (first.length <= 4) return first.toUpperCase()
  return first.slice(0, 3).toUpperCase()
}

interface ProductRowProps {
  entry: ProductEntry
  product: Product
  assetClass: AssetClass
  institution: Institution
  onEdit: () => void
  onDetail: () => void
  onDividend: () => void
  dividendTotal: number
}

export function ProductRow({ entry, product, assetClass, institution, onEdit, onDetail, onDividend, dividendTotal }: ProductRowProps) {
  const effectiveIncome = entry.income + dividendTotal
  const effectiveReturn = entry.returnPct + (entry.valueBrl > 0 ? dividendTotal / entry.valueBrl * 100 : 0)
  return (
    <tr>
      {/* Institution avatar */}
      <td>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
          title={institution.name}
        >
          {instAbbr(institution.name)}
        </div>
      </td>

      {/* Product name + class + details */}
      <td>
        <div>
          <button
            onClick={onDetail}
            className="font-semibold text-left transition-colors"
            style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--brand)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
          >
            {product.name}
          </button>
          <span
            className="badge badge-gray ml-2"
            style={{ fontSize: '11px', padding: '1px 8px', verticalAlign: 'middle' }}
          >
            {assetClass.name}
          </span>
        </div>
        {product.details && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {product.details}
          </div>
        )}
      </td>

      {/* Rentabilidade */}
      <td
        className="font-medium"
        style={{ color: effectiveReturn >= 0 ? 'var(--success)' : 'var(--danger)' }}
      >
        {formatPct(effectiveReturn)}
      </td>

      {/* Aporte */}
      <td style={{ color: 'var(--text-secondary)' }}>
        {entry.contribution > 0 ? formatBRL(entry.contribution) : '—'}
      </td>

      {/* Retirada */}
      <td style={{ color: 'var(--text-secondary)' }}>
        {entry.withdrawal > 0 ? formatBRL(entry.withdrawal) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </td>

      {/* Ganhos */}
      <td style={{ color: effectiveIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}>
        {formatBRL(effectiveIncome)}
      </td>

      {/* Total USD */}
      <td style={{ color: 'var(--text-secondary)' }}>{formatUSD(entry.valueUsd)}</td>

      {/* Total BRL */}
      <td className="font-semibold">{formatBRL(entry.valueBrl)}</td>

      {/* Actions */}
      <td>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onDividend}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title="Registrar dividendos"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title="Editar produto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}
