'use client'

import { ModalPortal } from '@/components/ui/ModalPortal'
import type { Product, Institution } from '@/types'

interface ReactivateProductModalProps {
  product: Product
  institution: Institution
  onCancel: () => void
  onConfirm: () => void
}

export function ReactivateProductModal({ product, institution, onCancel, onConfirm }: ReactivateProductModalProps) {
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
              style={{ background: isAggregated ? '#f59e0b15' : 'var(--success-subtle, #22c55e20)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isAggregated ? '#f59e0b' : 'var(--success)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {isAggregated ? 'Reativar produto agregado' : 'Reativar produto'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isAggregated ? 'Gerenciado automaticamente pela área de Ações/FIIs' : 'O produto voltará para a lista de produtos ativos'}
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
                  {' '}Para reativá-lo, adicione ações/FIIs de <strong>{institution.name}</strong> nessa área.
                </p>
              </div>
              <div className="flex justify-end">
                <button type="button" className="btn-brand" onClick={onCancel}>Fechar</button>
              </div>
            </>
          ) : (
            <div className="flex gap-3 justify-end">
              <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
              <button
                type="button"
                onClick={onConfirm}
                className="btn-brand"
              >
                Reativar
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  )
}
