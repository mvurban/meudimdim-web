import type { Category, Product, ProductEntry, AssetClass, Institution } from '@/types'
import { formatBRL, formatUSD, formatPct } from '@/lib/utils'
import { ProductRow } from './ProductRow'

interface CategoryGroupProps {
  category: Category
  entries: ProductEntry[]
  products: Product[]
  assetClasses: AssetClass[]
  institutions: Institution[]
  onEdit: (productId: string) => void
  onDetail: (productId: string) => void
  onDividend: (productId: string) => void
  dividendByProduct: Record<string, number>
}

export function CategoryGroup({
  category,
  entries,
  products,
  assetClasses,
  institutions,
  onEdit,
  onDetail,
  onDividend,
  dividendByProduct,
}: CategoryGroupProps) {
  const totalBrl          = entries.reduce((s, e) => s + e.valueBrl, 0)
  const totalUsd          = entries.reduce((s, e) => s + e.valueUsd, 0)
  const totalIncome       = entries.reduce((s, e) => s + e.income + (dividendByProduct[e.productId] ?? 0), 0)
  const totalContribution = entries.reduce((s, e) => s + e.contribution, 0)
  const totalWithdrawal   = entries.reduce((s, e) => s + e.withdrawal, 0)
  const avgReturn         = entries.length
    ? entries.reduce((s, e) => {
        const divTotal = dividendByProduct[e.productId] ?? 0
        const base = e.valueBrl > 0 ? divTotal / e.valueBrl * 100 : 0
        return s + e.returnPct + base
      }, 0) / entries.length
    : 0

  return (
    <div
      className="card overflow-hidden"
      style={{ padding: 0, borderLeft: `3px solid ${category.color}` }}
    >
      {/* Header — widths mirror the colgroup: 5 / 30 / 8 / 10 / 10 / 10 / 10 / 12 / 4 */}
      <div
        className="flex items-center py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
      >
        {/* Inst (5%) + Produto (30%) = 35% — category name */}
        <div className="flex items-center gap-2" style={{ width: '35%', padding: '0 16px' }}>
          <span
            className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{ background: category.color }}
          />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {category.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {entries.length} produto{entries.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Rent. (8%) */}
        <div className="text-sm" style={{ width: '8%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Rent. média</div>
          <div
            className="font-medium"
            style={{ color: avgReturn >= 0 ? 'var(--success)' : 'var(--danger)' }}
          >
            {formatPct(avgReturn)}
          </div>
        </div>

        {/* Aporte (10%) */}
        <div className="text-sm" style={{ width: '10%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Aporte</div>
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {totalContribution > 0 ? formatBRL(totalContribution) : '—'}
          </div>
        </div>

        {/* Retirada (10%) */}
        <div className="text-sm" style={{ width: '10%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Retirada</div>
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {totalWithdrawal > 0 ? formatBRL(totalWithdrawal) : '—'}
          </div>
        </div>

        {/* Ganhos (10%) */}
        <div className="text-sm" style={{ width: '10%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Ganhos</div>
          <div
            className="font-medium"
            style={{ color: totalIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}
          >
            {formatBRL(totalIncome)}
          </div>
        </div>

        {/* Total USD (10%) */}
        <div className="text-sm" style={{ width: '10%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>USD</div>
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {formatUSD(totalUsd)}
          </div>
        </div>

        {/* Total BRL (12%) */}
        <div className="text-sm" style={{ width: '12%', padding: '0 16px' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</div>
          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatBRL(totalBrl)}
          </div>
        </div>

        {/* Ações (7%) — vazio */}
        <div style={{ width: '7%' }} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full table-fixed">
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
<tbody>
            {entries.map(entry => {
              const product     = products.find(p => p.id === entry.productId)
              const assetClass  = product ? assetClasses.find(a => a.id === product.assetClassId) : undefined
              const institution = product ? institutions.find(i => i.id === product.institutionId) : undefined

              if (!product || !assetClass || !institution) return null

              return (
                <ProductRow
                  key={entry.id}
                  entry={entry}
                  product={product}
                  assetClass={assetClass}
                  institution={institution}
                  onEdit={() => onEdit(product.id)}
                  onDetail={() => onDetail(product.id)}
                  onDividend={() => onDividend(product.id)}
                  dividendTotal={dividendByProduct[entry.productId] ?? 0}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
