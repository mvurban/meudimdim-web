'use client'

import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { Product, ProductEntry, Category, AssetClass, Institution, Region, LiquidityOption } from '@/types'
import { formatBRL, formatUSD, MONTHS } from '@/lib/utils'
import { ModalPortal } from '@/components/ui/ModalPortal'

interface ProductDetailModalProps {
  product: Product
  currentEntry?: ProductEntry   // entry for the selected month
  entries: ProductEntry[]       // all entries (for chart)
  category: Category
  assetClass: AssetClass
  institution: Institution
  region?: Region
  liquidityOption?: LiquidityOption
  dividendTotal: number
  onClose: () => void
}

export function ProductDetailModal({
  product,
  currentEntry,
  entries,
  category,
  assetClass,
  institution,
  region,
  liquidityOption,
  dividendTotal,
  onClose,
}: ProductDetailModalProps) {
  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
      .slice(-12)
      .map(e => ({
        label: `${MONTHS[e.month - 1]}/${String(e.year).slice(2)}`,
        valor: e.valueBrl,
      }))
  }, [entries])

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        style={{ padding: '1.5rem' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <span
              className="inline-block h-3 w-3 rounded-full flex-shrink-0 mt-1.5"
              style={{ background: category.color }}
            />
            <div>
              <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {product.name}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {category.name} · {assetClass.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Dados do produto */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-3 p-4 rounded-lg"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <InfoItem label="Instituição" value={institution.name} />
          <InfoItem label="Região"      value={region?.name ?? '—'} />
          <InfoItem label="Liquidez"    value={liquidityOption?.name ?? '—'} />
          <InfoItem label="CNPJ"        value={product.cnpj || '—'} />
          <InfoItem label="Detalhes"    value={product.details || '—'} className="col-span-2" />
        </div>

        {/* Movimentação do mês */}
        {currentEntry && (
          <>
            <div className="flex items-center gap-3 py-4">
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Movimentação do mês
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div
              className="grid grid-cols-2 gap-x-8 gap-y-3 p-4 rounded-lg"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <InfoItem label="Aporte R$"        value={formatBRL(currentEntry.contribution)} />
              <InfoItem label="Retirada R$"       value={formatBRL(currentEntry.withdrawal)} />
              <InfoItem label="Total USD $"        value={formatUSD(currentEntry.valueUsd)} />
              <InfoItem label="Total BRL R$"       value={formatBRL(currentEntry.valueBrl)} />
              <InfoItem
                label="Dividendos recebidos"
                value={dividendTotal > 0 ? formatBRL(dividendTotal) : '—'}
                highlight={dividendTotal > 0}
              />
            </div>
          </>
        )}

        {/* Gráfico */}
        {chartData.length > 1 ? (
          <>
            <div className="flex items-center gap-3 py-4">
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Evolução · últimos {chartData.length} meses
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => formatBRL(v, true)}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v) => [formatBRL(Number(v ?? 0)), 'Total BRL']}
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                    }}
                    labelStyle={{ color: 'var(--text-muted)', marginBottom: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke={category.color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: category.color, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
            Histórico insuficiente para exibir o gráfico.
          </p>
        )}
      </div>
    </div>
    </ModalPortal>
  )
}

function InfoItem({
  label, value, className, highlight,
}: { label: string; value: string; className?: string; highlight?: boolean }) {
  return (
    <div className={className}>
      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: highlight ? 'var(--success)' : 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}
