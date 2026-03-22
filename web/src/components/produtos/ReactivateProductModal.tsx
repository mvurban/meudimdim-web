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
              style={{ background: 'var(--success-subtle, #22c55e20)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Reativar produto
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                O produto voltará para a lista de produtos ativos
              </p>
            </div>
          </div>

          {/* Product name */}
          <div
            className="rounded-lg px-4 py-3 mb-5"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {institution.name}
            </p>
          </div>

          {/* Footer */}
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
        </div>
      </div>
    </ModalPortal>
  )
}
