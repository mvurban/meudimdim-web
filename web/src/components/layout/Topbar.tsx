'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useNotifications, Notification } from '@/lib/notification-context'
import { api } from '@/lib/api'

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

const STATUS_COLOR: Record<Notification['status'], string> = {
  error:   '#ef4444',
  warning: '#f59e0b',
  success: '#22c55e',
  info:    'var(--border)',
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
  const { notifications, unreadCount, markAllAsRead, updateNotificationStatus, clearNotifications } = useNotifications()
  const [open, setOpen] = useState(false)
  const [retrying, setRetrying] = useState<string | null>(null)
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

  async function handleClear() {
    await clearNotifications()
    setOpen(false)
  }

  async function handleRetry(n: Notification) {
    if (!n.metadata) return
    const { tickers } = JSON.parse(n.metadata) as { tickers: { id: string; ticker: string }[] }
    if (!tickers?.length) return

    setRetrying(n.id)
    try {
      const { results, failed } = await api.post<{
        results: { id: string; ticker: string; precoAtual: number; precoFechamento: number }[]
        failed: { id: string; ticker: string }[]
      }>('/api/acoes/fetch-quotes', { tickers })

      if (results.length > 0) {
        await api.put('/api/acoes/refresh', {
          updates: results.map(r => ({ id: r.id, precoFechamento: r.precoFechamento, precoAtual: r.precoAtual })),
        })
      }

      if (failed.length === 0) {
        await updateNotificationStatus(n.id, 'success')
      }
      // se ainda houve falhas, mantém vermelho (não atualiza status)
    } catch {
      // mantém vermelho
    } finally {
      setRetrying(null)
    }
  }

  // Bell color driven by highest severity of unread notifications
  const bellColor = notifications.some(n => n.isNew && n.status === 'error')
    ? '#ef4444'
    : notifications.some(n => n.isNew && n.status === 'warning')
    ? '#f59e0b'
    : unreadCount > 0 ? '#ef4444' : 'var(--text-muted)'

  const badgeColor = notifications.some(n => n.isNew && n.status === 'error')
    ? '#ef4444'
    : notifications.some(n => n.isNew && n.status === 'warning')
    ? '#f59e0b'
    : '#ef4444'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors"
        style={{ color: bellColor }}
        title="Notificações"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: badgeColor, color: '#fff' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 w-80 rounded-lg shadow-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notificações
            </span>
            {notifications.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Limpar tudo
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Nenhuma notificação
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  retrying={retrying === n.id}
                  onRetry={() => handleRetry(n)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationItem({
  notification: n,
  retrying,
  onRetry,
}: {
  notification: Notification
  retrying: boolean
  onRetry: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const tickers: { id: string; ticker: string }[] = n.metadata
    ? (JSON.parse(n.metadata) as { tickers: { id: string; ticker: string }[] }).tickers ?? []
    : []

  const canRetry = n.status === 'error' && tickers.length > 0
  const isSuccess = n.status === 'success'
  const indicatorColor = STATUS_COLOR[n.status]

  const visibleTickers = expanded ? tickers : tickers.slice(0, 2)
  const hiddenCount = tickers.length - 2

  return (
    <div
      className="flex gap-3 px-3 py-3"
      style={{ borderBottom: '1px solid var(--border)', borderLeft: `3px solid ${indicatorColor}` }}
    >
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{n.text}</p>

        {/* Lista de tickers expandível */}
        {tickers.length > 0 && (
          <div className="mt-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {visibleTickers.map(t => t.ticker.replace('.SA', '')).join(', ')}
              {tickers.length > 2 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="ml-1 underline"
                  style={{ color: 'var(--text-muted)', fontSize: 11 }}
                >
                  e mais {hiddenCount}...
                </button>
              )}
              {tickers.length > 2 && expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="ml-1 underline"
                  style={{ color: 'var(--text-muted)', fontSize: 11 }}
                >
                  ver menos
                </button>
              )}
            </span>
          </div>
        )}

        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(n.createdAt).toLocaleString('pt-BR')}
        </p>
      </div>

      {/* Ação direita */}
      {canRetry && (
        <button
          onClick={onRetry}
          disabled={retrying}
          title="Tentar novamente"
          style={{ color: '#ef4444', flexShrink: 0, opacity: retrying ? 0.5 : 1 }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ animation: retrying ? 'spin 1s linear infinite' : undefined }}
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </button>
      )}
      {isSuccess && (
        <span style={{ color: '#22c55e', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      )}
    </div>
  )
}
