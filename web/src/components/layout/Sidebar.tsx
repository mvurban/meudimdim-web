'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import { initUserData } from '@/lib/mock-store'
import { useYear, AVAILABLE_YEARS } from '@/lib/year-context'
import { YearSelect } from './YearSelect'

const NAV = [
  { href: '/produtos',  icon: '◈', label: 'Produtos'  },
  { href: '/acoes',     icon: '◉', label: 'Ações'     },
]

const DASHBOARD_NAV = [
  { href: '/dashboard/overview',           icon: '▣', label: 'Overview'           },
  { href: '/dashboard/consolidado-mensal', icon: '◈', label: 'Consolidado Mensal' },
]

const CONFIG_NAV = [
  { href: '/configuracoes/categorias',    icon: '◧', label: 'Categorias',      danger: false },
  { href: '/configuracoes/classes',       icon: '◫', label: 'Classes de Ativo', danger: false },
  { href: '/configuracoes/instituicoes',  icon: '◩', label: 'Instituições',     danger: false },
  { href: '/configuracoes/regioes',       icon: '◎', label: 'Regiões',           danger: false },
  { href: '/configuracoes/cotacoes',          icon: '◐', label: 'Cotações',          danger: false },
  { href: '/configuracoes/importar-produtos', icon: '↑', label: 'Importar Produtos', danger: false },
  { href: '/configuracoes/excluir-conta',     icon: '⊗', label: 'Excluir conta',     danger: true  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { selectedYear, setSelectedYear } = useYear()
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('sidebar-config-expanded')
      if (stored !== null) return stored === 'true'
    }
    return pathname.startsWith('/configuracoes')
  })

  useEffect(() => {
    if (pathname.startsWith('/configuracoes')) {
      setExpanded(true)
      sessionStorage.setItem('sidebar-config-expanded', 'true')
    }
  }, [pathname])

  useEffect(() => {
    const email = session?.user?.email
    if (email) initUserData(email)
  }, [session])

  function toggleExpanded() {
    setExpanded(v => {
      const next = !v
      sessionStorage.setItem('sidebar-config-expanded', String(next))
      return next
    })
  }

  function active(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  function navStyle(href: string): React.CSSProperties {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderRadius: 8,
      padding: '9px 10px',
      fontSize: 13.5,
      fontWeight: active(href) ? 500 : 400,
      color: active(href) ? '#fff' : 'rgba(255,255,255,0.5)',
      background: active(href) ? 'rgba(34,197,94,0.12)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.15s',
    }
  }

  const userName = session?.user?.name ?? ''
  const userEmail = session?.user?.email ?? ''
  const userImage = session?.user?.image ?? null
  const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, zIndex: 40,
        width: 220, height: '100vh',
        display: 'flex', flexDirection: 'column',
        background: '#0d1117',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 20px 16px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0d1117"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0d1117" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
          Meu<span style={{ color: '#22c55e' }}>DimDim</span>
        </span>
      </div>

      {/* Year selector */}
      <div style={{ padding: '0 12px 12px' }}>
        <YearSelect
          value={selectedYear}
          options={AVAILABLE_YEARS}
          onChange={setSelectedYear}
        />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '0 8px', marginBottom: 6 }}>Menu</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Dashboard — sempre expandido */}
          <li>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 8,
              padding: '9px 10px',
              fontSize: 13.5,
              fontWeight: active('/dashboard') ? 500 : 400,
              color: active('/dashboard') ? '#fff' : 'rgba(255,255,255,0.5)',
              background: active('/dashboard') ? 'rgba(34,197,94,0.08)' : 'transparent',
            }}>
              <span style={{ width: 3, height: 16, borderRadius: 99, flexShrink: 0, background: active('/dashboard') ? '#22c55e' : 'transparent' }} />
              <span style={{ fontSize: 12, opacity: 0.75 }}>▣</span>
              <span style={{ flex: 1 }}>Dashboard</span>
            </div>
            <ul style={{ listStyle: 'none', padding: '2px 0 2px 22px', margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {DASHBOARD_NAV.map(item => {
                const isActive = active(item.href)
                return (
                  <li key={item.href}>
                    <Link href={item.href} style={{
                      ...navStyle(item.href),
                      fontSize: 13,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                      background: isActive ? 'rgba(34,197,94,0.12)' : 'transparent',
                    }}>
                      <span style={{ width: 3, height: 14, borderRadius: 99, flexShrink: 0, background: isActive ? '#22c55e' : 'transparent' }} />
                      <span style={{ fontSize: 11, opacity: 0.75, color: isActive ? '#22c55e' : 'inherit' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {NAV.map(item => (
            <li key={item.href}>
              <Link href={item.href} style={navStyle(item.href)}>
                <span style={{ width: 3, height: 16, borderRadius: 99, flexShrink: 0, background: active(item.href) ? '#22c55e' : 'transparent' }} />
                <span style={{ fontSize: 12, opacity: 0.75, color: active(item.href) ? '#22c55e' : 'inherit' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '14px 0' }} />

        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '0 8px', marginBottom: 6 }}>Sistema</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Configurações — expandable */}
          <li>
            <button
              onClick={toggleExpanded}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderRadius: 8,
                padding: '9px 10px',
                fontSize: 13.5,
                fontWeight: expanded ? 500 : 400,
                color: expanded ? '#fff' : 'rgba(255,255,255,0.5)',
                background: expanded ? 'rgba(34,197,94,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 3, height: 16, borderRadius: 99, flexShrink: 0, background: expanded ? '#22c55e' : 'transparent' }} />
              <span style={{ fontSize: 12, opacity: 0.75 }}>⊞</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Configurações</span>
              <span style={{ fontSize: 10, transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
            </button>

            {expanded && (
              <ul style={{ listStyle: 'none', padding: '2px 0 2px 22px', margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {CONFIG_NAV.map(item => {
                  const accentColor = item.danger ? '#ef4444' : '#22c55e'
                  const isActive = active(item.href)
                  return (
                    <li key={item.href}>
                      <Link href={item.href} style={{
                        ...navStyle(item.href),
                        fontSize: 13,
                        color: item.danger
                          ? (isActive ? '#ef4444' : 'rgba(239,68,68,0.6)')
                          : (isActive ? '#fff' : 'rgba(255,255,255,0.5)'),
                        background: isActive
                          ? (item.danger ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.12)')
                          : 'transparent',
                      }}>
                        <span style={{ width: 3, height: 14, borderRadius: 99, flexShrink: 0, background: isActive ? accentColor : 'transparent' }} />
                        <span style={{ fontSize: 11, opacity: 0.75, color: isActive ? accentColor : 'inherit' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* User footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userImage} alt={userName} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#22c55e', flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
          </div>
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Sair"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)',
              flexShrink: 0,
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.color = '#ef4444'
              el.style.background = 'rgba(239,68,68,0.1)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.color = 'rgba(255,255,255,0.3)'
              el.style.background = 'transparent'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
