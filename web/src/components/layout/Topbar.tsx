'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useNotifications } from '@/lib/notification-context'

const LABELS: Record<string, string> = {
  overview:             'Overview',
  'consolidado-mensal': 'Consolidado Mensal',
  dashboard:            'Dashboard',
  produtos:             'Produtos',
  acoes:          'Ações — Carteira',
  instituicoes:   'Visão por Instituição',
  cotacoes:       'Cotações de Câmbio',
  admin:          'Configurações',
  categorias:     'Categorias',
  classes:        'Classes de Ativo',
  'excluir-conta':'Excluir conta',
}

interface TopbarProps {
  action?: React.ReactNode
}

export function Topbar({ action }: TopbarProps) {
  const pathname = usePathname()
  const segment = pathname.split('/').filter(Boolean).pop() ?? ''
  const label = LABELS[segment] ?? segment

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-6"
      style={{
        background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--text-muted)' }}>MeuDimDim</span>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
      </div>

      {/* Right actions slot */}
      <div className="flex items-center gap-2">
        {action}
        <NotificationBell />
      </div>
    </header>
  )
}

function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleToggle() {
    if (!open) markAllAsRead()
    setOpen(prev => !prev)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors"
        style={{ color: unreadCount > 0 ? '#ef4444' : 'var(--text-muted)' }}
        title="Notificações"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 w-80 rounded-lg shadow-lg"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notificações
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Nenhuma notificação
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className="px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
