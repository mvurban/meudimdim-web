'use client'

import { usePathname } from 'next/navigation'

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
        <NotificationDot />
      </div>
    </header>
  )
}

function NotificationDot() {
  return (
    <button
      className="relative flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors"
      style={{ color: 'var(--text-muted)' }}
      title="Notificações"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    </button>
  )
}
