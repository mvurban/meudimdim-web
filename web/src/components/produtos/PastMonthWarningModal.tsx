'use client'

import { ModalPortal } from '@/components/ui/ModalPortal'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

interface PastMonthWarningModalProps {
  month: number
  year: number
  mode: 'create' | 'edit' | 'delete' | 'import'
  onCancel: () => void
  onConfirm: () => void
}

export function PastMonthWarningModal({ month, year, mode, onCancel, onConfirm }: PastMonthWarningModalProps) {
  const label = `${MONTHS[month - 1]}/${year}`
  const confirmLabel =
    mode === 'create' ? 'Cadastrar mesmo assim'
    : mode === 'delete' ? 'Excluir mesmo assim'
    : mode === 'import' ? 'Importar mesmo assim'
    : 'Editar mesmo assim'

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      >
        <div className="card w-full max-w-md animate-fade-in" style={{ padding: 0 }}>

          {/* Header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(239,68,68,0.12)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Alteração em mês anterior
            </span>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div
              className="rounded-lg p-4 space-y-2"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <div className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
                Zona de risco — mês já encerrado
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                O mês de <strong style={{ color: 'var(--text-primary)' }}>{label}</strong> já passou.
                Qualquer alteração feita aqui <strong style={{ color: 'var(--danger)' }}>não se propaga automaticamente</strong> para
                os meses seguintes — os valores dos meses futuros permanecem como estão.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
              <button
                className="text-sm px-4 py-2 rounded-lg font-medium"
                style={{ background: 'var(--danger)', color: '#fff', cursor: 'pointer' }}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  )
}
