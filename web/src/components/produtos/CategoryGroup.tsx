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
}

export function CategoryGroup({
  category,
  entries,
  products,
  assetClasses,
  institutions,
  onEdit,
}: CategoryGroupProps) {
  const totalBrl    = entries.reduce((s, e) => s + e.valueBrl, 0)
  const totalUsd    = entries.reduce((s, e) => s + e.valueUsd, 0)
  const totalIncome = entries.reduce((s, e) => s + e.income, 0)
  const avgReturn   = entries.length
    ? entries.reduce((s, e) => s + e.returnPct, 0) / entries.length
    : 0

  return (
    <div
      className="card overflow-hidden"
      style={{ padding: 0, borderLeft: `3px solid ${category.color}` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: category.color }}
          />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {category.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {entries.length} produto{entries.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Rent. média</div>
            <div className="font-medium value-pos">{formatPct(avgReturn)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Ganhos</div>
            <div className="font-medium value-pos">{formatBRL(totalIncome)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>USD</div>
            <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {formatUSD(totalUsd)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatBRL(totalBrl)}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th style={{ width: 48 }}>Inst.</th>
              <th>Produto</th>
              <th>Rent.</th>
              <th>Aporte</th>
              <th>Retirada</th>
              <th>Ganhos</th>
              <th>Total USD</th>
              <th>Total BRL</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
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
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
