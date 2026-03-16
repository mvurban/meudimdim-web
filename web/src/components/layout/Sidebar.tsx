'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/dashboard', icon: '▣', label: 'Dashboard' },
  { href: '/produtos',  icon: '◈', label: 'Produtos'  },
  { href: '/acoes',     icon: '◉', label: 'Ações'     },
]

const CONFIG_NAV = [
  { href: '/configuracoes/categorias',   icon: '◧', label: 'Categorias'      },
  { href: '/configuracoes/classes',      icon: '◫', label: 'Classes de Ativo' },
  { href: '/configuracoes/instituicoes', icon: '◩', label: 'Instituições'     },
  { href: '/configuracoes/cotacoes',     icon: '◐', label: 'Cotações'         },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
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

      {/* Month selector */}
      <div style={{ padding: '0 12px 12px' }}>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer' }}>
          <span>Mar / 2026</span>
          <span style={{ color: '#22c55e', fontSize: 10 }}>▾</span>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '0 8px', marginBottom: 6 }}>Menu</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                {CONFIG_NAV.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} style={{ ...navStyle(item.href), fontSize: 13 }}>
                      <span style={{ width: 3, height: 14, borderRadius: 99, flexShrink: 0, background: active(item.href) ? '#22c55e' : 'transparent' }} />
                      <span style={{ fontSize: 11, opacity: 0.75, color: active(item.href) ? '#22c55e' : 'inherit' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
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
        </div>
      </div>
    </aside>
  )
}
