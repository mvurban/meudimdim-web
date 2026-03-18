'use client'

import { useState } from 'react'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

interface CopyFromPrevModalProps {
  prevMonth: number
  prevYear: number
  destMonth: number
  destYear: number
  prevCount: number
  destCount: number
  onCancel: () => void
  onConfirm: () => void
}

export function CopyFromPrevModal({
  prevMonth, prevYear, destMonth, destYear,
  prevCount, destCount,
  onCancel, onConfirm,
}: CopyFromPrevModalProps) {
  const [checked, setChecked] = useState(false)
  const isOverwrite = destCount > 0

  const prevLabel = `${MONTHS[prevMonth - 1]}/${prevYear}`
  const destLabel = `${MONTHS[destMonth - 1]}/${destYear}`

  return (
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
          {isOverwrite ? (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(239,68,68,0.12)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--brand-subtle)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </div>
          )}
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isOverwrite ? 'Substituir produtos do mês' : 'Copiar produtos do mês anterior'}
          </span>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Simple mode */}
          {!isOverwrite && (
            <>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Copiar <strong style={{ color: 'var(--text-primary)' }}>{prevCount} produto{prevCount !== 1 ? 's' : ''}</strong> de{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{prevLabel}</strong> para{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{destLabel}</strong>.
              </p>
              <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                <div>· Valores patrimoniais (BRL/USD) serão mantidos</div>
                <div>· Aportes, retiradas e rendimentos serão zerados</div>
              </div>
            </>
          )}

          {/* Overwrite mode */}
          {isOverwrite && (
            <>
              <div className="rounded-lg p-4 space-y-2" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
                  Atenção: esta ação não pode ser desfeita
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Os <strong style={{ color: 'var(--text-primary)' }}>{destCount} produto{destCount !== 1 ? 's' : ''}</strong> de{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{destLabel}</strong> serão{' '}
                  <strong style={{ color: 'var(--danger)' }}>removidos e substituídos</strong> pelos{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{prevCount} produto{prevCount !== 1 ? 's' : ''}</strong> de{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{prevLabel}</strong>.
                </p>
                <div className="text-xs space-y-1 pt-1" style={{ color: 'var(--text-muted)' }}>
                  <div>· Todos os aportes, retiradas e rendimentos de {destLabel} serão perdidos</div>
                  <div>· Valores patrimoniais do mês anterior serão carregados como base</div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                  className="mt-0.5 flex-shrink-0"
                  style={{ accentColor: 'var(--danger)', width: 15, height: 15 }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Entendo que os dados de <strong style={{ color: 'var(--text-primary)' }}>{destLabel}</strong> serão substituídos e esta ação não pode ser desfeita
                </span>
              </label>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button className="btn-ghost text-sm" onClick={onCancel}>Cancelar</button>
            {isOverwrite ? (
              <button
                className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity"
                style={{
                  background: checked ? 'var(--danger)' : 'rgba(239,68,68,0.3)',
                  color: '#fff',
                  cursor: checked ? 'pointer' : 'not-allowed',
                  opacity: checked ? 1 : 0.6,
                }}
                disabled={!checked}
                onClick={onConfirm}
              >
                Substituir
              </button>
            ) : (
              <button className="btn-brand text-sm" onClick={onConfirm}>
                Confirmar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
