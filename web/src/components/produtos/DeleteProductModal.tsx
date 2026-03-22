'use client'

import { ModalPortal } from '@/components/ui/ModalPortal'
import { MONTHS } from '@/lib/utils'
import type { Product, Institution } from '@/types'

interface DeleteProductModalProps {
  product: Product
  institution: Institution
  selectedMonth: number
  selectedYear: number
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteProductModal({ product, institution, selectedMonth, selectedYear, onCancel, onConfirm }: DeleteProductModalProps) {
  const monthLabel = `${MONTHS[selectedMonth - 1]}/${selectedYear}`
  const isAggregated = product.isAggregated ?? false
  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      >
        <div
          className="card w-full max-w-md animate-fade-in"
          style={{ padding: '1.5rem' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
              style={{ background: '#ef444420' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {isAggregated ? 'Remover do mês' : 'Encerrar produto'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isAggregated ? `Remove a entrada de ${monthLabel}` : 'O produto não aparecerá em meses futuros'}
              </p>
            </div>
          </div>

          {/* Product name */}
          <div
            className="rounded-lg px-4 py-3 mb-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {institution.name}
            </p>
          </div>

          {/* Aggregated: only amber warning + close button */}
          {isAggregated ? (
            <>
              <div
                className="rounded-lg px-4 py-3 mb-5 flex gap-3 items-start"
                style={{ background: '#f59e0b15', border: '1px solid #f59e0b40' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p style={{ margin: 0, fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}>
                  Este produto é gerenciado automaticamente pela{' '}
                  <a href="/acoes" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'underline' }}>área de Ações/FIIs</a>.
                  {' '}Para encerrá-lo, remova as ações/FIIs de <strong>{institution.name}</strong> nessa área.
                </p>
              </div>
              <div className="flex justify-end">
                <button type="button" className="btn-brand" onClick={onCancel}>Fechar</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                O produto será encerrado e não aparecerá em nenhum mês futuro. O histórico dos meses anteriores será mantido.
              </p>
              <div className="flex gap-3 justify-end">
                <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="btn-brand"
                  style={{ background: 'var(--danger)', color: '#fff' }}
                >
                  Encerrar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  )
}
